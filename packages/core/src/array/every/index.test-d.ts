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

import { expectTypeOf, test } from 'vitest';
import { every } from '.';

const isEven = (x: number) => !(x & 1);
const arr = [1, 2, 3, 4];

test('it should have the correct curried types', () => {
  expectTypeOf(every).toBeFunction();
  expectTypeOf(every).toBeCallableWith(Boolean);
  expectTypeOf(every<number>).toBeCallableWith(isEven);

  expectTypeOf(every(isEven)).toBeFunction();
  expectTypeOf(every(isEven)).toBeCallableWith([]);
  expectTypeOf(every(isEven)).toBeCallableWith(arr);
});

test('it should have the correct return types', () => {
  expectTypeOf(every(isEven)(arr)).toBeBoolean();
});
