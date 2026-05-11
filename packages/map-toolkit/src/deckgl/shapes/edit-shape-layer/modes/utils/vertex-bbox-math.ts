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

import { centroid as turfCentroid, distance as turfDistance } from '@turf/turf';
import type { Feature, LineString, Polygon, Position } from 'geojson';
import { STEM_LENGTH_DIVISOR } from './transform-mode-guides';

/**
 * Outward buffer applied to the rotate-mode bounding box for polygon and
 * line edits, as a fraction of the longest bbox dimension. Pushes the
 * scale corner handles away from the polygon's vertices so a shape with
 * a vertex at its bbox corner doesn't visually overlap the scale handle
 * with the vertex handle.
 *
 * Note: this is proportional to shape size, not pixel-true. Strict pixel
 * spacing would require viewport access from inside the mode (which it
 * doesn't have). 3% reads as a clear gap at typical zoom levels without
 * being so large that it disconnects the box from the shape.
 */
const BBOX_BUFFER_RATIO = 0.03;

/**
 * Oriented bounding box for a polygon/line, expressed as four world-frame
 * corners (in shape-local order: bottomLeft, bottomRight, topRight,
 * topLeft) plus the world-frame stem base and tip for placing the rotate
 * handle above the (local) top edge. When `angleDeg === 0` this reduces
 * to a buffered axis-aligned bounding box; for non-zero angles the box
 * rotates with the polygon.
 */
export type OrientedBoundingBox = {
  bottomLeft: Position;
  bottomRight: Position;
  topRight: Position;
  topLeft: Position;
  stemBase: Position;
  stemTip: Position;
};

/**
 * Return the vertex array for a feature we'll wrap with an oriented
 * bounding box: the outer ring of a Polygon (still includes the closing
 * duplicate vertex; that's fine for the local axis-aligned bounds and
 * matches turfCentroid's behavior) or the coordinate array of a
 * LineString. Other geometry types fall through to `null` so we leave
 * the rotate-mode chrome unmodified.
 */
function getShapeVertices(feature: Feature): Position[] | null {
  if (feature.geometry.type === 'Polygon') {
    const ring = (feature.geometry as Polygon).coordinates[0];

    return Array.isArray(ring) ? (ring as Position[]) : null;
  }

  if (feature.geometry.type === 'LineString') {
    return (feature.geometry as LineString).coordinates as Position[];
  }

  return null;
}

/**
 * Compute the feature's centroid via turf so it matches the pivot used
 * by `RotateMode` exactly. Mismatched centroids would cause the
 * oriented bounding box to un-rotate around a slightly different point
 * than the shape was rotated around, which over multiple rotations
 * drifts the bounding box off the shape's "natural" edge.
 *
 * Calls `turfCentroid` directly on the feature — `turfCentroid` accepts
 * `Feature | FeatureCollection`, so the previous one-element FC wrapper
 * was a per-frame allocation that bought nothing.
 */
function polygonCentroid(feature: Feature): [number, number] | null {
  // biome-ignore lint/suspicious/noExplicitAny: turf type variance
  const coords = turfCentroid(feature as any).geometry.coordinates;

  if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
    return null;
  }

  return [coords[0], coords[1]];
}

/**
 * Axis-aligned bounding box of a polygon ring in the local frame
 * (vertices un-rotated by compass `-angleDeg` around `centroid`).
 * Compass-positive rotation is CW (north → east) — matching
 * `turfTransformRotate` — so the un-rotation matrix is the inverse:
 * compass-positive `+α` maps
 * `(deltaX, deltaY) → (deltaX·cos α − deltaY·sin α, deltaX·sin α + deltaY·cos α)`.
 * Returns `null` if no finite vertex was seen.
 */
function localAxisAlignedBounds(
  ring: Position[],
  centroid: [number, number],
  cos: number,
  sin: number,
): { minX: number; maxX: number; minY: number; maxY: number } | null {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const vertex of ring) {
    if (!vertex) {
      continue;
    }

    const deltaX = (vertex[0] as number) - centroid[0];
    const deltaY = (vertex[1] as number) - centroid[1];
    // Inverse of compass-positive (CW) rotation by angleDeg.
    const localX = deltaX * cos - deltaY * sin;
    const localY = deltaX * sin + deltaY * cos;

    if (localX < minX) {
      minX = localX;
    }

    if (localX > maxX) {
      maxX = localX;
    }

    if (localY < minY) {
      minY = localY;
    }

    if (localY > maxY) {
      maxY = localY;
    }
  }

  return Number.isFinite(minX) && Number.isFinite(minY)
    ? { minX, maxX, minY, maxY }
    : null;
}

