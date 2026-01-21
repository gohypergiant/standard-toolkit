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
  describe('basic functionality', () => {
    it.each`
      min    | max    | description
      ${0}   | ${1}   | ${'generates random numbers in 0-1 range'}
      ${0}   | ${10}  | ${'generates random numbers in 0-10 range'}
      ${-10} | ${10}  | ${'generates random numbers in negative to positive range'}
      ${5}   | ${15}  | ${'generates random numbers in positive range'}
      ${-20} | ${-10} | ${'generates random numbers in negative range'}
      ${0.5} | ${1.5} | ${'generates random numbers with floating-point bounds'}
    `('$description', ({ max, min }) => {
      const value = random(min, max);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    });
  });

  describe('edge cases', () => {
    it.each`
      min   | max   | description
      ${0}  | ${0}  | ${'handles zero range'}
      ${1}  | ${1}  | ${'handles single value range'}
      ${-5} | ${-5} | ${'handles negative single value range'}
    `('$description', ({ max, min }) => {
      const value = random(min, max);
      expect(value).toBeCloseTo(min);
      expect(value).toBeCloseTo(max);
    });

    it('generates values that can reach maximum bound', () => {
      const iterations = 10000;
      const min = 0;
      const max = 1;
      let reachedMax = false;

      for (let i = 0; i < iterations; i++) {
        const value = random(min, max);
        if (value > 0.99) {
          reachedMax = true;
          break;
        }
      }

      expect(reachedMax).toBe(true);
    });

    it('handles very small ranges', () => {
      const value = random(0, 0.0001);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(0.0001);
    });

    it('handles large ranges', () => {
      const value = random(0, Number.MAX_SAFE_INTEGER);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('error handling', () => {
    it('throws when min is greater than max', () => {
      expect(() => random(10, 5)).toThrow(RangeError);
      expect(() => random(10, 5)).toThrow('min exceeded max');
    });
  });
});

describe('randomInt', () => {
  describe('basic functionality', () => {
    it.each`
      min    | max    | description
      ${0}   | ${1}   | ${'generates random integers in 0-1 range'}
      ${0}   | ${10}  | ${'generates random integers in 0-10 range'}
      ${-10} | ${10}  | ${'generates random integers in negative to positive range'}
      ${5}   | ${15}  | ${'generates random integers in positive range'}
      ${-20} | ${-10} | ${'generates random integers in negative range'}
    `('$description', ({ max, min }) => {
      const value = randomInt(min, max);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
      expect(Number.isInteger(value)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it.each`
      min   | max   | expected | description
      ${0}  | ${0}  | ${0}     | ${'handles zero range'}
      ${1}  | ${1}  | ${1}     | ${'handles single value range'}
      ${-5} | ${-5} | ${-5}    | ${'handles negative single value range'}
    `('$description', ({ expected, max, min }) => {
      const value = randomInt(min, max);
      expect(value).toEqual(expected);
    });

    it('handles floating-point min/max by ceiling and flooring', () => {
      const value = randomInt(1.5, 5.9);
      expect(value).toBeGreaterThanOrEqual(2);
      expect(value).toBeLessThanOrEqual(5);
      expect(Number.isInteger(value)).toBe(true);
    });

    it('generates min value', () => {
      const iterations = 1000;
      const min = 0;
      const max = 1;
      let foundMin = false;

      for (let i = 0; i < iterations; i++) {
        if (randomInt(min, max) === min) {
          foundMin = true;
          break;
        }
      }

      expect(foundMin).toBe(true);
    });

    it('generates max value', () => {
      const iterations = 1000;
      const min = 0;
      const max = 1;
      let foundMax = false;

      for (let i = 0; i < iterations; i++) {
        if (randomInt(min, max) === max) {
          foundMax = true;
          break;
        }
      }

      expect(foundMax).toBe(true);
    });

    it('handles large integer ranges', () => {
      const value = randomInt(0, 1000000);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1000000);
      expect(Number.isInteger(value)).toBe(true);
    });
  });

  describe('distribution validation', () => {
    it('generates relatively uniform distribution', () => {
      const iterations = 10000;
      const min = 0;
      const max = 9;
      const buckets = new Array(10).fill(0);

      for (let i = 0; i < iterations; i++) {
        const value = randomInt(min, max);
        buckets[value]++;
      }

      const expectedCount = iterations / 10;
      const tolerance = expectedCount * 0.2;

      for (const count of buckets) {
        expect(count).toBeGreaterThan(expectedCount - tolerance);
        expect(count).toBeLessThan(expectedCount + tolerance);
      }
    });
  });

  describe('error handling', () => {
    it('throws when min is greater than max', () => {
      expect(() => randomInt(10, 5)).toThrow(RangeError);
      expect(() => randomInt(10, 5)).toThrow('min exceeded max');
    });
  });
});
