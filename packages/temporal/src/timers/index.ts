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

import { callNextSecond, remainder } from './utils';

/**
 * Works the same way as setInterval but will wait to fire until next clock second.
 *
 * @param callback - The callback to execute at the next second boundary and after each interval.
 * @param ms - The time, in ms, between callback execution. Must be a finite positive number.
 * @returns A function that cancels all pending timers when called.
 * @throws {RangeError} If `ms` is not a finite positive number.
 *
 * @example
 * ```typescript
 * import { setClockInterval } from '@accelint/temporal/timers';
 *
 * const cleanup = setClockInterval(() => console.log('hi'), 250);
 * // Will log "hi" at the next clock second boundary, then approximately every 250ms
 *
 * // Later, cleanup when done
 * cleanup();
 * ```
 */
export function setClockInterval(callback: () => void, ms: number): () => void {
  if (!Number.isFinite(ms) || ms <= 0) {
    throw new RangeError(
      `setClockInterval: ms must be a finite positive number, got ${ms}`,
    );
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  function repeat(): void {
    callback();
    // Re-anchor to the next ms-boundary to prevent drift accumulation over time
    timeout = setTimeout(repeat, remainder(ms));
  }

  const initialDelay = callNextSecond(repeat);

  return () => {
    clearTimeout(initialDelay);
    clearTimeout(timeout);
  };
}

/**
 * Works the same way as setTimeout but will wait to fire until next clock second.
 *
 * @param callback - The callback to execute once after the specified duration.
 * @param ms - The time, in ms, to wait after the next second boundary before executing the callback.
 *   Zero or negative values are treated as immediate execution after the next second boundary.
 * @returns A function that cancels any pending timers. Safe to call after the callback has already fired.
 *
 * @example
 * ```typescript
 * import { setClockTimeout } from '@accelint/temporal/timers';
 *
 * const cleanup = setClockTimeout(() => console.log('hi'), 250);
 * // Will log "hi" 250ms after the next clock second boundary
 *
 * // Later, cleanup if needed
 * cleanup();
 * ```
 */
export function setClockTimeout(callback: () => void, ms: number): () => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const initialDelay = callNextSecond(() => {
    timeout = setTimeout(callback, ms);
  });

  return () => {
    clearTimeout(initialDelay);
    clearTimeout(timeout);
  };
}
