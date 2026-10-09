import BasePage from './BasePage.js';

/**
 * Dashboard Page Object (post-login landing page of the demo app).
 */
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    this.welcomeMessage = page.locator('#welcome-message');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  /** Navigate straight to the dashboard. */
  async open() {
    await this.navigate('/dashboard.html');
  }

  /** @returns {Promise<string|null>} welcome message text. */
  async getWelcomeMessage() {
    await this.welcomeMessage.waitFor({ state: 'visible' });
    return this.welcomeMessage.textContent();
  }

  async logout() {
    await this.logoutButton.click();
  }

  /** @returns {Promise<boolean>} whether the welcome banner is visible. */
  async isLoggedIn() {
    return this.welcomeMessage.isVisible();
  }
}

export default DashboardPage;
