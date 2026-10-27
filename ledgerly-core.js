(function (root) {
  'use strict';
  const CATEGORIES = new Set(['Food','Transport','Housing','Shopping','Utilities','Health','Education','Salary','Other']);
  const TYPES = new Set(['income','expense']);
  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y,m,d] = value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  }
  function validateTransaction(input) {
    if (!input || typeof input !== 'object') return {ok:false,error:'Enter valid transaction details.'};
    const description = typeof input.description === 'string' ? input.description.trim() : '';
    if (!description) return {ok:false,error:'Enter a description.'};
    if (description.length > 80) return {ok:false,error:'Description must be 80 characters or fewer.'};
    const amount = Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) return {ok:false,error:'Enter an amount greater than zero.'};
    if (amount > 100000000) return {ok:false,error:'Amount must be $100,000,000 or less.'};
    const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
    if (!TYPES.has(input.type)) return {ok:false,error:'Choose Income or Expense.'};
    if (!CATEGORIES.has(input.category)) return {ok:false,error:'Choose a valid category.'};
    if (!validDate(input.date)) return {ok:false,error:'Enter a valid transaction date.'};
    const id = typeof input.id === 'string' && input.id.trim() ? input.id.slice(0,120) : '';
    if (!id) return {ok:false,error:'Transaction identifier is missing.'};
    return {ok:true,value:{id,description,amount:rounded,type:input.type,category:input.category,date:input.date}};
  }
  function normalizeTransactions(input) {
    if (!Array.isArray(input)) return [];
    return input.map(item => validateTransaction(item)).filter(result => result.ok).map(result => result.value);
  }
  function cents(value) { return Math.round((value + Number.EPSILON) * 100); }
  function calculateSummary(transactions) {
    let incomeCents = 0, expenseCents = 0;
    for (const t of transactions) {
      if (t.type === 'income') incomeCents += cents(t.amount);
      else if (t.type === 'expense') expenseCents += cents(t.amount);
    }
    return {income:incomeCents/100,expenses:expenseCents/100,balance:(incomeCents-expenseCents)/100,count:transactions.length};
  }
  function categoryTotals(transactions) {
    const totals = Object.create(null);
    for (const t of transactions) if (t.type === 'expense') totals[t.category] = ((totals[t.category] || 0) * 100 + cents(t.amount)) / 100;
    return totals;
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function csvCell(value) {
    let text = String(value ?? '');
    // Prevent spreadsheet formula execution for untrusted text fields.
    if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }
  function csvForTransactions(transactions) {
    const rows = [['description','amount','type','category','date'], ...transactions.map(t => [t.description,t.amount.toFixed(2),t.type,t.category,t.date])];
    return rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
  }
  const api = {CATEGORIES,localDateString,validDate,validateTransaction,normalizeTransactions,calculateSummary,categoryTotals,escapeHTML,csvForTransactions};
  root.LedgerlyCore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
