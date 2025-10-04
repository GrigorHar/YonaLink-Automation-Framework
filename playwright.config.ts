import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['html'],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/results.xml' }],
    ['line']
  ],
  use: {
    baseURL: 'https://ehr.stg.yonalink.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui-tests',
      testMatch: '**/login-*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api-tests',
      testMatch: '**/api/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'forms-tests',
      testMatch: '**/forms/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'integration-tests',
      testMatch: '**/integration/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e-tests',
      testMatch: '**/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'cross-browser',
      testMatch: '**/login-*.spec.ts',
      use: { ...devices['Desktop Edge'] },
    },
  ],
});

