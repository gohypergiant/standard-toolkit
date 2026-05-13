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

import type { SimpleFeatureCollection } from '@deck.gl-community/editable-layers';
import type { Feature, Point as GeoPoint } from 'geojson';
import type { ScaleModeWithFreeTransform } from '../scale-mode-with-free-transform';

/**
 * Typed view of `ScaleMode`'s private fields. Upstream
 * `@deck.gl-community/editable-layers` marks these as private but they're
 * the only seam we have for two things this package needs:
 *
 * - **Oriented-bounding-box-aware scaling** (`OrientedScaleMode`) — reads
 *   `_isScaling`, `_selectedEditHandle`, `_geometryBeingScaled`, calls
 *   `_getOppositeScaleHandle` and `_getUpdatedData`, writes the same
 *   fields on drag end.
 * - **Oriented-bounding-box corner cache patching** (`VertexTransformMode`)
 *   — overwrites `_cornerGuidePoints` so the scale-origin lookup anchors at
 *   the oriented bounding box corner the user sees instead of the
 *   axis-aligned bounding box corner ScaleMode emitted.
 *
 * Centralizing the cast through {@link scaleModePrivate} keeps the
 * `as any` boundary in this one file. Every call site reads/writes
 * through typed properties.
 */
export type ScaleModePrivate = {
  _isScaling: boolean;
  _cornerGuidePoints: Feature<GeoPoint>[];
  _geometryBeingScaled: SimpleFeatureCollection | null;
  _selectedEditHandle: Feature<GeoPoint> | null;
  _cursor: string | null;
  _getOppositeScaleHandle: (
    handle: Feature<GeoPoint> | null,
  ) => Feature<GeoPoint> | null;
  _getUpdatedData: (
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl ModeProps generic mismatch with package boundary
    props: any,
    features: SimpleFeatureCollection,
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl's _getUpdatedData returns SimpleFeatureCollection-ish
  ) => any;
};

/**
 * Cast a `ScaleModeWithFreeTransform` (or any subclass) to its typed
 * private-state view. The cast is the only `any` boundary needed for
 * the oriented-bounding-box-aware mode machinery — every other call site
 * goes through the returned typed object.
 */
export function scaleModePrivate(
  mode: ScaleModeWithFreeTransform,
): ScaleModePrivate {
  return mode as unknown as ScaleModePrivate;
}
