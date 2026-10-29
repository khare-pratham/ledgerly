import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:8000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ acceptDownloads: true });

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Your finances." }).waitFor();
    assert.equal(await page.locator("#count").textContent(), "0");
    console.log("PASS: dashboard opens with an empty transaction list");

    await page.getByLabel("Description").fill("Payday");
    await page.getByLabel("Amount (AUD)").fill("1000.00");
    await page.getByLabel("Type").selectOption("income");
    await page.getByLabel("Category").selectOption("Salary");
    await page.getByLabel("Date").fill("2026-10-29");
    await page.getByRole("button", { name: /Add transaction/ }).click();
    await page.getByText("Changes saved in this browser.").waitFor();

    await page.getByLabel("Description").fill("Rent");
    await page.getByLabel("Amount (AUD)").fill("125.50");
    await page.getByLabel("Type").selectOption("expense");
    await page.getByLabel("Category").selectOption("Housing");
    await page.getByLabel("Date").fill("2026-10-28");
    await page.getByRole("button", { name: /Add transaction/ }).click();

    assert.equal(await page.locator("#count").textContent(), "2");
    assert.match(await page.locator("#balance").textContent(), /874\.50/);
    assert.match(await page.locator("#income").textContent(), /1,000\.00/);
    assert.match(await page.locator("#expenses").textContent(), /125\.50/);
    console.log("PASS: income and expense update totals correctly");

    await page.getByRole("textbox", { name: "Filter transactions" }).fill("Rent");
    assert.equal(await page.locator("#transactions .item").count(), 1);
    await page.getByRole("textbox", { name: "Filter transactions" }).fill("does-not-exist");
    await page.getByText("No matching transactions.").waitFor();
    await page.getByRole("textbox", { name: "Filter transactions" }).fill("");
    console.log("PASS: transaction filtering works");

    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("#count").textContent(), "2");
    await page.getByRole("button", { name: "Delete Rent" }).click();
    assert.equal(await page.locator("#count").textContent(), "1");
    assert.match(await page.locator("#balance").textContent(), /1,000\.00/);
    console.log("PASS: local storage persists transactions and delete updates totals");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export CSV" }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "ledgerly-transactions.csv");
    const stream = await download.createReadStream();
    let csv = "";
    for await (const chunk of stream) csv += chunk.toString("utf8");
    assert.match(csv, /description,amount,type,category,date/);
    assert.match(csv, /Payday/);
    console.log("PASS: CSV export downloads transaction data");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Clear all data" }).click();
    assert.equal(await page.locator("#count").textContent(), "0");
    console.log("PASS: user can clear local transaction data");
    console.log("\nAll Ledgerly browser checks passed.");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
