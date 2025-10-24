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

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  fixAliasPlugin,
  fixExtensionsPlugin,
  fixFolderImportsPlugin,
} from 'esbuild-fix-imports-plugin';
import { defineConfig } from 'tsup';

/**
 * Recursively fix bare directory imports in all .js files in a directory
 */
async function fixBareImportsInDir(dir: string): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await fixBareImportsInDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      let contents = await readFile(fullPath, 'utf8');
      const original = contents;

      // Fix imports/exports from '.' to './index.js'
      contents = contents.replace(/(from\s+['"])\.(['"])/g, '$1./index.js$2');

      // Only write if changed
      if (contents !== original) {
        await writeFile(fullPath, contents, 'utf8');
      }
    }
  }
}

export default defineConfig({
  esbuildPlugins: [
    fixAliasPlugin(),
    fixFolderImportsPlugin(),
    fixExtensionsPlugin(),
  ],
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__fixtures__',
  ],
  bundle: false,
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  splitting: true,
  treeshake: true,
  metafile: true,
  async onSuccess() {
    // Post-process the built files to fix bare directory imports
    await fixBareImportsInDir('./dist');
    console.log('✅ Fixed bare directory imports for browser compatibility');
  },
});
