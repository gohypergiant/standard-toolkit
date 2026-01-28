// __private-exports
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

import { LatLon } from 'geodesy/mgrs';
import { type Compass, type Format, SYMBOL_PATTERNS } from '../latlon/internal';
import { parseMGRS } from './parser';
import type { CoordinateSystem } from '../latlon/internal/coordinate-system';

/**
 * Military Grid Reference System (MGRS) coordinate system implementation.
 *
 * Provides parsing, conversion, and formatting for MGRS coordinates. MGRS is a geocoordinate
 * standard used by NATO militaries for locating points on Earth, based on the UTM coordinate
 * system. Format: Grid Zone Designation + 100km Square ID + Numerical Location (e.g., '31U BF 12345 67890').
 *
 * @property name - Human-readable name: 'Military Grid Reference System'.
 * @property parse - Parses MGRS coordinate strings into latitude/longitude values.
 * @property toFloat - Converts coordinate component with bearing to signed float value.
 * @property toFormat - Formats latitude/longitude pair back to MGRS coordinate string.
 *
 * @example
 * ```typescript
 * systemMGRS.parse(null, '31U BF 12345 67890');
 * // [[['48.123456', 'N'], ['11.234567', 'E']], []]
 * ```
 *
 * @example
 * ```typescript
 * systemMGRS.toFormat('LATLON', [48.123456, 11.234567]);
 * // '31U BF 12345 67890'
 * ```
 *
 * @example
 * ```typescript
 * systemMGRS.toFloat(['48.123456', 'N']);
 * // 48.123456
 * ```
 */
export const systemMGRS: CoordinateSystem = {
  name: 'Military Grid Reference System',

  parse: parseMGRS,

  toFloat(arg) {
    const [num, bear] = arg as [string, Compass];

    return (
      Number.parseFloat(num) *
      (SYMBOL_PATTERNS.NEGATIVE_BEARINGS.test(bear) ? -1 : 1)
    );
  },

  toFormat(format: Format, [left, right]: [number, number]) {
    const { LAT, LON } = Object.fromEntries([
      [format.slice(0, 3), left],
      [format.slice(3), right],
    ]) as Record<'LAT' | 'LON', number>;

    const latlon = new LatLon(LAT, LON);

    return latlon.toUtm().toMgrs().toString();
  },
};
