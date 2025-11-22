// __private-exports
/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { LatLon } from 'geodesy/utm';
import { type Compass, type Format, SYMBOL_PATTERNS } from '../latlon/internal';
import { parseUTM } from './parser';
import type { CoordinateSystem } from '../latlon/internal/coordinate-system';

export const systemUTM: CoordinateSystem = {
  name: 'Universal Transverse Mercator',

  parse: parseUTM,

  toFloat(arg) {
    const [num, bear] = arg as [string, Compass];

    return (
      Number.parseFloat(num) *
      (SYMBOL_PATTERNS.NEGATIVE_BEARINGS.test(bear) ? -1 : 1)
    );
  },

  toFormat(format: Format, [left, right]: [number, number]) {
    const { LAT, LON } = Object.fromEntries([
      [format.slice(0, 3), left],
      [format.slice(3), right],
    ]) as Record<'LAT' | 'LON', number>;

    const latlon = new LatLon(LAT, LON);
    const utm = latlon.toUtm();

    // Format UTM coordinates manually to ensure correct format
    // Expected format: "18N 585628 4511644" (zone hemisphere easting northing)
    const zone = utm.zone.toString().padStart(2, '0');
    const hemisphere = utm.hemisphere;
    const easting = Math.round(utm.easting).toString();
    const northing = Math.round(utm.northing).toString();

    return `${zone}${hemisphere} ${easting} ${northing}`;
  },
};
