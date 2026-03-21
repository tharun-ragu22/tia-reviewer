// __e2e__/home.spec.ts
import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const BUCKET = "tia-files";

test("uploads file to cloud storage", async ({ page }) => {
  // Given a PDF is less than 50MB and less than 1000 pages
  await page.goto("/");

  // When the file is uploaded
  const fileInput = page.locator('input[type="file"]');
  const randomFileName = `${randomUUID()}_test.pdf`;
  await fileInput.setInputFiles({
    name: randomFileName,
    mimeType: "application/pdf",
    buffer: Buffer.from("dummy content"),
  });

  page.on('response', async (response) => {
  if (response.url().includes('/api/upload')) {
    console.log('upload API status:', response.status())
    const body = await response.text()
    console.log('upload API response:', body)
  }
  });

  const submitButton = page.locator('button[type="submit"]');
  console.log('submit button found:', await submitButton.count())
  await submitButton.click()
  console.log('clicked submit')

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

  async function deleteFile() {
    await storage.bucket(BUCKET).file(`tia-uploads/${randomFileName}`).delete();

    console.log(`gs://${BUCKET}/${randomFileName} deleted`);
  }

  await deleteFile().catch(console.error);
});
