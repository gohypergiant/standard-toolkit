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

import { fixImportsPlugin } from 'esbuild-fix-imports-plugin';
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { defineConfig } from 'tsup';
// import { reactCompilerEsbuildPlugin } from './react-compiler.esbuild';

export default defineConfig({
  esbuildPlugins: [
    // TODO: revisit this in the future
    // reactCompilerEsbuildPlugin({
    //   sourceMaps: true,
    //   filter: /\.m?[jt]sx?$/,
    // }),
    esbuildPluginFilePathExtensions({
      esmExtension: 'js',
    }),
    fixImportsPlugin(),
  ],
  entry: [
    'src/**/*.{ts,tsx,css}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__fixture__',
    '!storybook-static',
    '!src/test',
  ],
  loader: {
    '.css': 'copy',
  },
  tsconfig: './tsconfig.dist.json',
  metafile: true,
  bundle: true,
  clean: true,
  dts: true,
  format: 'esm',
  minify: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
