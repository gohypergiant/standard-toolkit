// __private-exports
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

import { GRID_SQUARE_SIZE_METERS } from '../grid-column.js';
import { GRID_ZONE_LIMITS, type GridZoneLetter } from '../grid-zone.js';
import type { LexerTokens } from './lexer-tokens.js';

export const validatePrecisionMGRS = ({ easting, northing }: LexerTokens) => {
  const precision = `${easting}${northing}`;

  if (precision.length && !/^\d+$/.test(`${precision}`)) {
    return `Invalid (non-numeric) characters in easting/northing "${precision}"`;
  }

  const length = `${precision}`?.length || 0;

  if (length % 2 === 1) {
    return `Invalid easting/northing pair - must be even number of digits - "${precision}"`;
  }

  return length <= 10
    ? ''
    : `Invalid easting/northing precision - greater than 5 digits each - "${precision}"`;
};

export const validatePrecisionUTM = ({
  easting,
  northing,
  zoneLetter,
}: LexerTokens) => {
  if (easting.length && !/^\d+$/.test(`${easting}`)) {
    return `Invalid (non-numeric) characters in easting "${easting}"`;
  }

  if (northing.length && !/^\d+$/.test(`${northing}`)) {
    return `Invalid (non-numeric) characters in northing "${northing}"`;
  }

  if (easting.length > 6) {
    return `Invalid easting precision - greater than 6 digits - "${easting}"`;
  }

  if (northing.length > 7) {
    return `Invalid northing precision - greater than 7 digits - "${northing}"`;
  }

  const numericEasting = Number.parseInt(easting, 10);
  const numericNorthing = Number.parseInt(northing, 10);

  if (numericEasting < GRID_SQUARE_SIZE_METERS || numericEasting > 900000) {
    return `Invalid easting value - outside expected range 100000-900000 - "${numericEasting}"`;
  }

  const { max, min } =
    GRID_ZONE_LIMITS[zoneLetter as GridZoneLetter]?.northing ?? {};

  if (max == null || min == null) {
    throw new Error(
      [
        '\n\n',
        Array(88).fill('-').join(''),
        `Missing northing limits for zone letter "${zoneLetter}"`,
        'This should not be possible, if the previous validators have passed.',
        Array(88).fill('-').join(''),
        '\n\n',
      ].join('\n'),
    );
  }

  if (numericNorthing < min || numericNorthing > max) {
    return `Invalid northing value - outside expected range ${min}-${max} - "${numericNorthing}"`;
  }

  return '';
};
