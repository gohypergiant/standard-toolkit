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

import type { DistanceUnit } from '@accelint/constants/units';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatBearing, formatDistance } from './index';

const DISTANCE_UNITS: DistanceUnit[] = [
  'kilometers',
  'meters',
  'nauticalmiles',
  'miles',
  'feet',
];

describe('formatBearing', () => {
  it.each([
    [45, '045°'],
    [0, '000°'],
    [180, '180°'],
    [-10, '350°'],
    [370, '010°'],
    [360, '000°'],
    [-360, '000°'],
  ])('formats %d as "%s"', (degrees, expected) => {
    expect(formatBearing(degrees)).toBe(expected);
  });

  it.each([
    [359.6, '000°'],
    [44.5, '045°'],
    [0.4, '000°'],
    [-0.4, '000°'],
  ])('rounds fractional bearing %d to "%s"', (degrees, expected) => {
    expect(formatBearing(degrees)).toBe(expected);
  });

  it.each([
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
  ])('throws a RangeError for %s', (_label, degrees) => {
    expect(() => formatBearing(degrees)).toThrow(
      new RangeError('degrees must be a finite number.'),
    );
  });

  it('always produces a 3-digit degree string no greater than 359', () => {
    fc.assert(
      fc.property(
        fc.double({ noNaN: true, noDefaultInfinity: true }),
        (degrees) => {
          const result = formatBearing(degrees);

          return /^\d{3}°$/.test(result) && Number.parseInt(result, 10) <= 359;
        },
      ),
    );
  });

  it('produces the same output for bearings 360 degrees apart', () => {
    fc.assert(
      fc.property(fc.integer({ min: -100000, max: 100000 }), (degrees) => {
        return formatBearing(degrees) === formatBearing(degrees + 360);
      }),
    );
  });
});

describe('formatDistance', () => {
  describe('single unit', () => {
    it.each([
      [42300, 'kilometers', '42.3 km'],
      [42336, 'nauticalmiles', '22.9 NM'],
      [500, 'meters', '500.0 m'],
      [1609.344, 'miles', '1.0 mi'],
      [30.48, 'feet', '100.0 ft'],
      [0, 'kilometers', '0.0 km'],
      [0, 'nauticalmiles', '0.0 NM'],
    ] as const)('formats %d meters in %s as "%s"', (meters, unit, expected) => {
      expect(formatDistance(meters, unit)).toBe(expected);
    });

    it('formats a single-element array the same as a bare unit', () => {
      expect(formatDistance(42300, ['kilometers'])).toBe(
        formatDistance(42300, 'kilometers'),
      );
    });

    it('produces a one-decimal number followed by a unit symbol', () => {
      fc.assert(
        fc.property(
          fc.double({
            min: 0,
            max: 1e12,
            noNaN: true,
            noDefaultInfinity: true,
          }),
          fc.constantFrom(...DISTANCE_UNITS),
          (meters, unit) => {
            return /^\d+\.\d [a-zA-Z]+$/.test(formatDistance(meters, unit));
          },
        ),
      );
    });
  });

  describe('dual units', () => {
    it.each([
      [42300, ['kilometers', 'nauticalmiles'], '42.3 km / 22.8 NM'],
      [0, ['kilometers', 'nauticalmiles'], '0.0 km / 0.0 NM'],
      [1609.344, ['miles', 'feet'], '1.0 mi / 5280.0 ft'],
    ] as const)('formats %d meters in %j as "%s"', (meters, units, expected) => {
      expect(formatDistance(meters, [...units])).toBe(expected);
    });
  });

  describe('validation', () => {
    it('throws when more than two units are provided', () => {
      expect(() =>
        formatDistance(42300, ['kilometers', 'nauticalmiles', 'miles']),
      ).toThrow(new Error('formatDistance accepts 1 or 2 units.'));
    });

    it('throws when the unit array is empty', () => {
      expect(() => formatDistance(42300, [])).toThrow(
        new Error('formatDistance accepts 1 or 2 units.'),
      );
    });

    it('throws when the unit is not a supported distance unit', () => {
      const unit = 'furlongs' as unknown as DistanceUnit;

      expect(() => formatDistance(42300, unit)).toThrow(
        new Error('Unsupported distance unit: furlongs'),
      );
    });

    it.each([
      ['NaN', Number.NaN],
      ['Infinity', Number.POSITIVE_INFINITY],
      ['-Infinity', Number.NEGATIVE_INFINITY],
    ])('throws a RangeError for %s meters', (_label, meters) => {
      expect(() => formatDistance(meters, 'kilometers')).toThrow(
        new RangeError('meters must be a finite number.'),
      );
    });
  });
});
