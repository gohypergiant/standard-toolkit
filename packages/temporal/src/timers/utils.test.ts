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

// vi.useFakeTimers() is NOT covered by restoreMocks: true in vitest config.
// This afterEach must remain to prevent fake timer state from leaking between tests.
afterEach(() => {
  vi.useRealTimers();
});

describe('remainder', () => {
  it('should return correct remainder for valid interval', () => {
    const now = 1234567890;
    const interval = 1000;
    vi.setSystemTime(now);

    const result = remainder(interval);

    // 1234567890 % 1000 = 890; 1000 - 890 = 110
    expect(result).toBe(110);
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

  it('should handle very large interval', () => {
    const now = 1234567890;
    const interval = Number.MAX_SAFE_INTEGER;
    vi.setSystemTime(now);

    const result = remainder(interval);

    // now < MAX_SAFE_INTEGER, so now % MAX_SAFE_INTEGER === now
    // result === MAX_SAFE_INTEGER - now
    expect(result).toBe(interval - now);
  });

  it.each([
    { interval: 0, description: 'zero' },
    { interval: Number.NaN, description: 'NaN' },
    { interval: -1000, description: 'negative' },
    { interval: Number.POSITIVE_INFINITY, description: 'positive Infinity' },
    { interval: Number.NEGATIVE_INFINITY, description: 'negative Infinity' },
  ])('should throw for invalid $description interval', ({ interval }) => {
    expect(() => remainder(interval)).toThrow(
      'remainder: interval must be a finite positive number',
    );
  });
});

describe('callNextSecond', () => {
  // biome-ignore lint/style/useNamingConvention: We need to change rule, this is valid
  const SECOND = 1000;

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

  it('should schedule independent callbacks that both fire at the same second boundary', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const now = 1234567890;
    vi.setSystemTime(now);
    // Both registered before the next second boundary (110ms away)
    // Each computes its own delay to the same next-second tick

    callNextSecond(callback1);
    callNextSecond(callback2);

    // Neither has fired yet
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();

    // At the second boundary both fire independently
    // 1234567890 % 1000 = 890; delay = 1000 - 890 = 110ms
    vi.advanceTimersByTime(110);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    // Neither fires again — each was scheduled once
    vi.advanceTimersByTime(SECOND * 5);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should return a cancellable timeout handle', () => {
    const callback = vi.fn();
    const now = 1234567890;
    vi.setSystemTime(now);
    const expectedDelay = SECOND - (now % SECOND);

    const handle = callNextSecond(callback);

    clearTimeout(handle);

    vi.advanceTimersByTime(expectedDelay);
    expect(callback).not.toHaveBeenCalled();
  });

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
