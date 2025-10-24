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
 * real browser environment by testing the built package with Playwright.
 *
 * ## Test Flow
 *
 * 1. Starts a simple HTTP server to serve test files
 * 2. Launches a headless Chromium browser via Playwright
 * 3. Runs browser compatibility test
 * 4. Reports results and exits with appropriate code
 *
 * ## Requirements
 *
 * - Package must be built with `pnpm build` (creates dist/)
 * - The `test:browser` npm script handles building automatically
 *
 * ## Exit Codes
 *
 * - 0: All tests passed (package is browser-compatible)
 * - 1: Some tests failed (package has browser compatibility issues)
 *
 * @module index
 */

import { chromium } from 'playwright';
import { createTestSuite } from './create-test-suite.mjs';
import { PORT, startServer } from './server.mjs';

const browser = await chromium.launch({ headless: true });
const server = startServer();

/**
 * URL for browser compatibility test
 * @constant {string}
 */
const TEST_URL = `http://localhost:${PORT}/browser-testing/positive.html`;

/**
 * Run browser compatibility test
 *
 * Validates that the built package works correctly in a real browser.
 *
 * @param {import('playwright').Browser} browser - Playwright browser instance
 */
async function allTests(browser) {
  const [test, onComplete] = createTestSuite(browser);

  console.log('Starting browser compatibility test...\n');

  await test('Browser compatibility', TEST_URL, (result) => {
    if (result.success) {
      console.log('[PASS] No browser errors detected');
      console.log(`  ${result.consoleMessages.length} console messages logged`);

      return true;
    }

    console.log('[FAIL] Browser compatibility test failed with errors:');

    for (const err of result.realErrors) {
      console.log(`  ${err}`);
    }

    return false;
  });

  onComplete(({ failing }) => {
    console.log('==================================================');
    console.log('Test Summary');
    console.log('==================================================');

    if (failing) {
      console.log('❌ Browser compatibility test FAILED\n');
      process.exit(1);
    } else {
      console.log('✅ Browser compatibility test PASSED');
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
