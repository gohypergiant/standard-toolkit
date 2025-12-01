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

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  fixAliasPlugin,
  fixExtensionsPlugin,
  fixFolderImportsPlugin,
} from 'esbuild-fix-imports-plugin';
import { globSync } from 'tinyglobby';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildPlugins: [
    fixAliasPlugin(),
    fixFolderImportsPlugin(),
    fixExtensionsPlugin(),
  ],
  entry: [
    'src/**/*.{ts,tsx,css}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__*__',
  ],
  loader: {
    '.css': 'copy',
  },
  tsconfig: './tsconfig.dist.json',
  metafile: true,
  bundle: false,
  clean: true,
  dts: {
    entry: Object.fromEntries(
      globSync([
        'src/**/*.{ts,tsx}',
        '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
      ]).map((file) => [
        path.relative(
          'src',
          file.slice(0, file.length - path.extname(file).length),
        ),
        fileURLToPath(new URL(file, import.meta.url)),
      ]),
    ),
  },
  format: 'esm',
  minify: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
