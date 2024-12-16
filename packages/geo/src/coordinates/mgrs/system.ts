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

import { Point } from '@ngageoint/grid-js';
import { MGRS } from '@ngageoint/mgrs-js';

import { SYMBOL_PATTERNS, type Format } from '../latlon/internal';
import type { CoordinateSystem } from '../latlon/internal/coordinate-sytem';

import { parseMGRS } from './parser';

function toFormat([lat, lon]: [number, number]) {
  const point3 = Point.point(lon, lat);

  return MGRS.from(point3).toString();
}

// biome-ignore lint/style/useNamingConvention: <explanation>
export const systemMGRS: CoordinateSystem = {
  name: 'Military Grid Reference System',

  parse: parseMGRS,

  toFloat: ([num, bear]) =>
    Number.parseFloat(num) *
    (SYMBOL_PATTERNS.NEGATIVE_BEARINGS.test(bear) ? -1 : 1),

  toFormat: (format: Format, [left, right]: [number, number]) => {
    const { LAT, LON } = Object.fromEntries([
      [format.slice(0, 3), left],
      [format.slice(3), right],
    ]) as Record<'LAT' | 'LON', number>;

    return toFormat([LAT, LON]);
  },
};