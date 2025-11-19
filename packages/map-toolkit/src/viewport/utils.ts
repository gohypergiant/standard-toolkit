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
import type { GeoCoordinate, GetViewportSizeArgs } from './types';

const numberFormatter = Intl.NumberFormat('en-US');

// Earth's equatorial circumference in different units
const EARTH_CIRCUMFERENCE = {
  kilometers: 40075,
  meters: 40075000,
  nauticalmiles: 21639,
  miles: 24901,
  feet: 131479713,
} as const;

/**
 * Normalizes longitude to -180 to 180 range.
 * Handles any wraparound including multi-revolution values from globe view.
 *
 * @param lon - Longitude value to normalize
 * @returns Normalized longitude in range [-180, 180]
 *
 * @example
 * ```typescript
 * normalizeLon(361)   // returns 1
 * normalizeLon(-181)  // returns 179
 * normalizeLon(721)   // returns 1
 * ```
 */
function normalizeLon(lon: number): number {
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}

/**
 * Returns a formatted viewport size string i.e. `660 x 1,801 NM`
 *
 * Calculates the geographic distance of viewport bounds and formats it
 * with width x height in the specified unit. Handles longitude normalization
 * for globe view, International Date Line crossing, and multiple world copies
 * at low zoom levels.
 *
 * Uses different calculation strategies based on viewport characteristics:
 * - Normal zoom with small longitude spans: Great circle distance (accurate)
 * - Large longitude spans (≥170°): Proportional calculation to avoid antipodal singularities
 * - Very low zoom (<2) with narrow bounds: Detects multiple world copies scenario
 *
 * @param args - Viewport size calculation arguments
 * @param args.bounds - Geographic bounds [minLon, minLat, maxLon, maxLat]
 * @param args.zoom - Zoom level for detection of edge cases like multiple world copies
 * @param args.unit - Unit of distance measurement: `km | m | nm | mi | ft`. Defaults to `nm`
 * @param args.formatter - Number formatter for localization (defaults to en-US)
 * @returns Formatted string like "660 x 1,801 NM" or "-- x -- NM" if invalid
 *
 * @example
 * ```typescript
 * getViewportSize({ bounds: [-82, 22, -71, 52], zoom: 5, unit: 'nm' })
 * // returns "612 x 1,801 NM"
 *
 * getViewportSize({ bounds: [170, 50, -170, 60], zoom: 4, unit: 'km' })
 * // returns "2,050 x 1,111 KM" (handles dateline crossing)
 *
 * getViewportSize({ bounds: [-180, -85, -144, 85], zoom: 1.5, unit: 'nm' })
 * // returns "21,639 x 6,570 NM" (detects multiple world copies at low zoom)
 * ```
 */
export function getViewportSize({
  bounds,
  zoom,
  unit = 'nm',
  formatter = numberFormatter,
}: GetViewportSizeArgs) {
  const defaultValue = `-- x -- ${unit.toUpperCase()}`;

  if (bounds.every((b) => Number.isNaN(b))) {
    return defaultValue;
  }

  const [minLon, minLat, maxLon, maxLat] = bounds;

  // Normalize longitude values to handle globe view multi-revolution coordinates
  const normalizedMinLon = normalizeLon(minLon);
  let normalizedMaxLon = normalizeLon(maxLon);

  // Validate latitude bounds are within valid geographic ranges
  if (minLat < -90 || minLat > 90 || maxLat < -90 || maxLat > 90) {
    console.warn(
      'getViewportSize: Invalid bounds - latitude outside valid ranges',
      { bounds },
    );
    return defaultValue;
  }

  // Validate that min/max latitude are in correct order
  if (minLat > maxLat) {
    console.warn(
      'getViewportSize: Invalid bounds - minLat is greater than maxLat',
      { bounds },
    );
    return defaultValue;
  }

  // Handle International Date Line crossing
  // If minLon > maxLon after normalization, we're crossing the dateline
  // Unwrap maxLon to the positive side for correct distance calculation
  if (normalizedMinLon > normalizedMaxLon) {
    normalizedMaxLon += 360;
  }

  const southWest: GeoCoordinate = [normalizedMinLon, minLat];
  const southEast: GeoCoordinate = [normalizedMaxLon, minLat];
  const northWest: GeoCoordinate = [normalizedMinLon, maxLat];

  const lonSpan = normalizedMaxLon - normalizedMinLon;
  const maxCircumference =
    EARTH_CIRCUMFERENCE[UNIT_MAP[unit] as keyof typeof EARTH_CIRCUMFERENCE];

  // Calculate height using great circle distance (always reliable for latitude)
  const heightDistance = Math.round(
    distance(southWest, northWest, { units: UNIT_MAP[unit] }),
  );

  // For width, use different approaches based on longitude span and zoom level:
  // - Small spans (<170°): Use great circle distance (accurate)
  // - Large spans (≥170°): Calculate proportionally from Earth's circumference
  //   (great circle distance breaks down near antipodal points ~180°)
  // - Very low zoom + small span: Multiple world copies visible, use full circumference
  let widthDistance: number;

  // Detect multiple world copies scenario:
  // At very low zoom (< 2) with a small lonSpan (< 100°), getBounds() returns a narrow slice
  // but visually multiple world copies are shown, so the real width is Earth's circumference
  const isMultipleWorldCopies = zoom < 2 && lonSpan < 100;

  if (isMultipleWorldCopies) {
    // Multiple world copies visible: use full Earth circumference
    widthDistance = maxCircumference;
  } else if (lonSpan < 170) {
    // Normal case: great circle distance is accurate
    widthDistance = Math.round(
      distance(southWest, southEast, { units: UNIT_MAP[unit] }),
    );
  } else {
    // Large longitude span: calculate width as proportion of Earth's circumference
    // This avoids the antipodal point singularity in great circle calculations
    const fractionOfWorld = lonSpan / 360;
    widthDistance = Math.round(maxCircumference * fractionOfWorld);
  }

  // Final safety check: cap at Earth's circumference (should rarely trigger now)
  if (widthDistance > maxCircumference) {
    widthDistance = maxCircumference;
  }

  const width = formatter.format(widthDistance);
  const height = formatter.format(heightDistance);

  return `${width} x ${height} ${unit.toUpperCase()}`;
}
