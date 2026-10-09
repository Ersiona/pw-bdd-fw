import fs from 'node:fs/promises';
import path from 'node:path';
import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import BrowserManager from '../utilities/BrowserManager.js';
import Logger from '../utilities/Logger.js';
import LoginPage from '../pages/LoginPage.js';
import DashboardPage from '../pages/DashboardPage.js';
import RegistrationPage from '../pages/RegistrationPage.js';

const SCREENSHOT_DIR = path.resolve('screenshots');
const TRACE_DIR = path.resolve('traces');

// One shared browser per worker process (launched once, closed at the end).
// Scenario isolation is achieved with a fresh browser CONTEXT per scenario.
let browser = null;

// ---------------------------------------------------------------------------
// BeforeAll / AfterAll - browser lifecycle (once per worker)
// ---------------------------------------------------------------------------

BeforeAll(async function () {
  await fs.mkdir(path.resolve('reports'), { recursive: true });
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

  browser = await BrowserManager.launch();
  Logger.info(`Browser launched: ${BrowserManager.selectedBrowser}`);
});

AfterAll(async function () {
  await browser?.close();
  Logger.info('Browser closed.');
});

// ---------------------------------------------------------------------------
// Before / After - context + page lifecycle (once per scenario)
// ---------------------------------------------------------------------------

Before(async function () {
  // Isolated context per scenario => clean state and parallel-safe.
  this.browser = browser;
  this.context = await BrowserManager.createContext(this.browser, {
    viewport: { width: 1280, height: 720 }
  });
  this.page = await this.context.newPage();

  // Expose page objects to step definitions via the World.
  this.loginPage = new LoginPage(this.page);
  this.dashboardPage = new DashboardPage(this.page);
  this.registrationPage = new RegistrationPage(this.page);

  // Optional Playwright tracing (TRACE=true) for debugging.
  if (process.env.TRACE === 'true') {
    await fs.mkdir(TRACE_DIR, { recursive: true });
    await this.context.tracing.start({ screenshots: true, snapshots: true });
  }
});

After(async function (scenario) {
  // Stop tracing (saved on every scenario when enabled).
  if (process.env.TRACE === 'true' && this.context) {
    const tracePath = path.join(TRACE_DIR, `trace-${Date.now()}.zip`);
    await this.context.tracing.stop({ path: tracePath });
    Logger.info(`Trace saved: ${tracePath}`);
  }

  // Failure handling: capture screenshot, attach to report, save to disk.
  if (scenario.result?.status === 'FAILED') {
    Logger.error(`Scenario FAILED: ${scenario.pickle.name}`);
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, 'image/png');

      const filePath = path.join(SCREENSHOT_DIR, `failure-${Date.now()}.png`);
      await fs.writeFile(filePath, screenshot);
      Logger.info(`Failure screenshot saved: ${filePath}`);
    } catch (error) {
      Logger.warn(`Could not capture screenshot: ${error.message}`);
    }
  }

  // Tear down the scenario's isolated context.
  await this.page?.close().catch(() => {});
  await this.context?.close().catch(() => {});
});
