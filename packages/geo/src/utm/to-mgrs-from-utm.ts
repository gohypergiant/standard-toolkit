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

import { gridRowOffset } from '../nga-grids-common/convert/grid-row-offset.js';
import { DEFAULT_MGRS_PRECISION } from '../nga-grids-common/convert/precision.js';
import {
  GRID_COLUMN_CYCLE,
  GRID_COLUMN_LETTERS,
  GRID_COLUMN_SET_SIZE,
  GRID_SQUARE_SIZE_METERS,
} from '../nga-grids-common/grid-column.js';
import { GRID_ROW_LETTERS } from '../nga-grids-common/grid-row.js';
import type { TokensMGRS } from '../mgrs/tokens-mgrs.js';
import type { TokensUTM } from './tokens-utm.js';

/**
 * Get the grid column letter for a UTM easting value.
 */
function eastingToGridColumn(easting: number, zoneNumber: number): string {
  const setIndex =
    ((zoneNumber - 1) % GRID_COLUMN_CYCLE) * GRID_COLUMN_SET_SIZE;
  const colIndex =
    Math.floor(easting / GRID_SQUARE_SIZE_METERS) % GRID_COLUMN_SET_SIZE;
  const letterIndex = (setIndex + colIndex) % GRID_COLUMN_LETTERS.length;

  return `${GRID_COLUMN_LETTERS[letterIndex]}`;
}

/**
 * Get the grid row letter for a UTM northing value.
 */
function northingToGridRow(
  northing: number,
  zoneNumber: number,
  hemisphere: 'N' | 'S',
): string {
  const baseOffset = gridRowOffset(hemisphere, zoneNumber);

  const rowIndex =
    Math.floor(northing / GRID_SQUARE_SIZE_METERS) % GRID_ROW_LETTERS.length;
  const letterIndex = (rowIndex + baseOffset) % GRID_ROW_LETTERS.length;

  return `${GRID_ROW_LETTERS[letterIndex]}`;
}

/**
 * Converts Universal Transverse Mercator (UTM) coordinates to Military Grid Reference System (MGRS) coordinates.
 *
 * This function reduces full UTM easting/northing values to a grid square identifier
 * plus a precision-limited location within that square.
 *
 * **Note:** This function performs no validation. Input coordinates should be validated
 * using the `parse` function before conversion.
 *
 * @see {@link file://./../../agents.md} for AI generation prompts used to create this function
 *
 * The conversion process:
 * 1. Determines the 100km grid square column letter from the easting value
 * 2. Determines the 100km grid square row letter from the northing value
 * 3. Calculates the position within the grid square
 * 4. Truncates (not rounds) the position to the specified precision
 *
 * @param coord - UTM coordinate with full easting/northing in meters
 * @param coord.zoneNumber - UTM zone number (1-60)
 * @param coord.zoneLetter - MGRS latitude band letter (C-X, excluding I and O)
 * @param coord.hemisphere - Hemisphere indicator ("N" or "S")
 * @param coord.easting - Full easting value in meters
 * @param coord.northing - Full northing value in meters
 * @param precision - Number of digits for MGRS easting/northing (1-5, default 5 = 1m precision)
 *   - 5: 1 meter precision (5 digits each for easting/northing)
 *   - 4: 10 meter precision
 *   - 3: 100 meter precision
 *   - 2: 1 kilometer precision
 *   - 1: 10 kilometer precision
 *
 * @returns MGRS coordinate with grid square identifier and truncated position
 *
 * @example
 * ```ts
 * // Convert UTM to 5-digit (1m) precision MGRS
 * const utm = { zoneNumber: 33, zoneLetter: "U", hemisphere: "N",
 *               easting: 412345, northing: 5767890 };
 * const mgrs = utmToMGRS(utm, 5);
 * // Returns: { zoneNumber: 33, zoneLetter: "U", gridCol: "X", gridRow: "P",
 * //            easting: 12345, northing: 67890, precision: 5 }
 *
 * // Convert UTM to 3-digit (100m) precision MGRS
 * const mgrs2 = utmToMGRS(utm, 3);
 * // Returns: { zoneNumber: 33, zoneLetter: "U", gridCol: "X", gridRow: "P",
 * //            easting: 123, northing: 678, precision: 3 }
 * ```
 */
export function toMGRSFromUTM(
  coord: TokensUTM,
  precision: number = DEFAULT_MGRS_PRECISION,
): TokensMGRS {
  const { easting, northing, zoneNumber, zoneLetter, hemisphere } = coord;

  // Truncate to precision (not round)
  const scale = 10 ** (DEFAULT_MGRS_PRECISION - precision);

  return {
    easting: Math.floor((easting % GRID_SQUARE_SIZE_METERS) / scale),
    northing: Math.floor((northing % GRID_SQUARE_SIZE_METERS) / scale),
    zoneNumber,
    zoneLetter,
    gridCol: eastingToGridColumn(easting, zoneNumber),
    gridRow: northingToGridRow(northing, zoneNumber, hemisphere),
    precision,
  };
}
