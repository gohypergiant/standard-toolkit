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
 * Creates a predicate function that determines if a value is greater than or equal to a threshold.
 *
 * @template T - The type of the values (number or string)
 * @param threshold - The threshold value to compare against
 * @param value - The value to test
 *
 * @remarks
 * - Pure function with no side effects
 * - Uses JavaScript's `>=` operator for comparison
 * - Works with both numbers and strings (lexicographic comparison for strings)
 * - Useful for array filtering and functional composition
 *
 * @example
 * ```typescript
 * const isAtLeast18 = isGreaterEqual(18);
 * isAtLeast18(21); // true
 * isAtLeast18(18); // true (inclusive)
 * isAtLeast18(16); // false
 *
 * const isAtLeastB = isGreaterEqual('B');
 * isAtLeastB('C'); // true
 * isAtLeastB('B'); // true
 * isAtLeastB('A'); // false
 *
 * // Useful with arrays
 * const scores = [45, 78, 92, 65, 88];
 * const passing = scores.filter(isGreaterEqual(70)); // [78, 92, 88]
 * ```
 */
export const isGreaterEqual =
  <T extends number | string>(threshold: T) =>
  (value: T) =>
    value >= threshold;
