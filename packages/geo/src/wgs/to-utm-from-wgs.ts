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
import { computePrecision } from '../nga-grids-common/convert/compute-precision.js';
import {
  UTM_FALSE_EASTING,
  UTM_FALSE_NORTHING,
  UTM_K0,
  WGS84,
} from '../nga-grids-common/convert/ellipsoid.js';
import { meridionalArc } from '../nga-grids-common/convert/meridional-arc.js';
import { primeVerticalRadius } from '../nga-grids-common/convert/prime-vertical-radius.js';
import { toRadians } from '../nga-grids-common/convert/to-radians.js';
import { GRID_ZONE_LETTER } from '../nga-grids-common/grid-zone.js';
import type { Precision } from '../nga-grids-common/convert/precision.js';
import type { TokensUTM } from '../utm/tokens-utm.js';
import type { TokensWGS } from './tokens-wgs.js';

/**
 * Derives UTM zone letter for a given latitude.
 * Valid latitude range is -80° to 84°.
 * Returns 'C' for latitudes <= -80° and 'X' for latitudes >= 84°.
 */
function getZoneLetter(lat: number): string {
  // Upper bound
  if (lat >= 84) {
    return 'X';
  }

  // Lower bound
  if (lat <= -80) {
    return 'C';
  }

  const index = Math.floor((lat + 80) / 8);

  // NOTE: fallback should not be reachable with valid latitude values (-80 to 84)
  return GRID_ZONE_LETTER[index] ?? 'Z';
}

/**
 * Converts WGS84 latitude/longitude to Universal Transverse Mercator (UTM) coordinates.
 *
 * This function performs the Transverse Mercator projection using the WGS84 ellipsoid.
 * It transforms geographic coordinates (latitude/longitude in decimal degrees) to UTM
 * grid coordinates (easting/northing in meters).
 *
 * **Note:** This function performs no validation. Input coordinates should be validated
 * using the `parse` function before conversion.
 *
 * @see {@link file://./../../agents.md} for AI generation prompts used to create this function
 *
 * The conversion process:
 * 1. Normalizes longitude to the range [-180°, 180°]
 * 2. Determines the UTM zone number (1-60) from longitude
 * 3. Calculates the central meridian for the zone
 * 4. Derives the zone letter (C-X) from latitude
 * 5. Computes ellipsoidal parameters for the WGS84 datum
 * 6. Applies the Transverse Mercator projection equations
 * 7. Adds UTM false easting (500,000m) and false northing (10,000,000m for Southern hemisphere)
 *
 * @param coord - WGS84 coordinate in decimal degrees
 * @param coord.lat - Latitude in decimal degrees (-90 to 90, negative = South)
 * @param coord.lon - Longitude in decimal degrees (-180 to 180, negative = West)
 * @param precisionOverride - Optional override for output precision metadata
 *
 * @returns UTM coordinate with easting/northing in meters
 *
 * @example
 * ```ts
 * // Convert New York City coordinates
 * const wgs = { lat: 40.7128, lon: -74.0060 };
 * const utm = wgsToUTM(wgs);
 * // Returns: { zoneNumber: 18, zoneLetter: "T", hemisphere: "N",
 * //            easting: 583960, northing: 4507523, precision: { easting: 6, northing: 7 } }
 *
 * // Convert Sydney, Australia coordinates
 * const wgsSydney = { lat: -33.8688, lon: 151.2093 };
 * const utmSydney = wgsToUTM(wgsSydney);
 * // Returns: { zoneNumber: 56, zoneLetter: "H", hemisphere: "S",
 * //            easting: 334873, northing: 6252841, precision: { easting: 6, northing: 7 } }
 * ```
 */
export function toUTMFromWGS(
  coord: TokensWGS,
  precisionOverride?: Precision,
): TokensUTM {
  const { lat, lon } = coord;
  const { a, e2, ePrime2 } = WGS84;

  // Normalize longitude and determine zone number
  const lonNorm = ((((lon + 180) % 360) + 360) % 360) - 180;
  const zoneNumber = Math.floor((lonNorm + 180) / 6) + 1;
  const lon0 = centralMeridian(zoneNumber);

  const latRad = toRadians(lat);
  const lonRad = toRadians(lonNorm);

  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const tanLat = Math.tan(latRad);

  const N = primeVerticalRadius(sinLat, a, e2);
  const T = tanLat * tanLat;
  const C = ePrime2 * cosLat * cosLat;
  const A = cosLat * (lonRad - lon0);

  // Meridional arc
  const M = meridionalArc(latRad, a, e2);

  // Easting
  const easting =
    UTM_K0 *
      N *
      (A +
        ((1 - T + C) * A ** 3) / 6 +
        ((5 - 18 * T + T ** 2 + 72 * C - 58 * ePrime2) * A ** 5) / 120) +
    UTM_FALSE_EASTING;

  // Northing
  let northing =
    UTM_K0 *
    (M +
      N *
        tanLat *
        (A ** 2 / 2 +
          ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 +
          ((61 - 58 * T + T ** 2 + 600 * C - 330 * ePrime2) * A ** 6) / 720));

  if (lat < 0) {
    northing += UTM_FALSE_NORTHING;
  }

  return {
    easting,
    northing,
    zoneNumber,
    // Derive zone letter
    zoneLetter: getZoneLetter(lat),
    hemisphere: lat >= 0 ? 'N' : 'S',
    precision: {
      easting: precisionOverride?.easting ?? computePrecision(easting),
      northing: precisionOverride?.northing ?? computePrecision(northing),
    },
  };
}
