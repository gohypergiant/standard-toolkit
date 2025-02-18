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
  SYMBOLS,
  SYMBOL_PATTERNS,
} from '../internal';
import type { CoordinateSystem } from '../internal/coordinate-sytem';

import { parseDegreesDecimalMinutes } from './parser';

type ToFloat = [string, string, Compass];

export const systemDegreesDecimalMinutes: CoordinateSystem<ToFloat> = {
  name: 'Degrees Decimal Minutes',

  parse: parseDegreesDecimalMinutes,

  toFloat: ([degrees, minutes, bear]) =>
    Number.parseFloat(
      (
        (Number.parseFloat(degrees) + Number.parseFloat(minutes) / 60) *
        (SYMBOL_PATTERNS.NEGATIVE_BEARINGS.test(bear) ? -1 : 1)
      ).toFixed(9),
    ),

  toFormat: (format: Format, [left, right]: [number, number]) => {
    return [left, right]
      .map((num, index) => {
        const abs = Math.abs(num);
        const deg = Math.floor(abs);
        const min = Number.parseFloat(((abs - deg) * 60).toFixed(9));

        return `${deg} ${min} ${BEARINGS[format][index as 0 | 1][+(num < 0)]}`;
      })
      .join(` ${SYMBOLS.DIVIDER} `);
  },
};
