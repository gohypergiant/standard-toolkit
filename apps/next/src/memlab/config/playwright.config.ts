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

import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for MemLab memory leak tests
 *
 * Key considerations:
 * - Tests run sequentially (workers: 1) for accurate memory measurements
 * - Longer timeouts for memory-intensive operations
 * - Chrome launched with --expose-gc for garbage collection control
 * - Web server configured to run production build
 */
export default defineConfig({
  testDir: '../../features',
  testMatch: '**/*.memlab.ts',

  // Run global setup before all tests to clean up old snapshots
  globalSetup: './global-setup.ts',

  // Run tests sequentially for accurate memory measurements
  // Parallel execution can interfere with heap snapshot accuracy
  fullyParallel: false,
  workers: 1,

  // Test timeout - reduced in CI for faster failure feedback
  // Heap snapshots and analysis can take significant time
  timeout: process.env.CI ? 90_000 : 120_000,

  // Global timeout for entire test run (20 minutes in CI)
  // This prevents the entire suite from hanging indefinitely
  globalTimeout: process.env.CI ? 20 * 60 * 1000 : undefined,

  // Disable retries in CI for faster feedback (enable once stable)
  retries: 0,

  // Fail the build on CI if tests marked as .only are found
  forbidOnly: !!process.env.CI,

  // Reporter configuration
  // In CI: list (real-time progress) + json (for parsing) + github (annotations)
  reporter: process.env.CI
    ? [
        ['list'],
        ['json', { outputFile: '../reports/results.json' }],
        ['github'],
      ]
    : [['list'], ['html', { outputFolder: '../reports/html', open: 'never' }]],

  use: {
    // Base URL for test pages
    baseURL: 'http://localhost:3000',

    // Enable tracing for debugging failed tests
    trace: 'on-first-retry',

    // Screenshot on failure for debugging
    screenshot: 'only-on-failure',

    // Action timeout for clicks, etc.
    actionTimeout: 10_000,

    // Navigation timeout
    navigationTimeout: 30_000,

    // Chrome-specific settings for heap snapshots
    launchOptions: {
      args: [
        // Enable precise memory info for accurate measurements
        '--enable-precise-memory-info',
        // Expose garbage collector for manual GC triggering
        '--js-flags=--expose-gc',
        // Disable extensions that might interfere with memory
        '--disable-extensions',
        // Use a clean profile
        '--incognito',
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Ensure we're using Chromium for CDP compatibility
        channel: undefined,
      },
    },
  ],

  // Start the Next.js server before running tests
  // In CI, the build already happened via `pnpm run build` - just start the server
  // Locally, build before start for convenience
  webServer: {
    command: process.env.CI ? 'pnpm start' : 'pnpm build && pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 60_000 : 180_000, // Faster in CI since no build needed
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
