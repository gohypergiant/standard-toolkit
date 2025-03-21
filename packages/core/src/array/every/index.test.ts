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

import { expect, test } from 'vitest';
import { every } from '.';

const isEven = (x: number) => !(x & 1);
const emptyArr = [];
const evenArr = [2, 4, 6, 8, 10];
const oddArr = [0, 3, 5, 7, 9, 11];

test('it should return true for an empty array', () => {
  const everyBool = every(Boolean);
  const everyMod = every(isEven);

  expect(everyBool(emptyArr)).toBeTruthy();
  expect(everyMod(emptyArr)).toBeTruthy();
});

test('it should return true for truthy predicates', () => {
  const everyBool = every(Boolean);
  const everyMod = every(isEven);

  expect(everyBool(evenArr)).toBeTruthy();
  expect(everyMod(evenArr)).toBeTruthy();
});

test('it should return false for falsey predicates', () => {
  const everyBool = every(Boolean);
  const everyMod = every(isEven);

  expect(everyBool(oddArr)).not.toBeTruthy();
  expect(everyMod(oddArr)).not.toBeTruthy();
});
