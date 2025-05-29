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

import fc from 'fast-check';
import { it } from 'vitest';
import { isGreaterEqual } from './';

it('should correctly test for greater or equal values', () => {
  fc.assert(
    fc.property(fc.integer(), fc.integer(), (a, b) => {
      return isGreaterEqual(a)(b) === a >= b;
    }),
    {
      verbose: 2,
      // manual cases
      examples: [
        [50, 100],
        [100, 50],
        [50, 50],
      ],
    },
  );
});
