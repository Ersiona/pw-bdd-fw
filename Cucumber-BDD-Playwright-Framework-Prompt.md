# Playwright JavaScript BDD Automation Framework

## Role

You are a Senior SDET / Test Automation Architect.

Your task is to design and implement a **production-ready UI automation framework** using **JavaScript + Playwright + Cucumber BDD**.

The framework must be clean, scalable, maintainable, and suitable for a real enterprise QA automation project.

Do not create a simple demo framework. Build the project with enterprise-level structure, reusable utilities, environment management, reporting, test data management, and multi-browser support.

---

# 1. Technology Stack

Use the following technologies:

* **JavaScript**
* **Node.js**
* **Playwright**
* **Cucumber.js**
* **GitHub**
* **Cucumber HTML Report**

Use modern JavaScript practices.

Use `async/await` consistently.

Use ES Modules (`import/export`) unless there is a strong technical reason to use CommonJS.

---

# 2. Automation Approach

The framework must follow these principles:

### BDD

Tests must be written using:

* Feature files
* Scenarios
* Given
* When
* Then
* And
* Background
* Scenario Outline
* Examples

Example:

```gherkin
Feature: Login

  Scenario: User logs in with valid credentials

    Given the user is on the login page
    When the user enters valid username and password
    And the user clicks the login button
    Then the user should be successfully logged in
```

Step definitions must contain the automation logic and interact with Page Objects.

Feature files should remain readable and business-oriented.

---

# 3. Page Object Model

Implement a proper **Page Object Model (POM)** architecture.

All UI locators and page-specific actions must be maintained inside the `Pages` directory.

Example:

```text
pages/
    LoginPage.js
    HomePage.js
    DashboardPage.js
```

A Page Object should:

* Contain locators
* Contain page-specific actions
* Provide reusable methods
* Avoid test-specific logic
* Avoid hardcoded test data
* Use Playwright's recommended locator strategies

Prefer:

```javascript
page.getByRole()
page.getByText()
page.getByLabel()
page.getByPlaceholder()
page.getByTestId()
```

Avoid XPath unless there is no reasonable alternative.

---

# 4. Global Page Setup

Create a global page/browser setup so that Step Definitions can easily access:

```javascript
page
browser
context
```

The goal is to avoid repeatedly creating browser/page instances inside every step definition.

Step definitions should be able to access Page Objects easily.

For example:

```javascript
import { page } from '../hooks/world.js';
import LoginPage from '../pages/LoginPage.js';
```

Or implement a clean custom Cucumber World if that provides a better architecture.

The final architecture must provide:

* Browser lifecycle management
* Context lifecycle management
* Page lifecycle management
* Clean access from Step Definitions
* Isolation between scenarios

Each scenario should have an isolated browser context unless explicitly configured otherwise.

---

# 5. Cucumber Hooks

Create Cucumber hooks for:

* BeforeAll
* AfterAll
* Before
* After

Hooks should manage:

```text
Browser
Context
Page
Screenshots
Failure handling
Tracing if required
Environment initialization
```

When a scenario fails:

* Automatically capture a screenshot
* Attach the screenshot to the Cucumber report
* Include useful debugging information

Do not create unnecessary browser instances.

---

# 6. Multi-Environment Support

The framework must support:

```text
DEV
TEST
UAT
```

The environment must be selectable without modifying test code.

Example:

```bash
ENV=dev npm test
ENV=test npm test
ENV=uat npm test
```

Create environment configuration such as:

```text
data/
    environments/
        dev.json
        test.json
        uat.json
```

Example:

```json
{
  "baseUrl": "https://dev.example.com",
  "username": "testuser",
  "password": "password"
}
```

Do not hardcode environment URLs inside Page Objects or Step Definitions.

Create a reusable configuration utility:

```javascript
Config.get('baseUrl')
Config.get('username')
Config.get('password')
```

Sensitive credentials must not be committed to GitHub.

Support `.env` for secrets.

Include:

```text
.env
.env.example
.gitignore
```

---

# 7. Fake Data Generator

Create a reusable fake data generator using a suitable library such as:

```text
@faker-js/faker
```

Create:

```text
utilities/
    DataGenerator.js
```

It should provide reusable methods for generating:

* First name
* Last name
* Full name
* Email
* Phone number
* Address
* Username
* Password
* Company
* Random numbers
* Random strings

Example:

```javascript
DataGenerator.randomEmail()
DataGenerator.randomFirstName()
DataGenerator.randomLastName()
```

The generated data should be reusable within a scenario.

Avoid generating different values for the same entity unless explicitly required.

---

# 8. Multi-Browser Support

Support at minimum:

```text
Chromium
Firefox
WebKit
```

Browser selection must be configurable.

Example:

```bash
BROWSER=chromium npm test
BROWSER=firefox npm test
BROWSER=webkit npm test
```

Do not hardcode Chromium.

Create a reusable browser factory/configuration.

The framework should validate unsupported browser values and provide a clear error message.

---

# 9. Folder Structure

Use the following primary structure:

```text
project-root/
│
├── features/
│   ├── login.feature
│   └── ...
│
├── step-definitions/
│   ├── login.steps.js
│   └── ...
│
├── pages/
│   ├── LoginPage.js
│   ├── HomePage.js
│   └── ...
│
├── hooks/
│   ├── hooks.js
│   └── world.js
│
├── utilities/
│   ├── Config.js
│   ├── BrowserManager.js
│   ├── DataGenerator.js
│   ├── WaitUtils.js
│   └── ...
│
├── data/
│   ├── environments/
│   │   ├── dev.json
│   │   ├── test.json
│   │   └── uat.json
│   │
│   └── test-data/
│       └── ...
│
├── reports/
│
├── screenshots/
│
├── package.json
├── cucumber.js
├── playwright.config.js
├── .env
├── .env.example
├── .gitignore
└── README.md
```

