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

describe('setClockInterval', () => {
  const ms = 1000;

  describe('normal operation', () => {
    it('should execute callback repeatedly at specified interval', () => {
      const callback = vi.fn();

      const cleanup = setClockInterval(callback, ms);

      vi.advanceTimersByTime(ms); // Advance to next second
      vi.advanceTimersByTime(ms); // Advance one full interval

      expect(callback).toHaveBeenCalled();
      expect(typeof cleanup).toBe('function');
    });

    it('should execute multiple times with drift correction', () => {
      const callback = vi.fn();
      const interval = 250;
      const now = 1500;
      vi.setSystemTime(now);

      const cleanup = setClockInterval(callback, interval);

      vi.advanceTimersByTime(500); // Advance to next second
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(interval);
      expect(callback).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(interval);
      expect(callback).toHaveBeenCalledTimes(3);

      vi.advanceTimersByTime(interval);
      expect(callback).toHaveBeenCalledTimes(4);

      cleanup();
    });

    it('should execute exact number of times based on elapsed time', () => {
      const callback = vi.fn();
      const interval = 200;
      const now = 1000;
      vi.setSystemTime(now);

      const cleanup = setClockInterval(callback, interval);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(interval * 5);
      expect(callback).toHaveBeenCalledTimes(6);

      vi.advanceTimersByTime(interval - 1);
      expect(callback).toHaveBeenCalledTimes(6);

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(7);

      cleanup();
    });
  });

  describe('cleanup behavior', () => {
    it('should stop further executions when cleanup is called', () => {
      const callback = vi.fn();
      const interval = 250;

      const cleanup = setClockInterval(callback, interval);

      vi.advanceTimersByTime(ms);
      vi.advanceTimersByTime(interval);
      const callCountBeforeCleanup = callback.mock.calls.length;
      expect(callCountBeforeCleanup).toBeGreaterThan(0);

      cleanup();

      vi.advanceTimersByTime(interval * 10);
      expect(callback).toHaveBeenCalledTimes(callCountBeforeCleanup);
    });

    it('should handle multiple rapid cleanup calls without errors', () => {
      const callback = vi.fn();
      const interval = 2000;
      const now = 1000;
      vi.setSystemTime(now);

      const cleanup = setClockInterval(callback, interval);

      vi.advanceTimersByTime(ms);
      expect(callback).toHaveBeenCalledTimes(1);

      cleanup();
      cleanup();
      cleanup();

      vi.advanceTimersByTime(interval * 10);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should treat zero interval as immediate execution', () => {
      const callback = vi.fn();
      const interval = 0;

      const cleanup = setClockInterval(callback, interval);

      vi.advanceTimersByTime(ms);

      expect(typeof cleanup).toBe('function');
      expect(callback).toHaveBeenCalled();

      cleanup();
    });

    it('should handle negative interval', () => {
      const callback = vi.fn();
      const interval = -1000;

      const cleanup = setClockInterval(callback, interval);

      vi.advanceTimersByTime(ms);

      expect(typeof cleanup).toBe('function');

      cleanup();
    });

    it('should handle very large interval', () => {
      const callback = vi.fn();
      const interval = 10_000_000;

      const cleanup = setClockInterval(callback, interval);

      vi.advanceTimersByTime(ms);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(typeof cleanup).toBe('function');

      cleanup();
    });

    it('should handle fractional interval values', () => {
      const callback = vi.fn();
      const interval = 250.75;
      const now = 1000;
      vi.setSystemTime(now);

      const cleanup = setClockInterval(callback, interval);

      vi.advanceTimersByTime(ms);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(interval);
      expect(callback).toHaveBeenCalledTimes(2);

      cleanup();
    });
  });

  describe('error handling', () => {
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
      expect(typeof cleanup).toBe('function');

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
});

describe('setClockTimeout', () => {
  const ms = 1000;

  describe('normal operation', () => {
    it('should execute callback once after specified delay', () => {
      const callback = vi.fn();

      const cleanup = setClockTimeout(callback, ms);

      vi.advanceTimersByTime(ms); // Advance to next second
      vi.advanceTimersByTime(ms); // Advance by timeout duration

      expect(callback).toHaveBeenCalled();
      expect(typeof cleanup).toBe('function');
    });

    it('should execute callback only once', () => {
      const callback = vi.fn();
      const timeout = 500;
      const now = 1000;
      vi.setSystemTime(now);

      const cleanup = setClockTimeout(callback, timeout);

      vi.advanceTimersByTime(ms);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(timeout);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(timeout * 10);
      expect(callback).toHaveBeenCalledTimes(1);

      cleanup();
    });
  });

  describe('cleanup behavior', () => {
    it('should prevent callback execution when cleanup is called', () => {
      const callback = vi.fn();
      const timeout = 500;
      const now = 1500;
      vi.setSystemTime(now);

      const cleanup = setClockTimeout(callback, timeout);

      vi.advanceTimersByTime(500);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(timeout - 100);
      expect(callback).not.toHaveBeenCalled();

      cleanup();

      vi.advanceTimersByTime(timeout);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple rapid cleanup calls without errors', () => {
      const callback = vi.fn();
      const timeout = 500;
      const now = 1000;
      vi.setSystemTime(now);

      const cleanup = setClockTimeout(callback, timeout);

      vi.advanceTimersByTime(ms);

      cleanup();
      cleanup();
      cleanup();

      vi.advanceTimersByTime(timeout);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should treat zero timeout as immediate execution', () => {
      const callback = vi.fn();
      const timeout = 0;

      const cleanup = setClockTimeout(callback, timeout);

      vi.advanceTimersByTime(ms);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(typeof cleanup).toBe('function');

      cleanup();
    });

    it('should treat negative timeout as immediate execution', () => {
      const callback = vi.fn();
      const timeout = -1000;

      const cleanup = setClockTimeout(callback, timeout);

      vi.advanceTimersByTime(ms);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(typeof cleanup).toBe('function');

      cleanup();
    });

    it('should handle very large timeout', () => {
      const callback = vi.fn();
      const timeout = 10_000_000;

      const cleanup = setClockTimeout(callback, timeout);

      vi.advanceTimersByTime(ms);

      expect(callback).not.toHaveBeenCalled();
      expect(typeof cleanup).toBe('function');

      cleanup();
    });

    it('should handle fractional timeout values', () => {
      const callback = vi.fn();
      const timeout = 500.75;
      const now = 1000;
      vi.setSystemTime(now);

      const cleanup = setClockTimeout(callback, timeout);

      vi.advanceTimersByTime(ms);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(timeout);
      expect(callback).toHaveBeenCalledTimes(1);

      cleanup();
    });
  });

  describe('error handling', () => {
    it('should propagate callback errors to caller', () => {
      const throwingCallback = vi.fn(() => {
        throw new Error('Timeout callback error');
      });
      const timeout = 500;
      const now = 1000;
      vi.setSystemTime(now);

      const cleanup = setClockTimeout(throwingCallback, timeout);

      vi.advanceTimersByTime(ms);

      expect(() => {
        vi.advanceTimersByTime(timeout);
      }).toThrow('Timeout callback error');

      expect(throwingCallback).toHaveBeenCalledTimes(1);
      expect(typeof cleanup).toBe('function');

      cleanup();
    });
  });
});
