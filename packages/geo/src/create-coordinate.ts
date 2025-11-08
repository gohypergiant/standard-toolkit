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

import { createMGRS } from './mgrs/create-mgrs.js';
import { createUTM } from './utm/create-utm.js';
import { createWGS } from './wgs/create-wgs.js';
import type { Options } from './internal/options.js';
import type { CoordinateMGRS } from './mgrs/coordinate-mgrs.js';
import type { CoordinateUTM } from './utm/coordinate-utm.js';
import type { CoordinateWGS } from './wgs/coordinate-wgs.js';
import type { OptionsWGS } from './wgs/options-wgs.js';

// Export unified types for convenience
export type AnyCoordinate = CoordinateMGRS | CoordinateUTM | CoordinateWGS;
export type { Options, OptionsWGS };

const creators = {
  mgrs: createMGRS,
  utm: createUTM,

  latlon: createWGS,
  lonlat: createWGS,
  wgs: createWGS,
};

/**
 * Creates a coordinate object from a string input based on the specified system.
 *
 * @param sys - The coordinate system: 'mgrs', 'utm', 'wgs', 'latlon', or 'lonlat'
 * @param input - The coordinate string to parse
 * @param options - Optional parsing options
 * @returns A coordinate object with conversion methods
 *
 * @remarks
 * For WGS84 coordinates, you can use three system identifiers:
 * - `'wgs'` - Generic WGS84, accepts `order` option (default: 'latlon')
 * - `'latlon'` - Convenience alias that automatically sets order to 'latlon' (latitude, longitude)
 * - `'lonlat'` - Convenience alias that automatically sets order to 'lonlat' (longitude, latitude)
 *
 * The 'latlon' and 'lonlat' aliases do not accept the `order` option to prevent ambiguity.
 * TypeScript will show a compile error if you attempt to pass conflicting options.
 *
 * WGS84 coordinates support multiple output formats via the `toString()` method:
 * - `'dd'` (Decimal Degrees) - Default format
 * - `'ddm'` (Degrees Decimal Minutes)
 * - `'dms'` (Degrees Minutes Seconds)
 *
 * @example
 * ```typescript
 * // Create an MGRS coordinate
 * const mgrs = createCoordinate('mgrs', '18SUJ2306806559');
 * console.log(mgrs.toString()); // "18SUJ2306806559"
 *
 * // Convert to other systems
 * const utm = mgrs.toUTM();
 * const wgs = mgrs.toWGS();
 *
 * // Create WGS84 coordinate (default lat-lon order)
 * const coord = createCoordinate('wgs', '42.3601, -71.0589');
 * console.log(coord.toMGRS().toString());
 *
 * // Create WGS84 coordinate with 'latlon' alias (explicit lat-lon order)
 * const latlon = createCoordinate('latlon', '42.3601, -71.0589');
 * console.log(latlon.toString()); // "42.3601, -71.0589"
 *
 * // Create WGS84 coordinate with 'lonlat' alias (lon-lat order)
 * const lonlat = createCoordinate('lonlat', '-71.0589, 42.3601');
 * console.log(lonlat.toString()); // "-71.0589, 42.3601"
 *
 * // WGS84 format options
 * coord.toString({ format: 'ddm' }); // "42° 21.606', -71° 3.534'"
 * coord.toString({ format: 'dms' }); // "42° 21' 36.36\", -71° 3' 32.04\""
 * ```
 */
export function createCoordinate(
  sys: 'mgrs',
  input: string,
  options?: Options,
): CoordinateMGRS;
export function createCoordinate(
  sys: 'utm',
  input: string,
  options?: Options,
): CoordinateUTM;
export function createCoordinate(
  sys: 'wgs',
  input: string,
  options?: OptionsWGS,
): CoordinateWGS;
export function createCoordinate(
  sys: 'latlon',
  input: string,
  options?: Omit<OptionsWGS, 'order'>,
): CoordinateWGS;
export function createCoordinate(
  sys: 'lonlat',
  input: string,
  options?: Omit<OptionsWGS, 'order'>,
): CoordinateWGS;
export function createCoordinate(
  sys: keyof typeof creators,
  input: string,
  options: Options | OptionsWGS = {},
): AnyCoordinate {
  // Automatically set order based on system alias
  const optionsWithOrder =
    sys === 'latlon' || sys === 'lonlat'
      ? { ...options, order: sys as 'latlon' | 'lonlat' }
      : options;

  return creators[sys](input, optionsWithOrder || {}) as AnyCoordinate;
}
