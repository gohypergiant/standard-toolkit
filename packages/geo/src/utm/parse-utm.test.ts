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

import { describe, expect, it } from 'vitest';
import { ParseError } from '../internal/parse-error.js';
import { parseUTM } from './parse-utm.js';

interface CreateCoord {
  zoneNum?: string;
  zoneCha?: string;
  gridCol?: string;
  gridRow?: string;
  east?: number | string;
  north?: number | string;
}

const expectingErrors = (input: string) =>
  (parseUTM(input) as ParseError).message;

// NOTE: <ZoneNumber><ZoneLetter>[<Easting><Northing>]
const create = ({ zoneNum, zoneCha, east, north }: CreateCoord): string =>
  `${zoneNum ?? '33'}${zoneCha ?? 'X'} ${east ?? ''} ${north ?? ''}`.trim();
const prop = (prop: string, tests: string[]) =>
  tests.map((val: string) => create({ [prop]: val }));

const prepareTestCases = (cases: Record<string, string[]>) =>
  Object.entries(cases)
    .flatMap(([error, inputs]) => inputs.map((input) => [input, error]))
    .map(([input, error]) => [input, error]);

describe('parse UTM', () => {
  it('should confirm a valid coordinate format', () => {
    expect(parseUTM(create({}), { skipValidation: true })).toBe(true);
  });

  describe('checking for errors', () => {
    it.each(['', undefined, {}])('should error on "%s"', (input) => {
      expect(
        parseUTM(input as unknown as string, { skipValidation: true }),
      ).toBe(false);
      expect(expectingErrors(input as unknown as string)).toContain(
        'Input must be a non-empty string',
      );
    });

    describe('format and specific error checks', () => {
      const formatErrors = prepareTestCases({
        'No zone number found': prop('zoneNum', ['A', 'Y', 'Z', '.', ' ']),

        'Invalid zone number': prop('zoneNum', ['-1', '0', '61', '99']),

        'No zone letter found': prop('zoneCha', [' ', '']),

        'Invalid zone letter': prop('zoneCha', [
          '_',
          '-',
          'I',
          'O',
          '0',
          '1',
          '9',
        ]),

        'Invalid (non-numeric) characters in easting': [
          create({ east: '-1', north: '0' }),
          create({ east: 'A', north: '1' }),
          create({ east: '.', north: '1' }),
        ],

        'Invalid (non-numeric) characters in northing': [
          create({ east: '100000', north: '-1' }),
          create({ east: '100000', north: 'A' }),
          create({ east: '100000', north: '.' }),
        ],

        'Invalid easting value - outside expected range 100000-900000': [
          //
          create({ east: '900001', north: '2' }), // max value + 1
          create({ east: '999999', north: '2' }), // well above max
          create({ east: '9999', north: '2' }), // below min
          create({ east: '0', north: '2' }), // zero
        ],

        'Invalid northing value - outside expected range': [
          // below min for band
          create({ east: '100000', north: 1100000 - 1, zoneCha: 'C' }),
          create({ east: '100000', north: 2000000 - 1, zoneCha: 'D' }),
          create({ east: '100000', north: 2800000 - 1, zoneCha: 'E' }),
          create({ east: '100000', north: 7000000 - 1, zoneCha: 'W' }),
          create({ east: '100000', north: 7900000 - 1, zoneCha: 'X' }),
          // above max for band
          create({ east: '100000', north: 1900000 + 1, zoneCha: 'C' }),
          create({ east: '100000', north: 2800000 + 1, zoneCha: 'D' }),
          create({ east: '100000', north: 3600000 + 1, zoneCha: 'E' }),
          create({ east: '100000', north: 7800000 + 1, zoneCha: 'W' }),
          create({ east: '100000', north: 9100000 + 1, zoneCha: 'X' }),
        ],
      });

      it.each(formatErrors)('"%s"', (input, error) => {
        expect(expectingErrors(input) ?? 'no error?').toContain(error);
      });
    });

    describe('errors due to spec restrictions', () => {
      const specificationErrors = prepareTestCases({
        'Invalid zone letter "X" for zone "60"': [
          create({ zoneNum: '60', zoneCha: 'X' }), // polar exception removes band X from zone 60
        ],
        'Invalid zone letter "X" for zone "32"': [
          create({ zoneNum: '32', zoneCha: 'X' }), // Svalbard exceptions skip even-numbered zones
        ],
        'Invalid zone letter "X" for zone "34"': [
          create({ zoneNum: '34', zoneCha: 'X' }),
        ],
        'Invalid zone letter "X" for zone "36"': [
          create({ zoneNum: '36', zoneCha: 'X' }),
        ],
      });

      it.each(specificationErrors)('"%s"', (input, error) => {
        expect(expectingErrors(input) ?? 'no error!?!?!').toContain(error);
      });
    });
  });

  describe('valid coordinates', () => {
    const allTestCases = [
      '01C 100000 1100000', // Low latitude band C in zone 01 with default column cycle
      '33M 100000 9100000', // Mid-latitude control case for default column/row pairing
      '59X 100000 7900000', // Zone 59 band X: only row V survives high-latitude cycling
      '60W 100000 7000000', // Zone 60 band W: tests westernmost column set and band upper edge
    ];

    it.each(allTestCases)('"%s"', (input) => {
      const flag = 'something made up';
      const result = parseUTM(input);
      const error = result instanceof ParseError ? result.message : flag;

      expect(error).toBe(flag);
      expect(result).toMatchSnapshot();
    });
  });
});
