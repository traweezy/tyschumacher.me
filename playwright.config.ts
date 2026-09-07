import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const secureBaseURL = process.env.PLAYWRIGHT_BASE_URL ?? `https://127.0.0.1:${PORT + 1}`;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testMatch: /.*home\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      testMatch: /.*mobile\.spec\.ts/,
      use: { ...devices["Pixel 10"] },
    },
    {
      name: "mobile-webkit",
      testMatch: /.*mobile\.spec\.ts/,
      use: {
        ...devices["iPhone 17"],
        browserName: "webkit",
        baseURL: secureBaseURL,
        ignoreHTTPSErrors: !process.env.PLAYWRIGHT_BASE_URL,
      },
    },
    {
      name: "tablet-webkit",
      testMatch: /.*mobile\.spec\.ts/,
      use: {
        ...devices["iPad Mini"],
        browserName: "webkit",
        baseURL: secureBaseURL,
        ignoreHTTPSErrors: !process.env.PLAYWRIGHT_BASE_URL,
      },
    },
    {
      name: "tablet-chrome",
      testMatch: /.*mobile\.spec\.ts/,
      use: { ...devices["iPad (gen 11) landscape"], browserName: "chromium" },
    },
    {
      name: "chromium-dark",
      testMatch: /.*dark\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], colorScheme: "dark" },
    },
    {
      name: "chromium-reduced-motion",
      testMatch: /.*reduced-motion\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? []
    : [
        {
          command: `pnpm next start --port ${PORT}`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
        {
          command: `node e2e/https-preview.ts ${PORT}`,
          url: `https://127.0.0.1:${PORT + 1}`,
          ignoreHTTPSErrors: true,
          reuseExistingServer: !process.env.CI,
        },
      ],
});