/**
 * Inflate a local-frame axis-aligned bounding box outward by
 * {@link BBOX_BUFFER_RATIO} of its longest side. Pulled out of
 * `computeOrientedBoundingBox` for clarity — the buffer is the only
 * place callers need to tune the gap between the shape's vertices and
 * its bbox handles.
 */
function inflateLocalBounds(localBounds: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}): { minX: number; maxX: number; minY: number; maxY: number } {
  const longestSide = Math.max(
    localBounds.maxX - localBounds.minX,
    localBounds.maxY - localBounds.minY,
  );
  const buffer = longestSide * BBOX_BUFFER_RATIO;

  return {
    minX: localBounds.minX - buffer,
    maxX: localBounds.maxX + buffer,
    minY: localBounds.minY - buffer,
    maxY: localBounds.maxY + buffer,
  };
}

/**
 * Compass-positive (CW) rotation from the polygon's local frame back to
 * world coordinates:
 * `(localX, localY) → (localX·cos + localY·sin, −localX·sin + localY·cos)`.
 * With `α = 90°`: local +Y (north) maps to world +X (east), matching
 * `turfTransformRotate`.
 */
function localPointToWorld(
  localX: number,
  localY: number,
  centroid: [number, number],
  cos: number,
  sin: number,
): Position {
  return [
    localX * cos + localY * sin + centroid[0],
    -localX * sin + localY * cos + centroid[1],
  ];
}

/**
 * Project the buffered local-frame bounds back to world coordinates and
 * place the rotate-stem above the top edge. Stem length matches deck.gl
 * `RotateMode`'s `longestEdgeKm / 1000` formula — computed on
 * world-frame corners via `turfDistance` so it produces the same km
 * value the axis-aligned bounding box version would.
 */
function buildOrientedBoundingBox(
  buffered: { minX: number; maxX: number; minY: number; maxY: number },
  localToWorld: (localX: number, localY: number) => Position,
): OrientedBoundingBox {
  const { minX, maxX, minY, maxY } = buffered;
  const topMidX = (minX + maxX) / 2;
  const bottomLeft = localToWorld(minX, minY);
  const bottomRight = localToWorld(maxX, minY);
  const topRight = localToWorld(maxX, maxY);
  const topLeft = localToWorld(minX, maxY);

  const widthKm = turfDistance(bottomLeft as Position, bottomRight as Position);
  const heightKm = turfDistance(bottomLeft as Position, topLeft as Position);
  const stemLengthDeg = Math.max(widthKm, heightKm) / STEM_LENGTH_DIVISOR;

  return {
    bottomLeft,
    bottomRight,
    topRight,
    topLeft,
    stemBase: localToWorld(topMidX, maxY),
    stemTip: localToWorld(topMidX, maxY + stemLengthDeg),
  };
}

/**
 * Compute the oriented bounding box for a polygon at the given
 * orientation angle. The angle is in **compass degrees** (CW positive:
 * a north-pointing edge rotates to east as `angleDeg` increases).
 * Algorithm:
 *
 * 1. Un-rotate every vertex by `-angleDeg` around the polygon's turf
 *    centroid (matches `RotateMode`'s pivot) to get its footprint in
 *    the shape-local frame.
 * 2. Take the axis-aligned bounding box of the local footprint.
 * 3. Inflate it outward by `BBOX_BUFFER_RATIO` of the longest local
 *    edge so polygon vertices don't collide with bounding-box scale
 *    handles.
 * 4. Rotate the four corners back by `+angleDeg` (compass) to world
 *    coordinates, using the matrix
 *    `(localX, localY) → (localX·cos α + localY·sin α, −localX·sin α + localY·cos α)`
 *    — this is the compass-positive rotation that matches
 *    `turfTransformRotate`, so the oriented bounding box stays
 *    visually aligned with the rotated polygon.
 *
 * Stem length is computed in **kilometers** via `turfDistance` of the
 * world-frame top edge so it matches deck.gl `RotateMode`'s
 * `longestEdgeKm / 1000` formula. Computing the offset in raw
 * lat-degrees produces a tiny stem (~100m for a 100km shape), which
 * collapses the stem visually.
 */
export function computeOrientedBoundingBox(
  feature: Feature,
  angleDeg: number,
): OrientedBoundingBox | null {
  const vertices = getShapeVertices(feature);

  if (!vertices || vertices.length < 2) {
    return null;
  }

  const centroid = polygonCentroid(feature);

  if (!centroid) {
    return null;
  }

  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const localBounds = localAxisAlignedBounds(vertices, centroid, cos, sin);

  if (!localBounds) {
    return null;
  }

  const buffered = inflateLocalBounds(localBounds);
  const localToWorld = (localX: number, localY: number): Position =>
    localPointToWorld(localX, localY, centroid, cos, sin);

  return buildOrientedBoundingBox(buffered, localToWorld);
}
