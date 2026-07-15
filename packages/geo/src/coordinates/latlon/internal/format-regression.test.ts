/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { describe, expect, it } from 'vitest';
import { formatDecimalDegrees } from '../decimal-degrees/formatter';
import { formatDegreesDecimalMinutes } from '../degrees-decimal-minutes/formatter';
import { formatDegreesMinutesSeconds } from '../degrees-minutes-seconds/formatter';

// Byte-identical regression guard for the DD/DDM/DMS string formatters.
// These expectations are captured from the pre-refactor formatters; the
// composition-over-parts refactor (task 1.3) must keep every string green.
// The spread covers 0, negatives, a seconds-carry case, a minutes-carry case,
// and the 80°S / 84°N grid boundary latitudes.

describe('DD/DDM/DMS byte-identical regression', () => {
  it.each`
    label                    | latitude      | longitude     | withOrdinal | expected
    ${'zero'}                | ${0}          | ${0}          | ${false}    | ${'0.000000°, 0.000000°'}
    ${'zero (ordinal)'}      | ${0}          | ${0}          | ${true}     | ${'0.000000° N, 0.000000° E'}
    ${'positive'}            | ${37.7749}    | ${-122.4194}  | ${true}     | ${'37.774900° N, 122.419400° W'}
    ${'negative (signed)'}   | ${-12.345678} | ${-23.456789} | ${false}    | ${'-12.345678°, -23.456789°'}
    ${'negative (ordinal)'}  | ${-12.345678} | ${-23.456789} | ${true}     | ${'12.345678° S, 23.456789° W'}
    ${'minutes carry'}       | ${40.9999995} | ${-74.006}    | ${false}    | ${'41.000000°, -74.006000°'}
    ${'north boundary 84°N'} | ${84}         | ${0}          | ${true}     | ${'84.000000° N, 0.000000° E'}
    ${'south boundary 80°S'} | ${-80}        | ${0}          | ${true}     | ${'80.000000° S, 0.000000° E'}
  `(
    'formatDecimalDegrees $label',
    ({ latitude, longitude, withOrdinal, expected }) => {
      expect(
        formatDecimalDegrees([latitude, longitude], {
          prefix: '',
          suffix: '',
          separator: ', ',
          withOrdinal,
        }),
      ).toBe(expected);
    },
  );

  it.each`
    label                    | latitude      | longitude     | withOrdinal | expected
    ${'zero'}                | ${0}          | ${0}          | ${false}    | ${"0° 0.0000', 0° 0.0000'"}
    ${'zero (ordinal)'}      | ${0}          | ${0}          | ${true}     | ${"0° 0.0000' N, 0° 0.0000' E"}
    ${'positive'}            | ${37.7749}    | ${-122.4194}  | ${false}    | ${"37° 46.4940', 122° 25.1640'"}
    ${'negative (ordinal)'}  | ${-12.345678} | ${-23.456789} | ${true}     | ${"12° 20.7407' S, 23° 27.4073' W"}
    ${'minutes carry'}       | ${40.9999995} | ${-74.006}    | ${false}    | ${"41° 0.0000', 74° 0.3600'"}
    ${'north boundary 84°N'} | ${84}         | ${0}          | ${true}     | ${"84° 0.0000' N, 0° 0.0000' E"}
    ${'south boundary 80°S'} | ${-80}        | ${0}          | ${true}     | ${"80° 0.0000' S, 0° 0.0000' E"}
  `(
    'formatDegreesDecimalMinutes $label',
    ({ latitude, longitude, withOrdinal, expected }) => {
      expect(
        formatDegreesDecimalMinutes([latitude, longitude], {
          prefix: '',
          suffix: '',
          separator: ', ',
          withOrdinal,
        }),
      ).toBe(expected);
    },
  );

  it.each`
    label                    | latitude                          | longitude     | withOrdinal | expected
    ${'zero'}                | ${0}                              | ${0}          | ${false}    | ${"0° 0' 0.00″, 0° 0' 0.00″"}
    ${'zero (ordinal)'}      | ${0}                              | ${0}          | ${true}     | ${"0° 0' 0.00″ N, 0° 0' 0.00″ E"}
    ${'positive'}            | ${37.7749}                        | ${-122.4194}  | ${false}    | ${"37° 46' 29.64″, 122° 25' 9.84″"}
    ${'negative (ordinal)'}  | ${-12.345678}                     | ${-23.456789} | ${true}     | ${"12° 20' 44.44″ S, 23° 27' 24.44″ W"}
    ${'seconds carry'}       | ${40 + (30 * 60 + 59.999) / 3600} | ${0}          | ${false}    | ${"40° 31' 0.00″, 0° 0' 0.00″"}
    ${'minutes carry'}       | ${40.99999999}                    | ${-74.006}    | ${false}    | ${"41° 0' 0.00″, 74° 0' 21.60″"}
    ${'north boundary 84°N'} | ${84}                             | ${0}          | ${true}     | ${"84° 0' 0.00″ N, 0° 0' 0.00″ E"}
    ${'south boundary 80°S'} | ${-80}                            | ${0}          | ${true}     | ${"80° 0' 0.00″ S, 0° 0' 0.00″ E"}
  `(
    'formatDegreesMinutesSeconds $label',
    ({ latitude, longitude, withOrdinal, expected }) => {
      expect(
        formatDegreesMinutesSeconds([latitude, longitude], {
          prefix: '',
          suffix: '',
          separator: ', ',
          withOrdinal,
        }),
      ).toBe(expected);
    },
  );
});
