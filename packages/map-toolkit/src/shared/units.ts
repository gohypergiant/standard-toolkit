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
 * Map of Turf.js unit names to display abbreviations.
 * These are the practical units users would select for map measurements.
 */
export const DISTANCE_UNIT_ABBREVIATIONS = {
  kilometers: 'km',
  meters: 'm',
  nauticalmiles: 'nm',
  miles: 'mi',
  feet: 'ft',
} as const;

/**
 * Turf.js unit name (e.g., 'kilometers', 'nauticalmiles').
 */
export type DistanceUnit = keyof typeof DISTANCE_UNIT_ABBREVIATIONS;

/**
 * Display abbreviation (e.g., 'km', 'nm').
 */
export type DistanceUnitAbbreviation =
  (typeof DISTANCE_UNIT_ABBREVIATIONS)[DistanceUnit];

/**
 * Default distance units for geographic measurements.
 */
export const DEFAULT_DISTANCE_UNITS: DistanceUnit = 'kilometers';

/**
 * Get the full Turf.js unit name from an abbreviation.
 * @param abbrev - The abbreviation (e.g., 'km', 'nm')
 * @returns The full unit name (e.g., 'kilometers', 'nauticalmiles') or undefined
 */
export function getDistanceUnitFromAbbreviation(
  abbrev: string,
): DistanceUnit | undefined {
  const entry = Object.entries(DISTANCE_UNIT_ABBREVIATIONS).find(
    ([, a]) => a === abbrev,
  );
  return entry?.[0] as DistanceUnit | undefined;
}

/**
 * Get the abbreviation for a Turf.js unit name.
 * @param unit - The full unit name (e.g., 'kilometers')
 * @returns The abbreviation (e.g., 'km') or the input if not found
 */
export function getDistanceUnitAbbreviation(unit: string): string {
  return DISTANCE_UNIT_ABBREVIATIONS[unit as DistanceUnit] ?? unit;
}
