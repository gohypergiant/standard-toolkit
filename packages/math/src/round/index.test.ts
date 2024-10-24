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

import { describe, it, expect } from 'vitest';
import { round } from './';

describe('round', () => {
  describe('positive rounding; decimal position', () => {
    const value = 1.2345;

    it.each`
      precision | expected
      ${1}      | ${1.2}
      ${2}      | ${1.23}
      ${3}      | ${1.235}
      ${4}      | ${1.2345}
      ${5}      | ${1.2345}
      ${0}      | ${1}
      ${-1}     | ${0}
    `('rounds to precision', ({ expected, precision }) => {
      expect(round(precision, value)).toEqual(expected);
    });
  });

  describe('negative rounding; rounding from right to left truncating all decimal value', () => {
    const value = 12345.6789;

    it.each`
      precision | expected
      ${0}      | ${12346}
      ${-1}     | ${12350}
      ${-2}     | ${12300}
      ${-3}     | ${12000}
      ${-4}     | ${10000}
      ${-5}     | ${0}
    `('rounds to precision', ({ expected, precision }) => {
      expect(round(precision, value)).toEqual(expected);
    });
  });

  it('throws if precision is not integer', () => {
    expect(() => round(1.1, 1)).toThrow('Precision must be an integer.');
  });
});
