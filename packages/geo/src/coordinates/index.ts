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

/**
 * IDEA:
 *
 * 1. Capture a format into deterministic groups via regex
 * 2. Normalize captured data into common format (DD)
 * 3. Validation for format types and value ranges
 * 4. Create formatter for coordinates in other package?
 */

/**
 * TODOs:
 *
 * - Auto detect lon/lat ordering?
 *  - Some tricks we can
 *    - Regex for NS as first few chars
 *    - Regex for 3 digits
 *    - Regex for first digit > 90
 */

import { toDigits } from '@hypergiant/converters';
import { dd, dms } from './configurations';
import { isPositiveDirection, normalizeDirection, negate } from './utils';

export function parseDD(val: string) {
  const matches = matchDD(val);

  const latDirection = normalizeDirection(matches[0] || matches[4]);
  const lonDirection = normalizeDirection(matches[5] || matches[9]);
  const latPositive = isPositiveDirection(latDirection, matches[1]);
  const lonPositive = isPositiveDirection(lonDirection, matches[6]);

  const latParsed = toDigits(
    Number.parseFloat(`${matches[2]}${matches[3]}`),
    6,
  );

  const lonParsed = toDigits(
    Number.parseFloat(`${matches[7]}${matches[8]}`),
    6,
  );

  const latValue = latPositive ? latParsed : negate(latParsed);
  const lonValue = lonPositive ? lonParsed : negate(lonParsed);

  return [latValue, lonValue];
}

export function parseDMS() {}

export function parseCoordinates() {}

export function parseLongitude() {}

export function parseLatitude() {}
