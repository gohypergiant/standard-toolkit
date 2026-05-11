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

import { lineString, point } from '@turf/helpers';
import type { Feature, Point as GeoPoint, LineString, Position } from 'geojson';
import type { ScaleModeWithFreeTransform } from '../scale-mode-with-free-transform';
import { scaleModePrivate } from './scale-mode-internals';
import type { OrientedBoundingBox } from './vertex-bbox-math';

/**
 * Custom `mode` tag applied to the buffered bounding box LineString so
 * the EditableGeoJsonLayer's line-color and dash-array accessors can
 * recognize it (mute color, render dashed) without affecting other guide
 * lines (rotate-stem connector, shape outlines for other shape types).
 */
export const VERTEX_BBOX_MODE = 'vertex-bbox';

/**
 * Build the oriented-bbox chrome (outline + scale corner handles +
 * rotate handle + stem connector) from a precomputed oriented bounding
 * box. Inherits each scale handle's `properties` (which include
 * `positionIndexes`) from the matching `existingScaleHandles` entry so
 * ScaleMode's `_getOppositeScaleHandle` lookup keeps working.
 *
 * Returns the full chrome `features` for the guide collection plus a
 * separate `scaleHandles` array of the four corner handles in iteration
 * order — callers that patch ScaleMode's `_cornerGuidePoints` cache reuse
 * these directly instead of re-scanning `features` for `editHandleType:
 * 'scale'` Points each frame.
 */
function buildBoundingBoxChrome(
  boundingBox: OrientedBoundingBox,
  existingRotateHandle: Feature<GeoPoint> | undefined,
  existingScaleHandles: Feature<GeoPoint>[],
): { features: Feature[]; scaleHandles: Feature<GeoPoint>[] } {
  const features: Feature[] = [];
  const scaleHandles: Feature<GeoPoint>[] = [];

  features.push(
    lineString(
      [
        boundingBox.bottomLeft,
        boundingBox.bottomRight,
        boundingBox.topRight,
        boundingBox.topLeft,
        boundingBox.bottomLeft,
      ],
      {
        mode: VERTEX_BBOX_MODE,
      },
    ) as Feature<LineString>,
  );

  // Reposition the four scale handles to the oriented bounding box corners. Local-frame
  // bottomLeft/bottomRight/topRight/topLeft maps to positionIndexes
  // 0/1/2/3, matching ScaleMode's
  // ring traversal order.
  const cornersByIndex: Position[] = [
    boundingBox.bottomLeft,
    boundingBox.bottomRight,
    boundingBox.topRight,
    boundingBox.topLeft,
  ];

  for (const handle of existingScaleHandles) {
    // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
    const properties = (handle.properties ?? {}) as any;
    const positionIndex = Array.isArray(properties.positionIndexes)
      ? (properties.positionIndexes[0] as number | undefined)
      : undefined;

    if (
      positionIndex === undefined ||
      positionIndex < 0 ||
      positionIndex >= 4
    ) {
      features.push(handle);
      continue;
    }

    const corner = cornersByIndex[positionIndex];

    if (corner) {
      const positioned = point(corner, properties) as Feature<GeoPoint>;
      features.push(positioned);
      scaleHandles.push(positioned);
    }
  }

  if (existingRotateHandle) {
    // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
    const rotateProps = (existingRotateHandle.properties ?? {}) as any;

    features.push(point(boundingBox.stemTip, rotateProps) as Feature<GeoPoint>);

    features.push(
      lineString([boundingBox.stemBase, boundingBox.stemTip], {
        mode: 'rotate-stem',
      }) as Feature<LineString>,
    );
  }

  return { features, scaleHandles };
}

/**
 * Apply the existing scale-envelope filter and rectangle vertex-handle
 * filter. Returns the filtered guide list; the oriented bounding box
 * replacement happens in a separate step.
 */
export function filterVertexGuides(
  features: Feature[],
  isRectangle: boolean,
  isRotating: boolean,
): Feature[] {
  return features.filter((guide) => {
    // biome-ignore lint/suspicious/noExplicitAny: Guide properties vary by mode
    const properties = (guide.properties ?? {}) as any;
    const editHandleType = properties.editHandleType;
    const guideType = properties.guideType;
    const mode = properties.mode;

    // Three "filter out" rules: rectangles hide their vertex handles to
    // preserve right angles, the scale envelope is always dropped (we
    // emit our own oriented bounding box instead), and scale corner
    // handles are hidden during a rotation drag.
    const drop =
      (isRectangle &&
        guideType === 'editHandle' &&
        editHandleType === 'existing') ||
      mode === 'scale' ||
      (isRotating && editHandleType === 'scale');

    return !drop;
  });
}

/**
 * `true` if `feature` is a rotate-mode-emitted bbox outline or stem
 * connector LineString that the oriented bounding box chrome will replace. Both come
 * through with no `editHandleType`, no `mode`, and either 5 coords
 * (closed bbox ring) or 2 coords (connector).
 */
