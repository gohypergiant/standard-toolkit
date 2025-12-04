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

import { centralMeridian } from '../nga-grids-common/convert/central-meridian.js';
import {
  UTM_FALSE_EASTING,
  UTM_FALSE_NORTHING,
  UTM_K0,
  WGS84,
} from '../nga-grids-common/convert/ellipsoid.js';
import { primeVerticalRadius } from '../nga-grids-common/convert/prime-vertical-radius.js';
import { toDegrees } from '../nga-grids-common/convert/to-degrees.js';
import { toFootpointLatitude } from '../nga-grids-common/convert/to-footpoint-latitude.js';
import type { TokensWGS } from '../wgs/tokens-wgs.js';
import type { TokensUTM } from './tokens-utm.js';

/**
 * Converts Universal Transverse Mercator (UTM) coordinates to WGS84 latitude/longitude.
 *
 * This function performs the inverse Transverse Mercator projection using the WGS84 ellipsoid.
 * It transforms UTM grid coordinates (easting/northing in meters) back to geographic coordinates
 * (latitude/longitude in decimal degrees).
 *
 * **Note:** This function performs no validation. Input coordinates should be validated
 * using the `parse` function before conversion.
 *
 * @see {@link file://./../../agents.md} for AI generation prompts used to create this function
 *
 * The conversion process uses the footpoint latitude method:
 * 1. Removes UTM false easting and northing offsets
 * 2. Computes the footpoint latitude from the meridional arc
 * 3. Calculates ellipsoidal parameters at the footpoint
 * 4. Applies the inverse Transverse Mercator equations
 * 5. Converts the result from radians to decimal degrees
 *
 * @param coord - UTM coordinate to convert
 * @param coord.easting - Easting value in meters (typically 100,000 to 900,000)
 * @param coord.northing - Northing value in meters (0 to ~10,000,000)
 * @param coord.hemisphere - Hemisphere indicator ("N" or "S")
 * @param coord.zoneNumber - UTM zone number (1-60)
 *
 * @returns WGS84 coordinate in decimal degrees
 *
 * @example
 * ```ts
 * // Convert Northern hemisphere UTM to WGS84
 * const utm = { zoneNumber: 33, zoneLetter: "U", hemisphere: "N",
 *               easting: 412345, northing: 5767890 };
 * const wgs = utmToWGS(utm);
 * // Returns: { lat: 52.1234, lon: 4.5678 }
 *
 * // Convert Southern hemisphere UTM to WGS84
 * const utmSouth = { zoneNumber: 56, zoneLetter: "H", hemisphere: "S",
 *                    easting: 334873, northing: 6252841 };
 * const wgsSouth = utmToWGS(utmSouth);
 * // Returns: { lat: -33.8688, lon: 151.2093 } (Sydney, Australia)
 * ```
 */
export function toWGSFromUTM(coord: TokensUTM): TokensWGS {
  const { easting, northing, hemisphere, zoneNumber } = coord;
  const { a, e2, ePrime2 } = WGS84;

  // Normalize UTM offsets
  const x = easting - UTM_FALSE_EASTING;
  const y = hemisphere === 'N' ? northing : northing - UTM_FALSE_NORTHING;

  // Compute meridional arc and footprint latitude
  const M = y / UTM_K0;
  const phi1 = toFootpointLatitude(M, a, e2);

  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const tanPhi1 = Math.tan(phi1);

  const N1 = primeVerticalRadius(sinPhi1, a, e2);
  const R1 = (a * (1 - e2)) / (1 - e2 * sinPhi1 * sinPhi1) ** 1.5;
  const T1 = tanPhi1 * tanPhi1;
  const C1 = ePrime2 * cosPhi1 * cosPhi1;
  const D = x / (N1 * UTM_K0);

  // Latitude (radians)
  const latRad =
    phi1 -
    ((N1 * tanPhi1) / R1) *
      (D ** 2 / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 ** 2 - 9 * ePrime2) * D ** 4) / 24 +
        ((61 +
          90 * T1 +
          298 * C1 +
          45 * T1 ** 2 -
          252 * ePrime2 -
          3 * C1 ** 2) *
          D ** 6) /
          720);

  // Longitude (radians)
  const lon0 = centralMeridian(zoneNumber);
  const lonRad =
    lon0 +
    (D -
      ((1 + 2 * T1 + C1) * D ** 3) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 ** 2 + 8 * ePrime2 + 24 * T1 ** 2) *
        D ** 5) /
        120) /
      cosPhi1;

  return {
    lat: toDegrees(latRad),
    lon: toDegrees(lonRad),
  };
}
