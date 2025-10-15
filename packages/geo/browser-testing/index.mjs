#!/usr/bin/env node

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
 * Browser compatibility test for the built npm package
 *
 * This script validates that the @accelint/geo package works correctly in a
 * real browser environment by running two complementary tests:
 *
 * 1. **Positive Test** (dist/): Imports from the build WITH compatibility
 *    transforms. This should work without errors and validates that the
 *    published package is browser-compatible.
 *
 * 2. **Negative Test** (dist-no-transforms/): Imports from a build WITHOUT
 *    compatibility transforms. This SHOULD fail with specific errors
 *    (e.g., "js_cols is not defined"), confirming that the transforms are
 *    actually fixing real issues.
 *
 * ## Test Flow
 *
 * 1. Starts a simple HTTP server to serve test files
 * 2. Launches a headless Chromium browser via Playwright
 * 3. Runs both positive and negative tests
 * 4. Reports results and exits with appropriate code
 *
 * ## Requirements
 *
 * - Package must be built with `pnpm build` (creates dist/)
 * - Package must be built with `pnpm build:no-transforms` (creates dist-no-transforms/)
 * - The `test:browser` npm script handles running both builds automatically
 *
 * ## Exit Codes
 *
 * - 0: All tests passed (transforms work, package is browser-compatible)
 * - 1: Some tests failed (either transforms don't work or package has issues)
 *
 * @module index
 */

import { chromium } from 'playwright';
import { createTestSuite } from './create-test-suite.mjs';
import { PORT, startServer } from './server.mjs';

const browser = await chromium.launch({ headless: true });
const server = startServer();

/**
 * URL for testing WITH compatibility transforms
 * @constant {string}
 */
const POSITIVE_TEST_URL = `http://localhost:${PORT}/browser-testing/positive.html`;

/**
 * URL for testing WITHOUT compatibility transforms
 * @constant {string}
 */
const NEGATIVE_TEST_URL = `http://localhost:${PORT}/browser-testing/negative.html`;

/**
 * Run all browser compatibility tests
 *
 * Executes both positive and negative tests to validate:
 * 1. The built package works in browsers (positive test)
 * 2. The transforms are actually fixing issues (negative test)
 *
 * @param {import('playwright').Browser} browser - Playwright browser instance
 */
async function allTests(browser) {
  const [test, onComplete] = createTestSuite(browser);

  console.log('Starting browser compatibility tests...\n');

  await test('WITH compatibility transforms', POSITIVE_TEST_URL, (result) => {
    if (result.success) {
      console.log('[PASS] No errors with transforms (expected)');
      console.log(`  ${result.consoleMessages.length} console messages logged`);

      return true;
    }

    console.log('[FAIL] Unexpected errors with transforms:');

    for (const err of result.realErrors) {
      console.log(`  ${err}`);
    }

    return false;
  });

  await test(
    'WITHOUT compatibility transforms',
    NEGATIVE_TEST_URL,
    (result) => {
      if (result.success) {
        console.log('[FAIL] No errors without transforms (unexpected!)');
        console.log(
          '  The transforms may not be necessary or may not be working.',
        );
        console.log('  All console messages:');

        for (const msg of result.consoleMessages) {
          console.log(`    ${msg}`);
        }

        return false;
      }

      console.log('[PASS] Errors detected without transforms (expected)');
      console.log('  This confirms the transforms are fixing real issues:');

      for (const err of result.realErrors.slice(0, 3)) {
        console.log(`  - ${err.split('\n')[0]}`);
      }

      if (result.realErrors.length > 3) {
        console.log(`  ... and ${result.realErrors.length - 3} more errors`);
      }

      return true;
    },
  );

  onComplete(({ failing, passing }) => {
    console.log('==================================================');
    console.log('Test Summary');
    console.log('==================================================');

    if (failing) {
      console.log(`❌ Some (${failing}) browser compatibility tests FAILED\n`);
      process.exit(1);
    } else {
      console.log(`✅ All (${passing}) browser compatibility tests PASSED`);
      process.exit(0);
    }
  });
}

try {
  await allTests(browser);
} finally {
  server.close();
  await browser.close();
}
