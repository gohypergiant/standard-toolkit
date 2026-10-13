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

import LatLonSpherical from 'geodesy/latlon-spherical';
import { isFiniteNumber } from '../coordinates/latlon/internal/validate';
import type { LonLatTuple } from '../coordinates/latlon/internal/normalize';

/**
 * Validates a pair of `[longitude, latitude]` tuples and converts them to
 * `LatLonSpherical` points for the geodesy library.
 *
 * Shared preamble for `bearing`, `distance`, and `midpoint`. Longitude and
 * latitude are not range-checked: map libraries such as deck.gl hand these
 * functions longitudes beyond ±180 when the map wraps, and the spherical
 * math is periodic, so out-of-range values still produce correct results.
 *
 * @param origin - The starting coordinate as `[longitude, latitude]` in decimal degrees.
 * @param destination - The ending coordinate as `[longitude, latitude]` in decimal degrees.
 * @param caller - Name of the calling function, used in the thrown error message.
 * @returns The origin and destination as `LatLonSpherical` points, in that order.
 * @throws {RangeError} When any coordinate component is not a finite number.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```typescript
 * const [originPoint, destinationPoint] = toSphericalPoints([0, 0], [0, 1], 'bearing');
 *
 * originPoint.initialBearingTo(destinationPoint);
 * // 0
 *
 * toSphericalPoints([Number.NaN, 0], [0, 1], 'bearing');
 * // throws RangeError: bearing requires finite [longitude, latitude] coordinates.
 * ```
 */
export function toSphericalPoints(
  origin: LonLatTuple,
  destination: LonLatTuple,
  caller: string,
): [LatLonSpherical, LatLonSpherical] {
  const [originLongitude, originLatitude] = origin;
  const [destinationLongitude, destinationLatitude] = destination;

  const hasFiniteCoordinates =
    isFiniteNumber(originLongitude) &&
    isFiniteNumber(originLatitude) &&
    isFiniteNumber(destinationLongitude) &&
    isFiniteNumber(destinationLatitude);

  if (!hasFiniteCoordinates) {
    throw new RangeError(
      `${caller} requires finite [longitude, latitude] coordinates.`,
    );
  }

  return [
    new LatLonSpherical(originLatitude, originLongitude),
    new LatLonSpherical(destinationLatitude, destinationLongitude),
  ];
}
