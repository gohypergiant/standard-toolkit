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

import { describe, expect, it } from 'vitest';
import type { CmdOptions } from '../../src/utils/types.ts';

describe('types', () => {
  it('should define CmdOptions type correctly', () => {
    // This is a type test, we're just ensuring the type exists and can be used
    const options: CmdOptions = {
      catalogInfo: '/path/to/catalog-info.yaml',
      nodeModules: '/path/to/node_modules',
      package: '/path/to/package.json',
      regenerate: true,
    };

    expect(options).toHaveProperty('catalogInfo');
    expect(options).toHaveProperty('nodeModules');
    expect(options).toHaveProperty('package');
    expect(options).toHaveProperty('regenerate');
  });
});
