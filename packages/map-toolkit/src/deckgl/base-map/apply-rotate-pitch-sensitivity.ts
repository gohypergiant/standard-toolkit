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

import type { Map as MapLibreMap } from 'maplibre-gl';

/**
 * Multiplier applied to MapLibre's built-in right-drag rotate/pitch deltas.
 *
 * MapLibre bakes its sensitivity into the rotate/pitch handlers at construction
 * (`rotateDegreesPerPixelMoved: 0.8`, `pitchDegreesPerPixelMoved: -0.5`) via a
 * closure, so there is no supported option to slow it down. `0.5` halves the
 * per-pixel response so the camera tilts/rotates more gently. Tune to taste.
 */
export const ROTATE_PITCH_SENSITIVITY = 0.5;

/**
 * Marker set on a handler once its move callbacks have been wrapped, so a
 * repeated {@link applyRotatePitchSensitivity} call (e.g. a second map `load`
 * after a style reload, where MapLibre keeps the same handler instances) does
 * not wrap the already-scaled callback and compound the multiplier.
 */
const WRAPPED_FLAG = '__rotatePitchSensitivityWrapped';

/** A MapLibre drag handler whose move callback returns delta results we scale. */
type ScalableDragHandler = {
  mousemoveWindow?: (...args: unknown[]) => unknown;
  [WRAPPED_FLAG]?: boolean;
};

/** Internal shape of MapLibre's DragRotateHandler (private fields, 5.x). */
type DragRotateInternals = {
  _mouseRotate?: ScalableDragHandler;
  _mousePitch?: ScalableDragHandler;
};

/**
 * Wrap a handler's `mousemoveWindow` callback so the named delta field in its
 * `HandlerResult` is scaled by `factor`. The gesture detection, around-center
 * math, and event filtering are left untouched — only the reported delta is
 * dampened. MapLibre 5.x routes drag moves through `mousemoveWindow` (it never
 * assigns `mousemove` on these handlers), so that is the only callback to wrap.
 */
function wrapDelta(
  handler: ScalableDragHandler,
  deltaKey: 'bearingDelta' | 'pitchDelta',
  factor: number,
): void {
  const original = handler.mousemoveWindow;

  if (typeof original !== 'function') {
    return;
  }

  handler.mousemoveWindow = function scaled(this: unknown, ...args: unknown[]) {
    const result = original.apply(this, args) as
      | Record<string, number>
      | undefined;

    // Mutate in place: MapLibre builds a fresh HandlerResult per move event, so
    // scaling the field directly avoids a per-event allocation on a ~60Hz drag.
    if (result && typeof result[deltaKey] === 'number') {
      result[deltaKey] *= factor;
    }

    return result;
  };
}

/**
 * Dampen MapLibre's mouse rotate/pitch sensitivity on a map instance.
 *
 * Reaches into the (private) `dragRotate` handler's mouse-rotate and mouse-pitch
 * sub-handlers and scales their `bearingDelta` / `pitchDelta` move results by
 * {@link ROTATE_PITCH_SENSITIVITY}. No public MapLibre API exposes these factors,
 * so this touches private fields; tested against maplibre-gl 5.x — re-verify on
 * major upgrades. Safe no-op if the internals are absent.
 *
 * @param map - The MapLibre map instance (after load).
 *
 * @example
 * ```typescript
 * map.on('load', () => {
 *   applyRotatePitchSensitivity(map);
 * });
 * ```
 */
export function applyRotatePitchSensitivity(map: MapLibreMap): void {
  const dragRotate = map.dragRotate as unknown as
    | DragRotateInternals
    | undefined;

  if (!dragRotate) {
    return;
  }

  const { _mouseRotate, _mousePitch } = dragRotate;

  // Guard each handler so a repeat call (second `load` after a style reload,
  // same handler instance) doesn't re-wrap and compound the multiplier.
  if (_mouseRotate && !_mouseRotate[WRAPPED_FLAG]) {
    wrapDelta(_mouseRotate, 'bearingDelta', ROTATE_PITCH_SENSITIVITY);
    _mouseRotate[WRAPPED_FLAG] = true;
  }

  if (_mousePitch && !_mousePitch[WRAPPED_FLAG]) {
    wrapDelta(_mousePitch, 'pitchDelta', ROTATE_PITCH_SENSITIVITY);
    _mousePitch[WRAPPED_FLAG] = true;
  }
}
