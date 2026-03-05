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
 */
export const DISTANCE_UNIT_SYMBOLS = {
  kilometers: 'km',
  meters: 'm',
  nauticalmiles: 'NM',
  miles: 'mi',
  feet: 'ft',
} as const;

export type DistanceUnitSymbol =
  (typeof DISTANCE_UNIT_SYMBOLS)[keyof typeof DISTANCE_UNIT_SYMBOLS];
