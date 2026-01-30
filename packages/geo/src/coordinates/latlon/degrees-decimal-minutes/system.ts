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

import {
  BEARINGS,
  type Compass,
  type Format,
  SYMBOL_PATTERNS,
  SYMBOLS,
} from '../internal';
import { parseDegreesDecimalMinutes } from './parser';
import type { CoordinateSystem } from '../internal/coordinate-system';

/**
 * Degrees Decimal Minutes coordinate system implementation.
 *
 * Provides parsing, conversion, and formatting for coordinates in degrees decimal minutes notation.
 * Coordinates are expressed as integer degrees and decimal minutes (e.g., 37° 46.4940' N).
 *
 * @property name - Human-readable name of the coordinate system.
 * @property parse - Parses degrees decimal minutes coordinate strings.
 * @property toFloat - Converts parsed coordinate components to floating point numbers.
 * @property toFormat - Formats numeric coordinates back to degrees decimal minutes string.
 *
 * @example
 * ```typescript
 * // Parse a coordinate string
 * const [coords, errors] = systemDegreesDecimalMinutes.parse('37° 46.4940' N / 122° 25.1640' W', 'LATLON');
 * ```
 *
 * @example
 * ```typescript
 * // Convert to float
 * const lat = systemDegreesDecimalMinutes.toFloat(['37', '46.4940', 'N']);
 * // 37.7749
 * ```
 *
 * @example
 * ```typescript
 * // Format to string
 * const formatted = systemDegreesDecimalMinutes.toFormat('LATLON', [37.7749, -122.4194]);
 * // '37 46.494 N / 122 25.164 W'
 * ```
 */
export const systemDegreesDecimalMinutes: CoordinateSystem = {
  name: 'Degrees Decimal Minutes',

  parse: parseDegreesDecimalMinutes,

  toFloat(arg) {
    const [degrees, minutes, bear] = arg as [string, string, Compass];

    return Number.parseFloat(
      (
        (Number.parseFloat(degrees) + Number.parseFloat(minutes) / 60) *
        (SYMBOL_PATTERNS.NEGATIVE_BEARINGS.test(bear) ? -1 : 1)
      ).toFixed(9),
    );
  },

  toFormat(format: Format, [left, right]: [number, number]) {
    return [left, right]
      .map((num, index) => {
        const abs = Math.abs(num);
        const deg = Math.floor(abs);
        const min = Number.parseFloat(((abs - deg) * 60).toFixed(10));

        return `${deg} ${min} ${BEARINGS[format][index as 0 | 1][+(num < 0)]}`;
      })
      .join(` ${SYMBOLS.DIVIDER} `);
  },
};
