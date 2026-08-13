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
import {
  buildRotateStemLine,
  computePolygonBounds,
  computeRotateStemTip,
} from './transform-mode-guides';
import type { Position } from 'geojson';

describe('computePolygonBounds', () => {
  it('returns null for an undefined ring', () => {
    expect(computePolygonBounds(undefined)).toBeNull();
  });

  it('returns null for a ring with fewer than 4 vertices', () => {
    const tooShort: Position[] = [
      [0, 0],
      [1, 0],
      [0, 0],
    ];

    expect(computePolygonBounds(tooShort)).toBeNull();
  });

  it('computes bbox and topVertex from a CCW rectangle ring', () => {
    // Rectangle covering [0..2] lon × [0..1] lat, with closing duplicate.
    const ring: Position[] = [
      [0, 0],
      [2, 0],
      [2, 1],
      [0, 1],
      [0, 0],
    ];

    expect(computePolygonBounds(ring)).toEqual({
      topVertex: [2, 1],
      minLat: 0,
      maxLat: 1,
      minLon: 0,
      maxLon: 2,
    });
  });

  it('picks the first vertex with the maximum latitude as topVertex', () => {
    // Two vertices share lat=1; the first one encountered wins.
    const ring: Position[] = [
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
      [0, 1],
    ];

    expect(computePolygonBounds(ring)?.topVertex).toEqual([0, 1]);
  });

  it('skips the closing duplicate vertex', () => {
    // If the closing vertex were counted, maxLon would be 5 instead of 2.
    const ring: Position[] = [
      [0, 0],
      [2, 0],
      [2, 1],
      [0, 1],
      [5, 0], // pretend closing duplicate that's actually farther east
    ];

    // The function uses lastIdx = ring.length - 1, so it iterates indices
    // 0..3 only and never sees [5, 0].
    expect(computePolygonBounds(ring)?.maxLon).toBe(2);
  });
});

describe('computeRotateStemTip', () => {
  it('preserves the base longitude (offset is added to lat only)', () => {
    const base: [number, number] = [-100, 40];
    const bounds = {
      topVertex: [-99.5, 40.5] as [number, number],
      minLat: 39.5,
      maxLat: 40.5,
      minLon: -100.5,
      maxLon: -99.5,
    };

    expect(computeRotateStemTip(base, bounds)[0]).toBe(-100);
  });

  it('offsets base latitude by max(widthKm, heightKm) / 1000 at the equator', () => {
    // Roughly 1°×1° bbox at equator: each edge ≈ 111 km.
    // Expected offset = 111 / 1000 = 0.111 lat-degrees (within rounding).
    const base: [number, number] = [0, 0];
    const bounds = {
      topVertex: [1, 1] as [number, number],
      minLat: -1,
      maxLat: 1,
      minLon: -1,
      maxLon: 1,
    };

    const tip = computeRotateStemTip(base, bounds);
    const offset = tip[1] - base[1];

    // The bbox is 2°×2° here (-1 to 1 in both axes), so each edge is ≈222 km
    // and the offset is ≈0.222.
    expect(offset).toBeGreaterThan(0.2);
    expect(offset).toBeLessThan(0.25);
  });

  it('uses the longer axis (width vs height) when bbox is rectangular', () => {
    // Wide bbox: 4° wide × 1° tall at equator. Width dominates.
    const base: [number, number] = [0, 0];
    const bounds = {
      topVertex: [2, 0.5] as [number, number],
      minLat: -0.5,
      maxLat: 0.5,
      minLon: -2,
      maxLon: 2,
    };

    const tip = computeRotateStemTip(base, bounds);
    const offset = tip[1] - base[1];

    // Width ≈ 444 km → offset ≈ 0.444 lat-degrees.
    expect(offset).toBeGreaterThan(0.4);
    expect(offset).toBeLessThan(0.5);
  });
});

describe('buildRotateStemLine', () => {
  it('returns a LineString feature with mode rotate-stem', () => {
    const base: [number, number] = [-100, 40];
    const tip: [number, number] = [-100, 40.2];

    const stem = buildRotateStemLine(base, tip);

    expect(stem).toEqual({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [base, tip],
      },
      properties: { mode: 'rotate-stem' },
    });
  });
});
