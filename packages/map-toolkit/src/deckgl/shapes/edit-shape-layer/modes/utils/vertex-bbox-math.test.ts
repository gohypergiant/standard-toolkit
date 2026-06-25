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
import { computeOrientedBoundingBox } from './vertex-bbox-math';
import type { Feature, LineString, Point, Polygon } from 'geojson';

const BUFFER_RATIO = 0.03;

/**
 * Square polygon at the equator with extent ±1° on both axes. Choosing
 * the equator keeps the great-circle distances symmetric on lat and lon
 * so the bbox math reads as a clean rectangle in local coordinates.
 */
function makeUnitSquare(): Feature<Polygon> {
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1],
        ],
      ],
    },
    properties: {},
  };
}

function makeLineString(coords: [number, number][]): Feature<LineString> {
  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: coords },
    properties: {},
  };
}

function makePointFeature(): Feature<Point> {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: {},
  };
}

describe('computeOrientedBoundingBox', () => {
  it('should return null for an unsupported geometry type', () => {
    const result = computeOrientedBoundingBox(makePointFeature(), 0);

    expect(result).toBeNull();
  });

  it('should return null for a LineString with fewer than two vertices', () => {
    const result = computeOrientedBoundingBox(makeLineString([[0, 0]]), 0);

    expect(result).toBeNull();
  });

  it('should return a full OrientedBoundingBox for a unit square at angle 0', () => {
    const result = computeOrientedBoundingBox(makeUnitSquare(), 0);

    expect(result).not.toBeNull();
    expect(result?.bottomLeft).toHaveLength(2);
    expect(result?.bottomRight).toHaveLength(2);
    expect(result?.topRight).toHaveLength(2);
    expect(result?.topLeft).toHaveLength(2);
    expect(result?.stemBase).toHaveLength(2);
    expect(result?.stemTip).toHaveLength(2);
  });

  it('should produce a buffered axis-aligned box at angle 0', () => {
    const result = computeOrientedBoundingBox(makeUnitSquare(), 0);
    // Buffer = longestSide (= 2 in local Mercator) × 0.03 ≈ 0.06, applied
    // outward on each side. At angle 0 the un-rotate-then-rotate
    // round-trip is identity in Mercator space, so the world-frame
    // corners are the world bbox shifted outward by the buffer.
    //
    // Precision is relaxed from 6 to 3 decimals because the OBB now
    // operates in Mercator space (`latToMercatorY` is non-linear). For a
    // 1°-tall square at the equator that round-trip introduces a ~3e-6
    // y-axis deviation, and the buffer (3% of the longest *local*
    // dimension) scales with the Mercator-y span, so the x-axis bounds
    // pick up the same ~3e-6 deviation indirectly.
    const expectedExtent = 1 + 2 * BUFFER_RATIO;

    expect(result?.bottomLeft[0]).toBeCloseTo(-expectedExtent, 3);
    expect(result?.bottomLeft[1]).toBeCloseTo(-expectedExtent, 3);
    expect(result?.bottomRight[0]).toBeCloseTo(expectedExtent, 3);
    expect(result?.bottomRight[1]).toBeCloseTo(-expectedExtent, 3);
    expect(result?.topRight[0]).toBeCloseTo(expectedExtent, 3);
    expect(result?.topRight[1]).toBeCloseTo(expectedExtent, 3);
    expect(result?.topLeft[0]).toBeCloseTo(-expectedExtent, 3);
    expect(result?.topLeft[1]).toBeCloseTo(expectedExtent, 3);
  });

  it('should place the stem above the top edge at angle 0', () => {
    const result = computeOrientedBoundingBox(makeUnitSquare(), 0);
    const topEdgeY = 1 + 2 * BUFFER_RATIO;

    expect(result?.stemBase[0]).toBeCloseTo(0, 6);
    // Precision relaxed — see note in the buffered-axis-aligned test.
    expect(result?.stemBase[1]).toBeCloseTo(topEdgeY, 3);
    expect(result?.stemTip[0]).toBeCloseTo(0, 6);
    // Stem tip is *above* the top edge (greater latitude).
    expect(result?.stemTip[1]).toBeGreaterThan(result?.stemBase[1] ?? 0);
  });

  it('should rotate corners compass-positive (CW) when angle is 90', () => {
    const zero = computeOrientedBoundingBox(makeUnitSquare(), 0);
    const ninety = computeOrientedBoundingBox(makeUnitSquare(), 90);
    // At angle 90 (compass-CW: north → east), the local bbox is the
    // same rectangle but mapped back to world via the compass-positive
    // rotation:
    //   (localX, localY) → (localX·cos α + localY·sin α,
    //                       −localX·sin α + localY·cos α)
    // With α = 90°: (lx, ly) → (ly, -lx). So the world position that
    // was at +X in the un-rotated box appears at -Y after rotation.
    //
    // Comparing across angles round-trips through `mercatorYToLat`
    // twice in different directions, so the y-axis deviation compounds
    // to ~1e-5. Precision relaxed accordingly.
    expect(ninety?.bottomLeft[0]).toBeCloseTo(zero?.bottomLeft[1] ?? 0, 3);
    expect(ninety?.bottomLeft[1]).toBeCloseTo(-(zero?.bottomLeft[0] ?? 0), 3);
    expect(ninety?.topRight[0]).toBeCloseTo(zero?.topRight[1] ?? 0, 3);
    expect(ninety?.topRight[1]).toBeCloseTo(-(zero?.topRight[0] ?? 0), 3);
  });

  it('should produce equivalent corners at angle 0 and angle 360', () => {
    const zero = computeOrientedBoundingBox(makeUnitSquare(), 0);
    const fullTurn = computeOrientedBoundingBox(makeUnitSquare(), 360);

    expect(fullTurn?.bottomLeft[0]).toBeCloseTo(zero?.bottomLeft[0] ?? 0, 6);
    expect(fullTurn?.bottomLeft[1]).toBeCloseTo(zero?.bottomLeft[1] ?? 0, 6);
    expect(fullTurn?.topRight[0]).toBeCloseTo(zero?.topRight[0] ?? 0, 6);
    expect(fullTurn?.topRight[1]).toBeCloseTo(zero?.topRight[1] ?? 0, 6);
  });

  it('should compute a non-null bounding box for a LineString', () => {
    const line = makeLineString([
      [0, 0],
      [2, 0],
      [2, 2],
    ]);

    const result = computeOrientedBoundingBox(line, 0);

    expect(result).not.toBeNull();
    // The bbox spans the line's extent (0..2 on both axes) plus the
    // proportional buffer.
    expect(result?.bottomLeft[0]).toBeLessThan(0);
    expect(result?.bottomLeft[1]).toBeLessThan(0);
    expect(result?.topRight[0]).toBeGreaterThan(2);
    expect(result?.topRight[1]).toBeGreaterThan(2);
  });
});
