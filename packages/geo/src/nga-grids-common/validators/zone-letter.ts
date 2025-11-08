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

import { GRID_ZONE_LETTER } from '../grid-zone.js';
import type { LexerTokens } from './lexer-tokens.js';

const LETTERS_WITHOUT_X = GRID_ZONE_LETTER.replace('X', '');

const ZONE_LETTER_OVERRIDE: Partial<Record<number, string>> = {
  // NGA.TR8350.2 §2-7: polar adjustments remove band X from these longitudinal zones
  32: LETTERS_WITHOUT_X,
  34: LETTERS_WITHOUT_X,
  36: LETTERS_WITHOUT_X,
  60: LETTERS_WITHOUT_X,
};

export const exceptionsForZone = ({ zoneLetter, zoneNumber }: LexerTokens) => {
  const letters = ZONE_LETTER_OVERRIDE[zoneNumber];

  if (!letters || typeof zoneLetter !== 'string') {
    return '';
  }

  return letters.includes(zoneLetter)
    ? ''
    : `Invalid zone letter "${zoneLetter}" for zone "${zoneNumber}"`;
};

export const invalidZoneLetter = ({ zoneLetter }: LexerTokens) =>
  typeof zoneLetter === 'string' && GRID_ZONE_LETTER.includes(zoneLetter)
    ? ''
    : `Invalid zone letter ${zoneLetter}`;

export const missingZoneLetter = ({ zoneLetter }: LexerTokens) =>
  zoneLetter.trim() ? '' : 'No zone letter found';
