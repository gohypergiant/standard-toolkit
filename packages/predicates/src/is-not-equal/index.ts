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

import { compose, equality, not } from '@accelint/core';

/**
 * Creates a predicate function that determines if a value is not strictly equal to a reference value.
 *
 * @param reference - The reference value to compare against
 * @param value - The value to test
 *
 * @remarks
 * - Pure function with no side effects
 * - Uses strict inequality (!==) comparison
 * - Negation of `isEqual` using functional composition
 *
 * @example
 * ```typescript
 * const isNotZero = isNotEqual(0);
 * isNotZero(5);   // true
 * isNotZero('0'); // true (strict inequality)
 * isNotZero(0);   // false
 *
 * const isNotFoo = isNotEqual('foo');
 * isNotFoo('bar'); // true
 * isNotFoo('foo'); // false
 *
 * // Useful with arrays
 * const values = [1, null, 2, null, 3];
 * const nonNull = values.filter(isNotEqual(null)); // [1, 2, 3]
 * ```
 */
export const isNotEqual = (reference: unknown) =>
  compose(not, equality(reference));
