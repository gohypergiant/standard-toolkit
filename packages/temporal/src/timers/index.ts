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
 * @param cb - The callback to execute immediately and after each duration.
 * @param ms - The time, in ms, between callback execution.
 * @returns A function to clear the timeout.
 *
 * @example
 * const cleanup = setClockInterval(() => console.log('hi'), 250);
 * // will log hi every 250ms starting on next clock second
 */
export function setClockInterval(cb: () => void, ms: number) {
  let timeout: number | undefined;

  function repeat() {
    cb();
    clearTimeout(timeout);

    // Catch any potential drift and correct it for next setTimeout call
    const adjustedMs = remainder(ms);

    timeout = setTimeout(repeat, adjustedMs);
  }

  callNextSecond(repeat);

  return () => clearTimeout(timeout);
}

/**
 * Works the same way as setTimeout but will wait to fire until next clock second.
 *
 * @param cb - The callback to execute after each duration.
 * @param ms - The time, in ms, between callback execution.
 * @returns A function to clear the timeout.
 *
 * @example
 * const cleanup = setClockTimeout(() => console.log('hi'), 250);
 * // will log hi after 250ms starting on next clock second
 */
export function setClockTimeout(cb: () => void, ms: number) {
  let timeout: number | undefined;

  function execute() {
    timeout = setTimeout(cb, ms);
  }

  callNextSecond(execute);

  return () => clearTimeout(timeout);
}
