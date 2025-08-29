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

import { equality } from '@accelint/core';

/**
 * Creates a predicate function that determines if a value is strictly equal to a reference value.
 *
 * @param reference - The reference value to compare against
 * @param value - The value to test
 *
 * @remarks
 * - Pure function with no side effects
 * - Uses strict equality (===) comparison
 * - Useful for array filtering and functional programming
 *
 * @example
 * ```typescript
 * const isZero = isEqual(0);
 * isZero(0);   // true
 * isZero('0'); // false (strict equality)
 *
 * const isFoo = isEqual('foo');
 * isFoo('foo'); // true
 * isFoo('bar'); // false
 *
 * // Useful with arrays
 * const numbers = [1, 2, 3, 2, 4];
 * const twos = numbers.filter(isEqual(2)); // [2, 2]
 * ```
 */
export const isEqual = equality;
