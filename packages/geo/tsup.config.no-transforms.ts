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

/**
 * Build configuration WITHOUT compatibility transforms.
 * Used for negative testing to verify that transforms are actually fixing issues.
 */

import {
  fixAliasPlugin,
  fixExtensionsPlugin,
  fixFolderImportsPlugin,
} from 'esbuild-fix-imports-plugin';
import { defineConfig } from 'tsup';
import * as ngageoint from './compat/ngageoint';

export default defineConfig({
  esbuildPlugins: [
    // NOTE: ngageoint.createEsbuildPlugin() intentionally omitted
    // This build should have the compatibility issues
    fixAliasPlugin(),
    fixFolderImportsPlugin(),
    fixExtensionsPlugin(),
  ],
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__fixtures__',
  ],
  bundle: true,
  clean: true,
  dts: false, // Skip type declarations for this build
  format: 'esm',
  sourcemap: true,
  splitting: true,
  treeshake: true,
  metafile: true,
  outDir: 'dist-no-transforms',
  noExternal: [...ngageoint.PACKAGES_TO_BUNDLE],
});
