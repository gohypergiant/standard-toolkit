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
import { assignAxes } from './assign-axes.js';
import { buildCoordinate } from './build-coordinate.js';
import { groupTokens } from './group-tokens.js';
import {
  type RefinedCoordinate,
  refineCoordinate,
} from './refine-coordinate.js';
import type { CoordinateWGS } from '../coordinate-wgs.js';
import type { OptionsWGS } from '../options-wgs.js';

/**
 * Assembles a complete Coordinate from parsed tokens.
 * This orchestrates the full pipeline: grouping → refinement → axis assignment → construction.
 *
 * @param tokens - Array of parsed tokens from the coordinate string
 * @param order - Expected coordinate order: "latlon" (default) or "lonlat"
 * @returns Error if any validation fails, otherwise a complete Coordinate object
 *
 * @example
 * ```ts
 * assembleCoordinate(['40°', '42'', '46.08"', 'N', '|', '74°', '0'', '21.6"', 'W'], 'latlon')
 * // Returns: [null, { lat: 40.7128, lon: -74.006 }]
 * ```
 */
export function assembleCoordinate(
  tokens: string[],
  order: OptionsWGS['order'],
): [null, CoordinateWGS] | [ParseError, null] {
  // Group tokens into two coordinate parts
  const [first, second] = groupTokens(tokens).map(refineCoordinate) as [
    RefinedCoordinate,
    RefinedCoordinate,
  ];

  if ('errors' in first) {
    // Check for refinement errors
    return [
      new ParseError(`First part errors: ${first.errors.join('; ')}`),
      null,
    ];
  }

  if ('errors' in second) {
    return [
      new ParseError(`Second part errors: ${second.errors.join('; ')}`),
      null,
    ];
  }

  // Assign axes based on compass directions and order
  const [axisError, assigned] = assignAxes(first, second, order);

  if (axisError) {
    return [axisError, null];
  }

  // Build and validate final coordinate
  return buildCoordinate(...assigned);
}
