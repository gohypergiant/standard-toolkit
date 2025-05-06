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

import { isString } from '../is-string';

/**
 * Determine if the given value is a number.
 * Includes Infinities and NaN, does not include strings that look like numbers
 *
 * @param val - The value to check whether or not it is a number value.
 *
 *
 * @example
 * isNumber(1.23) // true
 * isNumber(Infinity) // true
 * isNumber(NaN) // true
 * isNumber('1.23') // false
 */
export function isNumber(val: unknown): val is number {
  return typeof val === 'number' || val instanceof Number;
}

/**
 * Determine if the given value is a finite number.
 * Does not include infinities, NaN, or strings that look like numbers.
 *
 * @param val - The value to check whether or not it is a finite number value.
 *
 * @example
 * isFiniteNumber(1.23) // true
 * isFiniteNumber(Infinity) // false
 * isFiniteNumber(NaN) // false
 * isFiniteNumber('1.23') // false
 */
export function isFiniteNumber(val: unknown): val is number {
  return Number.isFinite(val);
}

/**
 * Determine if given value is a finite number, or string that parses to a finite number.
 * Does not include infinities, NaN.
 *
 * @param val - The value to check whether or not it is a finite numberic value.
 *
 * @example
 * isFiniteNumeric(1.23) // true
 * isFiniteNumeric('Infinity') // false
 * isFiniteNumeric(NaN) // false
 * isFiniteNumeric('1.23') // true
 * isFiniteNumeric('hi') // false
 */
export function isFiniteNumeric(val: unknown): val is number {
  const parsed = isString(val) ? Number.parseFloat(val as string) : val;

  return !Number.isNaN(parsed) && isFiniteNumber(parsed);
}

/**
 * Determine if given value is a number, or string that parses to a number. Includes infinities and NaN.
 * Non-finite strings are: 'Infinity', '-Infinity', and 'NaN'.
 *
 * @param val - The value to check whether or not it is a numberic value.
 *
 * @example
 * isNumeric(1.23) // true
 * isNumeric('Infinity') // true
 * isNumeric(NaN) // true
 * isNumeric('1.23') // true
 * isNumeric('hi') // false
 */
export function isNumeric(val: unknown): val is number {
  if (isString(val)) {
    return (
      val === 'Infinity' ||
      val === '-Infinity' ||
      val === 'NaN' ||
      isFiniteNumeric(val)
    );
  }

  return isNumber(val);
}
