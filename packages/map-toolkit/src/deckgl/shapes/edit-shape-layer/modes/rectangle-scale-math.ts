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

import type { Position } from 'geojson';

/**
 * Convert latitude (degrees) to Web Mercator Y (in degrees of "Mercator-y").
 *
 * Output is dimensionally compatible with longitude in degrees once divided
 * by the appropriate scale, but for our purposes we only need *consistency*
 * with the projection used when the rectangle was authored — so we mix
 * lon-degrees on x with Mercator-y on y. Both `latToMercatorY` calls use
 * the same scale, so projection math is internally consistent.
 *
 * @param lat - Latitude in degrees, clamped to (-89.999999, 89.999999) to
 *   avoid the polar singularities of the Mercator projection.
 * @returns Mercator-y in the same "degree-like" units used by longitude.
 */
export function latToMercatorY(lat: number): number {
  const clamped = Math.max(Math.min(lat, 89.999999), -89.999999);
  const rad = (clamped * Math.PI) / 180;

  return (Math.log(Math.tan(Math.PI / 4 + rad / 2)) * 180) / Math.PI;
}

/** Inverse of `latToMercatorY`: convert Mercator-y back to latitude in degrees. */
export function mercatorYToLat(mercY: number): number {
  const rad = (mercY * Math.PI) / 180;

  return ((2 * Math.atan(Math.exp(rad)) - Math.PI / 2) * 180) / Math.PI;
}

/**
 * Recompute a rotated rectangle after a corner drag, preserving its rotation.
 *
 * Operates in Web Mercator-projected space (x = lon, y = Mercator-projected
 * latitude) because that's the projection deck.gl renders into and the
 * projection in which `createRectangleShape` produces its visually-rectangular
 * output. Doing the math in raw lat/lon would preserve a *lat/lon-Euclidean*
 * rectangle, which appears as a parallelogram on the map.
 *
 * Algorithm: pin the diagonally-opposite corner, derive the rectangle's two
 * edge directions from the existing geometry, project the new dragged corner
 * onto those directions to compute the two adjacent corners. Result is a
 * clean rectangle in Mercator (90° angles, parallel opposite sides) with the
 * same rotation it started with — only the size changes.
 *
 * Math: with pinned opposite corner `O` and new dragged corner position `C`,
 * and edge unit vectors `u = (P_adj1 - O) / |P_adj1 - O|`,
 * `v = (P_adj2 - O) / |P_adj2 - O|`:
 *
 * - Diagonal `D = C - O`
 * - Project: `Mu = D · u`, `Mv = D · v`
 * - New adjacent corners: `O + Mu·u`, `O + Mv·v`
 *
 * When `lockAspect` is true, uniform scaling is applied: both edges scale by
 * the same factor `s`, computed as the projection of the cursor delta onto
 * the original diagonal direction. This keeps the rectangle's width/height
 * ratio fixed (Shift-drag behavior).
 *
 * @param originalCoords - The polygon's vertices at drag-start (before any
 *   scaling), in (lon, lat). Using drag-start coordinates avoids drift across
 *   frames.
 * @param draggedIndex - Vertex index of the dragged corner (0-3).
 * @param newCorner - The new world position for the dragged corner (mouse),
 *   in (lon, lat).
 * @param lockAspect - When true, scale uniformly (preserve aspect ratio).
 * @returns Updated 4 corner coordinates (without the closing duplicate),
 *   in (lon, lat); or null if the input isn't a 4-corner rectangle.
 */
