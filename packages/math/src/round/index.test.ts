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
import { round } from './';

describe('round', () => {
  describe('positive precision (decimal places)', () => {
    it.each`
      precision | value      | expected  | description
      ${1}      | ${1.2345}  | ${1.2}    | ${'rounds to 1 decimal place'}
      ${2}      | ${1.2345}  | ${1.23}   | ${'rounds to 2 decimal places'}
      ${3}      | ${1.2345}  | ${1.235}  | ${'rounds to 3 decimal places'}
      ${4}      | ${1.2345}  | ${1.2345} | ${'preserves value with sufficient precision'}
      ${5}      | ${1.2345}  | ${1.2345} | ${'preserves value with excess precision'}
      ${2}      | ${1.235}   | ${1.24}   | ${'rounds up when next digit >= 5'}
      ${2}      | ${1.234}   | ${1.23}   | ${'rounds down when next digit < 5'}
      ${1}      | ${9.95}    | ${10.0}   | ${'handles rounding that increases magnitude'}
      ${2}      | ${0.005}   | ${0.01}   | ${'handles small values'}
      ${3}      | ${-1.2345} | ${-1.234} | ${'handles negative values'}
    `('$description', ({ expected, precision, value }) => {
      expect(round(precision, value)).toEqual(expected);
    });
  });

  describe('zero precision (round to integer)', () => {
    it.each`
      value     | expected | description
      ${1.2345} | ${1}     | ${'rounds decimal to integer'}
      ${1.5}    | ${2}     | ${'rounds 0.5 up'}
      ${2.5}    | ${3}     | ${'rounds 0.5 up consistently'}
      ${-1.5}   | ${-1}    | ${'rounds negative 0.5 toward zero'}
      ${0.4}    | ${0}     | ${'rounds down'}
      ${0.6}    | ${1}     | ${'rounds up'}
    `('$description', ({ expected, value }) => {
      expect(round(0, value)).toEqual(expected);
    });
  });

  describe('negative precision (round to tens, hundreds, etc.)', () => {
    it.each`
      precision | value         | expected | description
      ${-1}     | ${12345.6789} | ${12350} | ${'rounds to nearest 10'}
      ${-2}     | ${12345.6789} | ${12300} | ${'rounds to nearest 100'}
      ${-3}     | ${12345.6789} | ${12000} | ${'rounds to nearest 1000'}
      ${-4}     | ${12345.6789} | ${10000} | ${'rounds to nearest 10000'}
      ${-5}     | ${12345.6789} | ${0}     | ${'rounds to nearest 100000'}
      ${-1}     | ${15}         | ${20}    | ${'rounds up to nearest 10'}
      ${-1}     | ${14}         | ${10}    | ${'rounds down to nearest 10'}
      ${-2}     | ${1234}       | ${1200}  | ${'rounds to nearest 100'}
    `('$description', ({ expected, precision, value }) => {
      expect(round(precision, value)).toEqual(expected);
    });
  });

  describe('edge cases', () => {
    it.each`
      precision | value                       | expected                    | description
      ${0}      | ${0}                        | ${0}                        | ${'handles zero'}
      ${0}      | ${-0}                       | ${-0}                       | ${'handles negative zero'}
      ${2}      | ${Number.EPSILON}           | ${0}                        | ${'handles very small numbers'}
      ${0}      | ${Number.MAX_SAFE_INTEGER}  | ${Number.MAX_SAFE_INTEGER}  | ${'handles max safe integer'}
      ${0}      | ${-Number.MAX_SAFE_INTEGER} | ${-Number.MAX_SAFE_INTEGER} | ${'handles negative max safe integer'}
      ${10}     | ${0.123456789012}           | ${0.123456789}              | ${'handles high precision values'}
      ${-10}    | ${12345678901234}           | ${12350000000000}           | ${'handles large negative precision'}
    `('$description', ({ expected, precision, value }) => {
      expect(round(precision, value)).toEqual(expected);
    });

    it('handles NaN value', () => {
      expect(round(2, Number.NaN)).toBeNaN();
    });

    it('handles positive infinity', () => {
      expect(round(2, Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
    });

    it('handles negative infinity', () => {
      expect(round(2, Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
    });
  });

  describe('error handling', () => {
    it.each`
      precision | description
      ${1.1}    | ${'rejects decimal precision'}
      ${1.5}    | ${'rejects half precision'}
      ${0.1}    | ${'rejects small decimal precision'}
      ${-1.5}   | ${'rejects negative decimal precision'}
    `('$description', ({ precision }) => {
      expect(() => round(precision, 1)).toThrow(
        'Precision must be an integer.',
      );
    });

    it('throws Error type for non-integer precision', () => {
      expect(() => round(1.1, 1)).toThrow(Error);
    });
  });
});
