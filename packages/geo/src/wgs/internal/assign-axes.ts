// __private-exports
/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { ParseError } from '../../internal/parse-error.js';
import type { OptionsWGS } from '../options-wgs.js';
import type { RefinedCoordinate } from './refine-coordinate.js';

type Partial = Exclude<RefinedCoordinate, { errors: string[] }>;
type ValidPair = [AxisAssignment, AxisAssignment];

/**
 * A coordinate value with its assigned axis.
 */
export interface AxisAssignment {
  axis: 'lat' | 'lon';
  value: number;
}

const checks = [
  (first: Partial, second: Partial, _order: OptionsWGS['order']) => {
    if (first.axis && second.axis && first.axis === second.axis) {
      return `Both parts assigned to the same axis: "${first.axis}"`;
    }
  },

  (first: Partial, second: Partial, order: OptionsWGS['order']) => {
    const conflictLat = order === 'latlon' && first.axis !== 'lat';
    const conflictLon = order === 'lonlat' && first.axis !== 'lon';

    if (first.axis && second.axis && (conflictLat || conflictLon)) {
      return `Coordinate parts contradict specified order "${order}"`;
    }
  },
];

/**
 * Assigns lat/lon axes to two coordinate values based on compass directions and order preference.
 * Handles axis inference when compass directions are missing, validates for conflicts,
 * and ensures the specified order (latlon/lonlat) is respected.
 *
 * This is the core logic for resolving ambiguous coordinate pairs into unambiguous lat/lon values.
 *
 * @param first - First refined coordinate (may have axis from compass direction)
 * @param second - Second refined coordinate (may have axis from compass direction)
 * @param order - Expected coordinate order: "latlon" (default) or "lonlat"
 * @returns Error if axes conflict or contradict order, otherwise the two assigned coordinates
 *
 * @example
 * ```ts
 * // With compass directions - axes are explicit
 * assignAxes(
 *   { axis: 'lat', value: 40.7128 },
 *   { axis: 'lon', value: -74.006 },
 *   'latlon'
 * )
 * // Returns: [null, [{ axis: 'lat', value: 40.7128 }, { axis: 'lon', value: -74.006 }]]
 *
 * // Without compass - infers from order
 * assignAxes(
 *   { value: 40.7128 },
 *   { value: -74.006 },
 *   'latlon'
 * )
 * // Returns: [null, [{ axis: 'lat', value: 40.7128 }, { axis: 'lon', value: -74.006 }]]
 *
 * // Detects conflicts
 * assignAxes(
 *   { axis: 'lat', value: 40.7128 },
 *   { axis: 'lat', value: 41.0 },
 *   'latlon'
 * )
 * // Returns: [ParseError('Both parts assigned to same axis'), null]
 * ```
 */
export function assignAxes(
  first: Partial,
  second: Partial,
  order: OptionsWGS['order'],
): [null, ValidPair] | [ParseError, null] {
  const error = checks.reduce(
    (acc, fn) => acc || (fn(first, second, order) ?? ''),
    '',
  );

  if (error) {
    return [new ParseError(error), null];
  }

  if (first.axis && !second.axis) {
    // Infer missing axis from the other coordinate
    second.axis = first.axis === 'lat' ? 'lon' : 'lat';
  }

  if (second.axis && !first.axis) {
    // Infer missing axis from the other coordinate
    first.axis = second.axis === 'lat' ? 'lon' : 'lat';
  }

  if (!(first.axis || second.axis)) {
    // When no compass directions exist, use order preference
    if (order === 'lonlat') {
      first.axis = 'lon';
      second.axis = 'lat';
    } else {
      first.axis = 'lat';
      second.axis = 'lon';
    }
  }

  return [null, [first, second] as ValidPair];
}
