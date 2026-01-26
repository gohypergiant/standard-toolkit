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
import { parseDecimalDegrees } from './parser';
import type { CoordinateSystem } from '../internal/coordinate-system';

/**
 * Decimal Degrees coordinate system implementation.
 *
 * Provides parsing, conversion, and formatting for coordinates in decimal degrees notation.
 * Coordinates are expressed as decimal numbers with degree symbols (e.g., 37.7749° N).
 *
 * @property name - Human-readable name of the coordinate system.
 * @property parse - Parses decimal degrees coordinate strings.
 * @property toFloat - Converts parsed coordinate components to floating point numbers.
 * @property toFormat - Formats numeric coordinates back to decimal degrees string.
 *
 * @example
 * // Parse a coordinate string
 * const [coords, errors] = systemDecimalDegrees.parse('37.7749° N / 122.4194° W', 'LATLON');
 *
 * @example
 * // Convert to float
 * const lat = systemDecimalDegrees.toFloat(['37.7749', 'N']);
 * // 37.7749
 *
 * @example
 * // Format to string
 * const formatted = systemDecimalDegrees.toFormat('LATLON', [37.7749, -122.4194]);
 * // '37.7749 N / 122.4194 W'
 */
export const systemDecimalDegrees: CoordinateSystem = {
  name: 'Decimal Degrees',

  parse: parseDecimalDegrees,

  toFloat(arg) {
    const [num, bear] = arg as [string, Compass];

    return (
      Number.parseFloat(num) *
      (SYMBOL_PATTERNS.NEGATIVE_BEARINGS.test(bear) ? -1 : 1)
    );
  },

  toFormat(format: Format, [left, right]: [number, number]) {
    return [left, right]
      .map(
        (num, index) =>
          `${Math.abs(num)} ${BEARINGS[format][index as 0 | 1][+(num < 0)]}`,
      )
      .join(` ${SYMBOLS.DIVIDER} `);
  },
};
