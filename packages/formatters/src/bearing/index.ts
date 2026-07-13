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

import {
  DISTANCE_UNIT_SYMBOLS,
  type DistanceUnit,
} from '@accelint/constants/units';
import { round } from '@accelint/math/round';

/**
 * Formats a bearing in degrees as a zero-padded 3-digit string with a degree symbol.
 *
 * Normalizes any value (negative or greater than 360) to the 0–360 range before
 * formatting. Uses true north reference per NTDS/C2 tactical display conventions.
 *
 * @remarks pure function
 *
 * @param degrees - The bearing in degrees. May be negative or greater than 360.
 * @returns A zero-padded 3-digit string with a trailing degree symbol, e.g. `"045°"`.
 *
 * @example
 * ```typescript
 * formatBearing(45);   // "045°"
 * formatBearing(-10);  // "350°"
 * formatBearing(0);    // "000°"
 * formatBearing(370);  // "010°"
 * formatBearing(360);  // "000°"
 * ```
 */
export function formatBearing(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const integer = round(0, normalized);
  // After rounding, 360 should wrap to 0
  const clamped = integer % 360;

  return `${`${clamped}`.padStart(3, '0')}°`;
}

/**
 * Formats a distance in meters into a human-readable string with unit abbreviations.
 *
 * Supports single or dual unit display. Single unit produces `"42.3 km"`;
 * dual unit produces `"42.3 km / 22.8 NM"`. Values are formatted to 1 decimal place.
 *
 * Supports the following units: `kilometers`, `nauticalmiles`, `miles`, `meters`, `feet`.
 *
 * @remarks pure function
 *
 * @param meters - The distance in meters.
 * @param units - A single `DistanceUnit` or a tuple of two `DistanceUnit` values.
 * @returns A formatted distance string with unit abbreviation(s).
 *
 * @throws {Error} Throws if more than 2 units are provided or an unsupported unit is given.
 *
 * @example
 * ```typescript
 * formatDistance(42300, 'kilometers');                        // "42.3 km"
 * formatDistance(42300, 'nauticalmiles');                     // "22.8 NM"
 * formatDistance(42300, ['kilometers', 'nauticalmiles']);     // "42.3 km / 22.8 NM"
 * formatDistance(0, 'kilometers');                            // "0.0 km"
 * ```
 */
export function formatDistance(
  meters: number,
  units: DistanceUnit | DistanceUnit[],
): string {
  const unitList = Array.isArray(units) ? units : [units];

  if (unitList.length > 2) {
    throw new Error('formatDistance accepts at most 2 units.');
  }

  const convert = (unit: DistanceUnit): number => {
    switch (unit) {
      case 'kilometers':
        return meters / 1000;
      case 'nauticalmiles':
        return meters / 1852;
      case 'miles':
        return meters / 1609.344;
      case 'meters':
        return meters;
      case 'feet':
        return meters * 3.28084;
    }
  };

  const parts = unitList.map((unit) => {
    const value = round(1, convert(unit));
    const symbol = DISTANCE_UNIT_SYMBOLS[unit];

    return `${value.toFixed(1)} ${symbol}`;
  });

  return parts.join(' / ');
}
