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
 * Rounds a number to a specified precision.
 *
 * This function supports two usage patterns:
 * 1. Direct: `round(precision, value)` - Returns the rounded number
 * 2. Curried: `round(precision)` - Returns a function that rounds to the specified precision
 *
 * The curried form is more performant when rounding multiple values to the same precision,
 * as it calculates the multiplier only once.
 *
 * @param precision - The precision of the rounded output (must be an integer).
 * @param value - The value to round. If omitted, returns a curried function.
 * @returns When value is provided, returns the rounded number.
 *          When value is omitted, returns a function `(value: number) => number`.
 *
 * @throws {Error} Throws if precision is not an integer.
 *
 * @example
 * ```typescript
 * // Direct usage
 * const value = round(1, 1.2345); // 1.2
 * const value = round(2, 1.2345); // 1.23
 * const value = round(3, 1.2345); // 1.235
 * const value = round(3.1, 1.2345); // Error
 *
 * // Curried usage for better performance with repeated precision
 * const roundTo2 = round(2);
 * const values = [1.2345, 2.3456, 3.4567].map(roundTo2);
 * // [1.23, 2.35, 3.46]
 * ```
 */
export function round(precision: number): (value: number) => number;
export function round(precision: number, value: number): number;
export function round(
  precision: number,
  value?: number,
): number | ((value: number) => number) {
  if (!Number.isInteger(precision)) {
    throw new Error('Precision must be an integer.');
  }

  const multiplier = 10 ** precision;

  if (value === undefined) {
    // Return curried function
    return (v: number) => Math.round(v * multiplier) / multiplier;
  }

  return Math.round(value * multiplier) / multiplier;
}
