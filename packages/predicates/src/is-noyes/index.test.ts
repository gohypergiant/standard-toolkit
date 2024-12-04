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
  createFixture,
  falsey,
  truthy,
} from '../../../constants/src/__fixtures__/boolean';

import { isFalse, isNo, isOff, isOn, isTrue, isYes } from './';

describe('boolean validators', () => {
  describe.each([
    // positive cases
    ...createFixture(
      true,
      [falsey, isFalse],
      [falsey, isNo],
      [falsey, isOff],
      [truthy, isOn],
      [truthy, isTrue],
      [truthy, isYes],
    ),
    // negative cases
    ...createFixture(
      false,
      [truthy, isFalse],
      [truthy, isNo],
      [truthy, isOff],
      [falsey, isOn],
      [falsey, isTrue],
      [falsey, isYes],
    ),
  ])('%s', (_name, expected, fn, values) => {
    it.each(values)(`should return "${expected}" for %j`, (value) => {
      expect(fn(value)).toBe(expected);
    });
  });
});
