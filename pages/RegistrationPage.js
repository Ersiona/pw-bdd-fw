import BasePage from './BasePage.js';

/**
 * Registration Page Object.
 * Demonstrates form filling with generated (Faker) data.
 */
class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);

    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.emailInput = page.getByLabel('Email');
    this.phoneInput = page.getByLabel('Phone');
    this.companyInput = page.getByLabel('Company');
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Register' });
    this.successMessage = page.locator('#success-message');
  }

  /** Navigate to the registration page. */
  async open() {
    await this.navigate('/register.html');
  }

  /**
   * Fill the whole registration form.
   * @param {{firstName?: string, lastName?: string, email?: string, phone?: string, company?: string, username?: string, password?: string}} userData
   */
  async fillForm(userData) {
    if (userData.firstName) await this.firstNameInput.fill(userData.firstName);
    if (userData.lastName) await this.lastNameInput.fill(userData.lastName);
    if (userData.email) await this.emailInput.fill(userData.email);
    if (userData.phone) await this.phoneInput.fill(userData.phone);
    if (userData.company) await this.companyInput.fill(userData.company);
    if (userData.username) await this.usernameInput.fill(userData.username);
    if (userData.password) await this.passwordInput.fill(userData.password);
  }

  async submit() {
    await this.submitButton.click();
  }

  /** @returns {Promise<string|null>} success/validation message text. */
  async getSuccessMessage() {
    await this.successMessage.waitFor({ state: 'visible' });
    return this.successMessage.textContent();
  }
}

export default RegistrationPage;
