import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import reporter from 'cucumber-html-reporter';

const JSON_REPORT = path.resolve('reports/cucumber-report.json');
const HTML_REPORT = path.resolve('reports/cucumber-report.html');

/**
 * Generate the cucumber HTML report from the cucumber JSON report.
 * Can be called programmatically (scripts/run-tests.js) or run directly:
 *   npm run report
 */
export function generateHtmlReport() {
  if (!fs.existsSync(JSON_REPORT)) {
    console.warn('[report] No cucumber JSON report found. Run tests first.');
    return;
  }

  const options = {
    theme: 'bootstrap',
    jsonFile: JSON_REPORT,
    output: HTML_REPORT,
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    storeScreenshots: false, // screenshots are inlined as attachments
    metadata: {
      'Test Environment': process.env.ENV || 'dev',
      Browser: process.env.BROWSER || 'chromium',
      Platform: `${process.platform} (${process.arch})`,
      'Node Version': process.version,
      Executed: 'Local'
    }
  };

  reporter.generate(options);
  console.log(`[report] HTML report generated: ${HTML_REPORT}`);
}

// Run directly: `node support/generate-html-report.js` or `npm run report`.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateHtmlReport();
}
