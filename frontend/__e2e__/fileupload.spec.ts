// __e2e__/home.spec.ts
import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";
import { Storage } from "@google-cloud/storage";
import { readFileSync } from "fs";

const storage = new Storage();
const BUCKET = "tia-files";
let randomFileName: string;

const examplePassingResponse = {
  summary: "The TIA is well structured.",
  overall_rating: "pass",
  findings: [
    {
      section: "Trip Generation",
      severity: "pass",
      issue: "ITE codes cited correctly",
      detail: "Table 3-2 on page 14 references ITE code 820",
      recommendation: "No action required",
    },
  ],
  methodology_flags: {
    ite_codes_cited: true,
    peak_hours_defined: true,
    study_area_justified: true,
    los_methodology_stated: true,
    mitigation_proportional: true,
  },
};

async function deleteFile(fileName: string) {
  await storage.bucket(BUCKET).file(`tia-uploads/${fileName}`).delete();

  console.log(`gs://${BUCKET}/${fileName} deleted`);
}

test("uploads file to cloud storage", async ({ page }) => {
  // Given a PDF is less than 50MB and less than 1000 pages
  await page.goto("/");

  // When the file is uploaded
  const fileInput = page.locator('input[type="file"]');
  randomFileName = `${randomUUID()}_test.pdf`;
  await fileInput.setInputFiles({
    name: randomFileName,
    mimeType: "application/pdf",
    buffer: Buffer.from("dummy content"),
  });
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/upload"),
    { timeout: 15000 },
  );

  // Then the file is uploaded to the cloud storage
  const delay = 200;
  const retries = 3;
  for (let i = 0; i < retries; ++i) {
    try {
      const [files] = await storage
        .bucket(BUCKET)
        .getFiles({ prefix: "tia-uploads/" });
      const fileNames = files.map((f) => f.name);
      console.log("files in bucket:", fileNames);
      expect(
        fileNames.filter((name) => name.includes(randomFileName)),
      ).toHaveLength(1);
      break;
    } catch (err) {
      console.log(`Attempt ${i}/${retries} failed`);
      if (i === retries - 1) throw err;
      const backoff = delay * Math.pow(2, i);
      const jitter = Math.random() * 100;
      await new Promise((res) => setTimeout(res, backoff + jitter));
    }
  }
});

test("displays review results after upload", async ({ page }) => {
  // Given a PDF is less than 50MB and less than 1000 pages

  await page.goto("/");

  // When the file is uploaded
  const fileInput = page.locator('input[type="file"]');
  randomFileName = `${randomUUID()}_test.pdf`;
  await fileInput.setInputFiles({
    name: randomFileName,
    mimeType: "application/pdf",
    buffer: readFileSync("dixie_outlet_mall.pdf"),
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
