const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../ledgerly-core.js');
const valid = (overrides={}) => ({id:'tx-1',description:'Groceries',amount:12.34,type:'expense',category:'Food',date:'2026-10-27',...overrides});

test('accepts and normalises a valid transaction', () => {
  const result = core.validateTransaction(valid({description:'  Groceries  ',amount:12.345}));
  assert.equal(result.ok,true); assert.equal(result.value.description,'Groceries'); assert.equal(result.value.amount,12.35);
});
test('rejects empty descriptions, invalid amounts, types, categories and dates', () => {
  for (const tx of [valid({description:'  '}),valid({amount:0}),valid({amount:NaN}),valid({amount:Infinity}),valid({amount:-1}),valid({type:'transfer'}),valid({category:'Unknown'}),valid({date:'2026-02-30'}),valid({date:''})]) assert.equal(core.validateTransaction(tx).ok,false);
});
test('rejects invalid stored records and non-array storage', () => {
  assert.equal(core.normalizeTransactions([valid(),valid({amount:-2})]).length,1);
  assert.deepEqual(core.normalizeTransactions({}),[]);
});
test('calculates money totals in cents without common floating point drift', () => {
  const txs=[valid({id:'1',amount:0.1}),valid({id:'2',amount:0.2}),valid({id:'3',amount:10,type:'income',category:'Salary'})];
  assert.deepEqual(core.calculateSummary(txs),{income:10,expenses:0.3,balance:9.7,count:3});
});
test('summarises expenses by category only', () => {
  const totals=core.categoryTotals([valid({amount:10}),valid({id:'2',amount:5}),valid({id:'3',type:'income',category:'Salary',amount:100})]);
  assert.equal(totals.Food,15); assert.equal(totals.Salary,undefined);
});
test('escapes HTML special characters', () => assert.equal(core.escapeHTML(`<img src=x onerror='x'>`),'&lt;img src=x onerror=&#39;x&#39;&gt;'));
test('quotes CSV cells, preserves commas and neutralises spreadsheet formulas', () => {
  const csv=core.csvForTransactions([valid({description:'=1+1, "test"'})]);
  assert.match(csv, /"'\=1\+1, ""test"""/);
  assert.match(csv, /"description","amount","type","category","date"/);
});
test('formats local calendar dates without UTC conversion', () => {
  const date=new Date(2026,9,27,0,15,0);
  assert.equal(core.localDateString(date),'2026-10-27');
});
