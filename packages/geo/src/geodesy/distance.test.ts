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
import { distance } from './distance';

describe('distance', () => {
  describe('known distances', () => {
    it('returns approximately 111195 meters for 1 degree of latitude at equator', () => {
      // 1 degree of latitude ≈ 111,195 m
      const result = distance([0, 0], [0, 1]);
      expect(result).toBeCloseTo(111195, -2);
    });

    it('computes distance from London to Paris (~343556 m)', () => {
      // London: [-0.1278, 51.5074], Paris: [2.3522, 48.8566]
      const result = distance([-0.1278, 51.5074], [2.3522, 48.8566]);
      expect(result).toBeCloseTo(343556, -2);
    });

    it('returns a positive distance for non-identical coordinates', () => {
      const result = distance([10, 20], [11, 21]);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('returns 0 for identical coordinates', () => {
      expect(distance([10, 20], [10, 20])).toBe(0);
    });

    it('returns 0 for origin coordinates', () => {
      expect(distance([0, 0], [0, 0])).toBe(0);
    });

    it('handles antipodal points', () => {
      // Distance between north and south pole ≈ half Earth circumference ≈ 20,015,087 m
      const result = distance([0, 90], [0, -90]);
      expect(result).toBeCloseTo(20015087, -2);
    });

    it('handles antimeridian crossing', () => {
      // Points straddling the antimeridian at same latitude
      const result = distance([179, 0], [-179, 0]);
      expect(result).toBeGreaterThan(0);
      // Should be about 222,390 m (2 degrees of longitude at equator)
      expect(result).toBeCloseTo(222390, -2);
    });
  });
});
