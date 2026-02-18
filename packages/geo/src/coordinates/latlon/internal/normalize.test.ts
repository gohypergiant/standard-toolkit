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

import { describe, expect, it } from 'vitest';
import {
  isCoordinateObject,
  isCoordinateTuple,
  normalizeObjectToLatLon,
  tupleToLatLon,
} from './normalize';

describe('isCoordinateTuple', () => {
  describe('valid tuples', () => {
    it.each`
      input
      ${[0, 0]}
      ${[1.5, 2.5]}
      ${[-90, 180]}
      ${[Number.MAX_VALUE, Number.MIN_VALUE]}
    `('returns true for $input', ({ input }) => {
      expect(isCoordinateTuple(input)).toBe(true);
    });

    it('returns true for readonly tuple', () => {
      const tuple = [1, 2] as const;
      expect(isCoordinateTuple(tuple)).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it.each`
      input         | description
      ${[]}         | ${'empty array'}
      ${[1]}        | ${'single element'}
      ${[1, 2, 3]}  | ${'three elements'}
      ${['1', '2']} | ${'string elements'}
      ${[1, '2']}   | ${'mixed types'}
    `('returns false for $description', ({ input }) => {
      expect(isCoordinateTuple(input)).toBe(false);
    });

    it.each`
      input        | description
      ${'string'}  | ${'string'}
      ${{}}        | ${'empty object'}
      ${null}      | ${'null'}
      ${undefined} | ${'undefined'}
    `('returns false for $description', ({ input }) => {
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid inputs
      expect(isCoordinateTuple(input as any)).toBe(false);
    });
  });
});

describe('isCoordinateObject', () => {
  describe('valid objects', () => {
    it.each`
      input                               | description
      ${{ lat: 1, lon: 2 }}               | ${'lat/lon'}
      ${{ LAT: 1, LON: 2 }}               | ${'LAT/LON'}
      ${{ latitude: 1, longitude: 2 }}    | ${'latitude/longitude'}
      ${{ LATITUDE: 1, LONGITUDE: 2 }}    | ${'LATITUDE/LONGITUDE'}
      ${{ Lat: 1, Lon: 2 }}               | ${'Lat/Lon'}
      ${{ LaT: 1, lOn: 2 }}               | ${'mixed case'}
      ${{ lat: 1, lon: 2, extra: 3 }}     | ${'with extra properties'}
      ${{ latitude: 0, longitude: 0 }}    | ${'zero values'}
      ${{ lat: -90, lon: 180 }}           | ${'boundary values'}
      ${{ lat: 1, latitude: 2, lon: 3 }}  | ${'lat and latitude with lon'}
      ${{ lat: 1, lon: 2, longitude: 3 }} | ${'lon and longitude with lat'}
    `('returns true for $description', ({ input }) => {
      expect(isCoordinateObject(input)).toBe(true);
    });
  });

  describe('missing keys', () => {
    it.each`
      input               | description
      ${{ lat: 1 }}       | ${'missing lon'}
      ${{ lon: 2 }}       | ${'missing lat'}
      ${{ latitude: 1 }}  | ${'missing longitude'}
      ${{ longitude: 2 }} | ${'missing latitude'}
      ${{ x: 1, y: 2 }}   | ${'wrong keys'}
      ${{}}               | ${'empty object'}
    `('returns false for $description', ({ input }) => {
      expect(isCoordinateObject(input)).toBe(false);
    });
  });

  describe('invalid types', () => {
    it.each`
      input        | description
      ${null}      | ${'null'}
      ${[1, 2]}    | ${'array'}
      ${'string'}  | ${'string'}
      ${undefined} | ${'undefined'}
      ${42}        | ${'number'}
    `('returns false for $description', ({ input }) => {
      // biome-ignore lint/suspicious/noExplicitAny: testing invalid inputs
      expect(isCoordinateObject(input as any)).toBe(false);
    });
  });
});

describe('normalizeObjectToLatLon', () => {
  describe('key variations', () => {
    it.each`
      input                               | expected
      ${{ lat: 40, lon: -74 }}            | ${{ lat: 40, lon: -74 }}
      ${{ LAT: 40, LON: -74 }}            | ${{ lat: 40, lon: -74 }}
      ${{ latitude: 40, longitude: -74 }} | ${{ lat: 40, lon: -74 }}
      ${{ LATITUDE: 40, LONGITUDE: -74 }} | ${{ lat: 40, lon: -74 }}
      ${{ Lat: 40, Lon: -74 }}            | ${{ lat: 40, lon: -74 }}
      ${{ LaT: 40, lOn: -74 }}            | ${{ lat: 40, lon: -74 }}
    `('normalizes $input', ({ input, expected }) => {
      expect(normalizeObjectToLatLon(input)).toStrictEqual(expected);
    });
  });

  describe('key priority', () => {
    it('prefers lat over latitude', () => {
      const result = normalizeObjectToLatLon({
        lat: 1,
        latitude: 2,
        lon: 3,
      });
      expect(result).toStrictEqual({ lat: 1, lon: 3 });
    });

    it('prefers lon over longitude', () => {
      const result = normalizeObjectToLatLon({
        lat: 1,
        lon: 3,
        longitude: 4,
      });
      expect(result).toStrictEqual({ lat: 1, lon: 3 });
    });

    it('uses latitude when lat is not present', () => {
      const result = normalizeObjectToLatLon({
        latitude: 2,
        lon: 3,
      });
      expect(result).toStrictEqual({ lat: 2, lon: 3 });
    });

    it('uses longitude when lon is not present', () => {
      const result = normalizeObjectToLatLon({
        lat: 1,
        longitude: 4,
      });
      expect(result).toStrictEqual({ lat: 1, lon: 4 });
    });
  });

  describe('invalid inputs', () => {
    it.each`
      input             | description
      ${{ x: 1, y: 2 }} | ${'wrong keys'}
      ${{ lat: 1 }}     | ${'missing lon'}
      ${{ lon: 2 }}     | ${'missing lat'}
      ${{}}             | ${'empty object'}
    `('returns null for $description', ({ input }) => {
      expect(normalizeObjectToLatLon(input)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles zero values', () => {
      expect(normalizeObjectToLatLon({ lat: 0, lon: 0 })).toStrictEqual({
        lat: 0,
        lon: 0,
      });
    });

    it('handles negative values', () => {
      expect(normalizeObjectToLatLon({ lat: -90, lon: -180 })).toStrictEqual({
        lat: -90,
        lon: -180,
      });
    });
  });
});

describe('tupleToLatLon', () => {
  describe('LATLON format', () => {
    it.each`
      tuple         | expected
      ${[40, -74]}  | ${{ lat: 40, lon: -74 }}
      ${[0, 0]}     | ${{ lat: 0, lon: 0 }}
      ${[-90, 180]} | ${{ lat: -90, lon: 180 }}
      ${[90, -180]} | ${{ lat: 90, lon: -180 }}
    `('converts $tuple to $expected', ({ tuple, expected }) => {
      expect(tupleToLatLon('LATLON', tuple)).toStrictEqual(expected);
    });
  });

  describe('LONLAT format', () => {
    it.each`
      tuple         | expected
      ${[-74, 40]}  | ${{ lat: 40, lon: -74 }}
      ${[0, 0]}     | ${{ lat: 0, lon: 0 }}
      ${[180, -90]} | ${{ lat: -90, lon: 180 }}
      ${[-180, 90]} | ${{ lat: 90, lon: -180 }}
    `('converts $tuple to $expected', ({ tuple, expected }) => {
      expect(tupleToLatLon('LONLAT', tuple)).toStrictEqual(expected);
    });
  });
});
