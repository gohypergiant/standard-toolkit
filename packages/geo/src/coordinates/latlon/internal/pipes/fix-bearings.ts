// __private-exports
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

import { BEARINGS, SYMBOL_PATTERNS, SYMBOLS, type Format } from '..';
import type { Tokens } from '../lexer';
import type { PipeResult } from '../pipes';

const orthogonal = {
  N: BEARINGS.LON,
  S: BEARINGS.LON,
  E: BEARINGS.LAT,
  W: BEARINGS.LAT,
};

const bearingConflictsWithNumber = (tokens: Tokens) =>
  tokens[0] &&
  tokens[1] &&
  SYMBOL_PATTERNS.NEGATIVE_SIGN.test(tokens[1]) &&
  SYMBOL_PATTERNS.NSEW.test(tokens[0]) &&
  !SYMBOL_PATTERNS.NEGATIVE_BEARINGS.test(tokens[0]);

const bePositive = (n: string) => n.replace(SYMBOL_PATTERNS.NEGATIVE_SIGN, '');

const conflict = ([a, b]: Tokens) =>
  `Bearing (${a}) conflicts with negative number (${b}).`;

/**
 * Normalize bearings - negative and positive numeric values to NSEW - and
 * positioning of bearings - after the numeric values - and fill in any missing
 * bearings if only one is provided.
 */
export function fixBearings(tokens: Tokens, format?: Format): PipeResult {
  const [left, right] = [
    tokens.slice(0, tokens.indexOf(SYMBOLS.DIVIDER)),
    tokens.slice(1 + tokens.indexOf(SYMBOLS.DIVIDER)),
  ].map(moveBearingsToHead) as [Tokens, Tokens];

  if (bearingConflictsWithNumber(left)) {
    return [[], conflict(left)];
  }

  if (bearingConflictsWithNumber(right)) {
    return [[], conflict(right)];
  }

  const [leftHasBearing, rightHasBearing] = [left, right].map(
    (list) => !!(list?.[0] && SYMBOL_PATTERNS.NSEW.test(list[0])),
  );

  let leftBearing = '';
  let rightBearing = '';

  if (leftHasBearing && rightHasBearing) {
    leftBearing = left.shift() ?? '';
    rightBearing = right.shift() ?? '';
  } else if (leftHasBearing) {
    leftBearing = left.shift() ?? '';
    rightBearing =
      orthogonal[leftBearing as keyof typeof orthogonal][
        +SYMBOL_PATTERNS.NEGATIVE_SIGN.test(right[0] ?? '') as 0 | 1
      ];
  } else if (rightHasBearing) {
    rightBearing = right.shift() ?? '';
    leftBearing =
      orthogonal[rightBearing as keyof typeof orthogonal][
        +SYMBOL_PATTERNS.NEGATIVE_SIGN.test(right[0] ?? '') as 0 | 1
      ];
  } else if (format) {
    leftBearing = `${BEARINGS[format][0][+SYMBOL_PATTERNS.NEGATIVE_SIGN.test(`${left[0]}`)]}`;
    rightBearing = `${BEARINGS[format][1][+SYMBOL_PATTERNS.NEGATIVE_SIGN.test(`${right[0]}`)]}`;
  } else {
    // neither exist
    return [[...left, SYMBOLS.DIVIDER, ...right], false];
  }

  return [
    [
      ...left.map(bePositive),
      leftBearing,
      SYMBOLS.DIVIDER,
      ...right.map(bePositive),
      rightBearing,
    ],
    false,
  ];
}

/**
 * Move the bearings indicators to the first element in the list - in this
 * module only - so that it is easier to work with; moving a bearing to the
 * "head" allows for `push()` of subsequent number processing will keep the
 * order of the numeric values intact.
 */
function moveBearingsToHead(coord: Tokens) {
  return coord.reduce((acc, t) => {
    if (/\d/.test(t)) {
      acc.push(t);
    } else {
      acc.unshift(t);
    }

    return acc;
  }, [] as Tokens);
}
