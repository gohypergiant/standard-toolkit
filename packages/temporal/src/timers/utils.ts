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

// NOTE: This directive tells the package indexer (scripts/indexer-v2.mjs) to exclude
// this file from the generated public entry-point index. Exports here are intentionally
// package-private (accessible to tests, not re-exported from the package root).
// __private-exports

/** Number of milliseconds in one second. Used as the clock-alignment interval for second-boundary timers. */
const SECOND_MS = 1000;

/**
 * Calculates the remaining time until the next interval boundary.
 *
 * This function computes how many milliseconds remain until the current time
 * aligns with the next multiple of the specified interval. If the current time
 * falls exactly on an interval boundary, the full interval duration is returned
 * (never 0). Used internally for clock-aligned timing operations.
 *
 * @param interval - The interval duration in milliseconds. Must be a finite positive number.
 * @returns The remaining milliseconds until the next interval boundary, in the range `(0, interval]`.
 *   Returns `interval` exactly when the current time falls on an interval boundary.
 * @throws {Error} If interval is not a finite positive number.
 *
 * @example
 * ```typescript
 * // Internal usage — not a public package export
 * const msUntilNextSecond = remainder(1000);
 * console.log(msUntilNextSecond); // e.g., 347 (milliseconds until next second boundary)
 * ```
 */
export function remainder(interval: number): number {
  if (!Number.isFinite(interval) || interval <= 0) {
    throw new Error(
      `remainder: interval must be a finite positive number, received ${interval}`,
    );
  }

  return interval - (Date.now() % interval);
}

/**
 * Executes a callback at the start of the next clock second.
 *
 * This function schedules a callback to run near the start of the next clock
 * second boundary. Timing is approximate due to event-loop scheduling; it is not
 * guaranteed to fire at exactly millisecond 0. Used internally by clock-aligned
 * timer functions.
 *
 * @param callback - The function to execute at the next second boundary.
 * @returns The timeout handle, which can be passed to clearTimeout to cancel the scheduled callback.
 *
 * @example
 * ```typescript
 * // Internal usage — not a public package export
 * const handle = callNextSecond(() => {
 *   console.log('This runs at the next second boundary');
 * });
 *
 * clearTimeout(handle);
 * ```
 */
export function callNextSecond(
  callback: () => void,
): ReturnType<typeof setTimeout> {
  return setTimeout(callback, remainder(SECOND_MS));
}
