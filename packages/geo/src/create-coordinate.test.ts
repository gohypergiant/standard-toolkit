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
import { createCoordinate } from './create-coordinate.js';
import type { AnyCoordinate } from './create-coordinate.js';
import type { CoordinateMGRS } from './mgrs/coordinate-mgrs.js';
import type { CoordinateUTM } from './utm/coordinate-utm.js';
import type { CoordinateWGS } from './wgs/coordinate-wgs.js';

const UTM_INPUT = '31 U 448251 5411932';
const UTM_OUTPUT = '31U 448251 5411932';

describe('createCoordinate API', () => {
  describe('MGRS coordinates', () => {
    it('should create MGRS coordinate with explicit system', () => {
      const mgrs = createCoordinate('mgrs', '01CEQ');

      expect(mgrs).toBeDefined();
      expect(mgrs.toString()).toBe('01CEQ');
      expect(mgrs.zoneNumber).toBe(1);
      expect(mgrs.zoneLetter).toBe('C');
      expect(mgrs.gridCol).toBe('E');
      expect(mgrs.gridRow).toBe('Q');
    });

    it('should handle MGRS with various precisions', () => {
      const lowPrecision = createCoordinate('mgrs', '01CEQ');
      expect(lowPrecision.toString()).toBe('01CEQ');

      const highPrecision = createCoordinate('mgrs', '01CEQ5555555555');
      expect(highPrecision.toString()).toBe('01CEQ5555555555');
    });

    it('should round-trip MGRS -> UTM -> MGRS accurately', () => {
      const original = createCoordinate('mgrs', '31UEQ4825211932');

      const utm = original.toUTM();
      expect(utm).toBeDefined();
      expect(utm.zoneNumber).toBe(original.zoneNumber);
      expect(utm.zoneLetter).toBe(original.zoneLetter);

      const converted = utm.toMGRS();
      expect(converted).toBeDefined();
      expect(converted.zoneNumber).toBe(original.zoneNumber);
      expect(converted.zoneLetter).toBe(original.zoneLetter);
      expect(converted.gridCol).toBe(original.gridCol);
      expect(converted.gridRow).toBe(original.gridRow);
    });
  });

  describe('UTM coordinates', () => {
    it('should create UTM coordinate with explicit system', () => {
      const utm = createCoordinate('utm', UTM_INPUT);

      expect(utm).toBeDefined();
      expect(utm.zoneNumber).toBe(31);
      expect(utm.hemisphere).toBe('N');
      expect(utm.easting).toBe(448251);
      expect(utm.northing).toBe(5411932);
    });

    it('should round-trip UTM -> MGRS -> UTM accurately', () => {
      const original = createCoordinate('utm', UTM_INPUT);

      expect(original.toMGRS).toBeDefined();
      expect(original.toWGS).toBeDefined();

      const mgrs = original.toMGRS();
      expect(mgrs).toBeDefined();
      expect(mgrs.zoneNumber).toBe(original.zoneNumber);
      expect(mgrs.zoneLetter).toBe(original.zoneLetter);

      const converted = mgrs.toUTM();
      expect(converted).toBeDefined();
      expect(converted.zoneNumber).toBe(original.zoneNumber);
      expect(converted.zoneLetter).toBe(original.zoneLetter);
      expect(converted.hemisphere).toBe(original.hemisphere);
    });

    it('should round-trip UTM -> WGS -> UTM with minimal precision loss', () => {
      const original = createCoordinate('utm', UTM_INPUT);

      const wgs = original.toWGS();
      expect(wgs).toBeDefined();
      expect(wgs.lat).toBeDefined();
      expect(wgs.lon).toBeDefined();

      const converted = wgs.toUTM();
      expect(converted).toBeDefined();
      expect(converted.zoneNumber).toBe(original.zoneNumber);
      expect(converted.hemisphere).toBe(original.hemisphere);
      // Easting and northing should be very close (within a few meters)
      expect(Math.abs(converted.easting - original.easting)).toBeLessThan(1);
      expect(Math.abs(converted.northing - original.northing)).toBeLessThan(1);
    });

    it('should convert UTM to WGS with and without order parameter', () => {
      const utm = createCoordinate('utm', UTM_INPUT);

      // Convert with lonlat order - this parameter affects how the resulting
      // WGS coordinate was created (for toString purposes)
      const wgsLonLat = utm.toWGS('lonlat');
      expect(wgsLonLat).toBeDefined();
      expect(wgsLonLat.lat).toBeDefined();
      expect(wgsLonLat.lon).toBeDefined();

      // Convert with latlon order explicitly
      const wgsLatLon = utm.toWGS('latlon');
      expect(wgsLatLon).toBeDefined();

      // Verify the coordinates toString works
      expect(wgsLonLat.toString()).toBeTruthy();
      expect(wgsLatLon.toString()).toBeTruthy();
    });

    it('should toString accurately', () => {
      const original = UTM_INPUT;
      const utm = createCoordinate('utm', original);

      expect(utm.toString()).toBe(UTM_OUTPUT);
    });
  });

  describe('WGS84 coordinates', () => {
    it('should create WGS coordinate with explicit system', () => {
      const wgs = createCoordinate('wgs', '42.3601, -71.0589');

      expect(wgs).toBeDefined();
      expect(wgs.lat).toBeCloseTo(42.3601, 4);
      expect(wgs.lon).toBeCloseTo(-71.0589, 4);
    });

    it('should create WGS coordinate with latlon alias', () => {
      const latlon = createCoordinate('latlon', '42.3601, -71.0589');

      expect(latlon).toBeDefined();
      expect(latlon.lat).toBeCloseTo(42.3601, 4);
      expect(latlon.lon).toBeCloseTo(-71.0589, 4);
    });

    it('should create WGS coordinate with lonlat alias', () => {
      const lonlat = createCoordinate('lonlat', '-71.0589, 42.3601');

      expect(lonlat).toBeDefined();
      expect(lonlat.lat).toBeCloseTo(42.3601, 4);
      expect(lonlat.lon).toBeCloseTo(-71.0589, 4);
    });

    it('should support lonlat order option', () => {
      const wgs = createCoordinate('wgs', '-71.0589, 42.3601', {
        order: 'lonlat',
      });

      expect(wgs.lat).toBeCloseTo(42.3601, 4);
      expect(wgs.lon).toBeCloseTo(-71.0589, 4);
    });

    it('should round-trip WGS -> UTM -> WGS with minimal precision loss', () => {
      const original = createCoordinate('wgs', '42.3601, -71.0589');

      expect(original.toUTM).toBeDefined();
      expect(original.toMGRS).toBeDefined();

      const utm = original.toUTM();
      expect(utm).toBeDefined();

      const converted = utm.toWGS();
      expect(converted).toBeDefined();
      // UTM precision should preserve lat/lon to within ~0.0001 degrees
      expect(converted.lat).toBeCloseTo(original.lat, 4);
      expect(converted.lon).toBeCloseTo(original.lon, 4);
    });

    it('should round-trip WGS -> MGRS -> WGS with expected precision loss', () => {
      const original = createCoordinate('wgs', '42.3601, -71.0589');

      const mgrs = original.toMGRS();
      expect(mgrs).toBeDefined();
      expect(mgrs.toString()).toBeTruthy();

      const converted = mgrs.toWGS();
      expect(converted).toBeDefined();
      // MGRS precision depends on grid square size
      // At default precision, expect ~0.001 degrees accuracy (100m)
      expect(Math.abs(converted.lat - original.lat)).toBeLessThan(0.01);
      expect(Math.abs(converted.lon - original.lon)).toBeLessThan(0.01);
    });

    it('should toString accurately', () => {
      const original = createCoordinate('wgs', '42.3601, -71.0589');

      expect(original.toString()).toBe('42.3601°, -71.0589°');
      expect(original.toString({ order: 'lonlat' })).toBe(
        '-71.0589°, 42.3601°',
      );
    });

    it('should toString with order based on alias used', () => {
      const latlon = createCoordinate('latlon', '42.3601, -71.0589');
      expect(latlon.toString()).toBe('42.3601°, -71.0589°');

      const lonlat = createCoordinate('lonlat', '-71.0589, 42.3601');
      expect(lonlat.toString()).toBe('-71.0589°, 42.3601°');

      // Can still override toString order
      expect(lonlat.toString({ order: 'latlon' })).toBe('42.3601°, -71.0589°');
    });

    it('should toString with DDM format', () => {
      const wgs = createCoordinate('wgs', '42.3601, -71.0589');

      // Default order (latlon)
      expect(wgs.toString({ format: 'ddm' })).toBe("42° 21.606', -71° 3.534'");

      // Explicit lonlat order
      expect(wgs.toString({ format: 'ddm', order: 'lonlat' })).toBe(
        "-71° 3.534', 42° 21.606'",
      );
    });

    it('should toString with DMS format', () => {
      const wgs = createCoordinate('wgs', '42.3601, -71.0589');

      // Default order (latlon)
      expect(wgs.toString({ format: 'dms' })).toBe(
        '42° 21\' 36.36", -71° 3\' 32.04"',
      );

      // Explicit lonlat order
      expect(wgs.toString({ format: 'dms', order: 'lonlat' })).toBe(
        '-71° 3\' 32.04", 42° 21\' 36.36"',
      );
    });

    it('should toString with all format options', () => {
      const coord = createCoordinate('wgs', '48.8584, 2.2945');

      // DD format
      expect(coord.toString({ format: 'dd' })).toBe('48.8584°, 2.2945°');

      // DDM format
      expect(coord.toString({ format: 'ddm' })).toBe("48° 51.504', 2° 17.67'");

      // DMS format
      expect(coord.toString({ format: 'dms' })).toBe(
        '48° 51\' 30.24", 2° 17\' 40.2"',
      );
    });
  });

  describe('Type safety', () => {
    it('should have correct TypeScript types', () => {
      const mgrs: CoordinateMGRS = createCoordinate('mgrs', '31UEQ4825211932');
      const utm: CoordinateUTM = createCoordinate('utm', UTM_INPUT);
      const wgs: CoordinateWGS = createCoordinate('wgs', '42.3601, -71.0589');

      // AnyCoordinate should accept all types
      const coords: AnyCoordinate[] = [mgrs, utm, wgs];

      expect(coords).toHaveLength(3);
    });

    it('should have correct TypeScript types for latlon and lonlat aliases', () => {
      const latlon: CoordinateWGS = createCoordinate(
        'latlon',
        '42.3601, -71.0589',
      );
      const lonlat: CoordinateWGS = createCoordinate(
        'lonlat',
        '-71.0589, 42.3601',
      );

      expect(latlon).toBeDefined();
      expect(lonlat).toBeDefined();
      expect(latlon.lat).toBeCloseTo(42.3601, 4);
      expect(lonlat.lat).toBeCloseTo(42.3601, 4);

      // The aliases automatically set the order, so these work without options:
      expect(latlon.toString()).toBe('42.3601°, -71.0589°');
      expect(lonlat.toString()).toBe('-71.0589°, 42.3601°');
    });
  });

  describe('Options support', () => {
    it('should support skipValidation option', () => {
      const mgrs = createCoordinate('mgrs', '31UEQ4825211932', {
        skipValidation: true,
      });

      expect(mgrs).toBeDefined();
    });

    it('should support WGS order option', () => {
      const wgs = createCoordinate('wgs', '-71.0589, 42.3601', {
        order: 'lonlat',
      });

      expect(wgs.lat).toBeCloseTo(42.3601, 4);
      expect(wgs.lon).toBeCloseTo(-71.0589, 4);
    });

    it('should support WGS toString with different input order', () => {
      // Create with lonlat order option
      const wgs = createCoordinate('wgs', '-71.0589, 42.3601', {
        order: 'lonlat',
      });

      // toString should work correctly
      const str = wgs.toString();
      expect(str).toContain('42.3601');
      expect(str).toContain('-71.0589');
    });
  });

  describe('tokens property', () => {
    describe('MGRS tokens', () => {
      it('should return all coordinate properties', () => {
        const mgrs = createCoordinate('mgrs', '31UEQ4825211932');
        const tokens = mgrs.tokens();

        expect(tokens).toBeDefined();
        expect(tokens.zoneNumber).toBe(31);
        expect(tokens.zoneLetter).toBe('U');
        expect(tokens.gridCol).toBe('E');
        expect(tokens.gridRow).toBe('Q');
        expect(tokens.easting).toBeDefined();
        expect(tokens.northing).toBeDefined();
        expect(tokens.precision).toBeDefined();
      });

      it('should return the same object as the coordinate itself', () => {
        const mgrs = createCoordinate('mgrs', '31UEQ4825211932');
        const tokens = mgrs.tokens();

        expect(tokens.zoneNumber).toBe(mgrs.zoneNumber);
        expect(tokens.zoneLetter).toBe(mgrs.zoneLetter);
        expect(tokens.gridCol).toBe(mgrs.gridCol);
        expect(tokens.gridRow).toBe(mgrs.gridRow);
        expect(tokens.easting).toBe(mgrs.easting);
        expect(tokens.northing).toBe(mgrs.northing);
      });
    });

    describe('UTM tokens', () => {
      it('should return all coordinate properties', () => {
        const utm = createCoordinate('utm', UTM_INPUT);
        const tokens = utm.tokens();

        expect(tokens).toBeDefined();
        expect(tokens.zoneNumber).toBe(31);
        expect(tokens.zoneLetter).toBe('U');
        expect(tokens.hemisphere).toBe('N');
        expect(tokens.easting).toBe(448251);
        expect(tokens.northing).toBe(5411932);
        expect(tokens.precision).toBeDefined();
      });

      it('should return the same object as the coordinate itself', () => {
        const utm = createCoordinate('utm', UTM_INPUT);
        const tokens = utm.tokens();

        expect(tokens.zoneNumber).toBe(utm.zoneNumber);
        expect(tokens.zoneLetter).toBe(utm.zoneLetter);
        expect(tokens.hemisphere).toBe(utm.hemisphere);
        expect(tokens.easting).toBe(utm.easting);
        expect(tokens.northing).toBe(utm.northing);
      });
    });

    describe('WGS84 tokens', () => {
      it('should return decimal degrees by default', () => {
        const wgs = createCoordinate('wgs', '42.3601, -71.0589');
        const tokens = wgs.tokens();

        expect(tokens).toBeDefined();
        expect(tokens.lat.degrees).toBeCloseTo(42.3601, 4);
        expect(tokens.lon.degrees).toBeCloseTo(-71.0589, 4);
      });

      it('should return decimal degrees when format is "dd"', () => {
        const wgs = createCoordinate('wgs', '42.3601, -71.0589');
        const tokens = wgs.tokens({ format: 'dd' });

        expect(tokens).toBeDefined();
        expect(tokens.lat.degrees).toBeCloseTo(42.3601, 4);
        expect(tokens.lon.degrees).toBeCloseTo(-71.0589, 4);
      });

      it('should return degrees decimal minutes when format is "ddm"', () => {
        const wgs = createCoordinate('wgs', '42.3601, -71.0589');
        const tokens = wgs.tokens({ format: 'ddm' });

        // 42.3601° = 42° 21.606'
        expect(tokens.lat.degrees).toBe(42);
        expect(tokens.lat.minutes).toBeCloseTo(21.606, 2);

        // -71.0589° = -71° 3.534'
        expect(tokens.lon.degrees).toBe(-71);
        expect(tokens.lon.minutes).toBeCloseTo(3.534, 2);
      });

      it('should return degrees minutes seconds when format is "dms"', () => {
        const wgs = createCoordinate('wgs', '42.3601, -71.0589');
        const tokens = wgs.tokens({ format: 'dms' });

        // 42.3601° = 42° 21' 36.36"
        expect(tokens.lat.degrees).toBe(42);
        expect(tokens.lat.minutes).toBe(21);
        expect(tokens.lat.seconds).toBeCloseTo(36.36, 1);

        // -71.0589° = -71° 3' 32.04"
        expect(tokens.lon.degrees).toBe(-71);
        expect(tokens.lon.minutes).toBe(3);
        expect(tokens.lon.seconds).toBeCloseTo(32.04, 1);
      });

      it('should work with different coordinate orders', () => {
        const latlon = createCoordinate('latlon', '42.3601, -71.0589');
        const lonlat = createCoordinate('lonlat', '-71.0589, 42.3601');

        const latlonTokens = latlon.tokens();
        const lonlatTokens = lonlat.tokens();

        // Both should have the same lat/lon values regardless of input order
        expect(latlonTokens.lat.degrees).toBeCloseTo(42.3601, 4);
        expect(latlonTokens.lon.degrees).toBeCloseTo(-71.0589, 4);
        expect(lonlatTokens.lat.degrees).toBeCloseTo(42.3601, 4);
        expect(lonlatTokens.lon.degrees).toBeCloseTo(-71.0589, 4);
      });

      // it('should work with format options on coordinates created with aliases', () => {
      //   const latlon = createCoordinate('latlon', '48.8584, 2.2945');
      //   const ddm = latlon.tokens({ format: 'ddm' });
      //   const dms = latlon.tokens({ format: 'dms' });

      //   expect(ddm.lat).toHaveLength(2);
      //   expect(ddm.lon).toHaveLength(2);
      //   expect(dms.lat).toHaveLength(3);
      //   expect(dms.lon).toHaveLength(3);
      // });
    });
  });

  describe('Error handling', () => {
    it('should throw ParseError for invalid MGRS input', () => {
      expect(() => createCoordinate('mgrs', 'invalid')).toThrow();
    });

    it('should throw ParseError for invalid UTM input', () => {
      expect(() => createCoordinate('utm', 'invalid')).toThrow();
    });

    it('should throw ParseError for invalid WGS input', () => {
      expect(() => createCoordinate('wgs', 'invalid')).toThrow();
    });

    it('should throw ParseError for invalid latlon input', () => {
      expect(() => createCoordinate('latlon', 'invalid')).toThrow();
    });

    it('should throw ParseError for invalid lonlat input', () => {
      expect(() => createCoordinate('lonlat', 'invalid')).toThrow();
    });

    it('should return error for invalid input with skipValidation', () => {
      // MGRS and UTM don't pass skipValidation to parse, so they return ParseError
      const mgrs = createCoordinate('mgrs', 'invalid', {
        skipValidation: true,
      });
      expect(mgrs).toBeInstanceOf(Error);

      const utm = createCoordinate('utm', 'invalid', { skipValidation: true });
      expect(utm).toBeInstanceOf(Error);

      // WGS passes skipValidation to parse, so it returns boolean false
      const wgs = createCoordinate('wgs', 'invalid', { skipValidation: true });
      expect(wgs).toBe(false);
    });
  });
});
