import { defineConfig, devices } from '@playwright/test';

// On GitHub's computers (CI) we run all 3 browsers.
// On this laptop, Windows blocks Playwright's own browser files,
// so we run the trusted Microsoft Edge that is already installed.
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: isCI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node app/server.js',
    url: 'http://localhost:3000/login',
    reuseExistingServer: !isCI,
  },
  projects: isCI
    ? [
        { name: 'setup', testMatch: /.*\.setup\.ts/ },
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
          dependencies: ['setup'],
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'], storageState: '.auth/user.json' },
          dependencies: ['setup'],
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'], storageState: '.auth/user.json' },
          dependencies: ['setup'],
        },
      ]
    : [
        {
          name: 'setup',
          testMatch: /.*\.setup\.ts/,
          use: { ...devices['Desktop Chrome'], channel: 'msedge' },
        },
        {
          name: 'edge',
          use: {
            ...devices['Desktop Chrome'],
            channel: 'msedge',
            storageState: '.auth/user.json',
          },
          dependencies: ['setup'],
        },
      ],
});