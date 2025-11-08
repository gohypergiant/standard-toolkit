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
import { parseMGRS } from './parse-mgrs.js';

interface CreateCoord {
  zoneNum?: string;
  zoneCha?: string;
  gridCol?: string;
  gridRow?: string;
  east?: number | string;
  north?: number | string;
}

const expectingErrors = (input: string) =>
  (parseMGRS(input) as ParseError).message;

// NOTE: <ZoneNumber><ZoneLetter><GridSquare>[<Easting><Northing>]
const create = ({
  zoneNum,
  zoneCha,
  gridCol,
  gridRow,
  east,
  north,
}: CreateCoord): string =>
  `${zoneNum ?? '33'}${zoneCha ?? 'X'}${gridCol ?? 'V'}${gridRow ?? 'G'}${east ?? ''}${north ?? ''}`;
const prop = (prop: string, tests: string[]) =>
  tests.map((val: string) => create({ [prop]: val }));

const prepareTestCases = (cases: Record<string, string[]>) =>
  Object.entries(cases)
    .flatMap(([error, inputs]) => inputs.map((input) => [input, error]))
    .map(([input, error]) => [input, error]);

describe('parse MGRS', () => {
  it('should confirm a valid coordinate format', () => {
    expect(parseMGRS(create({}), { skipValidation: true })).toBe(true);
  });

  describe('checking for errors', () => {
    it.each(['', undefined, {}])('should error on "%s"', (input) => {
      expect(
        parseMGRS(input as unknown as string, { skipValidation: true }),
      ).toBe(false);
      expect(expectingErrors(input as unknown as string)).toContain(
        'Input must be a non-empty string',
      );
    });

    describe('format and specific error checks', () => {
      const formatErrors = prepareTestCases({
        'No zone number found': prop('zoneNum', ['A', 'Y', 'Z', '.', ' ']),

        'Invalid zone number': prop('zoneNum', ['-1', '0', '61', '99']),

        // NOTE: skipping test for error 'No zone letter found' as it is not possible
        // to determine missing zone letter from missing grid square col or row

        'Invalid zone letter': prop('zoneCha', [
          '_',
          '-',
          'I',
          'O',
          '0',
          '1',
          '9',
        ]),

        'Invalid grid square column letter': prop('gridCol', [
          'I',
          'O',
          '_',
          '-',
          '0',
          '1',
          '9',
        ]),

        'Invalid grid square row letter': prop('gridRow', [
          'I',
          'O',
          '_',
          '-',
          '0',
          '1',
          '9',
          'Z',
        ]),

        'Invalid easting/northing pair - must be even number of digits': [
          ...prop('east', ['1', '123', '12345']),
          ...prop('north', ['1', '123', '12345']),
          create({ east: '9', north: '123456' }),
          create({ east: '98', north: '12345' }),
          create({ east: '987', north: '1234' }),
          create({ east: '9876', north: '123' }),
          create({ east: '98765', north: '12' }),
        ],

        'Invalid easting/northing precision': [
          //
          create({ east: '123456', north: '123456' }),
        ],

        'Invalid (non-numeric) characters in easting/northing': [
          create({ east: '1', north: 'A' }),
          create({ east: 'A', north: '1' }),
          create({ east: '.', north: '1' }),
          create({ east: '1', north: '.' }),
        ],
      });

      it.each(formatErrors)('"%s"', (input, error) => {
        expect(parseMGRS(input, { skipValidation: true })).toBe(false);
        expect(expectingErrors(input)).toContain(error);
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

        'Invalid grid square column': [
          create({ zoneNum: '2', zoneCha: 'C', gridCol: 'A' }), // 'A' is not valid in zone 2C
          create({ zoneNum: '32', zoneCha: 'V', gridCol: 'Q', gridRow: 'N' }), // Norway override: 32V restricted
          create({ zoneNum: '31', zoneCha: 'X', gridCol: 'A', gridRow: 'V' }), // Svalbard: zone 31X limited to Q–V
          create({ zoneNum: '33', zoneCha: 'X', gridCol: 'Z', gridRow: 'V' }), // Svalbard: zone 33X limited to A–H
        ],

        'Invalid grid square row': [
          create({ zoneNum: '12', zoneCha: 'C', gridCol: 'E', gridRow: 'W' }), // row below min northing
          create({ zoneNum: '33', zoneCha: 'X', gridCol: 'V', gridRow: 'W' }), // row above max northing
        ],
      });

      it.each(specificationErrors)('"%s"', (input, error) => {
        expect(expectingErrors(input) ?? 'no error!?!?!').toContain(error);
      });
    });
  });

  describe('valid coordinates', () => {
    const baseCases = [
      '59XJV', // Zone 59 band X: only row V survives high-latitude cycling
      '60WSC', // Zone 60 band W: tests westernmost column set and band upper edge
      '32VKN', // Norway override: zone 32V restricted to columns J–N
      '01CEQ', // Low latitude band C in zone 01 with default column cycle
      '02CKS', // Band C in even-numbered zone to exercise shifted row set
      '03CSN', // Band C in odd-numbered zone verifying complementary row set
      '12STA', // Band S lower boundary where row A is barely valid after wrap
      '33MVP', // Mid-latitude control case for default column/row pairing
      '31XQV', // Svalbard override: zone 31X limited to columns Q–V
      '33XAV', // Svalbard override: zone 33X reuses columns A–H
      '35XJL', // Svalbard override: zone 35X limited to columns J–R
      '37XSV', // Svalbard override: zone 37X limited to columns S–Z
    ];
    const validPrecisions = [
      '',
      '11',
      '2222',
      '333333',
      '44444444',
      '5555555555',
    ];
    const allTestCases = baseCases.flatMap((base) =>
      validPrecisions.map((prec) => `${base}${prec}`),
    );

    it.each(allTestCases)('"%s"', (input) => {
      const flag = 'something made up';
      const result = parseMGRS(input);
      const error = result instanceof ParseError ? result.message : flag;

      expect(error).toBe(flag);
      expect(result).toMatchSnapshot();
    });
  });
});
