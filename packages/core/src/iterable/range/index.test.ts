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
import { range } from '.';

const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('range', () => {
  test('it should iterate through the range given', () => {
    const actual: number[] = [];

    for (const x of range(1, 10)) {
      actual.push(x);
    }

    expect(actual).toStrictEqual(expected);
  });

  test('it should spread into the correct array', () => {
    const actual = [...range(1, 10)];

    expect(actual).toStrictEqual(expected);
  });
});
