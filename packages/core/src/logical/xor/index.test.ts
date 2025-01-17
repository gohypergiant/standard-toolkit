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

import { describe, expect, test } from 'vitest';
import { xor, xorFn } from '.';

const isEven = (x: number) => (x & 1) === 0;
const isOdd = (x: number) => !isEven(x);

describe('xor', () => {
  test('it should return true for true | false', () => {
    const actual = xor(true)(false);

    expect(actual).toBe(true);
  });

  test('it should return true for false | true', () => {
    const actual = xor(false)(true);

    expect(actual).toBe(true);
  });

  test('it should return false for true | true', () => {
    const actual = xor(true)(true);

    expect(actual).toBe(false);
  });

  test('it should return false for false | false', () => {
    const actual = xor(false)(false);

    expect(actual).toBe(false);
  });
});

describe('xorFn', () => {
  test('it should return true for true | false', () => {
    const actual = xorFn(isEven)(isOdd)(4);

    expect(actual).toBe(true);
  });

  test('it should return true for false | true', () => {
    const actual = xorFn(isOdd)(isEven)(4);

    expect(actual).toBe(true);
  });

  test('it should return false for true | true', () => {
    const actual = xorFn(isEven)(isEven)(4);

    expect(actual).toBe(false);
  });

  test('it should return false for false | false', () => {
    const actual = xorFn(isOdd)(isOdd)(4);

    expect(actual).toBe(false);
  });
});
