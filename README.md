# Ledgerly — Personal Finance Dashboard

A responsive, browser-based personal finance dashboard built with vanilla HTML, CSS and JavaScript.

> **Portfolio demo:** a local-first finance tracker for recording income and expenses, reviewing spending summaries, and exporting transactions.

## Features

- Add income and expense transactions with descriptions, categories and dates
- View income, expenses, balance and transaction-count summaries
- Review expense totals by category
- Filter and delete transactions
- Export transactions to CSV
- Optionally load sample data
- Persist transactions in browser `localStorage`
- Validate transaction fields and stored records before use
- Calculate money totals in integer cents to reduce floating-point errors
- Neutralise spreadsheet formula-like text in CSV exports
- Automated core tests using Node.js's built-in test runner and GitHub Actions

## Live demo

Open the GitHub Pages deployment: https://khare-pratham.github.io/ledgerly/

The app is a static frontend. No backend or account is required.

## Run locally

You can open `index.html` directly in a modern browser. If you prefer to serve the files locally, run this command from the repository directory:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Run automated tests

Requires Node.js 22 (or a compatible version with the built-in `node:test` runner).

```bash
node --check ledgerly-core.js
node --check tests/ledgerly-core.test.cjs
node --test tests/ledgerly-core.test.cjs
```

GitHub Actions runs the core syntax check and tests on pushes and pull requests targeting `main`, and can also be triggered manually from the Actions tab.

## Engineering notes

- Transaction inputs and saved records are validated before being used.
- Currency totals are calculated in integer cents to avoid common floating-point drift.
- Date validation checks actual calendar dates and uses local calendar fields.
- CSV fields are quoted, and formula-like text is prefixed to reduce spreadsheet formula-injection risk.
- Storage failures are surfaced to the user; unsaved in-memory data can still be exported before the page closes.
- The automated tests cover pure core logic. UI interactions, accessibility and the deployed page still need manual browser checks.

## Limitations

- Data stays in this browser's `localStorage`; clearing browser storage can remove it.
- Data does not synchronise between devices or browsers.
- There is no backend, account system, bank integration or multi-user access.
- This demo is not financial advice. Avoid entering sensitive financial information.

## Potential next improvements

- Add accessible text alternatives and summaries for visual charts.
- Add browser-level regression tests for key user journeys.
- Consider optional budget limits and recurring transactions.
- Add a backend only if cross-device sync or accounts become a real requirement.

## Tech stack

`HTML5` · `CSS3` · `Vanilla JavaScript` · `localStorage` · `Node.js test runner` · `GitHub Actions`

## Screenshot

![Ledgerly dashboard](ledgerly-dashboard.png)

## Project status

Portfolio prototype. The automated tests validate core calculations and data handling; they do not replace browser and deployment smoke tests.
