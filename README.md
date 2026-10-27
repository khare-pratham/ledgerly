# Ledgerly — Personal Finance Dashboard

A responsive finance-tracking frontend built with vanilla HTML, CSS and JavaScript.

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Features
- Add income and expense transactions with category and date
- Summary metrics and spending by category
- Filter and delete transactions
- Export transactions to CSV
- Optional sample data
- Persists data in browser `localStorage`

## Limitations / next steps
- No backend, login, bank integration, encryption layer, or multi-device sync
- Data is browser-local and can be lost when browser storage is cleared
- Not financial advice; don't enter sensitive financial information
- Next: add tests, a database-backed API, user accounts, budget limits, recurring transactions and accessible chart descriptions

## Stack
HTML, CSS, JavaScript, browser localStorage.
