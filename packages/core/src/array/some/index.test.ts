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
import { some } from '.';

const emptyArr = [];
const someEvenArr = [1, 3, 6, 9, 10];
const mostlyZeroArr = [0, 0, 6, 0, 0];
const oddArr = [1, 3, 5, 7, 9, 11];
const zeroArr = [0, 0, 0, 0, 0];

test('it should return false for empty array', () => {
  const someBool = some(Boolean);
  const someMod = some((x: number) => x % 2 === 0);

  expect(someBool(emptyArr)).toBe(false);
  expect(someMod(emptyArr)).toBe(false);
});

test('it should return true for truthy predicate', () => {
  const someBool = some(Boolean);
  const someMod = some((x: number) => x % 2 === 0);

  expect(someMod(someEvenArr)).toBe(true);
  expect(someBool(mostlyZeroArr)).toBe(true);
});

test('it should return false for falsey predicate', () => {
  const someBool = some(Boolean);
  const someMod = some((x: number) => x % 2 === 0);

  expect(someMod(oddArr)).toBe(false);
  expect(someBool(zeroArr)).toBe(false);
});
