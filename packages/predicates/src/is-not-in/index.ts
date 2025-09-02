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

import { compose, not } from '@accelint/core';
import { isIn } from '../is-in';

/**
 * Creates a predicate function that determines if a value does not exist in a given array.
 *
 * @template T - The type of the array elements and value
 * @param array - The array to search within
 * @param value - The value to check for
 *
 * @remarks
 * - Pure function with no side effects
 * - Negation of `isIn` using functional composition
 * - Uses strict equality (===) for element comparison
 * - Works with any type that can be compared with strict equality
 *
 * @example
 * ```typescript
 * const isInvalidStatus = isNotIn(['pending', 'approved', 'rejected']);
 * isInvalidStatus('unknown');  // true
 * isInvalidStatus('pending');  // false
 *
 * const isNotPrime = isNotIn([2, 3, 5, 7, 11, 13]);
 * isNotPrime(10); // true
 * isNotPrime(7);  // false
 *
 * // Useful with arrays
 * const allowedIds = [101, 102, 103];
 * const allRequests = [101, 104, 102, 105];
 * const unauthorized = allRequests.filter(isNotIn(allowedIds)); // [104, 105]
 * ```
 */
export const isNotIn = <T>(array: T[]) => compose(not, isIn<T>(array));
