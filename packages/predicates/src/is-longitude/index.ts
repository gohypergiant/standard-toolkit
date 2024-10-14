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

const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

/**
 * Test if value is a valid longitude range.
 *
 * Assumes degrees as the unit of measure.
 *
 * @example
 * isLongitude(-180) // true
 * isLongitude(0) // true
 * isLongitude(180) // true
 * isLongitude(-190) // false
 * isLongitude(NaN) // false
 */
export function isLongitude(val: unknown) {
  if (!isFiniteNumber(val)) {
    return false;
  }

  // TODO: is there a better way to tell TS this is a number now based on isFiniteNumeber?
  const ensuredValue = val as number;

  return ensuredValue >= MIN_LONGITUDE && ensuredValue <= MAX_LONGITUDE;
}
