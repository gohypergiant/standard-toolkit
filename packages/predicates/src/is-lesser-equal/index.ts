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

/**
 * Creates a predicate function that determines if a value is less than or equal to a threshold.
 *
 * @template T - The type of the values (number or string)
 * @param threshold - The threshold value to compare against
 * @param value - The value to test
 *
 * @remarks
 * - Pure function with no side effects
 * - Uses JavaScript's `<=` operator for comparison
 * - Works with both numbers and strings (lexicographic comparison for strings)
 * - Inclusive comparison (equal values return true)
 * - Useful for array filtering and functional composition
 *
 * @example
 * ```typescript
 * const isAtMost100 = isLesserEqual(100);
 * isAtMost100(50);  // true
 * isAtMost100(100); // true (inclusive)
 * isAtMost100(150); // false
 *
 * const isAtMostM = isLesserEqual('M');
 * isAtMostM('A'); // true
 * isAtMostM('M'); // true
 * isAtMostM('Z'); // false
 *
 * // Useful with arrays
 * const ages = [16, 18, 21, 25, 30];
 * const underAge = ages.filter(isLesserEqual(20)); // [16, 18]
 * ```
 */
export const isLesserEqual =
  <T extends number | string>(threshold: T) =>
  (value: T): boolean =>
    value <= threshold;
