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
  type EllipseAxisHandle,
  recomputeEllipseScaleFactors,
} from './ellipse-scale-math';
import { latToMercatorY, mercatorYToLat } from './mercator';
import type { Position } from 'geojson';

/**
 * Build axis-endpoint positions for a synthetic ellipse parameterized in
 * Mercator-space units (so test inputs and expected outputs are easy to
 * reason about without involving turf's rhumb math).
 *
 * The ellipse local x-axis is rotated by `rotationDeg` clockwise from the
 * Mercator x-axis (Mercator north). Returns `[+xEndpoint, +yEndpoint]`,
 * which is what the math function needs to derive both axes (the negative
 * endpoints are implied by reflection across the center).
 */
function buildAxisEndpoints(
  centerLon: number,
  centerLat: number,
  xSemiDeg: number,
  ySemiDeg: number,
  rotationDeg: number,
): { plusX: Position; plusY: Position } {
  const centerMercY = latToMercatorY(centerLat);
  const theta = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  // +xSemi endpoint: along local x-axis (rotated by `theta`).
  const plusXMercDx = xSemiDeg * cos;
  const plusXMercDy = xSemiDeg * sin;

  // +ySemi endpoint: along local y-axis (rotated by `theta + 90°`).
  const plusYMercDx = -ySemiDeg * sin;
  const plusYMercDy = ySemiDeg * cos;

  return {
    plusX: [centerLon + plusXMercDx, mercatorYToLat(centerMercY + plusXMercDy)],
    plusY: [centerLon + plusYMercDx, mercatorYToLat(centerMercY + plusYMercDy)],
  };
}

