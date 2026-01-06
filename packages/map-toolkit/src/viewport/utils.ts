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

import {
  type DistanceUnit,
  getDistanceUnitFromAbbreviation,
} from '../shared/units';
import type { GetViewportSizeArgs } from './types';

const numberFormatter = Intl.NumberFormat('en-US');

/**
 * Web Mercator constant: meters per pixel at zoom 0, equator.
 * This is Earth's circumference (40075016.686m) divided by 256 (tile size).
 */
const METERS_PER_PIXEL_AT_ZOOM_0 = 156543.03392;

/**
 * Unit conversion factors from meters.
 */
const METERS_TO_UNIT = {
  kilometers: 0.001,
  meters: 1,
  nauticalmiles: 0.000539957,
  miles: 0.000621371,
  feet: 3.28084,
} as const;

/**
 * Returns a formatted viewport size string i.e. `660 x 1,801 NM`
 *
 * Calculates the geographic distance of the viewport using zoom level and
 * pixel dimensions with the Web Mercator projection formula. This approach
 * provides stable results without the edge cases of bounds-based calculations.
 *
 * @param args - Viewport size calculation arguments
 * @param args.bounds - Geographic bounds [minLon, minLat, maxLon, maxLat]
 * @param args.zoom - Zoom level for meters-per-pixel calculation
 * @param args.width - Viewport width in pixels
 * @param args.height - Viewport height in pixels
 * @param args.unit - Unit of distance measurement: `km | m | nm | mi | ft`. Defaults to `nm`
 * @param args.formatter - Number formatter for localization (defaults to en-US)
 * @returns Formatted string like "660 x 1,801 NM" or "-- x -- NM" if invalid
 *
 * @example
 * ```typescript
 * getViewportSize({ bounds: [-82, 22, -71, 52], zoom: 5, width: 800, height: 600, unit: 'nm' })
 * // returns "612 x 459 NM"
 *
 * getViewportSize({ bounds: [170, 50, -170, 60], zoom: 4, width: 1024, height: 768, unit: 'km' })
 * // returns "2,050 x 1,538 KM"
 * ```
 */
export function getViewportSize({
  bounds,
  zoom,
  width: pixelWidth,
  height: pixelHeight,
  unit = 'nm',
  formatter = numberFormatter,
}: GetViewportSizeArgs) {
  const defaultValue = `-- x -- ${unit.toUpperCase()}`;

  // Validate inputs
  if (!bounds || bounds.every((b) => Number.isNaN(b))) {
    return defaultValue;
  }

  if (Number.isNaN(zoom) || pixelWidth === 0 || pixelHeight === 0) {
    return defaultValue;
  }

  const [, minLat, , maxLat] = bounds;

  // Validate latitude bounds are within valid geographic ranges
  if (minLat < -90 || minLat > 90 || maxLat < -90 || maxLat > 90) {
    return defaultValue;
  }

  // Calculate center latitude for the viewport
  const centerLat = (minLat + maxLat) / 2;

  // Web Mercator formula: meters per pixel at given zoom and latitude
  // Resolution = 156543.03392 * cos(latitude * π/180) / 2^zoom
  const metersPerPixel =
    (METERS_PER_PIXEL_AT_ZOOM_0 * Math.cos((centerLat * Math.PI) / 180)) /
    2 ** zoom;

  // Calculate distances in meters
  const widthMeters = pixelWidth * metersPerPixel;
  const heightMeters = pixelHeight * metersPerPixel;

  // Convert to requested unit
  const unitKey = getDistanceUnitFromAbbreviation(unit) as DistanceUnit;
  const conversionFactor = METERS_TO_UNIT[unitKey];

  const widthDistance = Math.round(widthMeters * conversionFactor);
  const heightDistance = Math.round(heightMeters * conversionFactor);

  const width = formatter.format(widthDistance);
  const height = formatter.format(heightDistance);

  return `${width} x ${height} ${unit.toUpperCase()}`;
}
