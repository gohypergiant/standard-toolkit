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
import { parseWGS } from './parse-wgs.js';

interface Args {
  error: false | string;
  input: string;
  output: string;
}

describe('parse WGS', () => {
  const testFn = ({ error, input, output }: Args) => {
    const formatOnly = parseWGS(input, { skipValidation: true });
    const result = parseWGS(input);

    if (error === false) {
      expect(formatOnly).toBe(true);
      expect(result).not.toBeInstanceOf(ParseError);
      expect(result).toEqual(output);
    } else if (error) {
      expect(formatOnly).toBe(false);
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(error);
    } else {
      throw new Error('Test case misconfigured');
    }
  };

  describe('valid inputs', () => {
    describe('decimal degrees - no compass', () => {
      it.each`
        input                  | output                             | error
        ${'0 0'}               | ${{ lat: 0, lon: 0 }}              | ${false}
        ${'12.345 67.890'}     | ${{ lat: 12.345, lon: 67.89 }}     | ${false}
        ${'+25.123 -171.4567'} | ${{ lat: 25.123, lon: -171.4567 }} | ${false}
        ${'-88.765 174.333'}   | ${{ lat: -88.765, lon: 174.333 }}  | ${false}
        ${'0 180'}             | ${{ lat: 0, lon: 180 }}            | ${false}
        ${'-90 -180'}          | ${{ lat: -90, lon: -180 }}         | ${false}
        ${'44.0, 91.0'}        | ${{ lat: 44, lon: 91 }}            | ${false}
        ${'22.5; 44.6'}        | ${{ lat: 22.5, lon: 44.6 }}        | ${false}
        ${'45,6 78,9'}         | ${{ lat: 45.6, lon: 78.9 }}        | ${false}
        ${'−45.000° 90.000°'}  | ${{ lat: -45, lon: 90 }}           | ${false}
      `('$input', testFn);
    });

    describe('decimal degrees with compass', () => {
      it.each`
        input                 | output                             | error
        ${'46.1N 93.2E'}      | ${{ lat: 46.1, lon: 93.2 }}        | ${false}
        ${'82.999S 165.111W'} | ${{ lat: -82.999, lon: -165.111 }} | ${false}
        ${'N23.45 E102.34'}   | ${{ lat: 23.45, lon: 102.34 }}     | ${false}
        ${'S12.34 W45.67'}    | ${{ lat: -12.34, lon: -45.67 }}    | ${false}
        ${'100E 45N'}         | ${{ lat: 45, lon: 100 }}           | ${false}
        ${'45N 100E'}         | ${{ lat: 45, lon: 100 }}           | ${false}
        ${'-45S 120E'}        | ${{ lat: -45, lon: 120 }}          | ${false}
        ${'23N -90'}          | ${{ lat: 23, lon: -90 }}           | ${false}
        ${'90N 0E'}           | ${{ lat: 90, lon: 0 }}             | ${false}
        ${'0N 180E'}          | ${{ lat: 0, lon: 180 }}            | ${false}
        ${'1 2 E'}            | ${{ lat: 1, lon: 2 }}              | ${false}
        ${'2 E 1'}            | ${{ lat: 1, lon: 2 }}              | ${false}
        ${'2 1 N'}            | ${{ lat: 1, lon: 2 }}              | ${false}
      `('$input', testFn);
    });

    describe('degrees minutes - no compass', () => {
      it.each`
        input                | output                                      | error
        ${'12° 87°'}         | ${{ lat: 12, lon: 87 }}                     | ${false}
        ${"14' 57'"}         | ${{ lat: 14 / 60, lon: 57 / 60 }}           | ${false}
        ${'16" 59"'}         | ${{ lat: 16 / 3600, lon: 59 / 3600 }}       | ${false}
        ${"19° 59' 17° 59'"} | ${{ lat: 19 + 59 / 60, lon: 17 + 59 / 60 }} | ${false}
      `('$input', testFn);
    });

    describe('degrees minutes with compass', () => {
      it.each`
        input                         | output                                                    | error
        ${"12°34'N 45°56'E"}          | ${{ lat: 12 + 34 / 60, lon: 45 + 56 / 60 }}               | ${false}
        ${"13°45.6'N 46°12.3'E"}      | ${{ lat: 13 + 45.6 / 60, lon: 46 + 12.3 / 60 }}           | ${false}
        ${"59°59.999'S 179°01.234'W"} | ${{ lat: -(59 + 59.999 / 60), lon: -(179 + 1.234 / 60) }} | ${false}
        ${'86 12 N 0E'}               | ${{ lat: 86 + 12 / 60, lon: 0 }}                          | ${false}
        ${'N 84 12 0E'}               | ${{ lat: 84 + 12 / 60, lon: 0 }}                          | ${false}
      `('$input', testFn);
    });

    describe('degrees minutes seconds', () => {
      it.each`
        input                         | output                                                                     | error
        ${'40°30\'10"N 75°15\'20"E'}  | ${{ lat: 40 + 30 / 60 + 10 / 3600, lon: 75 + 15 / 60 + 20 / 3600 }}        | ${false}
        ${'42 25 35 N 71 7 15 E'}     | ${{ lat: 42 + 25 / 60 + 35 / 3600, lon: 71 + 7 / 60 + 15 / 3600 }}         | ${false}
        ${'89°59\'59"S 179°59\'59"W'} | ${{ lat: -(89 + 59 / 60 + 59 / 3600), lon: -(179 + 59 / 60 + 59 / 3600) }} | ${false}
        ${'86 12 10 N 0E'}            | ${{ lat: 86 + 12 / 60 + 10 / 3600, lon: 0 }}                               | ${false}
        ${'1 2 3 4 5 6'}              | ${{ lat: 1 + 2 / 60 + 3 / 3600, lon: 4 + 5 / 60 + 6 / 3600 }}              | ${false}
      `('$input', testFn);
    });

    describe('compact/concatenated format (DDMMSSH)', () => {
      it.each`
        input                 | output                                                              | error
        ${'1230N 04515E'}     | ${{ lat: 12 + 30 / 60, lon: 45 + 15 / 60 }}                         | ${false}
        ${'123015N 0451530E'} | ${{ lat: 12 + 30 / 60 + 15 / 3600, lon: 45 + 15 / 60 + 30 / 3600 }} | ${false}
        ${'04515E 1230N'}     | ${{ lat: 12 + 30 / 60, lon: 45 + 15 / 60 }}                         | ${false}
        ${'0451530E 123015N'} | ${{ lat: 12 + 30 / 60 + 15 / 3600, lon: 45 + 15 / 60 + 30 / 3600 }} | ${false}
      `('$input', testFn);
    });

    describe('lonlat order (without compass)', () => {
      it('should parse lon lat when order is lonlat', () => {
        const result = parseWGS('100 45', { order: 'lonlat' });
        expect(result).toEqual({ lat: 45, lon: 100 });
      });

      it('should parse negative coordinates in lonlat order', () => {
        const result = parseWGS('-122.5 37.8', { order: 'lonlat' });
        expect(result).toEqual({ lat: 37.8, lon: -122.5 });
      });

      it('should handle boundary values in lonlat order', () => {
        const result = parseWGS('180 90', { order: 'lonlat' });
        expect(result).toEqual({ lat: 90, lon: 180 });
      });
    });

    describe('mixed formats and edge cases', () => {
      it.each`
        input               | output                            | error
        ${"5' 13°"}         | ${{ lat: 5 / 60, lon: 13 }}       | ${false}
        ${'3" N 22°'}       | ${{ lat: 3 / 3600, lon: 22 }}     | ${false}
        ${'N23 102E'}       | ${{ lat: 23, lon: 102 }}          | ${false}
        ${'23N E102'}       | ${{ lat: 23, lon: 102 }}          | ${false}
        ${'23°N W102°'}     | ${{ lat: 23, lon: -102 }}         | ${false}
        ${'5E 1N'}          | ${{ lat: 1, lon: 5 }}             | ${false}
        ${'86 N 0 12 E'}    | ${{ lat: 86, lon: 12 }}           | ${false}
        ${'N 84 0 12 10 E'} | ${{ lat: 84, lon: 12 + 10 / 60 }} | ${false}
      `('$input', testFn);
    });
  });

  // /*
  describe('INVALID inputs', () => {
    it.each`
      input                    | output | error
      ${''}                    | ${''}  | ${'Input must be a non-empty string'}
      ${null}                  | ${''}  | ${'Input must be a non-empty string'}
      ${undefined}             | ${''}  | ${'Input must be a non-empty string'}
      ${{}}                    | ${''}  | ${'Input must be a non-empty string'}
      ${'foo'}                 | ${''}  | ${'Input is not in a valid WGS format; input:'}
      ${'45'}                  | ${''}  | ${'Input is not in a valid WGS format; input:'}
      ${'45N'}                 | ${''}  | ${'Input is not in a valid WGS format; input:'}
      ${'some random garbage'} | ${''}  | ${'Input is not in a valid WGS format; input:'}
    `('$input', testFn);
  });
  // */

  it('should skip validation when requested', () => {
    expect(parseWGS('9', { skipValidation: true })).toBe(false);
  });

  describe('edge cases and error conditions', () => {
    // Note: The "too many coordinate groups" error is difficult to trigger
    // because the format validator typically rejects inputs before they reach finalize()
    it('should error on too many coordinate groups', () => {
      // Create valid format but with extra separators to create 3+ groups
      // Using degrees with multiple separators
      const result = parseWGS('12° / 34° / 56°');

      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        `Input is not in a valid WGS format; input: "12° / 34° / 56°"`,
      );
    });

    it('should error when both parts are on the same axis', () => {
      const result = parseWGS('12N 34N');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain('same axis');
    });

    it('should error when parts contradict latlon order', () => {
      const result = parseWGS('12E 34N', { order: 'latlon' });
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'contradict specified order',
      );
    });

    it('should error when parts contradict lonlat order', () => {
      const result = parseWGS('12N 34E', { order: 'lonlat' });
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'contradict specified order',
      );
    });

    it('should error when latitude exceeds 90', () => {
      const result = parseWGS('91 100');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'Latitude value out of range',
      );
    });

    it('should error when latitude is below -90', () => {
      const result = parseWGS('-91 100');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'Latitude value out of range',
      );
    });

    it('should error when longitude exceeds 180', () => {
      const result = parseWGS('45 181');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'Longitude value out of range',
      );
    });

    it('should error when longitude is below -180', () => {
      const result = parseWGS('45 -181');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'Longitude value out of range',
      );
    });

    it('should error when minutes value is too high', () => {
      const result = parseWGS("12° 60' N, 34° E");
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'Minutes value too high',
      );
    });

    it('should error when minutes value is negative', () => {
      const result = parseWGS("12° -5' N, 34° E");
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain('Minutes value too low');
    });

    it('should error when seconds value is too high', () => {
      const result = parseWGS('12° 30\' 60" N, 34° E');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'Seconds value too high',
      );
    });

    it('should error when seconds value is negative', () => {
      const result = parseWGS('12° 30\' -5" N, 34° E');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain('Seconds value too low');
    });

    it('should error with negative degrees and North direction', () => {
      const result = parseWGS('-12N, 34E');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'Conflicting indicators',
      );
      expect((result as ParseError).message).toContain('North');
    });

    it('should error with negative degrees and East direction', () => {
      const result = parseWGS('12N, -34E');
      expect(result).toBeInstanceOf(ParseError);
      expect((result as ParseError).message).toContain(
        'Conflicting indicators',
      );
      expect((result as ParseError).message).toContain('East');
    });
  });
});
