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
import { isNotLike } from './';

const TESTER_GEN = /^(?:(?:java|type)script)$/;
const STRING_GEN = /(?:(?:java|type)script)/;
const ALTERNATE_GEN = /^(?:markdown|rust)$/;

it('should correctly determine if the regex is not like the string', () => {
  fc.assert(
    fc.property(
      fc.oneof(fc.stringMatching(TESTER_GEN), fc.stringMatching(ALTERNATE_GEN)),
      fc.stringMatching(STRING_GEN),
      (a, b) => {
        return isNotLike(a)(b) === !new RegExp(a).test(b);
      },
    ),
    { verbose: 2 },
  );
});
