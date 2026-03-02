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

// vi.useFakeTimers() is NOT covered by restoreMocks: true in vitest config.
// This afterEach must remain to prevent fake timer state from leaking between tests.
afterEach(() => {
  vi.useRealTimers();
});

describe('setClockInterval', () => {
  const ms = 1000;

  it('should return a cleanup function', () => {
    const cleanup = setClockInterval(vi.fn(), ms);

    expect(cleanup).toBeTypeOf('function');

    cleanup();
  });

  it('should execute callback repeatedly at specified interval', () => {
    const callback = vi.fn();

    const cleanup = setClockInterval(callback, ms);

    vi.advanceTimersByTime(ms); // advance to next second boundary — 1st call
    vi.advanceTimersByTime(ms); // advance one full interval — 2nd call

    expect(callback).toHaveBeenCalledTimes(2);

    cleanup();
  });

  it('should call callback once at first interval boundary', () => {
    const callback = vi.fn();
    vi.setSystemTime(1500);

    const cleanup = setClockInterval(callback, 250);

    vi.advanceTimersByTime(500); // advance to next second boundary

    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should call callback again after each subsequent interval', () => {
    const callback = vi.fn();
    vi.setSystemTime(1500);

    const cleanup = setClockInterval(callback, 250);

    vi.advanceTimersByTime(500); // first boundary
    vi.advanceTimersByTime(250); // second fire
    vi.advanceTimersByTime(250); // third fire
    vi.advanceTimersByTime(250); // fourth fire

    expect(callback).toHaveBeenCalledTimes(4);

    cleanup();
  });

  it('should execute exact number of times based on elapsed time', () => {
    const callback = vi.fn();
    const interval = 200;
    vi.setSystemTime(1000);

    const cleanup = setClockInterval(callback, interval);

    // 1-second boundary (1000ms) + 5 full intervals (1000ms)
    vi.advanceTimersByTime(1000 + interval * 5);

    expect(callback).toHaveBeenCalledTimes(6);

    cleanup();
  });

  it('should not fire before the next interval completes', () => {
    const callback = vi.fn();
    const interval = 200;
    vi.setSystemTime(1000);

    const cleanup = setClockInterval(callback, interval);

    // Stop 1ms before the 7th fire
    vi.advanceTimersByTime(1000 + interval * 5 + interval - 1);

    expect(callback).toHaveBeenCalledTimes(6);

    cleanup();
  });

  it('should stop further executions when cleanup is called', () => {
    const callback = vi.fn();
    const interval = 250;
    vi.setSystemTime(1000); // Date.now()=1000 → remainder(250)=250, remainder(1000)=1000

    const cleanup = setClockInterval(callback, interval);

    vi.advanceTimersByTime(ms); // first boundary — call #1
    vi.advanceTimersByTime(interval); // second fire — call #2
    cleanup();

    vi.advanceTimersByTime(interval * 10);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should handle multiple rapid cleanup calls without errors', () => {
    const callback = vi.fn();
    const interval = 2000;
    vi.setSystemTime(1000);

    const cleanup = setClockInterval(callback, interval);

    vi.advanceTimersByTime(ms);
    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
    cleanup();
    cleanup();

    vi.advanceTimersByTime(interval * 10);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not execute callback when cleanup is called before next second boundary', () => {
    const callback = vi.fn();
    vi.setSystemTime(1500); // 500ms until next second

    const cleanup = setClockInterval(callback, 250);

    cleanup(); // called before callNextSecond fires

    vi.advanceTimersByTime(2000);

    expect(callback).not.toHaveBeenCalled();
  });

  it.each([
    { interval: 0, description: 'zero' },
    { interval: -1000, description: 'negative' },
    { interval: Number.POSITIVE_INFINITY, description: 'Infinity' },
    { interval: Number.NaN, description: 'NaN' },
  ])('should throw synchronously when interval is $description', ({
    interval,
  }) => {
    expect(() => {
      setClockInterval(vi.fn(), interval);
    }).toThrow('setClockInterval: ms must be a finite positive number');
  });

  it('should handle very large interval', () => {
    const callback = vi.fn();
    const interval = 10_000_000;

    const cleanup = setClockInterval(callback, interval);

    vi.advanceTimersByTime(ms);

    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should handle fractional interval values', () => {
    const callback = vi.fn();
    const interval = 250.75;
    vi.setSystemTime(1000);

    const cleanup = setClockInterval(callback, interval);

    vi.advanceTimersByTime(ms);
    vi.advanceTimersByTime(interval);

    expect(callback).toHaveBeenCalledTimes(2);

    cleanup();
  });

  it('should propagate callback errors to caller', () => {
    const throwingCallback = vi.fn(() => {
      throw new Error('Callback error');
    });
    const interval = 250;

    const cleanup = setClockInterval(throwingCallback, interval);

    expect(() => {
      vi.advanceTimersByTime(ms);
    }).toThrow('Callback error');

    expect(throwingCallback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should stop execution when callback throws error', () => {
    let callCount = 0;
    const callback = vi.fn(() => {
      callCount++;
      if (callCount === 1) {
        throw new Error('First execution error');
      }
    });
    const interval = 250;

    const cleanup = setClockInterval(callback, interval);

    expect(() => {
      vi.advanceTimersByTime(ms);
    }).toThrow('First execution error');
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(interval * 10);
    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });
});

describe('setClockTimeout', () => {
  const ms = 1000;

  it('should return a cleanup function', () => {
    const cleanup = setClockTimeout(vi.fn(), ms);

    expect(cleanup).toBeTypeOf('function');

    cleanup();
  });

  it('should execute callback once after specified delay', () => {
    const callback = vi.fn();

    const cleanup = setClockTimeout(callback, ms);

    vi.advanceTimersByTime(ms); // advance to next second boundary
    vi.advanceTimersByTime(ms); // advance by timeout duration

    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should execute callback only once', () => {
    const callback = vi.fn();
    const timeout = 500;
    vi.setSystemTime(1000);

    const cleanup = setClockTimeout(callback, timeout);

    // Advance past boundary + timeout + several more timeout durations
    vi.advanceTimersByTime(ms + timeout + timeout * 10);

    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should prevent callback execution when cleanup is called', () => {
    const callback = vi.fn();
    const timeout = 500;
    vi.setSystemTime(1500); // 500ms until next second

    const cleanup = setClockTimeout(callback, timeout);

    vi.advanceTimersByTime(500); // advance to second boundary — execute() fires, schedules setTimeout(cb, 500)
    cleanup(); // cancel the scheduled cb
    vi.advanceTimersByTime(timeout * 2); // advance well past when cb would have fired

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle multiple rapid cleanup calls without errors', () => {
    const callback = vi.fn();
    const timeout = 500;
    vi.setSystemTime(1000);

    const cleanup = setClockTimeout(callback, timeout);

    vi.advanceTimersByTime(ms);

    cleanup();
    cleanup();
    cleanup();

    vi.advanceTimersByTime(timeout);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not execute callback when cleanup is called before next second boundary', () => {
    const callback = vi.fn();
    vi.setSystemTime(1500); // 500ms until next second

    const cleanup = setClockTimeout(callback, 500);

    cleanup(); // called before callNextSecond fires

    vi.advanceTimersByTime(2000);

    expect(callback).not.toHaveBeenCalled();
  });

  it.each([
    { timeout: 0, description: 'zero' },
    { timeout: -1000, description: 'negative' },
  ])('should treat $description timeout as immediate execution', ({
    timeout,
  }) => {
    const callback = vi.fn();
    vi.setSystemTime(1500); // 500ms until next second — remainder(1000)=500, clear boundary

    const cleanup = setClockTimeout(callback, timeout);

    vi.advanceTimersByTime(ms);

    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should handle very large timeout', () => {
    const callback = vi.fn();
    const timeout = 10_000_000;

    const cleanup = setClockTimeout(callback, timeout);

    vi.advanceTimersByTime(ms);

    expect(callback).not.toHaveBeenCalled();

    cleanup();
  });

  it('should handle fractional timeout values', () => {
    const callback = vi.fn();
    const timeout = 500.75;
    vi.setSystemTime(1000);

    const cleanup = setClockTimeout(callback, timeout);

    vi.advanceTimersByTime(ms);
    vi.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should propagate callback errors to caller', () => {
    const throwingCallback = vi.fn(() => {
      throw new Error('Timeout callback error');
    });
    const timeout = 500;
    vi.setSystemTime(1000);

    const cleanup = setClockTimeout(throwingCallback, timeout);

    vi.advanceTimersByTime(ms);

    expect(() => {
      vi.advanceTimersByTime(timeout);
    }).toThrow('Timeout callback error');

    expect(throwingCallback).toHaveBeenCalledTimes(1);

    cleanup();
  });
});
