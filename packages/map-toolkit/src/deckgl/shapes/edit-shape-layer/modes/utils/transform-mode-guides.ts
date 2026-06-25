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

import { featureCollection } from '@turf/helpers';
import { distance as turfDistance } from '@turf/turf';
import type { GuideFeatureCollection } from '@deck.gl-community/editable-layers';
import type { Feature, Point, Position } from 'geojson';

/**
 * Local mirror of editable-layers' internal `EditHandleFeature` type
 * (defined in its `edit-modes/types.d.ts` but not re-exported from the
 * package entry). Mirrors the runtime shape of guide point features so
 * the parent ScaleMode can consume our cornerHandles unchanged. Shared
 * across `RectangleScaleMode` and `EllipseScaleMode` so the type stays
 * consistent if the upstream contract evolves.
 */
export type EditHandleFeature = Feature<
  Point,
  {
    guideType: 'editHandle';
    editHandleType:
      | 'existing'
      | 'intermediate'
      | 'snap-source'
      | 'snap-target'
      | 'scale'
      | 'rotate';
    positionIndexes?: number[];
    featureIndex?: number;
  }
>;

/**
 * Divisor applied to the polygon's bbox longest edge (in km) to derive
 * the rotate-handle stem length (in lat-degrees, treating the km value
 * as if it were lat-degrees). Mirrors the constant used by
 * `@deck.gl-community/editable-layers`'s `RotateMode` so our stems feel
 * the same as the parent's bbox→handle connector at any zoom level.
 */
export const STEM_LENGTH_DIVISOR = 1000;

/**
 * Lat/lon bounding box of a polygon ring plus its topmost vertex.
 * Returns null when the ring is missing or has fewer than 4 unique
 * vertices. The closing duplicate vertex is skipped automatically.
 */
export type PolygonBounds = {
  topVertex: [number, number];
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};

/**
 * Single-pass scan that yields the polygon's lat/lon bbox plus its
 * topmost vertex. Used by both `RectangleTransformMode` and
 * `EllipseTransformMode` to build their rotate-handle stems.
 */
export function computePolygonBounds(
  ring: Position[] | undefined,
): PolygonBounds | null {
  if (!ring || ring.length < 4) {
    return null;
  }

  const lastIdx = ring.length - 1;
  let topVertex: [number, number] | null = null;
  let maxLat = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;
  let minLon = Number.POSITIVE_INFINITY;

  for (let i = 0; i < lastIdx; i++) {
    const vertex = ring[i];

    if (!vertex) {
      continue;
    }

    const lon = vertex[0] as number;
    const lat = vertex[1] as number;

    if (lat > maxLat) {
      maxLat = lat;
      topVertex = [lon, lat];
    }

    if (lat < minLat) {
      minLat = lat;
    }

    if (lon > maxLon) {
      maxLon = lon;
    }

    if (lon < minLon) {
      minLon = lon;
    }
  }

  if (!topVertex) {
    return null;
  }

  return { topVertex, minLat, maxLat, minLon, maxLon };
}

/**
 * Compute the rotate-handle stem tip given a base point and the
 * polygon's bbox. Stem length matches the formula used by
 * `@deck.gl-community`'s `RotateMode` for its bbox→handle connector —
 * `longestEdgeLengthKm / STEM_LENGTH_DIVISOR`, where `longestEdgeLengthKm`
 * is the longest edge of the lat/lon-axis-aligned bbox in kilometers
 * (added to the base lat as if it were degrees). The dimensional
 * mismatch (km value treated as lat-degrees) is intentional — we mirror
 * deck.gl's formula so our stem scales the same way.
 */
export function computeRotateStemTip(
  base: [number, number],
  bounds: PolygonBounds,
): [number, number] {
  const widthKm = turfDistance(
    [bounds.minLon, bounds.minLat] as [number, number],
    [bounds.maxLon, bounds.minLat] as [number, number],
  );
  const heightKm = turfDistance(
    [bounds.minLon, bounds.minLat] as [number, number],
    [bounds.minLon, bounds.maxLat] as [number, number],
  );
  const longestEdgeKm = Math.max(widthKm, heightKm);
  const latOffset = longestEdgeKm / STEM_LENGTH_DIVISOR;

  return [base[0], base[1] + latOffset];
}

