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
import { clamp } from './';

describe('clamp', () => {
  describe('basic clamping', () => {
    it.each`
      min    | max   | value  | expected | description
      ${1}   | ${10} | ${0}   | ${1}     | ${'clamps value below min'}
      ${1}   | ${10} | ${11}  | ${10}    | ${'clamps value above max'}
      ${1}   | ${10} | ${5}   | ${5}     | ${'returns value within range'}
      ${1}   | ${10} | ${1}   | ${1}     | ${'returns value at min boundary'}
      ${1}   | ${10} | ${10}  | ${10}    | ${'returns value at max boundary'}
      ${-10} | ${-1} | ${-15} | ${-10}   | ${'clamps negative value below min'}
      ${-10} | ${-1} | ${0}   | ${-1}    | ${'clamps negative value above max'}
      ${-10} | ${10} | ${0}   | ${0}     | ${'handles zero in negative to positive range'}
    `('$description', ({ expected, max, min, value }) => {
      expect(clamp(min, max, value)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it.each`
      min                         | max                         | value                       | expected                    | description
      ${0}                        | ${0}                        | ${0}                        | ${0}                        | ${'handles zero range'}
      ${-0}                       | ${0}                        | ${-0}                       | ${-0}                       | ${'handles negative zero'}
      ${1}                        | ${10}                       | ${Number.POSITIVE_INFINITY} | ${10}                       | ${'clamps positive infinity'}
      ${1}                        | ${10}                       | ${Number.NEGATIVE_INFINITY} | ${1}                        | ${'clamps negative infinity'}
      ${Number.NEGATIVE_INFINITY} | ${Number.POSITIVE_INFINITY} | ${0}                        | ${0}                        | ${'handles infinite range'}
      ${Number.NEGATIVE_INFINITY} | ${Number.POSITIVE_INFINITY} | ${Number.POSITIVE_INFINITY} | ${Number.POSITIVE_INFINITY} | ${'handles infinite max with infinite value'}
      ${1.5}                      | ${2.5}                      | ${2.0}                      | ${2.0}                      | ${'handles floating-point values'}
    `('$description', ({ expected, max, min, value }) => {
      expect(clamp(min, max, value)).toBe(expected);
    });

    it('handles NaN value', () => {
      expect(clamp(1, 10, Number.NaN)).toBeNaN();
    });

    it('handles NaN min', () => {
      expect(clamp(Number.NaN, 10, 5)).toBeNaN();
    });

    it('handles NaN max', () => {
      expect(clamp(1, Number.NaN, 5)).toBeNaN();
    });
  });

  describe('error handling', () => {
    it('throws when min is greater than max', () => {
      expect(() => clamp(10, 5, 7)).toThrow(RangeError);
      expect(() => clamp(10, 5, 7)).toThrow('min exceeded max');
    });
  });
});
