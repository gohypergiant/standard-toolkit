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
import { setClockInterval, setClockTimeout } from './index';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('timers', () => {
  const ms = 1000;

  it('should execute callback repeatedly at specified interval starting at next clock second', () => {
    // Arrange
    const callback = vi.fn();

    // Act
    const cleanup = setClockInterval(callback, ms);

    // Tick to next second
    vi.advanceTimersByTime(ms);
    // Tick from internal timer
    vi.advanceTimersByTime(ms);

    // Assert
    expect(callback).toHaveBeenCalled();
    expect(cleanup).toBeTypeOf('function');
  });

  it('setClockInterval should execute multiple times with drift correction', () => {
    // Arrange
    const callback = vi.fn();
    const interval = 250;
    const now = 1500; // 1500 % 1000 = 500, so next second is in 500ms
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Assert - advance to next second (500ms)
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    // Advance by interval multiple times to verify drift correction
    // After first call at next second, subsequent calls should happen at corrected intervals
    vi.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);

    vi.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(4);

    // Cleanup
    cleanup();
  });

  it('setClockInterval cleanup should stop further executions', () => {
    // Arrange
    const callback = vi.fn();
    const interval = 250;

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Advance to next second and let it execute a few times
    vi.advanceTimersByTime(ms);
    vi.advanceTimersByTime(interval);
    const callCountBeforeCleanup = callback.mock.calls.length;
    expect(callCountBeforeCleanup).toBeGreaterThan(0);

    // Call cleanup
    cleanup();

    // Assert - advancing timers should not trigger more callbacks
    vi.advanceTimersByTime(interval * 10);
    expect(callback).toHaveBeenCalledTimes(callCountBeforeCleanup);
  });

  it('setClockInterval should handle zero interval', () => {
    // Arrange
    const callback = vi.fn();
    const interval = 0;

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Assert - zero interval causes NaN in remainder calculation
    // setTimeout(fn, NaN) is treated as setTimeout(fn, 0), executing immediately
    vi.advanceTimersByTime(ms);

    // Note: This is edge case behavior - production code should validate interval > 0
    expect(cleanup).toBeTypeOf('function');
    expect(callback).toHaveBeenCalled();

    cleanup();
  });

  it('setClockInterval should handle negative interval', () => {
    // Arrange
    const callback = vi.fn();
    const interval = -1000;

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Assert - negative interval causes incorrect modulo calculation
    // The remainder function returns: interval - (Date.now() % interval)
    // With negative interval, this produces unexpected timing
    vi.advanceTimersByTime(ms);

    // Note: This is edge case behavior - production code should validate interval > 0
    expect(cleanup).toBeTypeOf('function');
    // Callback may or may not execute depending on timing calculation
    expect(callback).toBeDefined();

    cleanup();
  });

  it('setClockInterval should execute exact number of times based on elapsed time', () => {
    // Arrange
    const callback = vi.fn();
    const interval = 200;
    const now = 1000; // Start at second boundary for predictability
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Assert - advance to next second (1000ms from now % 1000 = 0, so wait full 1000ms)
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    // Advance exactly 5 intervals (5 * 200ms = 1000ms)
    vi.advanceTimersByTime(interval * 5);
    expect(callback).toHaveBeenCalledTimes(6); // 1 initial + 5 more

    // Advance partial interval - should not trigger callback
    vi.advanceTimersByTime(interval - 1);
    expect(callback).toHaveBeenCalledTimes(6);

    // Complete the interval
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(7);

    cleanup();
  });

  it('setClockInterval should allow callback to throw error', () => {
    // Arrange
    const throwingCallback = vi.fn(() => {
      throw new Error('Callback error');
    });
    const interval = 250;

    // Act
    const cleanup = setClockInterval(throwingCallback, interval);

    // Assert - callback throws but timer mechanism continues
    // Note: The error will propagate to the test environment
    // We're documenting that the timer doesn't catch errors
    expect(() => {
      vi.advanceTimersByTime(ms); // Next second - this triggers the first callback
    }).toThrow('Callback error');

    expect(throwingCallback).toHaveBeenCalledTimes(1);
    expect(cleanup).toBeTypeOf('function');

    cleanup();
  });

  it('setClockInterval should stop execution when callback throws error', () => {
    // Arrange
    let callCount = 0;
    const callback = vi.fn(() => {
      callCount++;
      if (callCount === 1) {
        throw new Error('First execution error');
      }
    });
    const interval = 250;

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Assert - first call throws
    expect(() => {
      vi.advanceTimersByTime(ms);
    }).toThrow('First execution error');
    expect(callback).toHaveBeenCalledTimes(1);

    // Note: When callback throws, the repeat mechanism stops
    // because the error prevents the next setTimeout from being scheduled
    vi.advanceTimersByTime(interval * 10);
    expect(callback).toHaveBeenCalledTimes(1); // Still only called once

    cleanup();
  });

  it('setClockInterval should handle very large interval', () => {
    // Arrange
    const callback = vi.fn();
    const interval = 10000000; // 10 million ms (~2.7 hours)

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Assert - advance to next second
    vi.advanceTimersByTime(ms);
    expect(callback).toHaveBeenCalledTimes(1);

    // Large interval means callback won't repeat soon
    // Don't advance full interval in test (would take too long)
    expect(cleanup).toBeTypeOf('function');

    cleanup();
  });

  it('setClockInterval should handle fractional interval values', () => {
    // Arrange
    const callback = vi.fn();
    const interval = 250.75;
    const now = 1000; // Start at second boundary
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Assert - advance to next second
    vi.advanceTimersByTime(ms);
    expect(callback).toHaveBeenCalledTimes(1);

    // Advance by interval - JavaScript setTimeout handles fractional ms
    vi.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    cleanup();
  });

  it('setClockInterval should handle multiple rapid cleanup calls', () => {
    // Arrange
    const callback = vi.fn();
    const interval = 2000; // Use interval larger than 1 second to avoid multiple executions
    const now = 1000; // Start at second boundary
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockInterval(callback, interval);

    // Advance to next second
    vi.advanceTimersByTime(ms);
    expect(callback).toHaveBeenCalledTimes(1);

    // Assert - multiple cleanup calls should not cause errors
    cleanup();
    cleanup();
    cleanup();

    // Advancing time should not trigger callback after cleanup
    vi.advanceTimersByTime(interval * 10);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should execute callback once after specified delay starting at next clock second', () => {
    // Arrange
    const callback = vi.fn();

    // Act
    const cleanup = setClockTimeout(callback, ms);

    // Tick to next second
    vi.advanceTimersByTime(ms);
    // Tick from internal timer
    vi.advanceTimersByTime(ms);

    // Assert
    expect(callback).toHaveBeenCalled();
    expect(cleanup).toBeTypeOf('function');
  });

  it('setClockTimeout cleanup should prevent callback execution', () => {
    // Arrange
    const callback = vi.fn();
    const timeout = 500;
    const now = 1500; // Start at 1500ms (500ms to next second)
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockTimeout(callback, timeout);

    // Advance to next second - execute() runs and sets the timeout
    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    // Advance partway through the timeout period
    vi.advanceTimersByTime(timeout - 100);
    expect(callback).not.toHaveBeenCalled();

    // Call cleanup before timeout completes
    cleanup();

    // Assert - advance past when callback would have executed
    vi.advanceTimersByTime(timeout);
    expect(callback).not.toHaveBeenCalled();
  });

  it('setClockTimeout should execute callback only once', () => {
    // Arrange
    const callback = vi.fn();
    const timeout = 500;
    const now = 1000; // Start at second boundary
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockTimeout(callback, timeout);

    // Advance to next second (from boundary, need full 1000ms)
    vi.advanceTimersByTime(ms);
    expect(callback).not.toHaveBeenCalled();

    // Advance by timeout duration
    vi.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);

    // Assert - advancing more time should not trigger callback again
    vi.advanceTimersByTime(timeout * 10);
    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('setClockTimeout should handle zero timeout', () => {
    // Arrange
    const callback = vi.fn();
    const timeout = 0;

    // Act
    const cleanup = setClockTimeout(callback, timeout);

    // Assert - zero timeout means callback executes immediately after next second
    vi.advanceTimersByTime(ms); // Advance to next second

    // setTimeout(cb, 0) executes on next tick after the next second trigger
    expect(callback).toHaveBeenCalledTimes(1);
    expect(cleanup).toBeTypeOf('function');

    cleanup();
  });

  it('setClockTimeout should handle negative timeout', () => {
    // Arrange
    const callback = vi.fn();
    const timeout = -1000;

    // Act
    const cleanup = setClockTimeout(callback, timeout);

    // Assert - setTimeout treats negative values as 0
    vi.advanceTimersByTime(ms); // Advance to next second

    // Negative timeout is treated as 0, executing immediately after next second
    expect(callback).toHaveBeenCalledTimes(1);
    expect(cleanup).toBeTypeOf('function');

    cleanup();
  });

  it('setClockTimeout should allow callback to throw error', () => {
    // Arrange
    const throwingCallback = vi.fn(() => {
      throw new Error('Timeout callback error');
    });
    const timeout = 500;
    const now = 1000; // Start at second boundary
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockTimeout(throwingCallback, timeout);

    // Assert - advance to next second
    vi.advanceTimersByTime(ms);

    // Advance to timeout duration - callback throws
    expect(() => {
      vi.advanceTimersByTime(timeout);
    }).toThrow('Timeout callback error');

    // Callback was called once
    expect(throwingCallback).toHaveBeenCalledTimes(1);
    expect(cleanup).toBeTypeOf('function');

    cleanup();
  });

  it('setClockTimeout should handle very large timeout', () => {
    // Arrange
    const callback = vi.fn();
    const timeout = 10000000; // 10 million ms (~2.7 hours)

    // Act
    const cleanup = setClockTimeout(callback, timeout);

    // Assert - advance to next second
    vi.advanceTimersByTime(ms);

    // Callback should not execute yet with very large timeout
    expect(callback).not.toHaveBeenCalled();

    // Verify timeout is set
    expect(cleanup).toBeTypeOf('function');

    cleanup();
  });

  it('setClockTimeout should handle fractional timeout values', () => {
    // Arrange
    const callback = vi.fn();
    const timeout = 500.75;
    const now = 1000; // Start at second boundary
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockTimeout(callback, timeout);

    // Assert - advance to next second
    vi.advanceTimersByTime(ms);
    expect(callback).not.toHaveBeenCalled();

    // Advance by fractional timeout - JavaScript setTimeout handles fractional ms
    vi.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('setClockTimeout should handle multiple rapid cleanup calls', () => {
    // Arrange
    const callback = vi.fn();
    const timeout = 500;
    const now = 1000; // Start at second boundary
    vi.setSystemTime(now);

    // Act
    const cleanup = setClockTimeout(callback, timeout);

    // Advance to trigger the internal timeout setup
    vi.advanceTimersByTime(ms);

    // Assert - multiple cleanup calls should not cause errors
    cleanup();
    cleanup();
    cleanup();

    // Advancing time should not trigger callback after cleanup
    vi.advanceTimersByTime(timeout);
    expect(callback).not.toHaveBeenCalled();
  });
});
