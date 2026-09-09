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

// __private-exports

import { BEARINGS, type Format, SYMBOLS } from '.';
import { type Axis, getHemisphere } from './ordinal';

export type FormatOptions = {
  prefix: string;
  suffix: string;
  separator: string;
  withOrdinal?: boolean;
};

/**
 * Shared scaffold for a `CoordinateSystem`'s `toFormat` round-trip string.
 *
 * This is the loss-less internal representation `createCoordinate(...).dd()` /
 * `.ddm()` / `.dms()` returns — deliberately distinct from the display
 * formatters in each system's `formatter.ts`. The `to*Parts` / `format*`
 * functions round and carry to a fixed precision for human display; this path
 * keeps full precision and applies **no** carry so a value survives a
 * format → parse → float round-trip unchanged. The two must not be merged.
 *
 * Owns the parts every system's `toFormat` shares — the `[lat, lon]` map, the
 * ` / ` divider join, and the signed → `N`/`S`/`E`/`W` direction lookup — and
 * defers only the per-axis magnitude rendering (which is all that differs
 * between DD, DDM, and DMS) to `renderMagnitude`.
 *
 * @param format - Axis ordering (`'LATLON'` or `'LONLAT'`).
 * @param coordinates - Signed `[left, right]` values in the given ordering.
 * @param renderMagnitude - Renders the space-separated magnitude components of
 *   one axis (e.g. `"37 46.494"` for DDM) from its absolute value.
 * @returns The joined round-trip string, e.g. `"37 46.494 N / 122 25.164 W"`.
 *
 * @remarks pure function
 */
export const formatCoordinateSystem = (
  format: Format,
  [left, right]: [number, number],
  renderMagnitude: (magnitude: number) => string,
): string =>
  [left, right]
    .map((value, index) => {
      const direction = BEARINGS[format][index as 0 | 1][+(value < 0)];

      return `${renderMagnitude(Math.abs(value))} ${direction}`;
    })
    .join(` ${SYMBOLS.DIVIDER} `);

/**
 * Creates a coordinate formatter function from a coordinate conversion function.
 *
 * @param fn - Function that converts a single coordinate value to a formatted string.
 * @returns Formatter function that takes coordinate pair and optional config.
 *
 * @example
 * ```typescript
 * const formatDD = createFormatter((num) => `${num.toFixed(6)}°`);
 * formatDD([37.7749, -122.4194]);
 * // '37.774900° N, 122.419400° W'
 * ```
 *
 * @example
 * ```typescript
 * const formatDMS = createFormatter(toDegreesMinutesSeconds);
 * formatDMS([37.7749, -122.4194], { separator: ' / ', withOrdinal: true });
 * // '37° 46' 29.64″ N / 122° 25' 9.84″ W'
 * ```
 */
export const createFormatter =
  (fn: (coord: number, axis: Axis, withOrdinal?: boolean) => string) =>
  (coordinates: [number, number], config?: FormatOptions): string => {
    const [latitude, longitude] = coordinates;
    const latOrdinal = config?.withOrdinal
      ? ` ${getHemisphere(latitude, 'lat')}`
      : '';
    const lonOrdinal = config?.withOrdinal
      ? ` ${getHemisphere(longitude, 'lon')}`
      : '';
    const latValue = fn(latitude, 'lat', config?.withOrdinal);
    const lonValue = fn(longitude, 'lon', config?.withOrdinal);
    const prefix = config?.prefix ?? '';
    const suffix = config?.suffix ?? '';
    const separator = config?.separator ?? ', ';

    return `${prefix}${latValue}${latOrdinal}${separator}${lonValue}${lonOrdinal}${suffix}`;
  };
