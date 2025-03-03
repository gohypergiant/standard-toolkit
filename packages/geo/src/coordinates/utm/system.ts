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
import { UTM } from '@ngageoint/mgrs-js';

import { type Compass, type Format, SYMBOL_PATTERNS } from '../latlon/internal';
import type { CoordinateSystem } from '../latlon/internal/coordinate-system';

import { parseUTM } from './parser';

// biome-ignore lint/style/useNamingConvention: acronym
export const systemUTM: CoordinateSystem = {
  name: 'Military Grid Reference System',

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

    return UTM.from(Point.point(LON, LAT)).toString();
  },
};
