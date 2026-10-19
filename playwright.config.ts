import { defineConfig } from '@playwright/test'

/** Run the production export and a separate real SSG pagination fixture, with one browser worker. */
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL, browserName: 'chromium', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: [
    ...(process.env.BASE_URL ? [] : [{ command: 'pnpm preview', url: baseURL, reuseExistingServer: !process.env.CI, timeout: 30_000 }]),
    { command: 'pnpm exec tsx scripts/serve-pagination-fixture.ts', url: 'http://127.0.0.1:4174', reuseExistingServer: false, timeout: 180_000 }
  ]
})
