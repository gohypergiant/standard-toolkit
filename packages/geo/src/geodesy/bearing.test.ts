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
import { bearing } from './bearing';

describe('bearing', () => {
  describe('cardinal directions', () => {
    it('returns 0 for due north', () => {
      expect(bearing([0, 0], [0, 1])).toBe(0);
    });

    it('returns 90 for due east', () => {
      expect(bearing([0, 0], [1, 0])).toBeCloseTo(90, 5);
    });

    it('returns 180 for due south', () => {
      expect(bearing([0, 1], [0, 0])).toBeCloseTo(180, 5);
    });

    it('returns 270 for due west', () => {
      expect(bearing([1, 0], [0, 0])).toBeCloseTo(270, 5);
    });
  });

  describe('known coordinate pairs', () => {
    it('returns northeast bearing from origin to northeast point', () => {
      const result = bearing([0, 0], [1, 1]);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(90);
    });

    it('returns southwest bearing from origin to southwest point', () => {
      const result = bearing([0, 0], [-1, -1]);
      expect(result).toBeGreaterThan(180);
      expect(result).toBeLessThan(270);
    });

    it('computes correct bearing from London to Paris (~148°)', () => {
      // London: [-0.1278, 51.5074], Paris: [2.3522, 48.8566]
      const result = bearing([-0.1278, 51.5074], [2.3522, 48.8566]);
      expect(result).toBeCloseTo(148.4, 0);
    });
  });

  describe('edge cases', () => {
    it('returns 0 for identical coordinates (zero distance)', () => {
      expect(bearing([10, 20], [10, 20])).toBe(0);
    });

    it('handles antimeridian crossing correctly', () => {
      // From 179°E to 179°W crosses the antimeridian going east
      const result = bearing([179, 0], [-179, 0]);
      expect(result).toBeCloseTo(90, 0);
    });

    it('handles antipodal points', () => {
      // Antipodal points: bearing is technically undefined, but geodesy returns a value
      const result = bearing([0, 90], [0, -90]);
      expect(typeof result).toBe('number');
    });
  });
});
