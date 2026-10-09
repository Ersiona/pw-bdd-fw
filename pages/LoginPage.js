import BasePage from './BasePage.js';

/**
 * Login Page Object.
 * All locators and login-specific actions live here - never in step definitions.
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Stable, role/label-based locators (no XPath).
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('#error-message');
  }

  /** Navigate to the login page (root of the app). */
  async open() {
    await this.navigate('/');
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  /** Fill both credential fields (does NOT submit). */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  /** @returns {Promise<string|null>} visible error message text. */
  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return this.errorMessage.textContent();
  }
}

export default LoginPage;
