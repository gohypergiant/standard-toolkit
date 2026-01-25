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

  it('setClockInterval', () => {
    const callback = vi.fn();
    const cleanup = setClockInterval(callback, ms);

    // Tick to next second
    vi.advanceTimersByTime(ms);
    // Tick from iternal timer
    vi.advanceTimersByTime(ms);

    expect(callback).toHaveBeenCalled();
    expect(cleanup).toBeTypeOf('function');
  });

  it('setClockTimeout', () => {
    const callback = vi.fn();
    const cleanup = setClockTimeout(callback, ms);

    // Tick to next second
    vi.advanceTimersByTime(ms);
    // Tick from iternal timer
    vi.advanceTimersByTime(ms);

    expect(callback).toHaveBeenCalled();
    expect(cleanup).toBeTypeOf('function');
  });

  describe('setClockInterval', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('cleanup prevents the initial next-second scheduled callback', () => {
      // Suppose "now" is 12.900s => next second in 100ms
      vi.spyOn(Date, 'now').mockReturnValue(12_900);

      const cb = vi.fn();

      const cleanup = setClockInterval(cb, 1000);

      // Immediately cleanup before the next-second boundary occurs
      cleanup();

      // Cross the boundary
      vi.advanceTimersByTime(200);

      // If callNextSecond can't be cancelled, this will be 1 (leak)
      expect(cb).not.toHaveBeenCalled();
    });
  });
});
