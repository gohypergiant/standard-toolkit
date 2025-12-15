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

import { readFile, writeFile } from 'node:fs/promises';
import copy from 'rollup-plugin-copy';
import { glob } from 'tinyglobby';
import { defineConfig } from 'tsdown';

const CHECK = /client-only/;

export default defineConfig({
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__*__',
    '!storybook-static',
    '!src/test',
  ],
  tsconfig: './tsconfig.dist.json',
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  unbundle: true,
  treeshake: true,
  platform: 'neutral',
  minify: false,
  exports: true,
  external: [
    // we just copy css files manually
    /\.css$/,
    /^@react-aria\//,
    /^@react-stately\//,
  ],
  plugins: [
    {
      name: 'use-client-directive',
      async writeBundle() {
        const jsFiles = await glob([
          'dist/**/*.js',
          'dist/**/*.mjs',
          '!dist/**/*.map',
        ]);

        for (const file of jsFiles) {
          const content = await readFile(file, 'utf-8');

          if (CHECK.test(content)) {
            await writeFile(file, `'use client';\n\n${content}`);
          }
        }
      },
    },
    copy({
      targets: [{ src: 'src/**/*.css', dest: 'dist' }],
      flatten: false,
      hook: 'writeBundle',
    }),
  ],
});
