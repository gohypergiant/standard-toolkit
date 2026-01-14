/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseConfig from '@accelint/vitest-config/dom';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
    test: {
      globals: true,
      setupFiles: './src/test/setup.ts',
      environment: 'jsdom',
      // Define separate projects for unit and browser tests
      projects: [
        // Unit tests (jsdom)
        {
          extends: true,
          test: {
            name: 'unit',
            include: ['src/**/*.test.{ts,tsx}'],
            environment: 'jsdom',
            setupFiles: './src/test/setup.ts',
          },
        },
        // Visual regression tests (browser)
        {
          extends: true,
          resolve: {
            alias: {
              // Mock 'server-only' to allow importing server components in visual tests
              'server-only': path.resolve(
                __dirname,
                'src/visual-regression/mocks/server-only.ts',
              ),
            },
          },
          test: {
            name: 'visual',
            include: ['src/features/**/*.visual.tsx'],
            testTimeout: 30000,
            coverage: {
              enabled: false, // Coverage conflicts with browser mode
            },
            browser: {
              enabled: true,
              ui: false,
              headless: true,
              provider: playwright({
                launch: { headless: true },
                context: { deviceScaleFactor: 1 },
              }),
              instances: [{ browser: 'chromium' }],
              viewport: { width: 1280, height: 720 },
            },
            setupFiles: ['./src/visual-regression/vitest/setup.ts'],
          },
        },
      ],
    },
  }),
);
