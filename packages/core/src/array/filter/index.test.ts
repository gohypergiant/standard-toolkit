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
import { filter } from './';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);
const arr = [1, 2, 3, 4, 5, 6];
const expectedEven = [2, 4, 6];
const expectedOdd = [1, 3, 5];

test('it should return the correct filtered array', () => {
  const filterEven = filter(isEven);
  const filterOdd = filter(isOdd);

  expect(filterEven(arr)).toStrictEqual(expectedEven);
  expect(filterOdd(arr)).toStrictEqual(expectedOdd);
});
