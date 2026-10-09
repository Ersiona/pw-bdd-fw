import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

/**
 * Cross-platform test runner wrapper.
 *
 * 1. Spawns cucumber-js with the provided CLI args.
 * 2. ALWAYS generates the HTML report afterwards (even when tests fail).
 * 3. Propagates cucumber's exit code.
 *
 * This avoids fragile shell chaining (`&&` / `;`) that behaves differently
 * on Windows, macOS and Linux.
 */

// Resolve the cucumber-js executable from its package.json `bin` field.
// (require.resolve of the bin subpath is blocked by the package "exports" map,
//  but "./package.json" is exported, so we resolve through it.)
let cucumberBin;
try {
  const pkgJsonPath = require.resolve('@cucumber/cucumber/package.json');
  const pkgDir = path.dirname(pkgJsonPath);
  const binEntry = require(pkgJsonPath).bin['cucumber-js'];
  cucumberBin = path.join(pkgDir, binEntry);
} catch {
  cucumberBin = 'cucumber-js';
}

const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [cucumberBin, ...args], {
  stdio: 'inherit'
});

// Generate HTML report (read after the run so failures still produce a report).
await import(pathToFileURL(require.resolve('../support/generate-html-report.js')).href)
  .then((module) => module.generateHtmlReport())
  .catch((error) => {
    console.warn(`[runner] HTML report generation failed: ${error.message}`);
  });

process.exit(result.status ?? 1);
