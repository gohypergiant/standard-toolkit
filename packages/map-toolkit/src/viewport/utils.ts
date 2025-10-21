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

import { distance } from '@turf/distance';
import { UNIT_MAP } from './constants';
import type { GetViewportScaleArgs } from './types';

const numberFormatter = Intl.NumberFormat('en-US');

/**
 * Returns a formatter viewport bt i.e. `660 x 1,801 NMI`
 * @param {Object} args
 * @param {Object} args.bounds - 4 number tuple, i.e. `[-82, 22, -71, 52]`
 * @param {string} args.unit - Measure of distance, `km | m | nmi | mi | ft`. Defaults to `nmi`
 * @param {Intl.NumberFormat} args.formatter - [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
 * @returns
 */
export function getViewportScale({
  bounds,
  unit = 'nmi',
  formatter = numberFormatter,
}: GetViewportScaleArgs) {
  if (!bounds) {
    return `-- x -- ${unit.toUpperCase()}`;
  }

  const [minLon, minLat, maxLon, maxLat] = bounds;

  const width = formatter.format(
    Math.round(
      distance([minLat, minLon], [minLat, maxLon], {
        units: UNIT_MAP[unit],
      }),
    ),
  );

  const height = formatter.format(
    Math.round(
      distance([minLon, minLat], [minLon, maxLat], {
        units: UNIT_MAP[unit],
      }),
    ),
  );

  return `${width} x ${height} ${unit.toUpperCase()}`;
}
