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

import { GRID_ROW_LETTERS } from '../grid-row.js';
import { GRID_ZONE_LIMITS, type GridZoneLetter } from '../grid-zone.js';
import type { LexerTokens } from './lexer-tokens.js';

const ROW_SETS = [GRID_ROW_LETTERS, 'FGHJKLMNPQRSTUVABCDE'];
const SQUARE_ROWS = GRID_ROW_LETTERS;

export const invalidSquareRow = ({ gridRow }: LexerTokens) =>
  gridRow && typeof gridRow === 'string' && SQUARE_ROWS.includes(gridRow)
    ? ''
    : `Invalid grid square row letter "${gridRow}"`;

export const missingSquareRow = ({ gridRow }: LexerTokens) =>
  gridRow ? '' : 'No grid square row found';

export function validateRowForZone({
  gridRow,
  zoneLetter,
  zoneNumber,
}: LexerTokens) {
  const { max, min } = GRID_ZONE_LIMITS[zoneLetter as GridZoneLetter].northing;

  if (!Number.isFinite(zoneNumber) || min === undefined) {
    return '';
  }

  const rowSetIndex =
    ((((zoneNumber as number) - 1) % ROW_SETS.length) + ROW_SETS.length) %
    ROW_SETS.length;
  const rowSet = `${ROW_SETS[rowSetIndex]}`;
  const rowIndex = rowSet?.indexOf(gridRow as string);

  const baseNorthing = rowIndex * 100_000;
  const cycle = 2_000_000;

  let candidate = baseNorthing;

  if (candidate < min) {
    const diff = min - candidate;
    const cyclesToAdd = Math.ceil(diff / cycle);

    candidate += cyclesToAdd * cycle;
  }

  if (candidate >= min && candidate < max) {
    return '';
  }

  // NOTE: this code is theoretically necessary but not reachable in practice
  //  it is purely defensive code, an attempt to "cycle down" if `candidate`
  //  overshot the zone maximum. the branch is unreachable with valid MGRS
  //  geometry due to the mismatch between zone heights (~800km) and the row
  //  cycle period (2000km).

  // candidate -= cycle;
  // if (candidate >= min && candidate < max) {
  //   return '';
  // }

  return `Invalid grid square row "${gridRow}" for zone letter "${zoneLetter}"`;
}
