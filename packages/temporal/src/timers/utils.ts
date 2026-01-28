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

// __private-exports

const SECOND = 1000;

/**
 * Calculates the remaining time until the next interval boundary.
 *
 * This function computes how many milliseconds remain until the current time
 * aligns with the next multiple of the specified interval. Used internally for
 * clock-aligned timing operations.
 *
 * @param interval - The interval duration in milliseconds.
 * @returns The remaining milliseconds until the next interval boundary.
 *
 * @example
 * ```typescript
 * import { remainder } from '@accelint/temporal/timers/utils';
 *
 * const msUntilNextSecond = remainder(1000);
 * console.log(msUntilNextSecond); // e.g., 347 (milliseconds until next second)
 * ```
 */
export function remainder(interval: number) {
  return interval - (Date.now() % interval);
}

/**
 * Executes a callback at the start of the next clock second.
 *
 * This function schedules a callback to run precisely at the beginning of the
 * next second boundary (when milliseconds are 0). Used internally by clock-aligned
 * timer functions.
 *
 * @param callback - The function to execute at the next second boundary.
 *
 * @example
 * ```typescript
 * import { callNextSecond } from '@accelint/temporal/timers/utils';
 *
 * callNextSecond(() => {
 *   console.log('This runs at the next second boundary');
 * });
 * ```
 */
export function callNextSecond(callback: () => void) {
  const nextTick = remainder(SECOND);

  const timeout = setTimeout(() => {
    callback();
    clearTimeout(timeout);
  }, nextTick);
}
