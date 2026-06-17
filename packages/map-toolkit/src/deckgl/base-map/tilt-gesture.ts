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

import type { ViewType } from '../../camera/types';

/**
 * Degrees of rotation/pitch applied per pixel of drag movement. Scales the raw
 * gesture delta before it drives the camera; lower feels gentler. `0.5` maps the
 * full usable pitch range (~85°) onto a comfortable vertical drag distance.
 */
export const MOUSE_TILT_SENSITIVITY = 0.5;

/** The subset of a drag gesture event the tilt handler needs. */
export type TiltGesture = {
  leftButton?: boolean;
  rightButton?: boolean;
  deltaX: number;
  deltaY: number;
  ctrlKey: boolean;
};

/**
 * The camera changes a tilt gesture maps to. `promoteToTilt` is true when a flat
 * 2D view should switch to 2.5D first (so pitch can apply); `rotation`/`pitch`
 * are absolute target angles derived from the drag offset.
 */
export type TiltCommand = {
  promoteToTilt: boolean;
  rotation: number;
  pitch: number;
};

/**
 * Whether a drag gesture is a camera tilt/rotate (right-drag or ctrl+left-drag)
 * rather than a plain pan (left-drag).
 *
 * @param gesture - The drag gesture's button + modifier state.
 * @returns True when the gesture should rotate/pitch the camera.
 *
 * @example
 * ```typescript
 * isTiltGesture({ rightButton: true, deltaX: 0, deltaY: 0, ctrlKey: false }); // true
 * isTiltGesture({ leftButton: true, deltaX: 0, deltaY: 0, ctrlKey: false }); // false (pan)
 * ```
 */
export function isTiltGesture(gesture: TiltGesture): boolean {
  const isCtrlLeftDrag = gesture.ctrlKey && gesture.leftButton === true;
  return gesture.rightButton === true || isCtrlLeftDrag;
}

/**
 * Translate a tilt gesture into the camera rotation/pitch it should produce,
 * given the current view. Returns `null` for non-tilt gestures (plain pans) so
 * the caller leaves the camera untouched.
 *
 * `deltaX`/`deltaY` are cumulative offsets from the drag start, so the resulting
 * angles track the gesture; they are scaled by `sensitivity` for a gentler feel.
 * Pitch is negated so dragging up tilts the camera up. The camera store applies
 * its own view constraints (it ignores rotation in 3D and pitch outside 2.5D),
 * so this stays a pure mapping.
 *
 * @param gesture - The drag gesture (buttons, modifier, cumulative deltas).
 * @param view - The current camera view mode.
 * @param sensitivity - Degrees per pixel of drag (pass {@link MOUSE_TILT_SENSITIVITY} for the default feel).
 * @returns The camera command, or `null` if the gesture is not a tilt.
 *
 * @example
 * ```typescript
 * const command = tiltCommandFor(
 *   { rightButton: true, deltaX: 40, deltaY: -120, ctrlKey: false },
 *   '2D',
 *   MOUSE_TILT_SENSITIVITY,
 * );
 * // → { promoteToTilt: true, rotation: 20, pitch: 60 }
 * ```
 */
export function tiltCommandFor(
  gesture: TiltGesture,
  view: ViewType,
  sensitivity: number,
): TiltCommand | null {
  if (!isTiltGesture(gesture)) {
    return null;
  }

  return {
    promoteToTilt: view === '2D',
    // `+ 0` normalizes a `-0` (from negating `deltaY: 0`) to `0`.
    rotation: gesture.deltaX * sensitivity + 0,
    pitch: -gesture.deltaY * sensitivity + 0,
  };
}
