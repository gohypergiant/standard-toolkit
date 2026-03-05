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

import {
  DISTANCE_UNIT_SYMBOLS,
  type DistanceUnit,
} from '@accelint/constants/units';

/**
 * Default distance units for geographic measurements.
 */
export const DEFAULT_DISTANCE_UNITS: DistanceUnit = 'kilometers';

/**
 * Get the full Turf.js unit name from a symbol.
 *
 * @param symbol - The unit symbol (e.g., 'km', 'NM')
 * @returns The full unit name (e.g., 'kilometers', 'nauticalmiles') or undefined
 */
export function getDistanceUnitFromSymbol(
  symbol: string,
): DistanceUnit | undefined {
  const entry = Object.entries(DISTANCE_UNIT_SYMBOLS).find(
    ([, s]) => s === symbol,
  );
  return entry?.[0] as DistanceUnit | undefined;
}
