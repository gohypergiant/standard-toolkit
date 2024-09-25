/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
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
 * Clamps a number within the specified bounds.
 *
 * @throws {RangeError} Throws an error if min > max.
 *
 * @example
 * ```javascript
 * const value = clamp(10, 5, 15); // 10
 * const value = clamp(2, 5, 15); // 5
 * const value = clamp(20, 5, 15); // 15
 * const value = clamp(10, 15, 5); // RangeError
 * ```
 */
export function clamp<T extends number, Min extends number, Max extends number>(
  value: T,
  min: Min,
  max: Max,
): T | Min | Max {
  // TODO: do we want to handle this differently? A range error is quite explicit
  if (min > max) {
    throw new RangeError('min exceeded max');
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}