You may improve the structure if there is a strong architectural reason, but do not unnecessarily complicate it.

---

# 10. Cucumber Configuration

Create a proper Cucumber configuration.

It should support:

* Feature discovery
* Step definition discovery
* Hooks
* Tags
* Parallel execution
* HTML reporting
* JSON reporting if useful
* Screenshot attachments
* Environment configuration

Example commands:

```bash
npm test
npm run test:smoke
npm run test:regression
npm run test:dev
npm run test:test
npm run test:uat
```

Support tags:

```gherkin
@smoke
@regression
@login
```

Example:

```bash
npx cucumber-js --tags "@smoke"
```

---

# 11. Cucumber HTML Report

Implement an HTML report for every test execution.

The report should provide:

* Feature name
* Scenario name
* Step status
* Execution duration
* Passed/failed status
* Error message
* Screenshot for failed scenarios

Reports should be generated under:

```text
reports/
```

Use a reliable Cucumber HTML reporting solution compatible with the selected Cucumber.js version.

---

# 12. Utilities

Create reusable utilities under:

```text
utilities/
```

At minimum implement:

### Config

Environment configuration.

### BrowserManager

Browser creation and management.

### DataGenerator

Faker-based test data.

### WaitUtils

Reusable waiting helpers.

Do not create unnecessary custom wait methods when Playwright's built-in auto-waiting already handles the situation.

### Logger

Provide useful execution logs.

Avoid excessive console output.

---

# 13. Test Isolation

Every scenario should be independent.

Avoid:

```text
Scenario A creates data
Scenario B depends on Scenario A
```

Instead, each scenario should prepare its own required state.

Browser contexts should be isolated.

Test data should not leak between scenarios.

---

# 14. GitHub Integration

The project must be GitHub-ready.

Create:

```text
.gitignore
README.md
```

The `.gitignore` must exclude:

```text
node_modules/
.env
reports/
screenshots/
test-results/
playwright-report/
```

Do not commit credentials or secrets.

README must explain:

* Project purpose
* Technology stack
* Installation
* Node.js requirements
* Environment configuration
* Browser configuration
* Running tests
* Running tagged tests
* Running specific features
* Generating reports
* Project structure
* How to create a new Page Object
* How to create a new Feature
* How to create Step Definitions
* How to add a new environment

---

# 15. NPM Scripts

Create useful scripts in `package.json`.

For example:

```json
{
  "scripts": {
    "test": "cucumber-js",
    "test:smoke": "cucumber-js --tags '@smoke'",
    "test:regression": "cucumber-js --tags '@regression'",
    "test:dev": "cross-env ENV=dev cucumber-js",
    "test:test": "cross-env ENV=test cucumber-js",
    "test:uat": "cross-env ENV=uat cucumber-js"
  }
}
```

Make sure the scripts work on:

* macOS
* Linux
* Windows

Use `cross-env` where required.

---

# 16. Coding Standards

Follow these rules:

### Do

* Use clean JavaScript
* Use async/await
* Use meaningful names
* Use reusable functions
* Keep Step Definitions thin
* Keep Page Objects responsible for UI interaction
* Keep configuration separate from test logic
* Use Playwright auto-waiting
* Use stable locators
* Keep scenarios readable
* Keep tests independent

### Do Not

* Put locators inside Step Definitions
* Put environment URLs inside Page Objects
* Hardcode credentials
* Use arbitrary `waitForTimeout()` calls
* Duplicate browser initialization
* Duplicate login logic
* Put business logic inside Hooks
* Create huge utility classes
* Use XPath unnecessarily
* Couple scenarios together

---

# 17. Example Architecture

The intended flow should be:

```text
Feature
   ↓
Step Definition
   ↓
Page Object
   ↓
Playwright
   ↓
Application
```

Configuration:

```text
Environment
   ↓
Config Utility
   ↓
Test / Page Object
```

Browser:

```text
Cucumber Hook
      ↓
Browser Manager
      ↓
Browser
      ↓
Context
      ↓
Page
```

Test Data:

```text
Faker
   ↓
DataGenerator
   ↓
Scenario
   ↓
Page Object
```

Reporting:

```text
Cucumber
   ↓
Hooks
   ↓
Screenshot / Error
   ↓
Cucumber HTML Report
```

---

# 18. Initial Example

Create one complete example:

```text
Login Feature
Login Page
Login Step Definitions
Hooks
Environment configuration
Fake test data where appropriate
Cucumber HTML report
```

The example must actually run.

Use a configurable example application URL rather than embedding a real production URL.

---

# 19. Validation

After creating the framework:

1. Install dependencies.
2. Validate the project structure.
3. Run lint/validation if configured.
4. Execute the example test.
5. Verify that the browser launches.
6. Verify that Cucumber discovers the feature.
7. Verify that Step Definitions are discovered.
8. Verify Page Objects work.
9. Verify environment selection.
10. Verify browser selection.
11. Verify screenshot capture on failure.
12. Verify HTML report generation.

If something fails, diagnose and fix the framework rather than simply documenting the failure.

---

# 20. Final Deliverable

The final project should be a **clean, production-ready Playwright JavaScript BDD framework**.

The framework must be:

* Scalable
* Maintainable
* Reusable
* GitHub-ready
* CI/CD-friendly
* Multi-environment
* Multi-browser
* BDD-based
* Page Object Model based
* Reportable
* Test-data driven
* Scenario isolated

Before finishing, review the entire project as a Senior SDET Architect and remove unnecessary complexity, duplication, and anti-patterns.

Do not just generate files.

**Build the framework, validate it, and make sure the example test can actually execute successfully.**
