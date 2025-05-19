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
 * @param min - The lower bound to clamp to.
 * @param max - The upper bound to clamp to.
 * @param value - The number value to clamp to the given range.
 *
 * @throws {RangeError} Throws if min > max.
 *
 * @example
 * const value = clamp(5, 15, 10); // 10
 * const value = clamp(5, 15, 2); // 5
 * const value = clamp(5, 15, 20); // 15
 * const value = clamp(15, 5, 10); // RangeError
 */
export function clamp(min: number, max: number, value: number) {
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
