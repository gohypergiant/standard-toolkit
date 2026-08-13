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

/**
 * SI-compliant display symbols for distance units.
 *
 * Maps human-readable unit names to their correct display symbols
 * per the International System of Units (SI) and international standards.
 *
 * Key distinctions from informal abbreviations:
 * - "km" not "KM" (SI: lowercase k for kilo prefix, lowercase m for meters)
 * - "m" not "M" (SI: uppercase M is the mega prefix, not meters)
 * - "NM" for nautical miles (ICAO/IMO aviation/maritime convention)
 * - "mi" and "ft" are not SI units but follow conventional lowercase
 *
 * @see https://en.wikipedia.org/wiki/International_System_of_Units
 *
 * @example
 * ```typescript
 * import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants/units';
 *
 * const symbol = DISTANCE_UNIT_SYMBOLS.kilometers; // 'km'
 * const label = `Viewport: 600 x 400 ${DISTANCE_UNIT_SYMBOLS.nauticalmiles}`; // 'Viewport: 600 x 400 NM'
 * ```
 */
export const DISTANCE_UNIT_SYMBOLS = {
  kilometers: 'km',
  meters: 'm',
  nauticalmiles: 'NM',
  miles: 'mi',
  feet: 'ft',
} as const;

/**
 * Turf.js-compatible unit names for distance calculations.
 */
export type DistanceUnit = keyof typeof DISTANCE_UNIT_SYMBOLS;

/**
 * Display symbol for a distance unit (e.g., 'km', 'NM', 'mi').
 */
export type DistanceUnitSymbol = (typeof DISTANCE_UNIT_SYMBOLS)[DistanceUnit];

/**
 * Reverse lookup map: display symbol → Turf.js unit name.
 *
 * @example
 * ```typescript
 * import { DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants/units';
 *
 * DISTANCE_UNIT_BY_SYMBOL['km'];  // 'kilometers'
 * DISTANCE_UNIT_BY_SYMBOL['NM'];  // 'nauticalmiles'
 * ```
 */
export const DISTANCE_UNIT_BY_SYMBOL = Object.fromEntries(
  Object.entries(DISTANCE_UNIT_SYMBOLS).map(([unit, symbol]) => [symbol, unit]),
) as Record<DistanceUnitSymbol, DistanceUnit>;
