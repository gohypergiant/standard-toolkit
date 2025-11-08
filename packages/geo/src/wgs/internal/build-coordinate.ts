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
import type { CoordinateWGS } from '../coordinate-wgs.js';
import type { AxisAssignment } from './assign-axes.js';

/**
 * Constructs a final Coordinate object from two axis-assigned values.
 * Validates that latitude and longitude are within their valid ranges.
 *
 * @param first - First coordinate with assigned axis
 * @param second - Second coordinate with assigned axis
 * @returns Error if values are out of range, otherwise the final Coordinate object
 *
 * @example
 * ```ts
 * buildCoordinate(
 *   { axis: 'lat', value: 40.7128 },
 *   { axis: 'lon', value: -74.006 }
 * )
 * // Returns: [null, { lat: 40.7128, lon: -74.006 }]
 *
 * buildCoordinate(
 *   { axis: 'lat', value: 91.0 },
 *   { axis: 'lon', value: -74.006 }
 * )
 * // Returns: [ParseError('Latitude value out of range'), null]
 * ```
 */
export function buildCoordinate(
  first: AxisAssignment,
  second: AxisAssignment,
): [null, CoordinateWGS] | [ParseError, null] {
  const { lat, lon } = Object.fromEntries([
    [first.axis, first.value],
    [second.axis, second.value],
  ]) as unknown as CoordinateWGS;

  if (Math.abs(lat) > 90) {
    return [new ParseError(`Latitude value out of range: "${lat}"`), null];
  }

  if (Math.abs(lon) > 180) {
    return [new ParseError(`Longitude value out of range: "${lon}"`), null];
  }

  return [null, { lat, lon } as CoordinateWGS];
}
