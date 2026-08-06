import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/performance",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  workers: 1,
  outputDir: "test-results/performance-playwright",
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  use: {
    baseURL: "http://127.0.0.1:4175",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npx vite preview --host 127.0.0.1 --port 4175",
    url: "http://127.0.0.1:4175/performance-v2.html",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: "performance-mobile",
      use: { browserName: "chromium", viewport: { width: 390, height: 844 } },
    },
    {
      name: "performance-desktop",
      use: { browserName: "chromium", viewport: { width: 1365, height: 768 } },
    },
  ],
});
