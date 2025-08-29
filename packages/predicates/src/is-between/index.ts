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

import { andFn } from '@accelint/core';
import { isGreaterEqual } from '../is-greater-equal';
import { isLesserEqual } from '../is-lesser-equal';

/**
 * Creates a predicate function that determines if a number is between two bounds (inclusive).
 *
 * @param bounds - The tuple containing the lower and upper bounds (order doesn't matter)
 * @param value - The number to test
 *
 * @remarks
 * - Pure function with no side effects
 * - Inclusive on both ends (`>=` lower bound and `<=` upper bound)
 * - Automatically sorts bounds, so order doesn't matter in the tuple
 *
 * @example
 * ```typescript
 * const isValidScore = isBetween([0, 100]);
 * isValidScore(89);  // true
 * isValidScore(150); // false
 * isValidScore(0);   // true (inclusive)
 *
 * // Order doesn't matter
 * const isInRange = isBetween([100, 0]);
 * isInRange(50); // true
 * ```
 */
export const isBetween = (bounds: [number, number]) => {
  const sorted = [...bounds].sort() as [number, number];

  return andFn(isGreaterEqual(sorted[0]))(isLesserEqual(sorted[1]));
};
