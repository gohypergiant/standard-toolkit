/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
 * Playwright configuration for BaseMap integration tests.
 *
 * Runs headless, without slowMo, and relies on a software GL backend
 * (SwiftShader via ANGLE) so deck.gl/MapLibre can obtain a WebGL2 context in CI
 * where no real GPU is available.
 */
export default defineConfig({
  testDir: './src/features',
  testMatch: '**/*.integration.ts',

  fullyParallel: false,
  workers: 1,

  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,

  // Keep the HTML report outside `outputDir` (test-results) so Playwright does
  // not clear it when writing per-test artifacts.
  outputDir: 'test-results/integration',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/integration', open: 'never' }],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          // Software WebGL so headless Chromium can render deck.gl reliably.
          args: [
            '--use-gl=angle',
            '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader',
            '--ignore-gpu-blocklist',
          ],
        },
      },
    },
  ],

  // Start the Next.js server before running tests.
  webServer: {
    command: process.env.CI ? 'pnpm start' : 'pnpm build && pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 60_000 : 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});