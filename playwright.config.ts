import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const compassAdminURL =
  process.env.COMPASS_ADMIN_URL || 'http://localhost:4200';
const webclientURL = process.env.WEBCLIENT_URL || 'http://localhost:4201';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directories for all apps
  testDir: './test/e2e',

  // Output directory for test results
  outputDir: './test/test-results',

  // Global timeout for each test
  timeout: 30 * 1000,

  // Global timeout for expect assertions
  expect: {
    timeout: 5000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: './test/playwright-report' }],
    ['json', { outputFile: './test/test-results/results.json' }],
    ['junit', { outputFile: './test/test-results/junit.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],

  /* Shared settings for all projects */
  use: {
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Browser context options */
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    /* Collect coverage */
    // @ts-ignore
    collectCoverage: process.env.COLLECT_COVERAGE === 'true',
  },

  /* Configure projects for different apps and browsers */
  projects: [
    // Compass Admin - Desktop browsers
    {
      name: 'compass-admin-chromium',
      testDir: './apps/compass-admin/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: compassAdminURL,
      },
    },
    {
      name: 'compass-admin-firefox',
      testDir: './apps/compass-admin/e2e',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: compassAdminURL,
      },
    },
    {
      name: 'compass-admin-webkit',
      testDir: './apps/compass-admin/e2e',
      use: {
        ...devices['Desktop Safari'],
        baseURL: compassAdminURL,
      },
    },

    // Webclient - Desktop browsers
    {
      name: 'webclient-chromium',
      testDir: './apps/webclient/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: webclientURL,
      },
    },
    {
      name: 'webclient-firefox',
      testDir: './apps/webclient/e2e',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: webclientURL,
      },
    },
    {
      name: 'webclient-webkit',
      testDir: './apps/webclient/e2e',
      use: {
        ...devices['Desktop Safari'],
        baseURL: webclientURL,
      },
    },

    /* Test against mobile viewports */
    {
      name: 'compass-admin-mobile-chrome',
      testDir: './apps/compass-admin/e2e',
      use: {
        ...devices['Pixel 5'],
        baseURL: compassAdminURL,
      },
    },
    {
      name: 'webclient-mobile-chrome',
      testDir: './apps/webclient/e2e',
      use: {
        ...devices['Pixel 5'],
        baseURL: webclientURL,
      },
    },

    /* Test against mobile Safari */
    {
      name: 'compass-admin-mobile-safari',
      testDir: './apps/compass-admin/e2e',
      use: {
        ...devices['iPhone 12'],
        baseURL: compassAdminURL,
      },
    },
    {
      name: 'webclient-mobile-safari',
      testDir: './apps/webclient/e2e',
      use: {
        ...devices['iPhone 12'],
        baseURL: webclientURL,
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run dev:compass-admin',
      url: compassAdminURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'npm run dev:webclient',
      url: webclientURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./test/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./test/e2e/global-teardown.ts'),
});
