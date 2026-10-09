/**
 * Minimal waiting helpers.
 *
 * IMPORTANT: Playwright already auto-waits for element actionability
 * (visible, stable, enabled) before performing actions, so custom
 * `waitForTimeout` polling is discouraged. Only add waits that add value.
 */
class WaitUtils {
  /**
   * Wait until the page has reached a given load state.
   * @param {import('playwright').Page} page
   * @param {'load'|'domcontentloaded'|'networkidle'} [state]
   */
  static async waitForPageToLoad(page, state = 'domcontentloaded') {
    await page.waitForLoadState(state);
  }

  /**
   * Wait until the network is idle (page loaded all resources).
   * Use sparingly - prefer auto-waiting / explicit element waits.
   * @param {import('playwright').Page} page
   * @param {number} [timeout]
   */
  static async waitForNetworkIdle(page, timeout = 10000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for a locator to reach the given state (default: visible).
   * @param {import('playwright').Locator} locator
   * @param {'visible'|'hidden'|'attached'|'detached'} [state]
   */
  static async waitForElement(locator, state = 'visible') {
    await locator.waitFor({ state });
  }
}

export default WaitUtils;
