import fs from 'node:fs/promises';
import path from 'node:path';
import Config from '../utilities/Config.js';
import Logger from '../utilities/Logger.js';

/**
 * Base class for all Page Objects.
 *
 * Responsibilities:
 *  - Hold the Playwright `page` reference
 *  - Provide shared navigation / screenshot helpers
 *  - Keep environment URLs OUT of page objects (they come from Config)
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a path on top of the configured baseUrl.
   * @param {string} appPath e.g. '/' or '/dashboard.html'
   */
  async navigate(appPath = '/') {
    const url = `${Config.get('baseUrl')}${appPath}`;
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /** @returns {Promise<string>} current page title. */
  async getTitle() {
    return this.page.title();
  }

  /** @returns {Promise<string>} current page URL. */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Save a screenshot of the current page state.
   * @param {string} name file name (without extension)
   */
  async screenshot(name) {
    const dir = path.resolve('screenshots');
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${name}.png`);
    await this.page.screenshot({ path: filePath, fullPage: true });
    Logger.info(`Screenshot saved: ${filePath}`);
    return filePath;
  }
}

export default BasePage;
