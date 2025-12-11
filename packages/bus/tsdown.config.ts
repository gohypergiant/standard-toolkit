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

import { defineConfig } from 'tsdown';

export default defineConfig({
  plugins: [],
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/test',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__fixtures__',
  ],
  // NOTE: because we mark react as an optional dep, tsdown does not treat it as an external
  external: ['react'],
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  unbundle: true,
  treeshake: true,
  platform: 'neutral',
  minify: false,
  exports: {
    all: true,
  },
  // NOTE: our license header is currently not formatted correctly to support https://rolldown.rs/options/output#legalcomments
  outputOptions: {
    banner: `/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */\n\n`,
  },
});
