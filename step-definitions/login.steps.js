import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import Config from '../utilities/Config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Static test data. Loaded via fs instead of `import ... with { type: 'json' }`
// so the step file loads on ALL supported Node.js versions (>= 18) without
// import-assertion syntax differences.
const testData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../data/test-data/users.json'), 'utf-8')
);

// Background ---------------------------------------------------------------

Given('the user is on the login page', async function () {
  await this.loginPage.open();
});

// Valid login ---------------------------------------------------------------

When('the user enters valid credentials', async function () {
  // Credentials come from the active environment config (.env can override).
  await this.loginPage.login(Config.get('username'), Config.get('password'));
});

When('the user clicks the login button', async function () {
  await this.loginPage.clickLogin();
});

Then('the user should be successfully logged in', async function () {
  // The demo app redirects to the dashboard after a successful login.
  await expect(this.page).toHaveURL(/dashboard\.html/);
});

Then('the user should see the welcome message', async function () {
  const expected = `Welcome, ${Config.get('username')}!`;
  const actual = await this.dashboardPage.getWelcomeMessage();
  expect(actual).toBe(expected);
});

// Invalid login (data-driven from data/test-data/users.json) -----------------

When('the user enters invalid credentials', async function () {
  const user = testData.invalidUsers[0];
  this.setData('invalidUser', user);
  await this.loginPage.login(user.username, user.password);
});

Then('the user should see an error message', async function () {
  const message = await this.loginPage.getErrorMessage();
  expect(message).toBeTruthy();
});

// Scenario Outline -----------------------------------------------------------

When('the user enters username {string} and password {string}', async function (username, password) {
  await this.loginPage.login(username, password);
});

Then('the user should see the error message {string}', async function (expected) {
  const actual = await this.loginPage.getErrorMessage();
  expect(actual).toBe(expected);
});
