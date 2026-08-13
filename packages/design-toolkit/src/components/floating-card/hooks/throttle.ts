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

/**
 * Limits how often a function runs, firing on the leading edge and once more
 * for the final skipped call so the last value is never dropped.
 *
 * @param callback - Function to throttle.
 * @param milliseconds - Minimum gap between leading-edge calls.
 * @returns A throttled function with the same signature.
 *
 * @example
 * ```ts
 * const onMove = throttle((position: Position) => render(position), 16);
 * ```
 */
export function throttle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  milliseconds: number,
): (...args: Args) => void {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Args | undefined;

  return (...args: Args) => {
    const now = Date.now();

    lastArgs = args;

    if (now - lastCall >= milliseconds) {
      lastCall = now;
      callback(...args);

      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }

      return;
    }

    if (!timeout) {
      timeout = setTimeout(
        () => {
          lastCall = Date.now();

          if (lastArgs) {
            callback(...lastArgs);
          }

          timeout = undefined;
        },
        milliseconds - (now - lastCall),
      );
    }
  };
}
