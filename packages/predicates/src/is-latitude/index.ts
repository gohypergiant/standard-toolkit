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

import { isFiniteNumber } from '../is-number';

const MAX_ABSOLUTE_VALUE = 90;

/**
 * Determines if given value is a valid latitude range.
 * Assumes degrees as the unit of measure.
 *
 * @param val - The value to check whether or not it is a latitude.
 *
 * @example
 * isLatitude(-90) // true
 * isLatitude(0) // true
 * isLatitude(90) // true
 * isLatitude(-100) // false
 * isLatitude(NaN) // false
 */
export function isLatitude(val: unknown) {
  if (!isFiniteNumber(val)) {
    return false;
  }

  const abs = Math.abs(val);

  return abs >= 0 && abs <= MAX_ABSOLUTE_VALUE;
}
