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
import path from 'node:path';
import {
  fixAliasPlugin,
  fixExtensionsPlugin,
  fixFolderImportsPlugin,
} from 'esbuild-fix-imports-plugin';
import { glob } from 'tinyglobby';
import { defineConfig } from 'tsup';

const CHECK = /client-only/;

export default defineConfig({
  esbuildPlugins: [
    fixAliasPlugin(),
    fixFolderImportsPlugin(),
    fixExtensionsPlugin(),
  ],
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__*__',
    '!storybook-static',
    '!src/test',
  ],
  tsconfig: './tsconfig.build.json',
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
    // Add 'use client' directive to files that need it
    const jsFiles = await glob(['dist/**/*.js', '!dist/**/*.js.map']);

    for (const file of jsFiles) {
      const content = await fs.readFile(file, 'utf-8');

      if (CHECK.test(content)) {
        await fs.writeFile(file, `${"'use client';"}\n\n${content}`);
      }
    }

    // Copy CSS module files
    const cssModuleFiles = await glob(['src/**/*.module.css']);

    for (const srcFile of cssModuleFiles) {
      const destFile = path.join('dist', path.relative('src', srcFile));

      await fs.mkdir(path.dirname(destFile), { recursive: true });
      await fs.copyFile(srcFile, destFile);
    }
  },
});
