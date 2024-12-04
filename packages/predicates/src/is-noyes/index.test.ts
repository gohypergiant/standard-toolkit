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
import {
  isAnyFalsy,
  isAnyTruthy,
  isFalse,
  isNo,
  isOff,
  isOn,
  isTrue,
  isYes,
} from './';

type Config = {
  negative: unknown[];
  positive: unknown[];
  predicate: (a: unknown) => boolean;
};

const falsy = [0, '', false, ' false ', null, undefined, Number.NaN];
const truthy = [1, true, ' true '];

describe('boolean predicates', () => {
  describe.each`
    predicate      | positive                              | negative
    ${isAnyFalsy}  | ${[...falsy, 'no', 'off']}            | ${[...truthy, 'on', 'yes']}
    ${isAnyTruthy} | ${[...truthy, 'on', 'yes']}           | ${[...falsy, 'no', 'off']}
    ${isFalse}     | ${[...falsy, ' false', '0']}          | ${[...truthy, 'o', 'O', 'true', 'string with false', '0.00']}
    ${isNo}        | ${[...falsy, ' n', 'N ', 'no', 'NO']} | ${[...truthy, 'yes', 'string with no']}
    ${isOff}       | ${[...falsy, ' off', 'OFF ']}         | ${[...truthy, 'on', 'string with off', 'of']}
    ${isOn}        | ${[...truthy, ' on', 'ON ']}          | ${[...falsy, 'of', 'string with on', 'o']}
    ${isTrue}      | ${[...truthy, ' true']}               | ${[...falsy, 'any string', {}, [], /abc/]}
    ${isYes}       | ${[...truthy, ' yes', 'YeS ', 'y']}   | ${[...falsy, 'no', 'string with yes', 2]}
  `('$predicate.name', ({ predicate, ...lists }: Config) => {
    describe.each(['positive', 'negative'])('%s matches', (list) => {
      it.each(lists[list] as unknown[])('%j', (val) => {
        expect(predicate(val)).toBe(list === 'positive');
      });
    });
  });
});
