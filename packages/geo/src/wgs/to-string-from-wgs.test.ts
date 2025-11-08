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
import { toStringFromWGS } from './to-string-from-wgs';

describe('toStringFromWGS', () => {
  const newYork = { lat: 40.7489, lon: -73.968 };
  const paris = { lat: 48.8584, lon: 2.2945 };
  const southPole = { lat: -90, lon: 0 };
  const primeMeridian = { lat: 51.4779, lon: 0 };

  describe('decimal degrees (dd) format', () => {
    it('should format with default options (dd, latlon, no compass)', () => {
      expect(toStringFromWGS(newYork)).toBe('40.7489°, -73.968°');
    });

    it('should format with explicit dd format', () => {
      expect(toStringFromWGS(paris, { format: 'dd' })).toBe(
        '48.8584°, 2.2945°',
      );
    });

    it('should format in lonlat order', () => {
      expect(toStringFromWGS(newYork, { order: 'lonlat' })).toBe(
        '-73.968°, 40.7489°',
      );
    });

    it('should format with compass directions', () => {
      expect(toStringFromWGS(newYork, { compass: true })).toBe(
        '40.7489°N, 73.968°W',
      );
    });

    it('should format with compass directions in lonlat order', () => {
      expect(toStringFromWGS(paris, { compass: true, order: 'lonlat' })).toBe(
        '2.2945°E, 48.8584°N',
      );
    });

    it('should handle negative latitude with compass', () => {
      expect(toStringFromWGS(southPole, { compass: true })).toBe('90°S, 0°E');
    });

    it('should handle zero longitude with compass', () => {
      expect(toStringFromWGS(primeMeridian, { compass: true })).toBe(
        '51.4779°N, 0°E',
      );
    });

    it('should handle positive longitude with compass', () => {
      expect(
        toStringFromWGS({ lat: 35.6762, lon: 139.6503 }, { compass: true }),
      ).toBe('35.6762°N, 139.6503°E');
    });
  });

  describe('degrees decimal minutes (ddm) format', () => {
    it('should format without compass', () => {
      expect(toStringFromWGS(newYork, { format: 'ddm' })).toBe(
        "40° 44.934', -73° 58.08'",
      );
    });

    it('should format with compass', () => {
      expect(toStringFromWGS(newYork, { format: 'ddm', compass: true })).toBe(
        "40° 44.934'N, 73° 58.08'W",
      );
    });

    it('should format in lonlat order', () => {
      expect(toStringFromWGS(paris, { format: 'ddm', order: 'lonlat' })).toBe(
        "2° 17.67', 48° 51.504'",
      );
    });

    it('should format in lonlat order with compass', () => {
      expect(
        toStringFromWGS(paris, {
          format: 'ddm',
          compass: true,
          order: 'lonlat',
        }),
      ).toBe("2° 17.67'E, 48° 51.504'N");
    });

    it('should handle negative coordinates with compass', () => {
      expect(toStringFromWGS(southPole, { format: 'ddm', compass: true })).toBe(
        "90° 0'S, 0° 0'E",
      );
    });

    it('should handle zero values', () => {
      expect(toStringFromWGS({ lat: 0, lon: 0 }, { format: 'ddm' })).toBe(
        "0° 0', 0° 0'",
      );
    });
  });

  describe('degrees minutes seconds (dms) format', () => {
    it('should format without compass', () => {
      expect(toStringFromWGS(newYork, { format: 'dms' })).toBe(
        '40° 44\' 56.04", -73° 58\' 4.8"',
      );
    });

    it('should format with compass', () => {
      expect(toStringFromWGS(newYork, { format: 'dms', compass: true })).toBe(
        '40° 44\' 56.04"N, 73° 58\' 4.8"W',
      );
    });

    it('should format in lonlat order', () => {
      expect(toStringFromWGS(paris, { format: 'dms', order: 'lonlat' })).toBe(
        '2° 17\' 40.2", 48° 51\' 30.24"',
      );
    });

    it('should format in lonlat order with compass', () => {
      expect(
        toStringFromWGS(paris, {
          format: 'dms',
          compass: true,
          order: 'lonlat',
        }),
      ).toBe('2° 17\' 40.2"E, 48° 51\' 30.24"N');
    });

    it('should handle boundary values', () => {
      expect(
        toStringFromWGS(
          { lat: 90, lon: 180 },
          { format: 'dms', compass: true },
        ),
      ).toBe('90° 0\' 0"N, 180° 0\' 0"E');
    });

    it('should handle negative boundary values with compass', () => {
      expect(
        toStringFromWGS(
          { lat: -90, lon: -180 },
          { format: 'dms', compass: true },
        ),
      ).toBe('90° 0\' 0"S, 180° 0\' 0"W');
    });
  });

  describe('compass direction logic', () => {
    it('should use N for positive latitude', () => {
      expect(toStringFromWGS({ lat: 45, lon: 0 }, { compass: true })).toBe(
        '45°N, 0°E',
      );
    });

    it('should use S for negative latitude', () => {
      expect(toStringFromWGS({ lat: -45, lon: 0 }, { compass: true })).toBe(
        '45°S, 0°E',
      );
    });

    it('should use E for positive longitude', () => {
      expect(toStringFromWGS({ lat: 0, lon: 90 }, { compass: true })).toBe(
        '0°N, 90°E',
      );
    });

    it('should use W for negative longitude', () => {
      expect(toStringFromWGS({ lat: 0, lon: -90 }, { compass: true })).toBe(
        '0°N, 90°W',
      );
    });

    it('should handle zero latitude (defaults to N)', () => {
      expect(toStringFromWGS({ lat: 0, lon: 100 }, { compass: true })).toBe(
        '0°N, 100°E',
      );
    });

    it('should handle zero longitude (defaults to E)', () => {
      expect(toStringFromWGS({ lat: 45, lon: 0 }, { compass: true })).toBe(
        '45°N, 0°E',
      );
    });
  });

  describe('combined options', () => {
    it('should handle all options together (ddm, lonlat, compass)', () => {
      expect(
        toStringFromWGS(newYork, {
          format: 'ddm',
          order: 'lonlat',
          compass: true,
        }),
      ).toBe("73° 58.08'W, 40° 44.934'N");
    });

    it('should handle all options together (dms, latlon, compass)', () => {
      expect(
        toStringFromWGS(paris, {
          format: 'dms',
          order: 'latlon',
          compass: true,
        }),
      ).toBe('48° 51\' 30.24"N, 2° 17\' 40.2"E');
    });
  });

  describe('precision and edge cases', () => {
    it('should handle very small decimal values', () => {
      expect(
        toStringFromWGS({ lat: 0.0001, lon: 0.0001 }, { format: 'dd' }),
      ).toBe('0.0001°, 0.0001°');
    });

    it('should handle coordinates near boundaries', () => {
      expect(
        toStringFromWGS({ lat: 89.9999, lon: 179.9999 }, { format: 'dd' }),
      ).toBe('89.9999°, 179.9999°');
    });

    it('should maintain precision in ddm format', () => {
      const result = toStringFromWGS(
        { lat: 40.123456, lon: -73.987654 },
        { format: 'ddm' },
      );
      expect(result).toMatch(/40° 7\.4074'/);
      expect(result).toMatch(/-73° 59\.2592'/);
    });

    it('should maintain precision in dms format', () => {
      const result = toStringFromWGS(
        { lat: 40.123456, lon: -73.987654 },
        { format: 'dms' },
      );
      expect(result).toMatch(/40° 7' 24\.4416"/);
      expect(result).toMatch(/-73° 59' 15\.5544"/);
    });
  });
});
