import { setWorldConstructor } from '@cucumber/cucumber';

/**
 * Custom Cucumber World.
 *
 * Provides a clean, global handle to the browser infrastructure and page
 * objects so step definitions never need to create their own instances:
 *
 *   Given('...', async function () {
 *     await this.loginPage.open();
 *   });
 *
 * Also provides a scenario-scoped data bag (`this.data`) to guarantee that
 * generated test data is reused within a scenario and never leaks between
 * scenarios (each scenario gets a fresh World instance).
 */
class World {
  constructor({ attach, log, link, parameters }) {
    // Cucumber-provided helpers (must be captured for custom Worlds).
    this.attach = attach;
    this.log = log;
    this.link = link;
    this.parameters = parameters || {};

    // Browser lifecycle (assigned by hooks).
    this.browser = null;
    this.context = null;
    this.page = null;

    // Page objects (assigned by hooks after the page is created).
    this.loginPage = null;
    this.dashboardPage = null;
    this.registrationPage = null;

    // Scenario-scoped test data.
    this.data = {};
  }

  /**
   * Store a value in the scenario-scoped data bag.
   * @param {string} key
   * @param {*} value
   */
  setData(key, value) {
    this.data[key] = value;
  }

  /**
   * Retrieve a value from the scenario-scoped data bag.
   * @param {string} key
   * @returns {*}
   */
  getData(key) {
    return this.data[key];
  }
}

setWorldConstructor(World);

export default World;
