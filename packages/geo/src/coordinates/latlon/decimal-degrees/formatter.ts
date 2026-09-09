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

/** Default number of decimal places for decimal-degrees formatting. */
export const DECIMAL_DEGREES_PRECISION = 6;

/**
 * Structured decimal-degrees parts for a single signed coordinate value.
 *
 * `degrees` is the non-negative magnitude rounded to the requested precision;
 * the signed value is recoverable from the axis and `hemisphere`.
 */
export type DecimalDegreesParts = {
  degrees: number;
  hemisphere: Hemisphere;
};

/**
 * Converts a single signed coordinate value into decimal-degrees parts.
 *
 * Returns the non-negative magnitude plus the hemisphere letter for the axis
 * (following geo's `>= 0` convention). Decimal degrees has no minutes/seconds
 * carry; the magnitude is simply rounded to the requested precision.
 *
 * @param value - The signed coordinate value.
 * @param axis - Whether the value is a latitude (`'lat'`) or longitude (`'lon'`).
 * @param precision - Decimal places for the magnitude (default `6`).
 * @returns The `{ degrees, hemisphere }` parts object.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * toDecimalDegreesParts(-122.4194, 'lon');
 * // { degrees: 122.4194, hemisphere: 'W' }
 * ```
 */
export const toDecimalDegreesParts = (
  value: number,
  axis: Axis,
  precision: number = DECIMAL_DEGREES_PRECISION,
): DecimalDegreesParts => {
  const degrees = Number(Math.abs(value).toFixed(precision));

  return {
    degrees,
    hemisphere: getHemisphere(value, axis),
  };
};

/**
 * Converts a coordinate value to decimal degrees format.
 *
 * @param value - The coordinate value to format.
 * @param axis - Whether the value is a latitude (`'lat'`) or longitude (`'lon'`).
 * @param withOrdinal - Whether to use absolute value (when ordinal directions are shown separately).
 * @returns Formatted coordinate string with degree symbol and 6 decimal places.
 *
 * @example
 * ```typescript
 * toDecimalDegrees(45.123456, 'lat');
 * // '45.123456°'
 * ```
 *
 * @example
 * ```typescript
 * toDecimalDegrees(-122.4194, 'lon', true);
 * // '122.419400°'
 * ```
 */
const toDecimalDegrees = (
  value: number,
  axis: Axis,
  withOrdinal?: boolean,
): string => {
  const { degrees } = toDecimalDegreesParts(value, axis);
  const signed = withOrdinal || value >= 0 ? degrees : -degrees;

  return `${signed.toFixed(DECIMAL_DEGREES_PRECISION)}°`;
};

/**
 * Formats latitude/longitude coordinates in decimal degrees notation.
 *
 * @param coordinates - Tuple of [latitude, longitude] values.
 * @param config - Optional formatting configuration.
 * @returns Formatted coordinate string in decimal degrees format.
 *
 * @example
 * ```typescript
 * formatDecimalDegrees([37.7749, -122.4194]);
 * // '37.774900° N, 122.419400° W'
 * ```
 *
 * @example
 * ```typescript
 * formatDecimalDegrees([37.7749, -122.4194], { separator: ' / ' });
 * // '37.774900° N / 122.419400° W'
 * ```
 */
export const formatDecimalDegrees = createFormatter(toDecimalDegrees);
