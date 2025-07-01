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
import { isBetween } from './';

it('should correctly test if the value is between the two tuple elements', () => {
  fc.assert(
    fc.property(fc.tuple(fc.integer(), fc.integer()), fc.integer(), (a, b) => {
      const sorted = [...a].sort();
      return isBetween(a)(b) === (b >= sorted[0] && b <= sorted[1]);
    }),
    {
      verbose: 2,
      // manual cases
      examples: [
        [[50, 198], 100],
        [[100, 89], 50],
        [[50, 60], 50],
      ],
    },
  );
});
