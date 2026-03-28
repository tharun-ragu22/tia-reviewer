import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";
import { Storage } from "@google-cloud/storage";
import { readFileSync } from "fs";
import path from "path";

const storage = new Storage();
const BUCKET = "tia-files";
let randomFileName: string;

async function deleteFile(fileName: string) {
  await storage.bucket(BUCKET).file(`tia-uploads/${fileName}`).delete();

  console.log(`gs://${BUCKET}/${fileName} deleted`);
}

test("displays review results after upload", async ({ page }) => {
  // Given a PDF is less than 50MB and less than 1000 pages

  await page.goto("/");

  // When the file is uploaded
  const fileInput = page.locator('input[type="file"]');
  randomFileName = `${randomUUID()}_test.pdf`;
  await fileInput.setInputFiles({
    name: randomFileName,
    mimeType: "application/pdf",
    buffer: readFileSync(path.join(__dirname, "dixie_outlet_mall.pdf")),
  });
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/upload") && response.status() === 200,
    { timeout: 180000 },
  );

  // Then the user should see whether the assessment passed or failed
  await expect(page.getByText(/Overall result: \s*(pass|flag)/i)).toBeAttached({
    timeout: 15000,
  });
  // And there should be a summary section

  const summary = page.locator("div.summary-section");
  await expect(summary).toBeVisible();

  const summaryText = await summary.innerText();
  console.log('summary text', summaryText)
  expect(summaryText.trim().split(/\s+/).length).toBeGreaterThan(10);

  // And there should be at least 1 findings section
  const findings = page.locator("div.finding");
  await expect(findings).not.toHaveCount(0);

  const text = await findings.first().innerText();
  expect(text.trim().split(/\s+/).length).toBeGreaterThan(10);

  await expect(page.getByText("Methodology Flags")).toBeAttached({
    timeout: 15000,
  });
});

test.afterEach(async () => {
  console.log("deleting", randomFileName);
  await deleteFile(randomFileName).catch(console.error);
});
