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
 * Creates a predicate function that determines if a value exists in a given array.
 *
 * @template T - The type of the array elements and value
 * @param array - The array to search within
 * @param value - The value to check for
 *
 * @remarks
 * - Pure function with no side effects
 * - Uses Array.prototype.includes() for membership testing
 * - Uses strict equality (===) for element comparison
 * - Works with any type that can be compared with strict equality
 * - Useful for array filtering and validation predicates
 *
 * @example
 * ```typescript
 * const isValidStatus = isIn(['pending', 'approved', 'rejected']);
 * isValidStatus('pending');  // true
 * isValidStatus('unknown');  // false
 *
 * const isPrime = isIn([2, 3, 5, 7, 11, 13]);
 * isPrime(7);  // true
 * isPrime(10); // false
 *
 * // Useful with arrays
 * const userIds = [101, 102, 103, 104];
 * const activeUsers = [101, 103, 105, 106];
 * const validActiveUsers = activeUsers.filter(isIn(userIds)); // [101, 103]
 * ```
 */
export const isIn =
  <T>(array: T[]) =>
  (value: T) =>
    array.includes(value);
