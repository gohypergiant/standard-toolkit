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
import { isNotIn } from './';

it('should correctly test value is not in array', () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer(), { maxLength: 1000 }),
      fc.integer(),
      (array, value) => {
        return isNotIn(array)(value) === !array.includes(value);
      },
    ),
    {
      verbose: 2,
      // manual cases
      examples: [
        [[50, 75, 100], 100],
        [[100, 200, 300], 50],
      ],
    },
  );
});