function isRotateModeChromeLine(feature: Feature): boolean {
  // The geometry-type guard is kept separate because the rest of the
  // function depends on the LineString narrowing.
  if (feature.geometry.type !== 'LineString') {
    return false;
  }

  // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
  const properties = (feature.properties ?? {}) as any;
  const coords = (feature.geometry as LineString).coordinates;

  return (
    properties.editHandleType === undefined &&
    properties.mode === undefined &&
    (coords.length === 5 || coords.length === 2)
  );
}

/**
 * `true` if `feature` is any of the rotate-mode-emitted bbox chrome
 * pieces (bbox outline LineString, stem connector LineString, or the
 * rotate-handle Point). Used to strip the chrome during a rotation drag
 * so only the rotating shape and centroid pivot remain visible.
 */
export function isRotateChromeFeature(feature: Feature): boolean {
  // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
  const editHandleType = (feature.properties as any)?.editHandleType;

  return (
    isRotateModeChromeLine(feature) ||
    (editHandleType === 'rotate' && feature.geometry.type === 'Point')
  );
}

/**
 * Replace the rotate-mode emitted bbox + scale handles + rotate handle
 * + stem connector with oriented bounding box-based versions. Other guides (vertex
 * handles, intermediate handles, etc.) pass through unchanged.
 *
 * Returns the modified guide collection (`features`) plus the four
 * corner scale handles that were repositioned to the oriented bounding
 * box. The handles are surfaced separately so the caller can patch
 * `ScaleMode._cornerGuidePoints` without re-scanning the guide
 * collection on the hot path.
 */
export function replaceRotateChromeWithBoundingBox(
  features: Feature[],
  boundingBox: OrientedBoundingBox,
): { features: Feature[]; scaleHandles: Feature<GeoPoint>[] } {
  const existingScaleHandles: Feature<GeoPoint>[] = [];
  let rotateHandle: Feature<GeoPoint> | undefined;
  const passthrough: Feature[] = [];

  for (const feature of features) {
    // biome-ignore lint/suspicious/noExplicitAny: properties shape varies
    const editHandleType = (feature.properties as any)?.editHandleType;
    const isPoint = feature.geometry.type === 'Point';

    if (editHandleType === 'scale' && isPoint) {
      existingScaleHandles.push(feature as Feature<GeoPoint>);
      continue;
    }

    if (editHandleType === 'rotate' && isPoint) {
      rotateHandle = feature as Feature<GeoPoint>;
      continue;
    }

    if (isRotateModeChromeLine(feature)) {
      continue;
    }

    passthrough.push(feature);
  }

  const built = buildBoundingBoxChrome(
    boundingBox,
    rotateHandle,
    existingScaleHandles,
  );

  // Push chrome features into `passthrough` in place rather than
  // returning a spread-merged array — saves one array allocation per
  // `getGuides` frame.
  passthrough.push(...built.features);

  return { features: passthrough, scaleHandles: built.scaleHandles };
}

/**
 * Build a fresh set of scale-corner handle Points (one per oriented bounding box corner,
 * `positionIndexes` 0..3) suitable for assigning to ScaleMode's private
 * `_cornerGuidePoints`. Used to lock the corner cache to the
 * drag-start oriented bounding box during a scale gesture so its drag-origin lookup
 * stays at a fixed world position.
 */
export function boundingBoxToScaleHandles(
  boundingBox: OrientedBoundingBox,
): Feature<GeoPoint>[] {
  const corners: Position[] = [
    boundingBox.bottomLeft,
    boundingBox.bottomRight,
    boundingBox.topRight,
    boundingBox.topLeft,
  ];

  return corners.map(
    (corner, index) =>
      point(corner, {
        guideType: 'editHandle',
        editHandleType: 'scale',
        positionIndexes: [index],
      }) as Feature<GeoPoint>,
  );
}

/**
 * Reach into ScaleMode's private `_cornerGuidePoints` and sync it with
 * the oriented bounding box-positioned scale handles so its `_getOppositeScaleHandle`
 * lookup returns the diagonally-opposite oriented bounding box corner (where the user
 * sees the handle) rather than the axis-aligned bounding box corner ScaleMode computed
 * internally. Required because ScaleMode's drag origin comes from
 * those cached points, not from the visible feature collection.
 *
 * Pass the `scaleHandles` array returned by
 * {@link replaceRotateChromeWithBoundingBox} directly — the caller
 * already produced these as part of building the chrome, so this is a
 * straight assignment with no per-frame scan.
 */
export function syncScaleModeCornerCache(
  scaleMode: ScaleModeWithFreeTransform,
  scaleHandles: Feature<GeoPoint>[],
): void {
  if (scaleHandles.length !== 4) {
    return;
  }

  scaleModePrivate(scaleMode)._cornerGuidePoints = scaleHandles;
}
