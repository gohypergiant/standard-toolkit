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
 * Wraps a number into the half-open range `[min, max)`, cycling values that
 * fall outside it back around rather than clamping them to the edge.
 *
 * Unlike {@link clamp}, which pins out-of-range values to `min`/`max`, this
 * treats the range as circular: a value past `max` re-enters at `min`, and one
 * below `min` re-enters just under `max`. Handles negative and multi-revolution
 * inputs (JavaScript's `%` returns the dividend's sign, so the raw modulo alone
 * would leave `-90` negative). Common for angles (`wrap(0, 360, angle)`) and
 * longitudes (`wrap(-180, 180, lon)`).
 *
 * @param min - The inclusive lower bound of the range.
 * @param max - The exclusive upper bound of the range.
 * @param value - The number value to wrap into the given range.
 * @returns The wrapped value in `[min, max)`.
 *
 * @throws {RangeError} Throws if min >= max.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * const value = wrap(0, 360, 370); // 10
 * const value = wrap(0, 360, -90); // 270
 * const value = wrap(-180, 180, 190); // -170
 * const value = wrap(-180, 180, -180); // -180
 * const value = wrap(0, 360, 720); // 0
 * const value = wrap(360, 0, 10); // RangeError
 * ```
 */
export function wrap(min: number, max: number, value: number) {
  if (min >= max) {
    throw new RangeError('min exceeded max');
  }

  const range = max - min;

  return ((((value - min) % range) + range) % range) + min;
}
