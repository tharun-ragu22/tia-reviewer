import { defineConfig } from '@playwright/test'
import os from 'os'
import path from 'path'
import fs from 'fs'

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  const tmpPath = path.join(os.tmpdir(), 'gcp-key.json')
  fs.writeFileSync(tmpPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath
}

export default defineConfig({
  testDir: './__e2e__',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})