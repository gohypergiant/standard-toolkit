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

import { applyTransform, needsTransform } from './transform';
import type { Plugin } from 'vite';

/**
 * Vite plugin to fix @ngageoint package compatibility issues.
 *
 * This plugin transforms code during the Vite build process (used by Storybook)
 * to fix browser compatibility issues in the js_cols dependency.
 *
 * @returns Vite plugin configuration
 */
export function createNgageointCompatPlugin(): Plugin {
  return {
    name: 'ngageoint-compat',
    enforce: 'post', // Run AFTER other plugins, including optimizeDeps

    transform(code, _id) {
      if (needsTransform(code)) {
        return {
          code: applyTransform(code),
          map: null,
        };
      }
    },
  };
}
