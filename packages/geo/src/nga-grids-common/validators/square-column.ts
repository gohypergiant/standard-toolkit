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

import { GRID_COLUMN_LETTERS } from '../grid-column.js';
import type { LexerTokens } from './lexer-tokens.js';

const COLUMN_SETS = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'];
const NORWAY_ZONE_32_COLUMNS = 'JKLMN';
const SVALBARD_COLUMN_SETS: Record<number, string> = {
  31: 'QRSTUV',
  33: 'ABCDEFGH',
  35: 'JKLMNPQR',
  37: 'STUVWXYZ',
};
const SVALBARD_EXCLUDED_ZONES = new Set([32, 34, 36]);

export const invalidSquareColumn = ({ gridCol }: LexerTokens) =>
  gridCol &&
  typeof gridCol === 'string' &&
  GRID_COLUMN_LETTERS.includes(gridCol)
    ? ''
    : `Invalid grid square column letter "${gridCol}"`;

export const missingSquareColumn = ({ gridCol }: LexerTokens) =>
  gridCol ? '' : 'No grid square column found';

export const validateColForZone = ({
  gridCol,
  zoneLetter,
  zoneNumber,
}: LexerTokens) => {
  if (!Number.isFinite(zoneNumber)) {
    return '';
  }

  let columnSet = COLUMN_SETS[(zoneNumber - 1) % COLUMN_SETS.length];

  if (zoneLetter === 'V' && zoneNumber === 32) {
    columnSet = NORWAY_ZONE_32_COLUMNS;
  }

  if (zoneLetter === 'X') {
    const svalbardColumns = SVALBARD_COLUMN_SETS[zoneNumber];

    if (svalbardColumns) {
      columnSet = svalbardColumns;
    } else if (SVALBARD_EXCLUDED_ZONES.has(zoneNumber)) {
      return `Invalid grid square column "${gridCol}" for zone "${zoneNumber}"`;
    }
  }

  return gridCol && typeof gridCol === 'string' && columnSet?.includes(gridCol)
    ? ''
    : `Invalid grid square column "${gridCol}" for zone "${zoneNumber}"`;
};
