/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createFormatter } from '../internal/format';
import { type Axis, getHemisphere, type Hemisphere } from '../internal/ordinal';

/** Default number of decimal places for degrees-minutes-seconds formatting. */
export const DMS_PRECISION = 2;

/**
 * Structured degrees-minutes-seconds parts for a single signed coordinate value.
 *
 * `degrees`, `minutes`, and `seconds` are non-negative; carry keeps `seconds`
 * and `minutes` below `60`. The signed value is recoverable from the axis and
 * `hemisphere`.
 */
export type DmsParts = {
  degrees: number;
  minutes: number;
  seconds: number;
  hemisphere: Hemisphere;
};

/**
 * Converts a single signed coordinate value into degrees-minutes-seconds parts.
 *
 * Applies the seconds/minutes carry (`60″ → +1′`, `60′ → +1°`) after rounding
 * so `seconds` and `minutes` never reach `60`, then attaches the hemisphere
 * letter for the axis.
 *
 * @param value - The signed coordinate value.
 * @param axis - Whether the value is a latitude (`'lat'`) or longitude (`'lon'`).
 * @param precision - Decimal places for the seconds (default `2`).
 * @returns The `{ degrees, minutes, seconds, hemisphere }` parts object.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * toDmsParts(-77.0369, 'lon');
 * // { degrees: 77, minutes: 2, seconds: 12.84, hemisphere: 'W' }
 * ```
 */
export const toDmsParts = (
  value: number,
  axis: Axis,
  precision: number = DMS_PRECISION,
): DmsParts => {
  const magnitude = Math.abs(value);
  let degrees = Math.floor(magnitude);
  const minutesFull = (magnitude - degrees) * 60;
  let minutes = Math.floor(minutesFull);
  let seconds = Number(((minutesFull - minutes) * 60).toFixed(precision));

  // Rounding can produce 60 seconds (e.g. 40.9999999 -> 40° 59' 60.00″);
  // carry into minutes (and degrees) so the output stays a valid coordinate.
  minutes += Math.floor(seconds / 60);
  seconds %= 60;
  degrees += Math.floor(minutes / 60);
  minutes %= 60;

  return {
    degrees,
    minutes,
    seconds,
    hemisphere: getHemisphere(value, axis),
  };
};

/**
 * Converts a coordinate value to degrees minutes seconds format.
 *
 * @param num - The coordinate value to format.
 * @param axis - Whether the value is a latitude (`'lat'`) or longitude (`'lon'`).
 * @returns Formatted coordinate string with degrees, minutes, and seconds (e.g., "45° 30' 15.23″").
 *
 * @example
 * ```typescript
 * toDegreesMinutesSeconds(45.5042, 'lat');
 * // '45° 30' 15.12″'
 * ```
 *
 * @example
 * ```typescript
 * toDegreesMinutesSeconds(-122.4194, 'lon');
 * // '122° 25' 9.84″'
 * ```
 */
const toDegreesMinutesSeconds = (num: number, axis: Axis): string => {
  const { degrees, minutes, seconds } = toDmsParts(num, axis);

  return `${degrees}° ${minutes}' ${seconds.toFixed(DMS_PRECISION)}″`;
};

/**
 * Formats latitude/longitude coordinates in degrees minutes seconds notation.
 *
 * @param coordinates - Tuple of [latitude, longitude] values.
 * @param config - Optional formatting configuration.
 * @returns Formatted coordinate string in degrees minutes seconds format.
 *
 * @example
 * ```typescript
 * formatDegreesMinutesSeconds([37.7749, -122.4194]);
 * // '37° 46' 29.64″ N, 122° 25' 9.84″ W'
 * ```
 *
 * @example
 * ```typescript
 * formatDegreesMinutesSeconds([37.7749, -122.4194], { separator: ' / ' });
 * // '37° 46' 29.64″ N / 122° 25' 9.84″ W'
 * ```
 */
export const formatDegreesMinutesSeconds = createFormatter(
  toDegreesMinutesSeconds,
);
