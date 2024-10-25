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

import { expect, it, describe } from 'vitest';

import {
  createCoordinate,
  parseDecimalDegrees,
  parseDegreesDecimalMinutes,
  parseDegreesMinutesSeconds,
  parseMGRS,
} from '.';
import { coordinateSystems } from './coordinates/coordinate';

import { EXHAUSTIVE_ERRORS } from './coordinates/latlon/internal/exhaustive-errors';
import type { Format } from './coordinates/latlon/internal';
import { parseUTM } from './coordinates/utm/parser';

describe('creating a coordinate object', () => {
  it.each`
    system                    | format      | input                          | dd                                  | ddm                                    | dms                                    | mgrs
    ${coordinateSystems.dd}   | ${'LONLAT'} | ${'12.3456 E / 87.6543 N'}     | ${'12.3456 E / 87.6543 N'}          | ${'12 20.736 E / 87 39.258 N'}         | ${'12 20 44.16 E / 87 39 15.48 N'}     | ${'33XVT8787436351'}
    ${coordinateSystems.ddm}  | ${'LATLON'} | ${'11 33.02 N / 3 1.2 W'}      | ${'3.02 W / 11.550333333 N'}        | ${'3 1.2 W / 11 33.02 N'}              | ${'3 1 12 W / 11 33 1.1999988 N'}      | ${'30PVT9781976831'}
    ${coordinateSystems.dms}  | ${'LATLON'} | ${'11 22 33.44 N / 3 2 1.1 W'} | ${'3.033638889 W / 11.375955556 N'} | ${'3 2.01833334 W / 11 22.55733336 N'} | ${'3 2 1.1 W / 11 22 33.44 N'}         | ${'30PVT9632957549'}
    ${coordinateSystems.mgrs} | ${'LATLON'} | ${'30U WB 85358 69660'}        | ${'1.779008 W / 51.1719929 N'}      | ${'1 46.74048 W / 51 10.319574 N'}     | ${'1 46 44.4288 W / 51 10 19.17444 N'} | ${'30U WB 85358 69660'}
  `(
    'should create a coordinate in the $system.name system using the $format format',
    ({ format, input, system, ...expected }) => {
      const create = createCoordinate(system, format);

      const coord = create(input);

      expect(coord.valid).toBe(true);

      // explicit system and explicit format; needed because both will honor
      // the values provided at time of instantiation without them here
      expect(coord.dd('LONLAT')).toBe(expected.dd);
      expect(coord.dd('LATLON')).toBe(
        expected.dd.split(' / ').reverse().join(' / '),
      );

      expect(coord.ddm('LONLAT')).toBe(expected.ddm);
      expect(coord.ddm('LATLON')).toBe(
        expected.ddm.split(' / ').reverse().join(' / '),
      );

      expect(coord.dms('LONLAT')).toBe(expected.dms);
      expect(coord.dms('LATLON')).toBe(
        expected.dms.split(' / ').reverse().join(' / '),
      );

      expect(coord.mgrs()).toBe(expected.mgrs);
    },
  );

  const create = createCoordinate(coordinateSystems.dd, 'LATLON');

  it('should NOT create a coordinate; invalid coordinate input', () => {
    const coord = create('');

    expect(coord.valid).toBe(false);
  });

  it('should NOT create a coordinate; conflict between bearings and format', () => {
    const coord = create('1 E / 2 N');

    expect(coord.valid).toBe(false);
    expect(coord.errors).toEqual([
      '[ERROR] Mismatched formats: "LATLON" expected, "LONLAT" found.',
    ]);
  });

  it('should NOT create a coordinate; invalid format, expecting Decimal Degrees', () => {
    const coord = create('1 2 3 N / 5 6 7 W'); // too many numbers for DD

    expect(coord.valid).toBe(false);
    expect(coord.errors).toEqual(['[ERROR] Invalid coordinate value.']);
  });
});

describe.each`
  system   | parser
  ${'DD'}  | ${parseDecimalDegrees}
  ${'DDM'} | ${parseDegreesDecimalMinutes}
  ${'DMS'} | ${parseDegreesMinutesSeconds}
`('exhastive error checks for %s', ({ parser, system }) => {
  describe.each(['LATLON', 'LONLAT'] as [Format, Format])(
    'exhaustive errors for DD %s',
    (format) => {
      it.each(EXHAUSTIVE_ERRORS[system][format] as string[])('%s', (input) => {
        expect(parser(format, input)[1].length !== 0);
      });
    },
  );
});

