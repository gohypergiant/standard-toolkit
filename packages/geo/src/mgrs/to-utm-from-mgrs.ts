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

import { computePrecision } from '../nga-grids-common/convert/compute-precision.js';
import { gridRowOffset } from '../nga-grids-common/convert/grid-row-offset.js';
import {
  GRID_COLUMN_CYCLE,
  GRID_COLUMN_LETTERS,
  GRID_COLUMN_SET_SIZE,
  GRID_SQUARE_SIZE_METERS,
} from '../nga-grids-common/grid-column.js';
import {
  GRID_ROW_CYCLE_METERS,
  GRID_ROW_LETTERS,
} from '../nga-grids-common/grid-row.js';
import { GRID_ZONE_LIMITS } from '../nga-grids-common/grid-zone.js';
import type { Precision } from '../nga-grids-common/convert/precision.js';
import type { TokensUTM } from '../utm/tokens-utm.js';
import type { TokensMGRS } from './tokens-mgrs.js';

/**
 * Get the easting offset for a grid column letter within a zone.
 */
function gridColumnToEasting(col: string, zoneNumber: number): number {
  const setIndex =
    ((zoneNumber - 1) % GRID_COLUMN_CYCLE) * GRID_COLUMN_SET_SIZE;
  const colIndex = GRID_COLUMN_LETTERS.indexOf(col);

  // Find position within the current set (wrapping around)
  const setPosition =
    (colIndex - setIndex + GRID_COLUMN_LETTERS.length) %
    GRID_COLUMN_LETTERS.length;

  // Each column is 100km wide
  return setPosition * GRID_SQUARE_SIZE_METERS;
}

/**
 * Get the northing offset for a grid row letter within a zone and latitude band.
 * Uses the zone letter to determine which 2M band we're in.
 */
function gridRowToNorthing(
  row: string,
  zoneNumber: number,
  zoneLetter: string,
  hemisphere: 'N' | 'S',
): number {
  const rowIndex = GRID_ROW_LETTERS.indexOf(row);

  // Get the northing range for this zone letter
  const limits = GRID_ZONE_LIMITS[zoneLetter as keyof typeof GRID_ZONE_LIMITS];

  // Northern hemisphere: odd zones start at A, even zones start at F
  // Southern hemisphere: offset by 5 letters
  const baseOffset = gridRowOffset(hemisphere, zoneNumber);

  const adjustedIndex =
    (rowIndex - baseOffset + GRID_ROW_LETTERS.length) % GRID_ROW_LETTERS.length;

  // Each row is 100km high, but it cycles every 2M meters
  // Find which 2M band contains the zone letter's northing range
  const minNorthing = limits.northing.min;
  const maxNorthing = limits.northing.max;

  // Calculate which 2M cycle we're in based on the zone letter's range
  const baseCycle = Math.floor(minNorthing / GRID_ROW_CYCLE_METERS);
  const baseNorthing =
    baseCycle * GRID_ROW_CYCLE_METERS + adjustedIndex * 100000;

  // Check if baseNorthing is within the zone letter's range
  if (baseNorthing >= minNorthing && baseNorthing < maxNorthing) {
    return baseNorthing;
  }

  // Try the next cycle
  const nextNorthing = baseNorthing + GRID_ROW_CYCLE_METERS;

  /* v8 ignore else */
  if (nextNorthing >= minNorthing && nextNorthing < maxNorthing) {
    return nextNorthing;
  }

  // Fallback: return baseNorthing even if out of range
  // This should not occur with valid MGRS inputs that pass validation,
  // but provides graceful degradation for edge cases
  // NOTE: should not be possible given valid input; purely to satisfy TypeScript
  /* v8 ignore next */
  return baseNorthing;
}

/**
 * Converts Military Grid Reference System (MGRS) coordinates to Universal Transverse Mercator (UTM) coordinates.
 *
 * This function expands the MGRS grid square reference and precision-limited easting/northing
 * into full UTM meter values within the same zone and latitude band.
 *
 * **Note:** This function performs no validation. Input coordinates should be validated
 * using the `parse` function before conversion.
 *
 * @see {@link file://./../../agents.md} for AI generation prompts used to create this function
 *
 * The conversion process:
 * 1. Determines hemisphere from the zone letter (N-X = Northern, C-M = Southern)
 * 2. Calculates the 100km grid square offset for the column letter
 * 3. Calculates the 100km grid square offset for the row letter
 * 4. Scales the MGRS easting/northing values based on their precision
 * 5. Combines offsets and scaled values to produce full UTM coordinates
 *
 * @param coord - MGRS coordinate with grid square identifier and precision-limited location
 * @param coord.zoneNumber - UTM zone number (1-60)
 * @param coord.zoneLetter - MGRS latitude band letter (C-X, excluding I and O)
 * @param coord.gridCol - 100km grid square column letter
 * @param coord.gridRow - 100km grid square row letter
 * @param coord.easting - Easting within grid square (0-99999, depending on precision)
 * @param coord.northing - Northing within grid square (0-99999, depending on precision)
 * @param coord.precision - Number of digits in easting/northing (1-5)
 * @param precisionOverride - Optional override for output UTM precision metadata
 *
 * @returns UTM coordinate with full easting/northing in meters
 *
 * @example
 * ```ts
 * // Convert 5-digit precision MGRS to UTM
 * const mgrs = { zoneNumber: 33, zoneLetter: "U", gridCol: "X", gridRow: "P",
 *                easting: 12345, northing: 67890, precision: 5 };
 * const utm = mgrsToUTM(mgrs);
 * // Returns: { zoneNumber: 33, zoneLetter: "U", hemisphere: "N",
 * //            easting: 412345, northing: 5767890, precision: { easting: 6, northing: 7 } }
 *
 * // Convert 3-digit precision MGRS to UTM
 * const mgrs2 = { zoneNumber: 18, zoneLetter: "T", gridCol: "W", gridRow: "N",
 *                 easting: 123, northing: 456, precision: 3 };
 * const utm2 = mgrsToUTM(mgrs2);
 * // Returns: { zoneNumber: 18, zoneLetter: "T", hemisphere: "N",
 * //            easting: 612300, northing: 4545600, precision: { easting: 6, northing: 7 } }
 * ```
 */
export function toUTMFromMGRS(
  coord: TokensMGRS,
  precisionOverride?: Precision,
): TokensUTM {
  const {
    easting,
    northing,
    gridCol,
    gridRow,
    precision,
    zoneNumber,
    zoneLetter,
  } = coord;

  // Determine hemisphere from zone letter
  const hemisphere = zoneLetter >= 'N' ? 'N' : 'S';

  // Get 100km grid square offsets
  const colEasting = gridColumnToEasting(gridCol, zoneNumber);
  const rowNorthing = gridRowToNorthing(
    gridRow,
    zoneNumber,
    zoneLetter,
    hemisphere,
  );

  // Scale precision values (MGRS precision is in digits, each digit = 10^(5-precision) meters)
  const scale = 10 ** (5 - precision);
  const scaledEasting = easting * scale;
  const scaledNorthing = northing * scale;

  return {
    // Compute full UTM coordinates
    easting: colEasting + scaledEasting,
    northing: rowNorthing + scaledNorthing,
    zoneNumber,
    zoneLetter,
    hemisphere,
    precision: {
      easting:
        precisionOverride?.easting ??
        computePrecision(colEasting + scaledEasting),
      northing:
        precisionOverride?.northing ??
        computePrecision(rowNorthing + scaledNorthing),
    },
  };
}
