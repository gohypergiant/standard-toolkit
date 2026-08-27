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

import baseConfig from '@accelint/vitest-config/no-dom';
import solid from 'vite-plugin-solid';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    // Solid compiles every .tsx except the React wrapper entry and its
    // tests; those fall through to esbuild's automatic React JSX below.
    plugins: [solid({ exclude: /src[/\\]react[/\\]/ })],
    esbuild: { jsx: 'automatic' },
    test: {
      // the package entries no-op outside development (TanStack devtools
      // convention); tests exercise the real implementations
      env: { NODE_ENV: 'development' },
    },
  }),
);
