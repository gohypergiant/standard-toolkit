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

import { expand } from './internal/expand-decimal.js';
import type { OptionsWGS } from './options-wgs.js';
import type { TokensWGS } from './tokens-wgs.js';

type Compass = typeof COMPASS_LAT | typeof COMPASS_LON | false;
type Tuple = [number[], number[]];

const COMPASS_LAT = ['S', 'N'] as const;
const COMPASS_LON = ['W', 'E'] as const;
const FORMAT = {
  dd: (coord: TokensWGS) => [[coord.lat], [coord.lon]],
  ddm: (coord: TokensWGS) => [expand(coord.lat), expand(coord.lon)],
  dms: (coord: TokensWGS) => [expand(coord.lat, true), expand(coord.lon, true)],
};
const SYMBOLS = ['°', "'", '"'];

function addSymbols(compass: Compass, ...parts: number[]) {
  const degrees = parts.at(0);
  const direction = compass ? compass[degrees && degrees < 0 ? 0 : 1] : '';
  const numbers = parts
    .map((num, index) => `${compass ? Math.abs(num) : num}${SYMBOLS[index]}`)
    .join(' ');

  return numbers + direction;
}

/**
 * Converts WGS84 coordinate tokens to a formatted string representation.
 *
 * @param coord - The WGS84 coordinate tokens containing latitude and longitude
 * @param options - Formatting options for the output string
 * @param options.format - The coordinate format: `'dd'` (decimal degrees), `'ddm'` (degrees decimal minutes), or `'dms'` (degrees minutes seconds). Default: `'dd'`
 * @param options.compass - When `true`, uses compass directions (N/S/E/W) instead of negative values. Default: `false`
 * @param options.order - The coordinate order: `'latlon'` (latitude, longitude) or `'lonlat'` (longitude, latitude). Default: `'latlon'`
 * @returns A formatted string representation of the coordinate
 *
 * @example
 * ```ts
 * const coord = { lat: 40.7489, lon: -73.968 };
 *
 * // Default: decimal degrees, latlon order, no compass
 * toStringFromWGS(coord)
 * // "40.7489°, -73.968°"
 *
 * // With compass directions
 * toStringFromWGS(coord, { compass: true })
 * // "40.7489°N, 73.968°W"
 *
 * // Degrees decimal minutes format
 * toStringFromWGS(coord, { format: 'ddm' })
 * // "40° 44.934', -73° 58.08'"
 *
 * // Degrees minutes seconds with compass
 * toStringFromWGS(coord, { format: 'dms', compass: true })
 * // "40° 44' 56.04"N, 73° 58' 4.8"W"
 *
 * // Longitude-latitude order with compass
 * toStringFromWGS(coord, { order: 'lonlat', compass: true })
 * // "73.968°W, 40.7489°N"
 * ```
 */
export function toStringFromWGS(
  coord: TokensWGS,
  options: OptionsWGS = {},
): string {
  const format = (options.format ?? 'dd') as keyof typeof FORMAT;
  const [latNumbers, lonNumbers] = FORMAT[format](coord) as Tuple;

  const lat = addSymbols(!!options.compass && COMPASS_LAT, ...latNumbers);
  const lon = addSymbols(!!options.compass && COMPASS_LON, ...lonNumbers);

  return options?.order === 'lonlat' ? `${lon}, ${lat}` : `${lat}, ${lon}`;
}
