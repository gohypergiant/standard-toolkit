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
import { random, randomInt } from './';

describe('random', () => {
  describe('random', () => {
    it('should generate number within specified range', () => {
      const value = random(0, 1);

      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    });

    it.each`
      min   | max   | scenario
      ${0}  | ${0}  | ${'min equals max at zero'}
      ${1}  | ${1}  | ${'min equals max at one'}
      ${-5} | ${-5} | ${'min equals max at negative value'}
    `('should return approximately $min when $scenario', ({ min, max }) => {
      const value = random(min, max);

      expect(value).toBeCloseTo(min);
    });

    it('should generate number within negative range', () => {
      const min = -10;
      const max = -5;

      const value = random(min, max);

      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    });

    it('should throw RangeError when min exceeds max', () => {
      expect(() => random(1, 0)).toThrow('Min exceeded max');
    });
  });

  describe('randomInt', () => {
    it('should generate integer within specified range', () => {
      const value = randomInt(0, 1);

      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    });

    it.each`
      min  | max  | expected | scenario
      ${0} | ${0} | ${0}     | ${'min equals max at zero'}
      ${1} | ${1} | ${1}     | ${'min equals max at one'}
    `('should return $expected when $scenario', ({ min, max, expected }) => {
      const value = randomInt(min, max);

      expect(value).toEqual(expected);
    });

    it('should handle floating point boundaries correctly', () => {
      const min = 0.5;
      const max = 10.5;

      const value = randomInt(min, max);

      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(Math.ceil(min));
      expect(value).toBeLessThanOrEqual(Math.floor(max));
    });

    it('should throw RangeError when min exceeds max', () => {
      expect(() => randomInt(1, 0)).toThrow('Min exceeded max');
    });
  });
});
