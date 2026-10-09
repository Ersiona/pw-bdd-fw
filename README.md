# Playwright JavaScript BDD Automation Framework

A **production-ready UI automation framework** built with **JavaScript + Playwright + Cucumber BDD**.

It follows enterprise QA best practices: Page Object Model, custom Cucumber World, scenario isolation,
multi-environment and multi-browser support, Faker-based test data, automatic failure screenshots and
self-contained HTML reporting.

> The framework ships with a **bundled local demo application** (login / registration / dashboard)
> so the example tests run out-of-the-box, deterministically, and CI-friendly — no external site required.

---

## 1. Technology Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Language     | JavaScript (ES Modules, `async/await`)                  |
| Runner       | [Cucumber.js](https://github.com/cucumber/cucumber-js)  |
| Automation   | [Playwright](https://playwright.dev)                    |
| Test Data    | [@faker-js/faker](https://fakerjs.dev)                  |
| Reporting    | [cucumber-html-reporter](https://github.com/gkushang/cucumber-html-reporter) |
| Env / Secrets | [dotenv](https://github.com/motdotla/dotenv) + `cross-env` |

---

## 2. Node.js Requirements

- **Node.js >= 22** (tested on Node 24)
- npm >= 10

```bash
node --version   # must be >= 22
npm --version
```

---

## 3. Installation

```bash
git clone <repo-url>
cd pw-bdd-fw
npm install
```

`npm install` runs `playwright install chromium` automatically. To add the other browsers:

```bash
npx playwright install firefox webkit
```

---

## 4. Project Structure

```text
project-root/
│
├── features/                 # Gherkin feature files
│   ├── login.feature
│   └── registration.feature
│
├── step-definitions/         # Cucumber step definitions (thin, BDD glue)
│   ├── login.steps.js
│   └── registration.steps.js
│
├── pages/                    # Page Object Model
│   ├── BasePage.js           # shared navigation / helpers
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   └── RegistrationPage.js
│
├── hooks/
│   ├── hooks.js              # BeforeAll / AfterAll / Before / After
│   └── world.js              # custom Cucumber World (this.page, this.data, ...)
│
├── utilities/
│   ├── Config.js             # environment-aware configuration accessor
│   ├── BrowserManager.js     # multi-browser factory + validation
│   ├── DataGenerator.js      # Faker-based test data
│   ├── WaitUtils.js          # minimal purposeful wait helpers
│   └── Logger.js             # leveled console logging
│
├── data/
│   ├── environments/         # dev.json / test.json / uat.json
│   └── test-data/            # static test data (users.json)
│
├── demo-app/                 # bundled local demo application (SUT)
│   ├── index.html            # login page
│   ├── register.html         # registration page
│   ├── dashboard.html        # post-login page
│   └── ...
│
├── scripts/
│   ├── demo-server.js        # static server for the demo app
│   └── run-tests.js          # cross-platform test runner (always builds report)
│
├── support/
│   └── generate-html-report.js   # cucumber-html-reporter generation
│
├── reports/                  # generated HTML/JSON reports (gitignored)
├── screenshots/              # failure screenshots (gitignored)
├── traces/                   # optional Playwright traces (gitignored)
│
├── cucumber.mjs              # Cucumber configuration (ESM)
├── playwright.config.js      # supplementary Playwright tooling config
├── package.json
├── .env / .env.example
└── .gitignore
```
---

## 5. Environment Configuration

Three environments are supported: **dev**, **test**, **uat**. Each maps to a JSON file:

```text
data/environments/dev.json
data/environments/test.json
data/environments/uat.json
```

Example (`data/environments/dev.json`):

```json
{
  "baseUrl": "http://localhost:3000",
  "username": "standard_user",
  "password": "secret_sauce",
  "timeout": 15000
}
```

Configuration is read through the **Config utility** — never hardcoded in pages or steps:

```js
Config.get('baseUrl');
Config.get('username');
Config.get('password');
```

### Secrets

Real credentials are **never committed**. They live in `.env` (gitignored), which overrides the
environment JSON at runtime. Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

```dotenv
ENV=dev
BROWSER=chromium
HEADLESS=true
# BASE_URL=http://localhost:3000
# TEST_USERNAME=standard_user
# TEST_PASSWORD=secret_sauce
```

Environment is selected **without modifying test code**:

```bash
ENV=dev npm test
ENV=test npm test
ENV=uat npm test
# or
npm run test:dev
npm run test:test
npm run test:uat
```

---

## 6. Browser Configuration

Supported browsers: **chromium**, **firefox**, **webkit**.

```bash
BROWSER=chromium npm test
BROWSER=firefox  npm test
BROWSER=webkit   npm test
# or
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

The `BrowserManager` factory validates the requested browser and fails with a clear error for
unsupported values. `HEADLESS=false` runs browsers headed.

---

## 7. Running Tests

Start the bundled demo application first (one terminal):

```bash
npm run demo:server
# Serving http://localhost:3000
```

Run the suite (another terminal):

```bash
npm test
```

### NPM scripts

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm test`             | Run the full suite                           |
| `npm run test:smoke`   | `@smoke` scenarios                           |
| `npm run test:regression` | `@regression` scenarios                    |
| `npm run test:login`   | `@login` scenarios                           |
| `npm run test:registration` | `@registration` scenarios                |
| `npm run test:dev`     | Run against the `dev` environment            |
| `npm run test:test`    | Run against the `test` environment           |
| `npm run test:uat`     | Run against the `uat` environment            |
| `npm run test:chromium` / `test:firefox` / `test:webkit` | Browser-specific runs |
| `npm run test:parallel`| Run with 2 parallel workers                  |
| `npm run report`       | Regenerate the HTML report from the last run |
| `npm run cucumber`     | Raw `cucumber-js` invocation                 |

### Tagged tests

```bash
npm run test:smoke
# or directly:
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@login and not @regression"
```

### Specific features / scenarios

```bash
# single feature file
npx cucumber-js features/login.feature

# single scenario by line
npx cucumber-js features/login.feature:12

# by name regex
npx cucumber-js --name "valid credentials"
```

### Parallel execution

```bash
npm run test:parallel                 # 2 workers
npx cucumber-js --parallel 4          # 4 workers
```

Each worker runs its own browser; every scenario still gets an **isolated browser context**.

---

## 8. Reporting

Every run produces:

- `reports/cucumber-report.json` — machine-readable results
- `reports/cucumber-report.html` — browsable HTML report

The HTML report includes: feature/scenario names, step status, durations, error messages,
and **embedded screenshots for failed scenarios**.

The `scripts/run-tests.js` wrapper always regenerates the HTML report — even when a test fails.
To rebuild the report from the last JSON run only:

```bash
npm run report
```

---

## 9. Failure Handling

When a scenario fails, the `After` hook automatically:

1. Captures a full-page screenshot
2. Attaches it to the Cucumber report (visible in the HTML)
3. Saves a copy to `screenshots/failure-<timestamp>.png`
4. Logs the failed scenario name

Optional Playwright **tracing** (debugging artifacts) can be enabled with `TRACE=true` in `.env`;
traces are saved to `traces/` and can be opened in the Playwright Trace Viewer.

---

## 10. Architecture

### Flow

```text
Feature  →  Step Definition  →  Page Object  →  Playwright  →  Application
```

### Browser lifecycle

```text
Cucumber Hook (BeforeAll)
   → BrowserManager.launch()
   → Browser (shared per worker)
   → Context (isolated per scenario)
   → Page (per scenario)
   → Cucumber Hook (AfterAll) closes browser
```

### Custom World

The custom Cucumber World (`hooks/world.js`) gives every step definition a clean handle to the
browser infrastructure and page objects — no re-instantiation needed:

```js
import { Given } from '@cucumber/cucumber';

Given('the user is on the login page', async function () {
  await this.loginPage.open();
});
```

Available on `this`:

| Property            | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `this.browser`      | shared Playwright browser                 |
| `this.context`      | scenario-isolated browser context         |
| `this.page`         | scenario page                             |
| `this.loginPage` / `this.dashboardPage` / `this.registrationPage` | page objects |
| `this.data`         | scenario-scoped test data bag             |
| `this.attach`       | Cucumber attachment helper                |
| `this.setData(key, value)` / `this.getData(key)` | typed data helpers |

### Test isolation

- Every scenario gets a **fresh browser context** (clean state, parallel-safe)
- The World and its `this.data` bag are re-created per scenario → no data leakage
- Scenarios never depend on each other's state

---

## 11. Test Data

### Generated data (Faker)

Use `DataGenerator` for fake data (see `utilities/DataGenerator.js`):

```js
DataGenerator.randomFirstName()
DataGenerator.randomLastName()
DataGenerator.randomEmail()
DataGenerator.randomPhoneNumber()
DataGenerator.randomUsername()
DataGenerator.randomPassword()
DataGenerator.randomCompany()
DataGenerator.randomNumber()
DataGenerator.randomString()
```

Store generated values in the scenario data bag so they are **reused within the scenario**:

```js
this.setData('user', {
  firstName: DataGenerator.randomFirstName(),
  email: DataGenerator.randomEmail()
});
```

### Static data

Reusable static test data lives in `data/test-data/` (e.g. `users.json`) and is loaded with `fs`
(avoids `import ... with { type: 'json' }` so step files load on any Node >= 18):

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../data/test-data/users.json'), 'utf-8')
);
```

---

## 12. How To...

### Create a new Page Object

1. Create `pages/MyPage.js` extending `BasePage`:

   ```js
   import BasePage from './BasePage.js';

   class MyPage extends BasePage {
     constructor(page) {
       super(page);
       this.someButton = page.getByRole('button', { name: 'Save' });
     }

     async open() {
       await this.navigate('/my-page');
     }

     async clickSave() {
       await this.someButton.click();
     }
   }

   export default MyPage;
   ```

2. Register it in the `Before` hook (`hooks/hooks.js`):

   ```js
   this.myPage = new MyPage(this.page);
   ```

3. Use it from steps: `await this.myPage.clickSave();`

> Locators should use Playwright's recommended strategies (`getByRole`, `getByLabel`,
> `getByPlaceholder`, `getByTestId`, `getByText`). Avoid XPath unless unavoidable.

### Create a new Feature

Add a Gherkin file under `features/`:

```gherkin
@myFeature @regression
Feature: My Feature

  Scenario: A meaningful business scenario
    Given a precondition
    When the user performs an action
    Then an expected outcome is observed
```

### Create Step Definitions

Add `step-definitions/my.feature.steps.js`:

```js
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('a precondition', async function () {
  await this.myPage.open();
});

When('the user performs an action', async function () {
  await this.myPage.doSomething();
});

Then('an expected outcome is observed', async function () {
  await expect(this.myPage.someElement).toBeVisible();
});
```

Step definitions are automatically discovered via `cucumber.mjs` (`import` glob). Keep them **thin** —
all UI interaction belongs in Page Objects.

### Add a new environment

1. Create `data/environments/staging.json` with the needed keys.
2. (Optional) Add `staging` to `VALID_ENVS` in `utilities/Config.js`.
3. Run with `ENV=staging npm test`.

---

## 13. Coding Standards

**Do:**
- Use clean JavaScript with `async/await` and ES Modules
- Keep step definitions thin; Page Objects own UI interaction
- Use `Config` for anything environment-specific
- Prefer Playwright auto-waiting and stable locators
- Keep scenarios readable, independent, and business-oriented

**Do Not:**
- Put locators in step definitions
- Hardcode URLs/credentials in pages or steps
- Use arbitrary `waitForTimeout()` calls
- Duplicate browser initialization or login logic
- Couple scenarios together
- Use XPath unnecessarily

---

## 14. CI/CD

The framework is CI-friendly:

- Zero external test dependencies (bundled demo app)
- `npm ci && npx playwright install --with-deps && npm test` works in any Linux runner
- JUnit output can be added via `--format junit:reports/results.xml` for CI dashboards
- Artifacts to persist: `reports/`, `screenshots/`, `traces/`

---

## 15. Troubleshooting

| Symptom | Fix |
| ------- | --- |
| VS Code shows `Was unable to find step for "Given ..."` | The Cucumber extension needs glue config. `cucumber.glue` is already set in `.vscode/settings.json` — reload the window. |
| `net::ERR_CONNECTION_REFUSED http://localhost:3000` | Start the demo app: `npm run demo:server` |
| `Unsupported browser "..."` | Use `chromium`, `firefox`, or `webkit` |
| `Executable doesn't exist` | `npx playwright install chromium firefox webkit` |
| Missing step definitions on the CLI | Run with `--dry-run` to list undefined steps; check Node version is >= 18 |

---

## 16. License

This project is for demonstration and learning purposes.

