import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import DataGenerator from '../utilities/DataGenerator.js';

Given('the user is on the registration page', async function () {
  await this.registrationPage.open();
});

When('the user fills the registration form with random details', async function () {
  // Generate once and reuse within the scenario via the World data bag.
  const user = {
    firstName: DataGenerator.randomFirstName(),
    lastName: DataGenerator.randomLastName(),
    email: DataGenerator.randomEmail(),
    phone: DataGenerator.randomPhoneNumber(),
    company: DataGenerator.randomCompany(),
    username: DataGenerator.randomUsername(),
    password: DataGenerator.randomPassword()
  };
  this.setData('user', user);

  await this.registrationPage.fillForm(user);
});

When('the user submits the registration form', async function () {
  await this.registrationPage.submit();
});

Then('the user should see a success message', async function () {
  const message = await this.registrationPage.getSuccessMessage();
  const user = this.getData('user');
  expect(message).toContain('Registration successful');
  expect(message).toContain(user.firstName);
});
