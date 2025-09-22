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

import fs from 'node:fs/promises';
import {
  fixAliasPlugin,
  fixExtensionsPlugin,
  fixFolderImportsPlugin,
} from 'esbuild-fix-imports-plugin';
import { glob } from 'tinyglobby';
import { defineConfig } from 'tsup';

const CHECK = /client-only/gm;

export default defineConfig({
  esbuildPlugins: [
    fixAliasPlugin(),
    fixFolderImportsPlugin(),
    fixExtensionsPlugin(),
  ],
  entry: [
    'src/**/*.{ts,tsx,css}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__fixtures__',
    '!storybook-static',
    '!src/test',
  ],
  loader: {
    '.css': 'copy',
  },
  tsconfig: './tsconfig.dist.json',
  metafile: true,
  bundle: false,
  clean: true,
  dts: true,
  format: 'esm',
  minify: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  onSuccess: async () => {
    const files = await glob(['dist/**/*.js', '!dist/**/*.js.map']);

    for (let i = 0; i < files.length; i++) {
      const path = files[i];
      const content = await fs.readFile(path, 'utf-8');

      if (CHECK.test(content)) {
        fs.writeFile(path, `${"'use client';"}\n\n${content}`);
      }
    }
  },
});
