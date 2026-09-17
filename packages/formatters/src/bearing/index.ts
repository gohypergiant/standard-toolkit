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
  METERS_PER_UNIT,
  type DistanceUnit,
} from '@accelint/constants/units';
import { round } from '@accelint/math/round';
import { wrap } from '@accelint/math/wrap';

/**
 * Formats a bearing in degrees as a zero-padded 3-digit string with a degree symbol.
 *
 * Wraps any value (negative or greater than 360) into the 0–360 range before
 * formatting. Uses true north reference per NTDS/C2 tactical display conventions.
 *
 * @param degrees - The bearing in degrees. May be negative or greater than 360.
 * @returns A zero-padded 3-digit string with a trailing degree symbol, e.g. `"045°"`.
 *
 * @throws {RangeError} Throws if `degrees` is `NaN` or infinite.
 *
 * @remarks
 * Pure function.
 *
 * Fractional bearings round to the nearest whole degree, and a value that
 * rounds up to 360 wraps back to `"000°"`.
 *
 * @example
 * ```typescript
 * formatBearing(45);    // "045°"
 * formatBearing(-10);   // "350°"
 * formatBearing(0);     // "000°"
 * formatBearing(370);   // "010°"
 * formatBearing(360);   // "000°"
 * formatBearing(359.6); // "000°"
 * ```
 */
export function formatBearing(degrees: number): string {
  if (!Number.isFinite(degrees)) {
    throw new RangeError('degrees must be a finite number.');
  }

  const wrapped = wrap(0, 360, round(0, degrees));

  return `${String(wrapped).padStart(3, '0')}°`;
}

function formatOne(meters: number, unit: DistanceUnit): string {
  if (!Object.hasOwn(METERS_PER_UNIT, unit)) {
    throw new Error(`Unsupported distance unit: ${unit}`);
  }

  const value = round(1, meters / METERS_PER_UNIT[unit]);

  return `${value.toFixed(1)} ${DISTANCE_UNIT_SYMBOLS[unit]}`;
}

/**
 * Formats a distance in meters into a human-readable string with unit abbreviations.
 *
 * Supports single or dual unit display. Single unit produces `"42.3 km"`;
 * dual unit produces `"42.3 km / 22.8 NM"`. Values are formatted to 1 decimal place.
 *
 * Supports the following units: `kilometers`, `nauticalmiles`, `miles`, `meters`, `feet`.
 *
 * @param meters - The distance in meters.
 * @param units - A single `DistanceUnit` or an array of one or two `DistanceUnit` values.
 * @returns A formatted distance string with unit abbreviation(s).
 *
 * @throws {RangeError} Throws if `meters` is `NaN` or infinite.
 * @throws {Error} Throws if `units` is an empty array or has more than 2 entries.
 * @throws {Error} Throws if a unit is not a key of `METERS_PER_UNIT`.
 *
 * @remarks
 * Pure function.
 *
 * Conversion divides `meters` by `METERS_PER_UNIT[unit]` from
 * `@accelint/constants/units`; symbols come from `DISTANCE_UNIT_SYMBOLS`.
 *
 * @example
 * ```typescript
 * formatDistance(42300, 'kilometers');                        // "42.3 km"
 * formatDistance(42300, 'nauticalmiles');                     // "22.8 NM"
 * formatDistance(42300, ['kilometers', 'nauticalmiles']);     // "42.3 km / 22.8 NM"
 * formatDistance(0, 'kilometers');                            // "0.0 km"
 * formatDistance(42300, ['kilometers', 'miles', 'feet']);     // Error
 * ```
 */
export function formatDistance(
  meters: number,
  units: DistanceUnit | DistanceUnit[],
): string {
  if (!Number.isFinite(meters)) {
    throw new RangeError('meters must be a finite number.');
  }

  if (!Array.isArray(units)) {
    return formatOne(meters, units);
  }

  if (units.length === 0 || units.length > 2) {
    throw new Error('formatDistance accepts 1 or 2 units.');
  }

  return units.map((unit) => formatOne(meters, unit)).join(' / ');
}
