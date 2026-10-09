import { chromium, firefox, webkit } from '@playwright/test';

/**
 * Supported browser implementations.
 * The user-selectable "logical" names map to Playwright browser launchers.
 */
const BROWSERS = {
  chromium,
  firefox,
  webkit
};

const VALID_BROWSERS = Object.keys(BROWSERS);

/**
 * Central browser factory / lifecycle management.
 *
 * Browser selection (never hardcoded):
 *   BROWSER=chromium npm test
 *   BROWSER=firefox  npm test
 *   BROWSER=webkit   npm test
 */
class BrowserManager {
  /** @returns {string} selected logical browser name (defaults to 'chromium'). */
  static get selectedBrowser() {
    return (process.env.BROWSER || 'chromium').toLowerCase();
  }

  /** @returns {string[]} list of supported browser names. */
  static get supportedBrowsers() {
    return [...VALID_BROWSERS];
  }

  /**
   * Validate a browser name, throwing a clear error for unsupported values.
   * @param {string} browser
   */
  static validateBrowser(browser) {
    if (!VALID_BROWSERS.includes(browser)) {
      throw new Error(
        `Unsupported browser "${browser}". Supported browsers: ${VALID_BROWSERS.join(', ')}. ` +
          `Set it via BROWSER=chromium|firefox|webkit.`
      );
    }
  }

  /**
   * Launch the configured browser once per worker.
   * @returns {Promise<import('playwright').Browser>}
   */
  static async launch() {
    const browserName = this.selectedBrowser;
    this.validateBrowser(browserName);

    const launchOptions = {
      headless: process.env.HEADLESS !== 'false'
    };

    return BROWSERS[browserName].launch(launchOptions);
  }

  /**
   * Create an isolated browser context (one per scenario).
   * @param {import('playwright').Browser} browser
   * @param {object} [options]
   * @returns {Promise<import('playwright').BrowserContext>}
   */
  static async createContext(browser, options = {}) {
    return browser.newContext(options);
  }
}

export default BrowserManager;