describe('recomputeEllipseScaleFactors', () => {
  /**
   * Each case exercises a single drag scenario. The expected scale factors
   * are derived from the geometry: dragging an axis endpoint by a known
   * displacement should multiply the corresponding semi-axis by a known
   * factor.
   */
  const cases: {
    label: string;
    centerLon: number;
    centerLat: number;
    xSemiDeg: number;
    ySemiDeg: number;
    rotationDeg: number;
    handle: EllipseAxisHandle;
    /** Displacement applied to the dragged endpoint, in Mercator-degree units. */
    dragDistance: number;
    lockAspect: boolean;
    expectedXScale: number;
    expectedYScale: number;
  }[] = [
    {
      label: 'axis-aligned: drag +x endpoint outward, free',
      centerLon: 0,
      centerLat: 0,
      xSemiDeg: 1,
      ySemiDeg: 0.5,
      rotationDeg: 0,
      handle: 'plusX',
      dragDistance: 0.5, // new +x endpoint at +1.5
      lockAspect: false,
      expectedXScale: 1.5,
      expectedYScale: 1,
    },
    {
      label: 'axis-aligned: drag +y endpoint outward, free',
      centerLon: 0,
      centerLat: 0,
      xSemiDeg: 1,
      ySemiDeg: 0.5,
      rotationDeg: 0,
      handle: 'plusY',
      dragDistance: 0.5, // new +y endpoint at +1
      lockAspect: false,
      expectedXScale: 1,
      expectedYScale: 2, // (0.5 + 0.5) / 0.5
    },
    {
      label: 'axis-aligned: drag -x endpoint outward, free',
      centerLon: 0,
      centerLat: 0,
      xSemiDeg: 1,
      ySemiDeg: 0.5,
      rotationDeg: 0,
      handle: 'minusX',
      dragDistance: 0.5,
      lockAspect: false,
      expectedXScale: 1.5,
      expectedYScale: 1,
    },
    {
      label: 'axis-aligned: drag +x endpoint outward, lock-aspect',
      centerLon: 0,
      centerLat: 0,
      xSemiDeg: 1,
      ySemiDeg: 0.5,
      rotationDeg: 0,
      handle: 'plusX',
      dragDistance: 0.5,
      lockAspect: true,
      expectedXScale: 1.5,
      expectedYScale: 1.5, // both axes scaled by the same factor
    },
    {
      label: '45° rotated: drag +x endpoint along its axis, free',
      centerLon: 0,
      centerLat: 0,
      xSemiDeg: 1,
      ySemiDeg: 0.5,
      rotationDeg: 45,
      handle: 'plusX',
      dragDistance: 0.5,
      lockAspect: false,
      expectedXScale: 1.5,
      expectedYScale: 1,
    },
    {
      label: '90° rotated: drag +y endpoint along its axis, free',
      centerLon: 0,
      centerLat: 0,
      xSemiDeg: 1,
      ySemiDeg: 0.5,
      rotationDeg: 90,
      handle: 'plusY',
      dragDistance: 0.5,
      lockAspect: false,
      expectedXScale: 1,
      expectedYScale: 2,
    },
    {
      label: 'drag +x inward (shrink), free',
      centerLon: 0,
      centerLat: 0,
      xSemiDeg: 1,
      ySemiDeg: 0.5,
      rotationDeg: 0,
      handle: 'plusX',
      dragDistance: -0.5, // new +x endpoint at +0.5
      lockAspect: false,
      expectedXScale: 0.5,
      expectedYScale: 1,
    },
  ];

  it.each(cases)('$label', ({
    centerLon,
    centerLat,
    xSemiDeg,
    ySemiDeg,
    rotationDeg,
    handle,
    dragDistance,
    lockAspect,
    expectedXScale,
    expectedYScale,
  }) => {
    const { plusX, plusY } = buildAxisEndpoints(
      centerLon,
      centerLat,
      xSemiDeg,
      ySemiDeg,
      rotationDeg,
    );
    const center: Position = [centerLon, centerLat];

    // Compute the dragged endpoint's new position by applying
    // dragDistance along the handle's outward axis direction in Mercator,
    // then converting back to (lon, lat) so the math function exercises
    // its own Mercator pipeline end-to-end.
    const handleEndpoint = handle.startsWith('plus')
      ? handle === 'plusX'
        ? plusX
        : plusY
      : handle === 'minusX'
        ? reflectAcrossCenter(center, plusX)
        : reflectAcrossCenter(center, plusY);

    const newCorner = applyOutwardDisplacement(
      center,
      handleEndpoint,
      dragDistance,
    );

    const result = recomputeEllipseScaleFactors(
      center,
      plusX,
      plusY,
      handle,
      newCorner,
      lockAspect,
    );

    expect(result).not.toBeNull();
    if (!result) {
      return;
    }

    expect(result.xScale).toBeCloseTo(expectedXScale, 4);
    expect(result.yScale).toBeCloseTo(expectedYScale, 4);
  });

  it('returns null when the +x axis has zero length', () => {
    const center: Position = [0, 0];
    const collapsed: Position = [0, 0];
    const plusY: Position = [0, 0.5];

    const result = recomputeEllipseScaleFactors(
      center,
      collapsed,
      plusY,
      'plusX',
      [1, 0],
      false,
    );

    expect(result).toBeNull();
  });

  it('clamps negative scale to MIN_SCALE so dragging through center does not invert', () => {
    const center: Position = [0, 0];
    const { plusX, plusY } = buildAxisEndpoints(0, 0, 1, 0.5, 0);

    // Drag +x endpoint to (-2, 0) — i.e. past the center, onto the -x side.
    const result = recomputeEllipseScaleFactors(
      center,
      plusX,
      plusY,
      'plusX',
      [-2, 0],
      false,
    );

    expect(result).not.toBeNull();
    if (!result) {
      return;
    }

    // The projected length is negative; clamp prevents inversion.
    expect(result.xScale).toBeGreaterThan(0);
    expect(result.xScale).toBeLessThan(0.1);
  });
});

/**
 * Reflect a Mercator-space point across the center to get the opposite-side
 * endpoint position (in lon/lat).
 */
function reflectAcrossCenter(center: Position, endpoint: Position): Position {
  const centerMercY = latToMercatorY(center[1] as number);
  const endMercY = latToMercatorY(endpoint[1] as number);
  const reflectedMercX = (center[0] as number) * 2 - (endpoint[0] as number);
  const reflectedMercY = centerMercY * 2 - endMercY;

  return [reflectedMercX, mercatorYToLat(reflectedMercY)];
}

/**
 * Apply an outward displacement (in Mercator-degree units) along the
 * handle's outward direction, returning a new (lon, lat) for the dragged
 * endpoint.
 */
function applyOutwardDisplacement(
  center: Position,
  handleEndpoint: Position,
  distance: number,
): Position {
  const centerMercY = latToMercatorY(center[1] as number);
  const handleMercY = latToMercatorY(handleEndpoint[1] as number);
  const dx = (handleEndpoint[0] as number) - (center[0] as number);
  const dy = handleMercY - centerMercY;
  const len = Math.hypot(dx, dy);

  if (len === 0) {
    return handleEndpoint;
  }

  const ux = dx / len;
  const uy = dy / len;

  const newMercX = (handleEndpoint[0] as number) + distance * ux;
  const newMercY = handleMercY + distance * uy;

  return [newMercX, mercatorYToLat(newMercY)];
}
