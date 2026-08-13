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

import { latToMercatorY } from './mercator';
import type { Position } from 'geojson';

/**
 * Identifies which axis-endpoint handle was dragged. The ellipse's local
 * x-axis corresponds to `xSemiAxis`; the local y-axis corresponds to
 * `ySemiAxis`. Sign indicates which side of the center the handle is on.
 */
export type EllipseAxisHandle = 'plusX' | 'minusX' | 'plusY' | 'minusY';

/**
 * Result of an ellipse axis-endpoint drag.
 *
 * `xScale` and `yScale` are multiplicative factors to apply to the original
 * `xSemiAxis.value` and `ySemiAxis.value` respectively. Center and rotation
 * angle are unchanged by axis-endpoint drag.
 */
export type EllipseScaleResult = {
  /** Multiplier for the existing `xSemiAxis.value`. */
  xScale: number;
  /** Multiplier for the existing `ySemiAxis.value`. */
  yScale: number;
};

/** Minimum scale factor; prevents collapsing or inverting the ellipse. */
const MIN_SCALE = 0.01;

/**
 * Compute the new semi-axis scale factors after a single axis-endpoint drag.
 *
 * Operates in Web Mercator-projected space so the math agrees with the
 * projection deck.gl renders into. The center is held fixed (axis-endpoint
 * drag does not translate the ellipse); only the axis lengths change.
 *
 * Free drag (`lockAspect = false`):
 * - Project the cursor delta from center onto the dragged-axis unit vector
 *   (the vector from center to the dragged endpoint, normalized).
 * - The projected magnitude divided by the original axis length is the
 *   scale factor for that axis. The other axis is unchanged.
 *
 * Locked drag (`lockAspect = true`, Shift held):
 * - Same projection along the dragged axis gives a scale factor.
 * - That same factor is applied to **both** semi-axes, preserving the
 *   ellipse's aspect ratio.
 *
 * @param center - Ellipse center in (lon, lat).
 * @param plusXEndpoint - Current `+xSemiAxis` endpoint in (lon, lat).
 * @param plusYEndpoint - Current `+ySemiAxis` endpoint in (lon, lat).
 * @param draggedHandle - Which axis-endpoint handle the user is dragging.
 * @param newCorner - The dragged endpoint's new world position (lon, lat).
 * @param lockAspect - When true, scale both axes uniformly (Shift behavior).
 * @returns Scale factors to apply to the existing semi-axis values, or
 *   `null` if the input is degenerate (zero-length axis).
 */
export function recomputeEllipseScaleFactors(
  center: Position,
  plusXEndpoint: Position,
  plusYEndpoint: Position,
  draggedHandle: EllipseAxisHandle,
  newCorner: Position,
  lockAspect: boolean,
): EllipseScaleResult | null {
  const centerMercX = center[0] as number;
  const centerMercY = latToMercatorY(center[1] as number);
  const plusXMercX = plusXEndpoint[0] as number;
  const plusXMercY = latToMercatorY(plusXEndpoint[1] as number);
  const plusYMercX = plusYEndpoint[0] as number;
  const plusYMercY = latToMercatorY(plusYEndpoint[1] as number);
  const newMercX = newCorner[0] as number;
  const newMercY = latToMercatorY(newCorner[1] as number);

  // Local axis vectors in Mercator: `unitX` points from center to the
  // +xSemi endpoint; `unitY` points from center to the +ySemi endpoint.
  // Their lengths equal the current semi-axis lengths in Mercator units.
  const xVecX = plusXMercX - centerMercX;
  const xVecY = plusXMercY - centerMercY;
  const yVecX = plusYMercX - centerMercX;
  const yVecY = plusYMercY - centerMercY;
  const lenX = Math.hypot(xVecX, xVecY);
  const lenY = Math.hypot(yVecX, yVecY);

  if (lenX === 0 || lenY === 0) {
    return null;
  }

  const unitXx = xVecX / lenX;
  const unitXy = xVecY / lenX;
  const unitYx = yVecX / lenY;
  const unitYy = yVecY / lenY;

  // Cursor delta from center, in Mercator.
  const deltaX = newMercX - centerMercX;
  const deltaY = newMercY - centerMercY;

  // Pick the axis the dragged handle lives on, and project. Sign of the
  // projection encodes which side of the center the cursor is on; for the
  // negative-side handles we negate so a "drag outward" still yields a
  // positive new-length value.
  let projectedAxisLen: number;
  let isXAxisDrag: boolean;

  switch (draggedHandle) {
    case 'plusX':
      projectedAxisLen = deltaX * unitXx + deltaY * unitXy;
      isXAxisDrag = true;
      break;
    case 'minusX':
      projectedAxisLen = -(deltaX * unitXx + deltaY * unitXy);
      isXAxisDrag = true;
      break;
    case 'plusY':
      projectedAxisLen = deltaX * unitYx + deltaY * unitYy;
      isXAxisDrag = false;
      break;
    case 'minusY':
      projectedAxisLen = -(deltaX * unitYx + deltaY * unitYy);
      isXAxisDrag = false;
      break;
  }

  // Reference axis length in Mercator (the one the user is dragging).
  const referenceLen = isXAxisDrag ? lenX : lenY;
  const rawScale = projectedAxisLen / referenceLen;
  const clampedScale = Math.max(rawScale, MIN_SCALE);

  if (lockAspect) {
    // Same factor applied to both semi-axes: aspect ratio preserved.
    return { xScale: clampedScale, yScale: clampedScale };
  }

  // Free drag: only the dragged axis changes; the other axis is unchanged.
  return {
    xScale: isXAxisDrag ? clampedScale : 1,
    yScale: isXAxisDrag ? 1 : clampedScale,
  };
}
