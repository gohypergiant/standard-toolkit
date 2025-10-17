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

import { applyTransform } from './transform';
import type { Plugin } from 'esbuild';

/**
 * Esbuild plugin to fix @ngageoint package compatibility issues.
 *
 * This plugin transforms code during the esbuild process (used by tsup for production builds)
 * to fix browser compatibility issues in the js_cols dependency.
 *
 * @returns Esbuild plugin configuration
 */
export function createNgageointCompatPlugin(): Plugin {
  return {
    name: 'ngageoint-compat',
    setup(build) {
      // Intercept the js_cols.min.js file specifically
      build.onLoad({ filter: /js_cols\.min\.js$/ }, async (args) => {
        const fs = await import('node:fs/promises');
        const contents = await fs.readFile(args.path, 'utf8');

        return {
          contents: applyTransform(contents),
          loader: 'js',
        };
      });
    },
  };
}
