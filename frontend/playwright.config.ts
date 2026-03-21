import { defineConfig } from "@playwright/test";
import os from "os";
import path from "path";
import fs from "fs";

let googleCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "";

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  const tmpPath = path.join(os.tmpdir(), "gcp-key.json");
  fs.writeFileSync(tmpPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  googleCredentialsPath = tmpPath;  // capture the path in a variable
}

export default defineConfig({
  testDir: "./__e2e__",
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      GCP_PROJECT_ID: process.env.GCP_PROJECT_ID ?? "",
      GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME ?? "",
      GOOGLE_APPLICATION_CREDENTIALS: googleCredentialsPath,  // use variable directly
    },
  },
});