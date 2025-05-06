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

import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { default as autoprefixer } from 'autoprefixer';
import { default as postcss } from 'postcss';
import { defineConfig } from 'tsup';

async function processCss(css: string) {
  return await postcss([autoprefixer]).process(css, {
    from: undefined /* suppress source map warning */,
  }).css;
}

export default defineConfig({
  esbuildPlugins: [
    vanillaExtractPlugin({
      processCss,
    }),
  ],
  entry: ['src/index.ts'],
  format: 'esm',
  silent: false,
  esbuildOptions(options, _context) {
    options.logLevel = 'debug';
  },
});
