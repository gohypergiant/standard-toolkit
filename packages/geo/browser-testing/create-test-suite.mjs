// __private-exports
/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Browser compatibility test suite framework
 *
 * This module provides a factory function for creating browser-based test suites.
 * It handles page lifecycle, console message capture, and automatic result tracking.
 *
 * @module create-test-suite
 */

/**
 * Maximum time to wait for tests to complete (in milliseconds)
 * Acts as a timeout to prevent hanging if tests never complete
 * @constant {number}
 */
const MAX_WAIT_TIME = 5000;

/**
 * Interval to check if tests have completed (in milliseconds)
 * @constant {number}
 */
const CHECK_INTERVAL = 100;

/**
 * Playwright navigation option to wait until network is idle
 * @constant {object}
 */
const NETWORK_IDLE = { waitUntil: 'networkidle' };

/**
 * Patterns to filter out from error detection
 * Add common framework warnings that should be ignored during testing
 * @constant {string[]}
 */
const IGNORED_ERRORS = [
  // NOTE: example of errors to possibly ignore
  // 'Download the React DevTools',
  // 'Warning: ReactDOM.render',
];

/**
 * Create a test suite for running browser compatibility tests
 *
 * This factory function returns a tuple containing:
 * 1. A test function for running individual tests
 * 2. A completion callback that receives test results
 *
 * @param {import('playwright').Browser} browser - Playwright browser instance
 * @returns {[test: Function, onComplete: Function]} Tuple of [test function, completion callback]
 *
 * @example
 * const browser = await chromium.launch({ headless: true });
 * const [test, onComplete] = createTestSuite(browser);
 *
 * await test('My Test', 'http://localhost:8080', (result) => {
 *   return result.success;
 * });
 *
 * onComplete(({ failing, passing }) => {
 *   console.log(`Passed: ${passing}, Failed: ${failing}`);
 * });
 */
export function createTestSuite(browser) {
  if (!browser) {
    throw new Error('No browser provided to run the tests.');
  }

  const results = { failing: 0, passing: 0 };

  /**
   * Run a browser compatibility test
   *
   * Opens a new browser page, navigates to the test URL, captures console output,
   * and validates the result using the provided check function. Automatically
   * tracks passing and failing tests.
   *
   * @param {string} title - Human-readable test description
   * @param {string} url - URL to test (should be served by the test server)
   * @param {(result: TestResult) => boolean} checkFn - Validation callback that receives
   *   test results and returns true for pass, false for fail
   *
   * @typedef {object} TestResult
   * @property {string[]} consoleMessages - All console messages captured during test
   * @property {string[]} realErrors - Console errors (filtered by IGNORED_ERRORS)
   * @property {boolean} success - True if no real errors were detected
   *
   * @example
   * await test('Should work with transforms', 'http://localhost:8765/positive.html', (result) => {
   *   if (result.success) {
   *     console.log('[PASS]');
   *     return true;
   *   }
   *   console.log('[FAIL]', result.realErrors);
   *   return false;
   * });
   */
  async function test(title, url, checkFn) {
    const page = await browser.newPage();

    console.log('==================================================');
    console.log(`[TEST] ${title}`);
    console.log('==================================================');
    console.log(`Loading: ${url}\n`);

    try {
      const result = await loadPage(page, url);

      if (checkFn(result)) {
        results.passing++;
      } else {
        results.failing++;
      }
    } catch (error) {
      console.error(`[ERROR] Test "${title}" execution failed:`, error.message);
      console.error(error.stack);
      results.failing++;

      return false;
    } finally {
      await page.close(); // ✅ Always close the page
      console.log('');
    }
  }

  return [test, (cb) => cb(results)];
}

/**
 * Load a page and capture console output
 *
 * Navigates to the specified URL, waits for network idle, then polls for
 * `window.testsComplete` to be set to true (with a timeout). This allows
 * tests to signal completion rather than relying on arbitrary wait times.
 * Captures all console messages and errors, filtering based on IGNORED_ERRORS.
 *
 * @param {import('playwright').Page} page - Playwright page instance
 * @param {string} testUrl - URL to load and test
 * @returns {Promise<TestResult>} Test results including console messages and errors
 *
 * @typedef {object} TestResult
 * @property {string[]} consoleMessages - All console messages (info, log, error, etc.)
 * @property {string[]} realErrors - Console errors after filtering ignored patterns
 * @property {boolean} success - True if no real errors were detected
 */
async function loadPage(page, testUrl) {
  const consoleMessages = [];
  const consoleErrors = [];

  // Set up console listeners
  const consoleListener = (msg) => {
    const text = msg.text();

    consoleMessages.push(text);
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  };

  const errorListener = (error) => {
    consoleErrors.push(`${error.name}: ${error.message}\n${error.stack}`);
  };

  page.on('console', consoleListener);
  page.on('pageerror', errorListener);

  try {
    await page.goto(testUrl, NETWORK_IDLE);

    // Wait for the page to signal completion via window.testsComplete
    // or timeout after MAX_WAIT_TIME
    const deadline = Date.now() + MAX_WAIT_TIME;
    let testsComplete = false;

    while (!testsComplete && Date.now() < deadline) {
      testsComplete = await page.evaluate(() => window.testsComplete === true);

      if (!testsComplete) {
        await page.waitForTimeout(CHECK_INTERVAL);
      }
    }

    if (!testsComplete) {
      console.warn(
        `[WARNING] Tests did not complete within ${MAX_WAIT_TIME}ms - results may be incomplete`,
      );
    }

    const realErrors = consoleErrors.filter(
      (error) => !IGNORED_ERRORS.some((pattern) => error.includes(pattern)),
    );

    return { consoleMessages, realErrors, success: realErrors.length === 0 };
  } finally {
    page.off('console', consoleListener);
    page.off('pageerror', errorListener);
  }
}
