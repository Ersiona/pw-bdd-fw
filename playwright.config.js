// ---------------------------------------------------------------------------
// Playwright configuration (supplementary / optional).
//
// NOTE: The primary test runner of this framework is Cucumber.js
// (see cucumber.mjs). This file exists for:
//   1. Documenting browser + viewport defaults used by the framework.
//   2. Enabling `npx playwright install` and Playwright tooling.
//
// It is intentionally NOT used to run BDD tests - cucumber-js is the runner.
// ---------------------------------------------------------------------------

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './features', // only relevant if you ever run `npx playwright test`
  timeout: 30000,
  fullyParallel: false,
  reporter: 'list',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 720 }
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
