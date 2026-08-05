/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { defineConfig } from 'tsdown';
import solid from 'vite-plugin-solid';
import { getBanner } from '../../scripts/license.js';

export default defineConfig({
  // solid JSX needs the babel transform — rolldown/oxc has no native support
  plugins: [solid()],
  entry: ['src/index.ts'],
  // query-devtools precedent: bundle solid + devtools-ui into dist so react
  // consumers never install solid. Only the stream peer stays external.
  external: ['@accelint/stream'],
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  unbundle: false,
  treeshake: true,
  platform: 'browser',
  minify: false,
  exports: false,
  outputOptions: {
    banner: getBanner(),
  },
});
