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

import {
  BEARINGS,
  type Compass,
  type Format,
  SYMBOL_PATTERNS,
  SYMBOLS,
} from '../internal';
import type { CoordinateSystem } from '../internal/coordinate-sytem';

import { parseDecimalDegrees } from './parser';

type ToFloat = [string, Compass];

export const systemDecimalDegrees: CoordinateSystem<ToFloat> = {
  name: 'Decimal Degrees',

  parse: parseDecimalDegrees,

  toFloat: ([num, bear]) =>
    Number.parseFloat(num) *
    (SYMBOL_PATTERNS.NEGATIVE_BEARINGS.test(bear) ? -1 : 1),

  toFormat: (format: Format, [left, right]: [number, number]) =>
    [left, right]
      .map(
        (num, index) =>
          `${Math.abs(num)} ${BEARINGS[format][index as 0 | 1][+(num < 0)]}`,
      )
      .join(` ${SYMBOLS.DIVIDER} `),
};
