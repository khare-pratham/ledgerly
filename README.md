# Ledgerly — Personal Finance Dashboard

[![Ledgerly Tests](https://github.com/khare-pratham/ledgerly/actions/workflows/ledgerly-tests.yml/badge.svg)](https://github.com/khare-pratham/ledgerly/actions/workflows/ledgerly-tests.yml) [![Live demo](https://img.shields.io/badge/demo-live-147d6f)](https://khare-pratham.github.io/ledgerly/)

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
- Automated core tests and Playwright browser end-to-end tests in GitHub Actions

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

GitHub Actions runs core syntax checks, unit tests and Playwright browser tests on pushes and pull requests targeting `main`, and can also be triggered manually from the Actions tab.

## Engineering notes

- Transaction inputs and saved records are validated before being used.
- Currency totals are calculated in integer cents to avoid common floating-point drift.
- Date validation checks actual calendar dates and uses local calendar fields.
- CSV fields are quoted, and formula-like text is prefixed to reduce spreadsheet formula-injection risk.
- Storage failures are surfaced to the user; unsaved in-memory data can still be exported before the page closes.
- Automated tests cover core logic and key browser journeys: adding income/expenses, calculating totals, filtering, persistence, deletion, CSV export and clearing data. Accessibility and the deployed page still benefit from manual checks.

## Limitations

- Data stays in this browser's `localStorage`; clearing browser storage can remove it.
- Data does not synchronise between devices or browsers.
- There is no backend, account system, bank integration or multi-user access.
- This demo is not financial advice. Avoid entering sensitive financial information.

## Potential next improvements

- Add accessible text alternatives and summaries for visual charts.
- Consider optional budget limits and recurring transactions.
- Add a backend only if cross-device sync or accounts become a real requirement.

## Tech stack

`HTML5` · `CSS3` · `Vanilla JavaScript` · `localStorage` · `Node.js test runner` · `GitHub Actions`

## Screenshot

![Ledgerly dashboard](ledgerly-dashboard.png)

## Project status

Portfolio prototype. Automated core and browser tests cover key calculations and user journeys; manual accessibility and deployed-page smoke tests are still recommended.
