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

import type { TokensMGRS } from './tokens-mgrs.js';

/**
 * Converts an MGRS coordinate object to its string representation.
 * Format: (ZoneNumber)(ZoneLetter)(GridCol)(GridRow)[(Easting)(Northing)]
 * Example: "18TYN9901117814" (with 5-digit precision)
 */
export function toStringFromMGRS(coord: TokensMGRS): string {
  const {
    zoneNumber,
    zoneLetter,
    gridCol,
    gridRow,
    easting,
    northing,
    precision,
  } = coord;

  // Pad zone number to 2 digits
  const zoneStr = String(zoneNumber).padStart(2, '0');

  // If precision is 0, only output the grid square
  if (precision === 0) {
    return `${zoneStr}${zoneLetter}${gridCol}${gridRow}`;
  }

  // Pad easting and northing to the precision length
  const eastingStr = String(easting).padStart(precision, '0');
  const northingStr = String(northing).padStart(precision, '0');

  return `${zoneStr}${zoneLetter}${gridCol}${gridRow}${eastingStr}${northingStr}`;
}
