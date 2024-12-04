/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { isFalse, isNo, isOff, isOn, isTrue, isYes } from './';

type Config = {
  negative: unknown[];
  positive: unknown[];
  predicate: (a: unknown) => boolean;
};

describe('boolean predicates', () => {
  describe.each`
    predicate  | positive                                        | negative
    ${isFalse} | ${[false, ' false', '0', '0.00']}               | ${[true, 'o', 'O', 'true', 'string with false']}
    ${isNo}    | ${[false, ' n', 'N ', 'no', 'NO']}              | ${[true, 'yes', 'string with no']}
    ${isOff}   | ${[false, ' off', 'OFF ']}                      | ${[true, 'on', 'string with off', 'of']}
    ${isOn}    | ${[true, ' on', 'ON ']}                         | ${[false, 'of', 'string with on', 'o']}
    ${isTrue}  | ${[true, ' true', 'any string', {}, [], /abc/]} | ${[false, '']}
    ${isYes}   | ${[true, ' yes', 'YeS ', 'y']}                  | ${[false, 'no', 'string with yes']}
  `('$predicate.name', ({ negative, positive, predicate }: Config) => {
    it.each(positive)('%s', (val) => {
      expect(predicate(val)).toBe(true);
    });

    it.each(negative)('%s', (val) => {
      expect(predicate(val)).toBe(false);
    });
  });
});
