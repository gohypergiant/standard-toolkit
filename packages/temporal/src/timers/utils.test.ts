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
  it('should return correct remainder for valid interval', () => {
    // Arrange
    const now = 1234567890;
    const interval = 1000;
    vi.setSystemTime(now);

    // Act
    const result = remainder(interval);

    // Assert
    const expected = interval - (now % interval);
    expect(result).toBe(expected);
  });

  it('should handle interval equal to current timestamp modulo', () => {
    // Arrange
    const interval = 1000;
    const now = 5000; // 5000 % 1000 = 0
    vi.setSystemTime(now);

    // Act
    const result = remainder(interval);

    // Assert
    expect(result).toBe(interval);
  });

  it('should handle zero interval', () => {
    // Arrange
    const interval = 0;

    // Act
    const result = remainder(interval);

    // Assert - zero interval causes NaN result
    // Calculation: 0 - (Date.now() % 0) = 0 - NaN = NaN
    expect(result).toBeNaN();
  });

  it('should handle negative interval', () => {
    // Arrange
    const now = 1234567890;
    const interval = -1000;
    vi.setSystemTime(now);

    // Act
    const result = remainder(interval);

    // Assert - negative interval produces mathematically valid but semantically incorrect result
    // Calculation: -1000 - (1234567890 % -1000)
    // In JavaScript, modulo with negative divisor: 1234567890 % -1000 = 890
    // Result: -1000 - 890 = -1890
    const expected = interval - (now % interval);
    expect(result).toBe(expected);
    expect(result).toBeLessThan(0);
  });

  it('should handle very large interval', () => {
    // Arrange
    const now = 1234567890;
    const interval = Number.MAX_SAFE_INTEGER;
    vi.setSystemTime(now);

    // Act
    const result = remainder(interval);

    // Assert
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(interval);
  });

  it('should handle Infinity interval', () => {
    // Arrange
    const now = 1234567890;
    const interval = Number.POSITIVE_INFINITY;
    vi.setSystemTime(now);

    // Act
    const result = remainder(interval);

    // Assert - Infinity - (now % Infinity) = Infinity - now = Infinity
    expect(result).toBe(Number.POSITIVE_INFINITY);
  });

  it('should handle negative Infinity interval', () => {
    // Arrange
    const now = 1234567890;
    const interval = Number.NEGATIVE_INFINITY;
    vi.setSystemTime(now);

    // Act
    const result = remainder(interval);

    // Assert - -Infinity - (now % -Infinity) = -Infinity - now = -Infinity
    expect(result).toBe(Number.NEGATIVE_INFINITY);
  });

  it('should handle NaN interval', () => {
    // Arrange
    const interval = Number.NaN;

    // Act
    const result = remainder(interval);

    // Assert - NaN - (Date.now() % NaN) = NaN - NaN = NaN
    expect(result).toBeNaN();
  });

  it('should handle decimal interval values', () => {
    // Arrange
    const now = 1234567890;
    const interval = 100.5;
    vi.setSystemTime(now);

    // Act
    const result = remainder(interval);

    // Assert - should calculate correctly with decimal precision
    const expected = interval - (now % interval);
    expect(result).toBeCloseTo(expected, 10);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(interval);
  });
});

describe('callNextSecond', () => {
  // biome-ignore lint/style/useNamingConvention: We need to change rule, this is valid
  const SECOND = 1000;

  it('should execute callback at next clock second', () => {
    // Arrange
    const callback = vi.fn();
    const now = 1234567890;
    vi.setSystemTime(now);
    const expectedDelay = SECOND - (now % SECOND);

    // Act
    callNextSecond(callback);

    // Assert - callback should not execute immediately
    expect(callback).not.toHaveBeenCalled();

    // Advance to next second
    vi.advanceTimersByTime(expectedDelay);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should set timeout with correct delay', () => {
    // Arrange
    const callback = vi.fn();
    const now = 1500; // 1500 % 1000 = 500
    vi.setSystemTime(now);
    const expectedDelay = SECOND - (now % SECOND); // 500

    // Act
    callNextSecond(callback);

    // Assert - advance less than expected delay
    vi.advanceTimersByTime(expectedDelay - 1);
    expect(callback).not.toHaveBeenCalled();

    // Advance the remaining time
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cleanup timeout after execution', () => {
    // Arrange
    const callback = vi.fn();
    const now = 1234567890;
    vi.setSystemTime(now);
    const expectedDelay = SECOND - (now % SECOND);

    // Act
    callNextSecond(callback);
    vi.advanceTimersByTime(expectedDelay);

    // Assert - callback executed once
    expect(callback).toHaveBeenCalledTimes(1);

    // Advance more time - callback should not execute again
    vi.advanceTimersByTime(SECOND * 10);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle callback execution at second boundary', () => {
    // Arrange
    const callback = vi.fn();
    const now = 5000; // Exactly on second boundary (5000 % 1000 = 0)
    vi.setSystemTime(now);

    // Act
    callNextSecond(callback);

    // Assert - should wait full second
    vi.advanceTimersByTime(SECOND);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should allow callback to throw error without affecting timeout cleanup', () => {
    // Arrange
    const throwingCallback = vi.fn(() => {
      throw new Error('Callback execution error');
    });
    const now = 1234567890;
    vi.setSystemTime(now);
    const expectedDelay = SECOND - (now % SECOND);

    // Act
    callNextSecond(throwingCallback);

    // Assert - callback throws when executed
    expect(() => {
      vi.advanceTimersByTime(expectedDelay);
    }).toThrow('Callback execution error');

    expect(throwingCallback).toHaveBeenCalledTimes(1);

    // Verify timeout is cleaned up (callback should not execute again)
    vi.advanceTimersByTime(SECOND * 10);
    expect(throwingCallback).toHaveBeenCalledTimes(1);
  });
});
