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
 * The camera's rotation/pitch at the moment a tilt drag started. The gesture's
 * cumulative delta is applied on top of this, so each new drag continues from
 * the current camera angle instead of snapping to an absolute derived from the
 * (per-gesture, resets-to-zero) delta.
 */
export type TiltBaseline = {
  rotation: number;
  pitch: number;
};

/**
 * The absolute camera angles a tilt gesture maps to: `baseline` plus the scaled
 * drag offset. Pitch is unclamped here — the camera store bounds it to its
 * renderable range (see `buildCameraState`), so this stays a pure mapping.
 */
export type TiltCommand = {
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
 * Translate a tilt gesture into the absolute camera rotation/pitch it should
 * produce, given the camera angles captured when this drag started.
 *
 * `deltaX`/`deltaY` are cumulative offsets from the drag start (they reset to ~0
 * each new gesture), so the scaled delta is added to `baseline` — each drag
 * continues from the current camera angle rather than snapping to an absolute.
 * Pitch is negated so dragging up tilts the camera up. Pitch is intentionally
 * unclamped: the camera store bounds it to the renderable range, keeping this a
 * pure mapping. Callers gate on {@link isTiltGesture} before applying the
 * result, so a plain pan never reaches here.
 *
 * @param gesture - The drag gesture (buttons, modifier, cumulative deltas).
 * @param sensitivity - Degrees per pixel of drag (pass {@link MOUSE_TILT_SENSITIVITY} for the default feel).
 * @param baseline - Camera rotation/pitch captured when this drag started.
 * @returns The absolute target rotation/pitch for the camera.
 *
 * @example
 * ```typescript
 * const command = tiltCommandFor(
 *   { rightButton: true, deltaX: 40, deltaY: -60, ctrlKey: false },
 *   MOUSE_TILT_SENSITIVITY,
 *   { rotation: 0, pitch: 30 },
 * );
 * // rotation: 0 + 40 * 0.5 = 20; pitch: 30 - (-60 * 0.5) = 60
 * // → { rotation: 20, pitch: 60 }
 * ```
 */
export function tiltCommandFor(
  gesture: TiltGesture,
  sensitivity: number,
  baseline: TiltBaseline,
): TiltCommand {
  return {
    rotation: baseline.rotation + gesture.deltaX * sensitivity,
    // Negate `deltaY` so dragging up tilts up. The `+ 0` normalizes the `-0`
    // that `-(0 * sensitivity)` produces when `deltaY` is 0, so a zero-delta
    // frame yields `0`, not `-0`.
    pitch: baseline.pitch - gesture.deltaY * sensitivity + 0,
  };
}
