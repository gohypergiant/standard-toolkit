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
 * @param value - The value to round.
 * @param precision - The precision of the rounded output.
 *
 * @throws {Error} Throws if precision is not an integer.
 *
 * @example
 * const value = round(1, 1.2345); // 1.2
 * const value = round(2, 1.2345); // 1.23
 * const value = round(3, 1.2345); // 1.235
 * const value = round(3.1, 1.2345); // Error
 */
export function round(precision: number, value: number): number {
  if (!Number.isInteger(precision)) {
    throw new Error('Precision must be an integer.');
  }

  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}
