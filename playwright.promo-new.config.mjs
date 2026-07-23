import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/promo-new-ui',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  outputDir: 'test-results/promo-new-playwright',
  reporter: process.env.CI ? [['line'], ['html', { open: 'never', outputFolder: 'playwright-report/promo-new' }]] : 'line',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    launchOptions: process.env.PROMO_BROWSER_EXECUTABLE
      ? {
        executablePath: process.env.PROMO_BROWSER_EXECUTABLE,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      }
      : undefined,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 4174',
    url: 'http://127.0.0.1:4174/promo-admin-new.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [{ name: 'promo-admin-chromium', use: { browserName: 'chromium' } }],
});
