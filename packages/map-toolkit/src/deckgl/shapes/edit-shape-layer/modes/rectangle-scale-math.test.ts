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
  latToMercatorY,
  mercatorYToLat,
  recomputeRectangleCorners,
} from './rectangle-scale-math';
import type { Position } from 'geojson';

/**
 * Build the four corners of a rotated rectangle, in CCW (lon, lat) order
 * matching the convention used by `createRectangleShape`. Math is performed
 * in Mercator-projected space so the result is a true rectangle on the map.
 */
function buildRotatedRectangle(
  centerLon: number,
  centerLat: number,
  widthDeg: number,
  heightDeg: number,
  rotationDeg: number,
): Position[] {
  const centerMercY = latToMercatorY(centerLat);
  const halfW = widthDeg / 2;
  const halfH = heightDeg / 2;
  const theta = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  // Pre-rotation corners in (mercX, mercY) space relative to center.
  const local: [number, number][] = [
    [-halfW, -halfH],
    [halfW, -halfH],
    [halfW, halfH],
    [-halfW, halfH],
  ];

  return local.map(([lx, ly]) => {
    const rx = cos * lx - sin * ly;
    const ry = sin * lx + cos * ly;

    return [centerLon + rx, mercatorYToLat(centerMercY + ry)];
  });
}

describe('latToMercatorY / mercatorYToLat', () => {
  it.each([
    ['equator', 0],
    ['mid-northern', 45],
    ['mid-southern', -45],
    ['near north pole', 89.9],
    ['near south pole', -89.9],
    ['tiny positive', 0.000001],
    ['tiny negative', -0.000001],
    ['arbitrary northern', 37.7749],
    ['arbitrary southern', -33.8688],
  ])('roundtrips %s latitude (%f) without drift', (_label, lat) => {
    const roundtrip = mercatorYToLat(latToMercatorY(lat));

    expect(roundtrip).toBeCloseTo(lat, 9);
  });

  it('clamps latitudes outside the (-89.999999, 89.999999) range', () => {
    expect(latToMercatorY(90)).toBe(latToMercatorY(89.999999));
    expect(latToMercatorY(-90)).toBe(latToMercatorY(-89.999999));
  });
});

describe('recomputeRectangleCorners', () => {
  /**
   * Each case dragger-back-to-self covers a representative rectangle: a
   * different mix of position, size, rotation, dragged corner, and whether
   * Shift (lockAspect) is held.
   */
  const dragBackCases = [
    {
      label: 'axis-aligned at equator, drag corner 0, free scale',
      centerLon: 0,
      centerLat: 0,
      widthDeg: 2,
      heightDeg: 1,
      rotationDeg: 0,
      draggedIdx: 0,
      lockAspect: false,
    },
    {
      label: 'axis-aligned at equator, drag corner 1, free scale',
      centerLon: 0,
      centerLat: 0,
      widthDeg: 2,
      heightDeg: 1,
      rotationDeg: 0,
      draggedIdx: 1,
      lockAspect: false,
    },
    {
      label: 'axis-aligned at equator, drag corner 2, free scale',
      centerLon: 0,
      centerLat: 0,
      widthDeg: 2,
      heightDeg: 1,
      rotationDeg: 0,
      draggedIdx: 2,
      lockAspect: false,
    },
    {
      label: 'axis-aligned at equator, drag corner 3, free scale',
      centerLon: 0,
      centerLat: 0,
      widthDeg: 2,
      heightDeg: 1,
      rotationDeg: 0,
      draggedIdx: 3,
      lockAspect: false,
    },
    {
      label: '45° rotated, mid-northern lat, drag corner 0',
      centerLon: -120,
      centerLat: 45,
      widthDeg: 1.5,
      heightDeg: 1,
      rotationDeg: 45,
      draggedIdx: 0,
      lockAspect: false,
    },
    {
      label: '45° rotated, mid-northern lat, drag corner 2 with lock-aspect',
      centerLon: -120,
      centerLat: 45,
      widthDeg: 1.5,
      heightDeg: 1,
      rotationDeg: 45,
      draggedIdx: 2,
      lockAspect: true,
    },
    {
      label: 'arbitrary rotation (17.3°) southern hemisphere',
      centerLon: 30,
      centerLat: -33.8688,
      widthDeg: 0.8,
      heightDeg: 0.4,
      rotationDeg: 17.3,
      draggedIdx: 1,
      lockAspect: false,
    },
    {
      label: 'arbitrary rotation southern hemisphere with lock-aspect',
      centerLon: 30,
      centerLat: -33.8688,
      widthDeg: 0.8,
      heightDeg: 0.4,
      rotationDeg: 17.3,
      draggedIdx: 3,
      lockAspect: true,
    },
    {
      label: 'tiny rectangle near the equator',
      centerLon: 0,
      centerLat: 0,
      widthDeg: 0.01,
      heightDeg: 0.01,
      rotationDeg: 30,
      draggedIdx: 0,
      lockAspect: false,
    },
    {
      label: 'large rectangle at high latitude',
      centerLon: -100,
      centerLat: 70,
      widthDeg: 5,
      heightDeg: 3,
      rotationDeg: 22.5,
      draggedIdx: 2,
      lockAspect: false,
    },
    {
      label: 'negative rotation (-90°)',
      centerLon: 0,
      centerLat: 0,
      widthDeg: 2,
      heightDeg: 1,
      rotationDeg: -90,
      draggedIdx: 1,
      lockAspect: true,
    },
  ];

  it.each(
    dragBackCases,
  )('dragging a corner back to itself returns the original rectangle: $label', ({
    centerLon,
    centerLat,
    widthDeg,
    heightDeg,
    rotationDeg,
    draggedIdx,
    lockAspect,
  }) => {
    const corners = buildRotatedRectangle(
      centerLon,
      centerLat,
      widthDeg,
      heightDeg,
      rotationDeg,
    );
    const dragged = corners[draggedIdx] as Position;

    const result = recomputeRectangleCorners(
      corners,
      draggedIdx,
      dragged,
      lockAspect,
    );

    expect(result).not.toBeNull();

    if (!result) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      const original = corners[i] as Position;
      const recomputed = result[i] as Position;

      expect(recomputed[0]).toBeCloseTo(original[0] as number, 6);
      expect(recomputed[1]).toBeCloseTo(original[1] as number, 6);
    }
  });

  it('returns null when fewer than 4 corners are provided', () => {
    expect(
      recomputeRectangleCorners(
        [
          [0, 0],
          [1, 0],
        ],
        0,
        [2, 0],
        false,
      ),
    ).toBeNull();
  });

  it('returns null when a degenerate edge length is zero', () => {
    // adjU and opp are colocated → edgeU has length 0.
    const collapsed: Position[] = [
      [0, 0],
      [1, 1],
      [1, 1],
      [0, 0],
    ];

    expect(recomputeRectangleCorners(collapsed, 0, [2, 2], false)).toBeNull();
  });
});
