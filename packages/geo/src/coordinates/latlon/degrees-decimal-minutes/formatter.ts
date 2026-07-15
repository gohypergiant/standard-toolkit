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

/** Default number of decimal places for degrees-decimal-minutes formatting. */
export const DDM_PRECISION = 4;

/**
 * Structured degrees-decimal-minutes parts for a single signed coordinate value.
 *
 * `degrees` and `minutes` are non-negative; carry keeps `minutes` below `60`.
 * The signed value is recoverable from the axis and `hemisphere`.
 */
export type DdmParts = {
  degrees: number;
  minutes: number;
  hemisphere: Hemisphere;
};

/**
 * Converts a single signed coordinate value into degrees-decimal-minutes parts.
 *
 * Applies the minutes carry (`60′ → +1°`) after rounding so `minutes` never
 * reaches `60`, then attaches the hemisphere letter for the axis.
 *
 * @param value - The signed coordinate value.
 * @param axis - Whether the value is a latitude (`'lat'`) or longitude (`'lon'`).
 * @param precision - Decimal places for the minutes (default `4`).
 * @returns The `{ degrees, minutes, hemisphere }` parts object.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * toDdmParts(12.576, 'lat');
 * // { degrees: 12, minutes: 34.56, hemisphere: 'N' }
 * ```
 */
export const toDdmParts = (
  value: number,
  axis: Axis,
  precision: number = DDM_PRECISION,
): DdmParts => {
  const magnitude = Math.abs(value);
  let degrees = Math.floor(magnitude);
  let minutes = Number(((magnitude - degrees) * 60).toFixed(precision));

  // Rounding can produce 60 minutes (e.g. 40.9999995 -> 40° 60.0000');
  // carry into degrees so the output stays a valid coordinate.
  degrees += Math.floor(minutes / 60);
  minutes %= 60;

  return {
    degrees,
    minutes,
    hemisphere: getHemisphere(value, axis),
  };
};

/**
 * Converts a coordinate value to degrees decimal minutes format.
 *
 * @param value - The coordinate value to format.
 * @param axis - Whether the value is a latitude (`'lat'`) or longitude (`'lon'`).
 * @returns Formatted coordinate string with degrees and decimal minutes (e.g., "45° 30.1234'").
 *
 * @example
 * ```typescript
 * toDegreesDecimalMinutes(45.5, 'lat');
 * // '45° 30.0000''
 * ```
 *
 * @example
 * ```typescript
 * toDegreesDecimalMinutes(-122.4194, 'lon');
 * // '122° 25.1640''
 * ```
 */
const toDegreesDecimalMinutes = (value: number, axis: Axis): string => {
  const { degrees, minutes } = toDdmParts(value, axis);

  return `${degrees}° ${minutes.toFixed(DDM_PRECISION)}'`;
};

/**
 * Formats latitude/longitude coordinates in degrees decimal minutes notation.
 *
 * @param coordinates - Tuple of [latitude, longitude] values.
 * @param config - Optional formatting configuration.
 * @returns Formatted coordinate string in degrees decimal minutes format.
 *
 * @example
 * ```typescript
 * formatDegreesDecimalMinutes([37.7749, -122.4194]);
 * // '37° 46.4940' N, 122° 25.1640' W'
 * ```
 *
 * @example
 * ```typescript
 * formatDegreesDecimalMinutes([37.7749, -122.4194], { separator: ' / ' });
 * // '37° 46.4940' N / 122° 25.1640' W'
 * ```
 */
export const formatDegreesDecimalMinutes = createFormatter(
  toDegreesDecimalMinutes,
);
