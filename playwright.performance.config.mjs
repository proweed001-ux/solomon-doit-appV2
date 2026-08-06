import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/performance",
  timeout: 30000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4175",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npx vite --host 127.0.0.1 --port 4175",
    url: "http://127.0.0.1:4175/performance-v2.html",
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [
    {
      name: "performance-mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "performance-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1365, height: 768 } },
    },
  ],
});
