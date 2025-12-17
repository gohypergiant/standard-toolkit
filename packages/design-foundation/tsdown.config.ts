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

import copy from 'rollup-plugin-copy';
import { defineConfig } from 'tsdown';

export default defineConfig({
  plugins: [
    copy({
      targets: [{ src: 'src/**/*.css', dest: 'dist' }],
      flatten: false,
      hook: 'writeBundle',
    }),
  ],
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{d,test,test-d,bench}.{ts,tsx}',
    '!**/__*__',
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
  exports: {
    customExports(pkg) {
      // pkg already contains all the js exports. we only need to manually add the ./styles export
      pkg['./styles'] = './dist/index.css';
      return pkg;
    },
  },
  external: [
    // we just copy css files manually
    /\.css$/,
  ],
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
