import { defineConfig, devices } from "@playwright/test";

/**
 * Subflix Playwright e2e configuration.
 *
 * - Local: 1 worker max, no retries, faster feedback.
 * - CI: 2 workers, 2 retries, screenshots + video on failure, JSON + HTML reports.
 * - Tests run against the dev or production server based on PLAYWRIGHT_BASE_URL.
 *   In CI we boot `npm start` after build via webServer below.
 */

const isCI = !!process.env.CI;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 1,
  reporter: isCI
    ? [
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["json", { outputFile: "playwright-report/results.json" }],
        ["github"]
      ]
    : [["html", { open: "on-failure" }], ["list"]],
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 8_000,
    navigationTimeout: 15_000,
    testIdAttribute: "data-testid"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } }
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] }
    }
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: isCI ? "npm run start" : "npm run dev",
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
        stdout: "ignore",
        stderr: "pipe"
      }
});
