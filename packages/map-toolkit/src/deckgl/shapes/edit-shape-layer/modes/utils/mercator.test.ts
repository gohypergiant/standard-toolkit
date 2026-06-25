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
import { latToMercatorY, mercatorYToLat } from './mercator';

describe('latToMercatorY', () => {
  it('should map the equator to 0', () => {
    // Exact equality fails by ~1e-17 because `Math.tan(Math.PI / 4)` is
    // 0.9999999999999999, not exactly 1 (the input π/4 isn't exactly
    // representable in double precision).
    expect(latToMercatorY(0)).toBeCloseTo(0, 13);
  });

  it('should be sign-symmetric across the equator', () => {
    for (const lat of [10, 30, 45, 60, 80]) {
      expect(latToMercatorY(-lat)).toBeCloseTo(-latToMercatorY(lat), 10);
    }
  });

  it('should grow monotonically with latitude', () => {
    const sample = [-80, -60, -30, -10, 0, 10, 30, 60, 80];

    for (let i = 1; i < sample.length; i++) {
      expect(latToMercatorY(sample[i] as number)).toBeGreaterThan(
        latToMercatorY(sample[i - 1] as number),
      );
    }
  });

  it('should grow faster than linearly near the poles', () => {
    // The Mercator projection stretches the distance between latitudes as
    // they approach the poles. 80°→85° should map to a larger interval
    // than 0°→5°, which is the defining property of the projection.
    const lowLatStep = latToMercatorY(5) - latToMercatorY(0);
    const highLatStep = latToMercatorY(85) - latToMercatorY(80);

    expect(highLatStep).toBeGreaterThan(lowLatStep);
  });

  it('should clamp latitudes outside ±89.999999 to avoid the polar singularity', () => {
    // Anything past the clamp threshold should map to the same finite
    // Mercator-y as the clamp itself rather than diverging to ±∞.
    const clampedNorth = latToMercatorY(89.999999);
    const beyondNorth = latToMercatorY(90);

    expect(Number.isFinite(clampedNorth)).toBe(true);
    expect(beyondNorth).toBe(clampedNorth);
  });
});

describe('mercatorYToLat', () => {
  it('should map 0 back to the equator', () => {
    expect(mercatorYToLat(0)).toBe(0);
  });

  it('should round-trip through latToMercatorY for typical latitudes', () => {
    // Lat → MercY → Lat reproduces the input within floating-point
    // precision across the usable range. This is the load-bearing
    // property of the projection helpers: both rectangle-scale-math and
    // ellipse-scale-math rely on it.
    for (const lat of [-85, -60, -30, -1, 0, 1, 30, 60, 85]) {
      expect(mercatorYToLat(latToMercatorY(lat))).toBeCloseTo(lat, 10);
    }
  });
});
