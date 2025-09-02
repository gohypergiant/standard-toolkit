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
import { isBetween } from '../is-between';

/**
 * Creates a predicate function that determines if a number is not between two bounds (exclusive of range).
 *
 * @param bounds - The tuple containing the lower and upper bounds (order doesn't matter)
 * @param value - The number to test
 *
 * @remarks
 * - Pure function with no side effects
 * - Negation of `isBetween` using functional composition
 * - Automatically sorts bounds, so order doesn't matter in the tuple
 *
 * @example
 * ```typescript
 * const isOutOfRange = isNotBetween([10, 90]);
 * isOutOfRange(5);   // true (below range)
 * isOutOfRange(95);  // true (above range)
 * isOutOfRange(50);  // false (within range)
 * isOutOfRange(10);  // false (on boundary, inclusive)
 *
 * // Useful for validation
 * const scores = [5, 25, 75, 95, 105];
 * const outliers = scores.filter(isNotBetween([0, 100])); // [105]
 * ```
 */
export const isNotBetween = (bounds: [number, number]) =>
  compose(not, isBetween(bounds));
