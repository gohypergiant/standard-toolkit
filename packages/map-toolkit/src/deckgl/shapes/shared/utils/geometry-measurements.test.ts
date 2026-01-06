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
import {
  computeCircleMeasurements,
  computeEllipseMeasurementsFromAxes,
  computeRectangleMeasurementsFromCorners,
} from './geometry-measurements';

describe('geometry-measurements', () => {
  describe('computeCircleMeasurements', () => {
    it('computes radius from center and edge point', () => {
      // San Francisco coordinates
      const center: [number, number] = [-122.4194, 37.7749];
      // Point approximately 10km east (longitude increases eastward)
      const edgePoint: [number, number] = [-122.3094, 37.7749];

      const result = computeCircleMeasurements(center, edgePoint, 'kilometers');

      // Should be approximately 10km (geodesic distance)
      expect(result.radius).toBeCloseTo(9.4, 0);
    });

    it('computes diameter as 2x radius', () => {
      const center: [number, number] = [-122.4194, 37.7749];
      const edgePoint: [number, number] = [-122.3094, 37.7749];

      const result = computeCircleMeasurements(center, edgePoint, 'kilometers');

      expect(result.diameter).toBeCloseTo(result.radius * 2, 10);
    });

    it('computes area as π * radius²', () => {
      const center: [number, number] = [-122.4194, 37.7749];
      const edgePoint: [number, number] = [-122.3094, 37.7749];

      const result = computeCircleMeasurements(center, edgePoint, 'kilometers');

      const expectedArea = Math.PI * result.radius ** 2;
      expect(result.area).toBeCloseTo(expectedArea, 10);
    });

    it('returns zero measurements when center equals edge point', () => {
      const center: [number, number] = [-122.4194, 37.7749];

      const result = computeCircleMeasurements(center, center, 'kilometers');

      expect(result.radius).toBe(0);
      expect(result.diameter).toBe(0);
      expect(result.area).toBe(0);
    });

    it('works with different distance units', () => {
      const center: [number, number] = [-122.4194, 37.7749];
      const edgePoint: [number, number] = [-122.3094, 37.7749];

      const kmResult = computeCircleMeasurements(
        center,
        edgePoint,
        'kilometers',
      );
      const mResult = computeCircleMeasurements(center, edgePoint, 'meters');
      const miResult = computeCircleMeasurements(center, edgePoint, 'miles');

      // Meters should be ~1000x kilometers
      expect(mResult.radius).toBeCloseTo(kmResult.radius * 1000, -1);
      // Miles should be less than kilometers (1 mile ≈ 1.609 km)
      expect(miResult.radius).toBeLessThan(kmResult.radius);
    });

    it('handles points at different latitudes', () => {
      // Center near equator
      const center: [number, number] = [0, 0];
      // Point 1 degree north
      const edgePoint: [number, number] = [0, 1];

      const result = computeCircleMeasurements(center, edgePoint, 'kilometers');

      // 1 degree of latitude is approximately 111km
      expect(result.radius).toBeCloseTo(111, 0);
    });

    it('handles negative coordinates', () => {
      // Southern hemisphere
      const center: [number, number] = [-70.6693, -33.4489]; // Santiago, Chile
      const edgePoint: [number, number] = [-70.5693, -33.4489];

      const result = computeCircleMeasurements(center, edgePoint, 'kilometers');

      expect(result.radius).toBeGreaterThan(0);
      expect(result.diameter).toBeGreaterThan(0);
      expect(result.area).toBeGreaterThan(0);
    });
  });

  describe('computeEllipseMeasurementsFromAxes', () => {
    it('computes major and minor axes from semi-axes', () => {
      const xSemiAxis = 100; // horizontal radius
      const ySemiAxis = 50; // vertical radius

      const result = computeEllipseMeasurementsFromAxes(xSemiAxis, ySemiAxis);

      // Major axis is the longer one (x in this case)
      expect(result.majorAxis).toBe(200);
      expect(result.minorAxis).toBe(100);
    });

    it('identifies major axis correctly when y is larger', () => {
      const xSemiAxis = 30;
      const ySemiAxis = 80;

      const result = computeEllipseMeasurementsFromAxes(xSemiAxis, ySemiAxis);

      // Major axis should be the larger one (y in this case)
      expect(result.majorAxis).toBe(160);
      expect(result.minorAxis).toBe(60);
    });

    it('handles equal semi-axes (circle case)', () => {
      const semiAxis = 50;

      const result = computeEllipseMeasurementsFromAxes(semiAxis, semiAxis);

      expect(result.majorAxis).toBe(100);
      expect(result.minorAxis).toBe(100);
      expect(result.xSemiAxis).toBe(50);
      expect(result.ySemiAxis).toBe(50);
    });

    it('computes area as π * xSemiAxis * ySemiAxis', () => {
      const xSemiAxis = 100;
      const ySemiAxis = 50;

      const result = computeEllipseMeasurementsFromAxes(xSemiAxis, ySemiAxis);

      const expectedArea = Math.PI * xSemiAxis * ySemiAxis;
      expect(result.area).toBeCloseTo(expectedArea, 10);
    });

    it('returns zero area when either axis is zero', () => {
      const result1 = computeEllipseMeasurementsFromAxes(0, 50);
      const result2 = computeEllipseMeasurementsFromAxes(100, 0);

      expect(result1.area).toBe(0);
      expect(result2.area).toBe(0);
    });

    it('preserves original semi-axis values in result', () => {
      const xSemiAxis = 75.5;
      const ySemiAxis = 42.3;

      const result = computeEllipseMeasurementsFromAxes(xSemiAxis, ySemiAxis);

      expect(result.xSemiAxis).toBe(xSemiAxis);
      expect(result.ySemiAxis).toBe(ySemiAxis);
    });

    it('handles very small values', () => {
      const xSemiAxis = 0.001;
      const ySemiAxis = 0.002;

      const result = computeEllipseMeasurementsFromAxes(xSemiAxis, ySemiAxis);

      expect(result.majorAxis).toBeCloseTo(0.004, 10);
      expect(result.minorAxis).toBeCloseTo(0.002, 10);
      expect(result.area).toBeCloseTo(Math.PI * 0.001 * 0.002, 10);
    });

    it('handles very large values', () => {
      const xSemiAxis = 1000000;
      const ySemiAxis = 500000;

      const result = computeEllipseMeasurementsFromAxes(xSemiAxis, ySemiAxis);

      expect(result.majorAxis).toBe(2000000);
      expect(result.minorAxis).toBe(1000000);
    });
  });

  describe('computeRectangleMeasurementsFromCorners', () => {
    it('computes width and height from adjacent corners', () => {
      // Define a rectangle with corners going clockwise
      // Corner 0 -> Corner 1 is width, Corner 1 -> Corner 2 is height
      const corner0: [number, number] = [-122.4, 37.8];
      const corner1: [number, number] = [-122.3, 37.8]; // ~8.5km east
      const corner2: [number, number] = [-122.3, 37.7]; // ~11km south

      const result = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        'kilometers',
      );

      // Width should be approximately the distance from corner0 to corner1
      expect(result.width).toBeGreaterThan(0);
      // Height should be approximately the distance from corner1 to corner2
      expect(result.height).toBeGreaterThan(0);
    });

    it('computes area as width * height', () => {
      const corner0: [number, number] = [-122.4, 37.8];
      const corner1: [number, number] = [-122.3, 37.8];
      const corner2: [number, number] = [-122.3, 37.7];

      const result = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        'kilometers',
      );

      expect(result.area).toBeCloseTo(result.width * result.height, 10);
    });

    it('handles a square (equal width and height)', () => {
      // Create a roughly square region (accounting for lat/long distortion)
      const corner0: [number, number] = [0, 0];
      const corner1: [number, number] = [0.1, 0]; // ~11km east at equator
      const corner2: [number, number] = [0.1, 0.1]; // ~11km north

      const result = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        'kilometers',
      );

      // At the equator, degrees are roughly equal in km
      expect(result.width).toBeCloseTo(result.height, 0);
    });

    it('works with different distance units', () => {
      const corner0: [number, number] = [-122.4, 37.8];
      const corner1: [number, number] = [-122.3, 37.8];
      const corner2: [number, number] = [-122.3, 37.7];

      const kmResult = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        'kilometers',
      );
      const mResult = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        'meters',
      );

      // Meters should be ~1000x kilometers
      expect(mResult.width).toBeCloseTo(kmResult.width * 1000, -1);
      expect(mResult.height).toBeCloseTo(kmResult.height * 1000, -1);
    });

    it('returns zero dimensions when corners are the same point', () => {
      const corner: [number, number] = [-122.4, 37.8];

      const result = computeRectangleMeasurementsFromCorners(
        corner,
        corner,
        corner,
        'kilometers',
      );

      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
      expect(result.area).toBe(0);
    });

    it('handles collinear corners (degenerate rectangle)', () => {
      // All three corners on the same line
      const corner0: [number, number] = [-122.4, 37.8];
      const corner1: [number, number] = [-122.3, 37.8];
      const corner2: [number, number] = [-122.2, 37.8];

      const result = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        'kilometers',
      );

      // Width should be non-zero (corner0 to corner1)
      expect(result.width).toBeGreaterThan(0);
      // Height should also be non-zero (corner1 to corner2) - this is geodesic
      expect(result.height).toBeGreaterThan(0);
    });

    it('handles negative coordinates', () => {
      // Southern hemisphere
      const corner0: [number, number] = [-70.7, -33.5];
      const corner1: [number, number] = [-70.6, -33.5];
      const corner2: [number, number] = [-70.6, -33.4];

      const result = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        'kilometers',
      );

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.area).toBeGreaterThan(0);
    });

    it('handles coordinates crossing the prime meridian', () => {
      const corner0: [number, number] = [-0.1, 51.5]; // West of Greenwich
      const corner1: [number, number] = [0.1, 51.5]; // East of Greenwich
      const corner2: [number, number] = [0.1, 51.6];

      const result = computeRectangleMeasurementsFromCorners(
        corner0,
        corner1,
        corner2,
        'kilometers',
      );

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });
  });
});
