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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { callNextSecond, remainder } from './utils';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('remainder', () => {
  describe('normal operation', () => {
    it('should return correct remainder for valid interval', () => {
      const now = 1234567890;
      const interval = 1000;
      vi.setSystemTime(now);

      const result = remainder(interval);

      const expected = interval - (now % interval);
      expect(result).toBe(expected);
    });

    it('should return full interval when at second boundary', () => {
      const interval = 1000;
      const now = 5000;
      vi.setSystemTime(now);

      const result = remainder(interval);

      expect(result).toBe(interval);
    });

    it('should calculate correctly with decimal precision', () => {
      const now = 1234567890;
      const interval = 100.5;
      vi.setSystemTime(now);

      const result = remainder(interval);

      const expected = interval - (now % interval);
      expect(result).toBeCloseTo(expected, 10);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(interval);
    });
  });

  describe('edge cases', () => {
    it('should return NaN for zero interval', () => {
      const interval = 0;

      const result = remainder(interval);

      expect(result).toBeNaN();
    });

    it('should return negative value for negative interval', () => {
      const now = 1234567890;
      const interval = -1000;
      vi.setSystemTime(now);

      const result = remainder(interval);

      const expected = interval - (now % interval);
      expect(result).toBe(expected);
      expect(result).toBeLessThan(0);
    });

    it('should handle very large interval', () => {
      const now = 1234567890;
      const interval = Number.MAX_SAFE_INTEGER;
      vi.setSystemTime(now);

      const result = remainder(interval);

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(interval);
    });

    it('should return positive Infinity for positive Infinity interval', () => {
      const now = 1234567890;
      const interval = Number.POSITIVE_INFINITY;
      vi.setSystemTime(now);

      const result = remainder(interval);

      expect(result).toBe(Number.POSITIVE_INFINITY);
    });

    it('should return negative Infinity for negative Infinity interval', () => {
      const now = 1234567890;
      const interval = Number.NEGATIVE_INFINITY;
      vi.setSystemTime(now);

      const result = remainder(interval);

      expect(result).toBe(Number.NEGATIVE_INFINITY);
    });

    it('should return NaN for NaN interval', () => {
      const interval = Number.NaN;

      const result = remainder(interval);

      expect(result).toBeNaN();
    });
  });
});

describe('callNextSecond', () => {
  // biome-ignore lint/style/useNamingConvention: We need to change rule, this is valid
  const SECOND = 1000;

  describe('normal operation', () => {
    it('should execute callback at next clock second', () => {
      const callback = vi.fn();
      const now = 1234567890;
      vi.setSystemTime(now);
      const expectedDelay = SECOND - (now % SECOND);

      callNextSecond(callback);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(expectedDelay);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should calculate correct delay from current time', () => {
      const callback = vi.fn();
      const now = 1500;
      vi.setSystemTime(now);
      const expectedDelay = SECOND - (now % SECOND);

      callNextSecond(callback);

      vi.advanceTimersByTime(expectedDelay - 1);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should execute only once', () => {
      const callback = vi.fn();
      const now = 1234567890;
      vi.setSystemTime(now);
      const expectedDelay = SECOND - (now % SECOND);

      callNextSecond(callback);
      vi.advanceTimersByTime(expectedDelay);

      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(SECOND * 10);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should wait full second when at second boundary', () => {
      const callback = vi.fn();
      const now = 5000;
      vi.setSystemTime(now);

      callNextSecond(callback);

      vi.advanceTimersByTime(SECOND);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should propagate callback errors to caller', () => {
      const throwingCallback = vi.fn(() => {
        throw new Error('Callback execution error');
      });
      const now = 1234567890;
      vi.setSystemTime(now);
      const expectedDelay = SECOND - (now % SECOND);

      callNextSecond(throwingCallback);

      expect(() => {
        vi.advanceTimersByTime(expectedDelay);
      }).toThrow('Callback execution error');

      expect(throwingCallback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(SECOND * 10);
      expect(throwingCallback).toHaveBeenCalledTimes(1);
    });
  });
});
