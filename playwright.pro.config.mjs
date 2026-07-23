import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/pro",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  outputDir: "test-results/playwright",
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: process.env.PRO_BROWSER_EXECUTABLE
      ? { executablePath: process.env.PRO_BROWSER_EXECUTABLE }
      : undefined,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npx vite preview --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173/pro.html?t=1028",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: "mobile-390x844",
      use: { browserName: "chromium", viewport: { width: 390, height: 844 } },
    },
    {
      name: "desktop-1365x768",
      use: {
        browserName: "chromium",
        viewport: { width: 1365, height: 768 },
      },
    },
  ],
});