/**
 * GeoJSON LineString feature representing the rotate-handle stem (the
 * connector from `base` on the shape to `tip` outside it). Marked
 * `mode: 'rotate-stem'` so transform-mode guide filters can target it.
 */
export function buildRotateStemLine(
  base: [number, number],
  tip: [number, number],
  // biome-ignore lint/suspicious/noExplicitAny: GuideFeatureCollection's feature variant doesn't include a clean LineString shape with custom properties
): any {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [base, tip],
    },
    properties: { mode: 'rotate-stem' },
  };
}

/**
 * Standard transform-mode `getGuides` post-processing pipeline shared by
 * `RectangleTransformMode` and `EllipseTransformMode`:
 *
 * 1. **Drops the parent rotate-mode envelope and connector** (anything
 *    with no `mode`, `editHandleType`, or `guideType` property).
 * 2. **Keeps the scale-mode envelope** (`mode: 'scale'`, the actual
 *    shape outline) and the rotate-stem connector
 *    (`mode: 'rotate-stem'`).
 * 3. **Repositions the rotate handle** to the stem tip when a stem is
 *    provided.
 * 4. **Appends the stem connector LineString** so it renders alongside
 *    the relocated rotate handle.
 *
 * Caller passes the raw guides from `super.getGuides(props)` and the
 * already-computed stem (mode-specific). Pass `null` for `stem` when no
 * shape is selected or the stem can't be computed; the rotate handle
 * stays at its parent-emitted position in that case.
 */
export function postProcessTransformGuides(
  allGuides: GuideFeatureCollection,
  stem: { base: [number, number]; tip: [number, number] } | null,
): GuideFeatureCollection {
  // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, accessed defensively
  const processed: any[] = [];

  for (const guide of allGuides.features) {
    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, accessed defensively
    const guideAny = guide as any;
    const properties = guideAny?.properties ?? {};
    const guideType = properties.guideType;
    const editHandleType = properties.editHandleType;
    const mode = properties.mode;
    const geometryType = guideAny?.geometry?.type;

    // Drop rotate-mode envelope and connector; keep scale-mode envelope
    // (the shape outline) and our own rotate-stem connector.
    if (
      mode !== 'scale' &&
      mode !== 'rotate-stem' &&
      editHandleType === undefined &&
      guideType === undefined
    ) {
      continue;
    }

    // Reposition the rotate handle to the stem's tip.
    if (stem && editHandleType === 'rotate' && geometryType === 'Point') {
      processed.push({
        ...guideAny,
        geometry: { ...guideAny.geometry, coordinates: stem.tip },
      });
      continue;
    }

    processed.push(guide);
  }

  // Append the connector line from base to tip so the rotate handle
  // visually "comes off" the shape via a stem.
  if (stem) {
    processed.push(buildRotateStemLine(stem.base, stem.tip));
  }

  // biome-ignore lint/suspicious/noExplicitAny: turf types mismatch with editable-layers GeoJSON types
  return featureCollection(processed as any) as any;
}

/**
 * Strip all chrome from the guide collection while a rotation drag is in
 * progress. Drops scale handles and any LineString guides (scale envelope,
 * rotate envelope, connector lines), so the user sees only the rotating
 * shape and any Point-type guides like RotateMode's centroid pivot.
 *
 * Used by both `RectangleTransformMode` and `EllipseTransformMode` to
 * avoid showing a "bounding box" overlay on top of the rotating shape.
 */
export function filterGuidesForRotation(
  guides: GuideFeatureCollection,
): GuideFeatureCollection {
  // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, accessed defensively
  const kept: any[] = [];

  for (const guide of guides.features) {
    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode, accessed defensively
    const guideAny = guide as any;
    const editHandleType = guideAny?.properties?.editHandleType;
    const geometryType = guideAny?.geometry?.type;

    if (editHandleType === 'scale') {
      continue;
    }

    if (geometryType !== 'Point') {
      continue;
    }

    kept.push(guide);
  }

  // biome-ignore lint/suspicious/noExplicitAny: turf types mismatch with editable-layers GeoJSON types
  return featureCollection(kept) as any;
}
