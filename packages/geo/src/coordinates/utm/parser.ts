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

import Utm from 'geodesy/utm';
import { type ParseResults, parse } from '../latlon/internal/parse';
import { violation } from '../latlon/internal/violation';

type Match = [string, string, string, string];

const PATTERN_PARTS =
  /^((?:..)?)\s*(\w?)\s*(?:(\d+(?:\.\d*)?)?)\s*(?:(\d+(?:\.\d*)?)?)$/i;

/**
 * Creates a ParseResults error tuple with formatted message.
 *
 * @param message - Error message describing the parsing failure.
 * @returns ParseResults tuple with empty tokens array and formatted error message.
 *
 * @example
 * ```typescript
 * error('Invalid Zone number (65) found');
 * // [[], ['[ERROR] Invalid Zone number (65) found; expected format ZZ N|S DDD DDD.']]
 * ```
 */
const error = (message: string) =>
  [
    [],
    [`${violation(message)}; expected format ZZ N|S DDD DDD.`],
  ] as ParseResults;

/**
 * Validates UTM coordinate components and returns detailed error messages.
 *
 * Checks zone number (1-60), latitude band letter (N/S), easting, and northing values
 * for validity and returns specific error messages for each invalid component.
 *
 * @param input - UTM coordinate string to validate.
 * @returns ParseResults with empty tokens and detailed error message.
 *
 * @example
 * ```typescript
 * detailedErrors('65N 585628 4511644');
 * // [[], ['[ERROR] Invalid Zone number (65) found; expected format ZZ N|S DDD DDD.']]
 * ```
 *
 * @example
 * ```typescript
 * detailedErrors('18X 585628 4511644');
 * // [[], ['[ERROR] Invalid Latitude band letter (X) found; expected format ZZ N|S DDD DDD.']]
 * ```
 */
function detailedErrors(input: string) {
  const [zone, band, east, north] = (
    input.trim().replace(/\s+/g, ' ').match(PATTERN_PARTS) ?? []
  ).slice(1) as Match;

  if (!zone || +zone > 60 || +zone < 1) {
    return error(`Invalid Zone number (${zone}) found`);
  }

  if (!/[NS]/i.test(band)) {
    return error(`Invalid Latitude band letter (${band}) found`);
  }

  if (!(east || +east >= 0)) {
    return error(`Invalid Easting number (${east ?? ''}) found`);
  }

  if (!(north || +north >= 0)) {
    return error(`Invalid Northing number (${north ?? ''}) found`);
  }

  return error('Uncaught error condition.');
}

/**
 * Parses UTM (Universal Transverse Mercator) coordinate string into lat/lon format.
 *
 * Accepts UTM coordinates in format "ZZ N|S EEEEE NNNNN" where ZZ is zone (1-60),
 * N|S is hemisphere, EEEEE is easting, and NNNNN is northing. Converts to
 * latitude/longitude using the geodesy library.
 *
 * @param _format - Unused format parameter (kept for interface compatibility).
 * @param input - UTM coordinate string to parse.
 * @returns ParseResults with lat/lon tokens or error messages.
 *
 * @example
 * ```typescript
 * parseUTM(null, '18N 585628 4511644');
 * // [['40.7128', '/', '-74.0060'], []]
 * ```
 *
 * @example
 * ```typescript
 * parseUTM(null, '65N 585628 4511644');
 * // [[], ['[ERROR] Invalid Zone number (65) found; expected format ZZ N|S DDD DDD.']]
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: Format is unused
export function parseUTM(_format: any, input: string) {
  try {
    // Preprocess: ensure space between zone and hemisphere for geodesy parser
    // Convert "18N 585628 4511644" to "18 N 585628 4511644"
    // The geodesy library requires 4 space-separated elements
    const normalized = input.trim().replace(/^(\d{1,2})([NS])\s+/i, '$1 $2 ');

    const utm = Utm.parse(normalized);
    const latlon = utm.toLatLon();

    return parse(`${latlon.lat} / ${latlon.lon}`, 'LATLON');
  } catch (_) {
    return detailedErrors(input);
  }
}
