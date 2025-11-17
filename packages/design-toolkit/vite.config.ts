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
import tailwindcss from '@tailwindcss/vite';
import stringHash from 'string-hash';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

function generateScopedNameDefault(
  name: string,
  _filename: string,
  css: string,
) {
  const i = css.indexOf(`.${name}`);
  const lineNumber = css.substr(0, i).split(/[\r\n]/).length;
  const hash = stringHash(css).toString(36).substr(0, 5);

  return `_${name}_${hash}_${lineNumber}`;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      generateScopedName: (name, filename, css) =>
        name.startsWith('group\\/')
          ? name
          : generateScopedNameDefault(name, filename, css),
    },
  },
});
