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

import { callNextSecond, remainder } from './utils';

/**
 * Schedules a callback to start on the next clock second and repeat at a drift-corrected interval.
 *
 * @param cb - The callback to execute immediately and after each duration.
 * @param ms - The time, in ms, between callback execution.
 * @returns A function to clear the timeout.
 * @throws {Error} Propagates any error thrown by `cb` during execution.
 *
 * @example
 * ```typescript
 * import { setClockInterval } from '@accelint/temporal/timers';
 *
 * const cleanup = setClockInterval(() => console.log('hi'), 250);
 * // Will log "hi" every 250ms starting on next clock second
 *
 * // Later, cleanup when done
 * cleanup();
 * ```
 */
export function setClockInterval(cb: () => void, ms: number): () => void {
  let timeout: number | undefined;
  let isCancelled = false;

  function repeat(): void {
    if (isCancelled) {
      return;
    }

    cb();

    if (isCancelled) {
      return;
    }

    clearTimeout(timeout);

    // Catch any potential drift and correct it for next setTimeout call
    const adjustedMs = remainder(ms);
    timeout = setTimeout(repeat, adjustedMs);
  }

  const cancelNextSecond = callNextSecond(repeat);

  return (): void => {
    isCancelled = true;
    cancelNextSecond();

    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  };
}

/**
 * Schedules a one-time callback to start on the next clock second after the requested delay.
 *
 * @param cb - The callback to execute after each duration.
 * @param ms - The time, in ms, between callback execution.
 * @returns A function to clear the timeout.
 * @throws {Error} Propagates any error thrown by `cb` during execution.
 *
 * @example
 * ```typescript
 * import { setClockTimeout } from '@accelint/temporal/timers';
 *
 * const cleanup = setClockTimeout(() => console.log('hi'), 250);
 * // Will log "hi" after 250ms starting on next clock second
 *
 * // Later, cleanup if needed
 * cleanup();
 * ```
 */
export function setClockTimeout(cb: () => void, ms: number): () => void {
  let timeout: number | undefined;
  let isCancelled = false;

  function execute(): void {
    if (isCancelled) {
      return;
    }

    timeout = setTimeout(cb, ms);
  }

  const cancelNextSecond = callNextSecond(execute);

  return (): void => {
    isCancelled = true;
    cancelNextSecond();

    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  };
}
