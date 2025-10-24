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
import type {
  GeoCoordinate,
  GetViewportScaleArgs as GetViewportSizeArgs,
} from './types';

const numberFormatter = Intl.NumberFormat('en-US');

/**
 * Returns a formatter viewport size string i.e. `660 x 1,801 NMI`
 * @param {Object} args
 * @param {Object} args.bounds - 4 number tuple, i.e. `[-82, 22, -71, 52]`
 * @param {string} args.unit - Measure of distance, `km | m | nmi | mi | ft`. Defaults to `nmi`
 * @param {Intl.NumberFormat} args.formatter - [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
 * @returns
 */
export function getViewportSize({
  bounds,
  unit = 'nmi',
  formatter = numberFormatter,
}: GetViewportSizeArgs) {
  if (!bounds) {
    return `-- x -- ${unit.toUpperCase()}`;
  }

  const [minLon, minLat, maxLon, maxLat] = bounds;

  const southWest: GeoCoordinate = [minLon, minLat];
  const southEast: GeoCoordinate = [maxLon, minLat];
  const northWest: GeoCoordinate = [minLon, maxLat];

  const width = formatter.format(
    Math.round(distance(southWest, southEast, { units: UNIT_MAP[unit] })),
  );

  const height = formatter.format(
    Math.round(distance(southWest, northWest, { units: UNIT_MAP[unit] })),
  );

  return `${width} x ${height} ${unit.toUpperCase()}`;
}
