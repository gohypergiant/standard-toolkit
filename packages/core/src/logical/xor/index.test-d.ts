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

import { describe, expectTypeOf, test } from 'vitest';
import { xor, xorFn } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('xor', () => {
  test('it should have the correct curried types', () => {
    expectTypeOf(xor).toBeFunction();
    expectTypeOf(xor).toBeCallableWith(0);
    expectTypeOf(xor).toBeCallableWith('');
    expectTypeOf(xor).toBeCallableWith(false);

    expectTypeOf(xor(false)).toBeFunction();
    expectTypeOf(xor(false)).toBeCallableWith(0);
    expectTypeOf(xor(false)).toBeCallableWith('');
    expectTypeOf(xor(false)).toBeCallableWith(false);
  });

  test('it should have the correct return types', () => {
    expectTypeOf(xor(5)(0)).toBeBoolean();
    expectTypeOf(xor('')(0)).toBeBoolean();
    expectTypeOf(xor(5)(false)).toBeBoolean();
  });
});

describe('xorFn', () => {
  test('it should have the correct curried types', () => {
    expectTypeOf(xorFn).toBeFunction();
    expectTypeOf(xorFn<number>).toBeCallableWith(isEven);
    expectTypeOf(xorFn<number>).toBeCallableWith(isOdd);

    expectTypeOf(xorFn(isEven)).toBeFunction();
    expectTypeOf(xorFn(isEven)).toBeCallableWith(isEven);
    expectTypeOf(xorFn(isEven)).toBeCallableWith(isOdd);

    expectTypeOf(xorFn(isEven)(isOdd)).toBeCallableWith(0);
    expectTypeOf(xorFn(isEven)(isOdd)).toBeCallableWith(94);
  });

  test('it should have the correct return types', () => {
    expectTypeOf(xorFn(isEven)(isOdd)(4)).toBeBoolean();
    expectTypeOf(xorFn(isOdd)(isEven)(4)).toBeBoolean();
    expectTypeOf(xorFn(isOdd)(isOdd)(4)).toBeBoolean();
  });
});