describe('raw coordinate parsing', () => {
  describe('Decimal Degrees', () => {
    it.each`
      input                              | format      | tokens                               | errors
      ${'+27.5916 , -099.4523'}          | ${'LATLON'} | ${'27.5916 N / 99.4523 W'}           | ${[]}
      ${'-45.123456 , 75.654321'}        | ${'LATLON'} | ${'45.123456 S / 75.654321 E'}       | ${[]}
      ${'+45.0 , -75.0'}                 | ${'LATLON'} | ${'45 N / 75 W'}                     | ${[]}
      ${'90.0 , 180.0'}                  | ${'LATLON'} | ${'90 N / 180 E'}                    | ${[]}
      ${'-90.0 , +180.0'}                | ${'LATLON'} | ${'90 S / 180 E'}                    | ${[]}
      ${'+0.0 , -0.0'}                   | ${'LATLON'} | ${'0 N / 0 W'}                       | ${[]}
      ${'+27.123456789 , -99.987654321'} | ${'LATLON'} | ${'27.123456789 N / 99.987654321 W'} | ${[]}
      ${'+45.0  ,  -75.0'}               | ${'LATLON'} | ${'45 N / 75 W'}                     | ${[]}
      ${'180 , 90'}                      | ${'LONLAT'} | ${'180 E / 90 N'}                    | ${[]}
      ${'180 , 91'}                      | ${'LONLAT'} | ${''}                                | ${['[ERROR] Degrees value (91) exceeds max value (90).']}
      ${'181 , 90'}                      | ${'LONLAT'} | ${''}                                | ${['[ERROR] Degrees value (181) exceeds max value (180).']}
      ${'-33 / 22 / 3'}                  | ${'LATLON'} | ${''}                                | ${['[ERROR] Invalid coordinate value.']}
      ${'1 N / 2 E'}                     | ${'LONLAT'} | ${''}                                | ${['[ERROR] Mismatched formats: "LONLAT" expected, "LATLON" found.']}
    `('$format, $input', ({ format, input, ...expected }) => {
      const [tokens, errors] = parseDecimalDegrees(format, input);

      expect(errors).toStrictEqual(expected.errors);
      expect(tokens).toStrictEqual(expected.tokens.split(' ').filter(Boolean));
    });
  });

  describe('Degrees Decimal Minutes', () => {
    it.each`
      input                             | format      | tokens                         | errors
      ${`40° 46.302' N, 79° 56.207' W`} | ${'LATLON'} | ${'40 46.302 N / 79 56.207 W'} | ${[]}
      ${`90° 0' S, 180° 0' W`}          | ${'LATLON'} | ${'90 0 S / 180 0 W'}          | ${[]}
      ${`0° 0' N 0° 0' E`}              | ${'LATLON'} | ${'0 0 N / 0 0 E'}             | ${[]}
      ${`0° 0' N, 0° 0' E`}             | ${'LATLON'} | ${'0 0 N / 0 0 E'}             | ${[]}
      ${`15° 45' S, 75° 45' E`}         | ${'LATLON'} | ${'15 45 S / 75 45 E'}         | ${[]}
      ${`40°46.302'N,79°58'W`}          | ${'LATLON'} | ${'40 46.302 N / 79 58 W'}     | ${[]}
      ${`40° 26' N, 79° 56.2' W`}       | ${'LATLON'} | ${'40 26 N / 79 56.2 W'}       | ${[]}
      ${`40°26'N,79°58'W`}              | ${'LATLON'} | ${'40 26 N / 79 58 W'}         | ${[]}
      ${`40° 26' W , 79° 58' N`}        | ${'LONLAT'} | ${'40 26 W / 79 58 N'}         | ${[]}
      ${`12   ° 56 '  , 12° 56'`}       | ${'LATLON'} | ${'12 56 N / 12 56 E'}         | ${[]}
      ${`12   ° 56 '      12° 56'`}     | ${'LATLON'} | ${'12 56 N / 12 56 E'}         | ${[]}
      ${'12   ° 56       12° 56'}       | ${'LATLON'} | ${'12 56 N / 12 56 E'}         | ${[]}
      ${`89° 59.999" N, 179° 59.999"`}  | ${'LATLON'} | ${''}                          | ${['[ERROR] Seconds indicator (") not valid in Degree Decimal Minutes.']}
      ${`1° 2" 3°`}                     | ${'LONLAT'} | ${''}                          | ${['[ERROR] Seconds indicator (") not valid in Degree Decimal Minutes.']}
      ${`12   ° 56 '      12 56'`}      | ${'LATLON'} | ${''}                          | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`12   ° 56 '      12 56 `}      | ${'LATLON'} | ${''}                          | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`9° 8' 9 8 `}                   | ${'LATLON'} | ${''}                          | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`9° -8' 9° 8 `}                 | ${'LATLON'} | ${''}                          | ${['[ERROR] Negative value for non-degrees value found.']}
    `('$format, $input', ({ format, input, ...expected }) => {
      const [tokens, errors] = parseDegreesDecimalMinutes(format, input);

      expect(errors).toStrictEqual(expected.errors);
      expect(tokens).toStrictEqual(expected.tokens.split(' ').filter(Boolean));
    });
  });

  describe('Degrees Minutes Seconds', () => {
    it.each`
      input                                            | format      | tokens                                | errors
      ${'1 N 1'}                                       | ${'LATLON'} | ${'1 0 0 N / 1 0 0 E'}                | ${[]}
      ${'1 E 1'}                                       | ${'LONLAT'} | ${'1 0 0 E / 1 0 0 N'}                | ${[]}
      ${`40° 26' 46.302" N, 79° 58' 56.207" W`}        | ${'LATLON'} | ${'40 26 46.302 N / 79 58 56.207 W'}  | ${[]}
      ${`90° 0' 0" S, 180° 0' 0" W`}                   | ${'LATLON'} | ${'90 0 0 S / 180 0 0 W'}             | ${[]}
      ${`0° 0' 0" N 0° 0' 0" E`}                       | ${'LATLON'} | ${'0 0 0 N / 0 0 0 E'}                | ${[]}
      ${`0° 0' 0" N, 0° 0' 0" E`}                      | ${'LATLON'} | ${'0 0 0 N / 0 0 0 E'}                | ${[]}
      ${`15° 45' 30" S, 75° 45' 10" E`}                | ${'LATLON'} | ${'15 45 30 S / 75 45 10 E'}          | ${[]}
      ${`89° 59' 59.999" N, 179° 59' 59.999"`}         | ${'LATLON'} | ${'89 59 59.999 N / 179 59 59.999 E'} | ${[]}
      ${` + 89  ° 59   59.999 " N, 179° 59 59.999"  `} | ${'LATLON'} | ${'89 59 59.999 N / 179 59 59.999 E'} | ${[]}
      ${`40°26'46.302"N,79°58'56.207"W`}               | ${'LATLON'} | ${'40 26 46.302 N / 79 58 56.207 W'}  | ${[]}
      ${`40° 26' 46.3" N, 79° 58' 56.2" W`}            | ${'LATLON'} | ${'40 26 46.3 N / 79 58 56.2 W'}      | ${[]}
      ${`40°26'46"N,79°58'56"W`}                       | ${'LATLON'} | ${'40 26 46 N / 79 58 56 W'}          | ${[]}
      ${`40° 26' 46.302" W , 79° 58' 56.207" N`}       | ${'LONLAT'} | ${'40 26 46.302 W / 79 58 56.207 N'}  | ${[]}
      ${`12   ° 56 "  , 12° 56"`}                      | ${'LATLON'} | ${'12 0 56 N / 12 0 56 E'}            | ${[]}
      ${`12   ° 56 "      12° 56"`}                    | ${'LATLON'} | ${'12 0 56 N / 12 0 56 E'}            | ${[]}
      ${'12   ° 56       12° 56'}                      | ${'LATLON'} | ${'12 56 0 N / 12 56 0 E'}            | ${[]}
      ${`1° 2" 3°`}                                    | ${'LONLAT'} | ${'1 0 2 E / 3 0 0 N'}                | ${[]}
      ${`40° 26' 46.302" N 79° 58' 56.207" W`}         | ${'LATLON'} | ${'40 26 46.302 N / 79 58 56.207 W'}  | ${[]}
      ${`12   ° 56 "      12 56"`}                     | ${'LATLON'} | ${'12 0 56 N / 12 0 56 E'}            | ${[]}
      ${`12   ° 56 "      12 56 `}                     | ${'LATLON'} | ${'12 0 56 N / 12 56 0 E'}            | ${[]}
      ${`9° 8" 9 8 `}                                  | ${'LATLON'} | ${'9 0 8 N / 9 8 0 E'}                | ${[]}
      ${`9° 8' 9 8 `}                                  | ${'LATLON'} | ${''}                                 | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`91° 0' 0" N, 79° 58' 56" W`}                  | ${'LATLON'} | ${''}                                 | ${['[ERROR] Degrees value (91°) exceeds max value (90).']}
      ${`45° 60' 0" N, 75° 45' 10" W`}                 | ${'LATLON'} | ${''}                                 | ${["[ERROR] Minutes value (60') exceeds max value (59)."]}
      ${`45° 30' 61" N, 75° 45' 0" W`}                 | ${'LATLON'} | ${''}                                 | ${['[ERROR] Seconds value (61") exceeds max value (59.999999999).']}
      ${`45°0'0"N, 181° 0' 0" W`}                      | ${'LATLON'} | ${''}                                 | ${['[ERROR] Degrees value (181°) exceeds max value (180).']}
      ${`40.1° 26' 46" N, 79° 58' 56" W`}              | ${'LATLON'} | ${''}                                 | ${['[ERROR] Degrees value (40.1°) must not include decimal value.']}
      ${`+40° 26' 46.302" N, -79° 58' 56.207" E`}      | ${'LATLON'} | ${''}                                 | ${['[ERROR] Bearing (E) conflicts with negative number (-79°).']}
      ${`45° -10' 10" N, 75° 30' 10" W`}               | ${'LATLON'} | ${''}                                 | ${['[ERROR] Negative value for non-degrees value found.']}
      ${`45° -10' 10" N, 75° 30' 10" W`}               | ${'LONLAT'} | ${''}                                 | ${['[ERROR] Negative value for non-degrees value found.']}
      ${`45° -10' 10" N, 75° 30' 10" W extra stuff`}   | ${'LATLON'} | ${''}                                 | ${['[ERROR] Too many bearings.']}
      ${`45° -10' 10" N, 75° 30' 10" W 213`}           | ${'LATLON'} | ${''}                                 | ${['[ERROR] Too many numbers.']}
      ${`45° 10' 10" E, 75° 30' 10" N`}                | ${'LATLON'} | ${''}                                 | ${['[ERROR] Mismatched formats: "LATLON" expected, "LONLAT" found.']}
    `('$format, $input', ({ format, input, ...expected }) => {
      const [tokens, errors] = parseDegreesMinutesSeconds(format, input);

      expect(errors).toStrictEqual(expected.errors);
      expect(tokens).toStrictEqual(expected.tokens.split(' ').filter(Boolean));
    });
  });

  describe('Military Grid Reference System', () => {
    it.each`
      input                   | format      | tokens                         | errors
      ${'30U WB 85358 69660'} | ${'LATLON'} | ${'51.1719929 N / 1.779008 W'} | ${[]}
    `('$input -> $tokens', ({ format, input, ...expected }) => {
      const [tokens, errors] = parseMGRS(format, input);

      expect(errors).toStrictEqual(expected.errors);
      expect(tokens).toStrictEqual(expected.tokens.split(' ').filter(Boolean));
    });

    it.each`
      input         | error
      ${''}         | ${'No input provided'}
      ${'-1'}       | ${'Invalid UTM zone number (-1) found in grid zone designation'}
      ${'99'}       | ${'Invalid UTM zone number (99) found in grid zone designation'}
      ${'30I'}      | ${'Invalid Latitude band letter (I) found in grid zone designation'}
      ${'30O'}      | ${'Invalid Latitude band letter (O) found in grid zone designation'}
      ${'30K OI'}   | ${'Invalid 100K m square identification (OI) found'}
      ${'30X 0 0'}  | ${'Invalid numerical location (0,0) found'}
      ${'30X HH 0'} | ${'Invalid numerical location (0,) found'}
    `('$input -> $error', ({ input, ...expected }) => {
      const [tokens, errors] = parseMGRS('LATLON', input);

      expect(errors).toStrictEqual(
        expected.error
          ? [`[ERROR] ${expected.error}; expected format DDZ AA DDD DDD.`]
          : [],
      );
      expect(tokens).toStrictEqual([]);
    });
  });

  describe('Universal Transverse Mercator', () => {
    it.each`
      input                    | format      | tokens                           | errors
      ${'30 N 585358 5669660'} | ${'LATLON'} | ${'51.1719929 N / 1.779008 W'}   | ${[]}
      ${'18 N 585628 4511322'} | ${'LATLON'} | ${'40.7483961 N / 73.9857049 W'} | ${[]}
    `('$input -> $tokens', ({ format, input, ...expected }) => {
      const [tokens, errors] = parseUTM(format, input);

      expect(errors).toStrictEqual(expected.errors);
      expect(tokens).toStrictEqual(expected.tokens.split(' ').filter(Boolean));
    });

    it.each`
      input       | error
      ${''}       | ${'Invalid Zone number () found'}
      ${'-1'}     | ${'Invalid Zone number (-1) found'}
      ${'99'}     | ${'Invalid Zone number (99) found'}
      ${'30U'}    | ${'Invalid Latitude band letter (U) found'}
      ${'30 N'}   | ${'Invalid Easting number () found'}
      ${'30 N 0'} | ${'Invalid Northing number () found'}
    `('$input -> $error', ({ input, ...expected }) => {
      const [tokens, errors] = parseUTM('LATLON', input);

      expect(errors).toStrictEqual(
        expected.error
          ? [`[ERROR] ${expected.error}; expected format ZZ N|S DDD DDD.`]
          : [],
      );
      expect(tokens).toStrictEqual([]);
    });
  });
});
