import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: 1,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