export function recomputeRectangleCorners(
  originalCoords: Position[],
  draggedIndex: number,
  newCorner: Position,
  lockAspect: boolean,
): Position[] | null {
  if (originalCoords.length < 4) {
    return null;
  }

  const draggedIdx = ((draggedIndex % 4) + 4) % 4;
  const oppositeIdx = (draggedIdx + 2) % 4;
  const adjUIdx = (draggedIdx + 1) % 4;
  const adjVIdx = (draggedIdx + 3) % 4;

  const opp = originalCoords[oppositeIdx];
  const adjU = originalCoords[adjUIdx];
  const adjV = originalCoords[adjVIdx];

  if (!opp) {
    return null;
  }
  if (!(adjU && adjV)) {
    return null;
  }

  // Project all corners and the new dragged corner into Mercator space
  // (x = lon, y = mercator-y) so the rectangle math operates in the same
  // projection the map renders, avoiding parallelogram distortion.
  const oppMercX = opp[0] as number;
  const oppMercY = latToMercatorY(opp[1] as number);
  const adjUMercX = adjU[0] as number;
  const adjUMercY = latToMercatorY(adjU[1] as number);
  const adjVMercX = adjV[0] as number;
  const adjVMercY = latToMercatorY(adjV[1] as number);
  const newMercX = newCorner[0] as number;
  const newMercY = latToMercatorY(newCorner[1] as number);

  // Edge vectors from the pinned opposite corner to each adjacent corner.
  const edgeUx = adjUMercX - oppMercX;
  const edgeUy = adjUMercY - oppMercY;
  const edgeVx = adjVMercX - oppMercX;
  const edgeVy = adjVMercY - oppMercY;
  const lenU = Math.hypot(edgeUx, edgeUy);
  const lenV = Math.hypot(edgeVx, edgeVy);

  if (lenU === 0 || lenV === 0) {
    return null;
  }

  // Unit vectors along edges U and V (the rectangle's local axes).
  const unitUx = edgeUx / lenU;
  const unitUy = edgeUy / lenU;
  const unitVx = edgeVx / lenV;
  const unitVy = edgeVy / lenV;

  // Cursor delta from the pinned corner; project onto each edge to get the
  // new edge magnitudes (the new rectangle's width and height).
  const deltaX = newMercX - oppMercX;
  const deltaY = newMercY - oppMercY;
  let projU = deltaX * unitUx + deltaY * unitUy;
  let projV = deltaX * unitVx + deltaY * unitVy;

  if (lockAspect) {
    // Project the cursor delta onto the original diagonal direction to get
    // a single uniform scale factor, then apply it to both edges so the
    // rectangle's aspect ratio is preserved.
    const origDiagX = lenU * unitUx + lenV * unitVx;
    const origDiagY = lenU * unitUy + lenV * unitVy;
    const origDiagLenSq = origDiagX * origDiagX + origDiagY * origDiagY;

    if (origDiagLenSq === 0) {
      return null;
    }

    const scaleFactor =
      (deltaX * origDiagX + deltaY * origDiagY) / origDiagLenSq;
    projU = scaleFactor * lenU;
    projV = scaleFactor * lenV;
  }

  // Reconstruct the three non-pinned corners in Mercator, then convert
  // mercator-y back to latitude for the GeoJSON output.
  const newAdjUMercX = oppMercX + projU * unitUx;
  const newAdjUMercY = oppMercY + projU * unitUy;
  const newAdjVMercX = oppMercX + projV * unitVx;
  const newAdjVMercY = oppMercY + projV * unitVy;
  const newDraggedMercX = oppMercX + projU * unitUx + projV * unitVx;
  const newDraggedMercY = oppMercY + projU * unitUy + projV * unitVy;

  const result: Position[] = [
    originalCoords[0] as Position,
    originalCoords[1] as Position,
    originalCoords[2] as Position,
    originalCoords[3] as Position,
  ];
  result[oppositeIdx] = opp;
  result[draggedIdx] = lockAspect
    ? [newDraggedMercX, mercatorYToLat(newDraggedMercY)]
    : newCorner;
  result[adjUIdx] = [newAdjUMercX, mercatorYToLat(newAdjUMercY)];
  result[adjVIdx] = [newAdjVMercX, mercatorYToLat(newAdjVMercY)];

  return result;
}
