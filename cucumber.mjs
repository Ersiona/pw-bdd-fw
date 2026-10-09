// Cucumber.js configuration (ESM).
// Cucumber automatically discovers this file (cucumber.mjs) at the project root.
//
// CLI flags (e.g. --tags, --parallel) are merged on top of this file,
// so `npm run test:smoke` -> `cucumber-js --tags '@smoke'` works out of the box.
//
// All paths below are resolved relative to THIS config file so step/feature
// discovery works regardless of the current working directory.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default {
  // Support code (hooks, world, step definitions) loaded as ES modules.
  import: [
    path.join(projectRoot, 'hooks/**/*.js'),
    path.join(projectRoot, 'step-definitions/**/*.js')
  ],

  // Feature discovery.
  paths: [path.join(projectRoot, 'features/**/*.feature')],

  // Formatters:
  //  - `progress`  -> compact console progress
  //  - `json`      -> machine-readable report used by cucumber-html-reporter
  format: [
    'progress',
    `json:${path.join(projectRoot, 'reports', 'cucumber-report.json')}`
  ],

  // Generate async/await snippets for missing step definitions.
  formatOptions: {
    snippetInterface: 'async-await'
  },

  // Tag to always skip (unless explicitly overridden).
  tags: 'not @skip',

  // 0 = run sequentially in the main process. Use `npm run test:parallel`
  // (or --parallel N) for multi-worker execution.
  parallel: 0,

  // Failing due to pending/undefined steps should fail the run.
  strict: true,

  // Exit cleanly once the event loop drains (avoids hanging after hooks).
  forceExit: true
};
