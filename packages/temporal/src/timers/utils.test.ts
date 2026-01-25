/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callNextSecond } from './utils'; // adjust path

describe('callNextSecond', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('can be cancelled before the next second boundary', () => {
    // Make "now" be 12.345s into a minute so remainder(1000) = 655ms
    vi.spyOn(Date, 'now').mockReturnValue(12_345);

    const cb = vi.fn();

    // callNextSecond returns a cleanup fn
    const cancel = callNextSecond(cb);

    // Cancel immediately
    cancel?.();

    vi.advanceTimersByTime(1000);

    expect(cb).not.toHaveBeenCalled();
  });
});
