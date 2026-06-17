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
  isTiltGesture,
  MOUSE_TILT_SENSITIVITY,
  tiltCommandFor,
} from './tilt-gesture';

describe('isTiltGesture', () => {
  it.each([
    {
      label: 'right-button drag',
      gesture: { rightButton: true, deltaX: 0, deltaY: 0, ctrlKey: false },
      expected: true,
    },
    {
      label: 'ctrl + left-button drag',
      gesture: { leftButton: true, deltaX: 0, deltaY: 0, ctrlKey: true },
      expected: true,
    },
    {
      label: 'plain left-button drag (pan)',
      gesture: { leftButton: true, deltaX: 0, deltaY: 0, ctrlKey: false },
      expected: false,
    },
    {
      label: 'ctrl without any button',
      gesture: { deltaX: 0, deltaY: 0, ctrlKey: true },
      expected: false,
    },
  ])('returns $expected for a $label', ({ gesture, expected }) => {
    expect(isTiltGesture(gesture)).toBe(expected);
  });
});

describe('tiltCommandFor', () => {
  const zeroBaseline = { rotation: 0, pitch: 0 };

  it.each([
    {
      label: 'maps deltaX to scaled rotation and negates deltaY for pitch',
      gesture: { rightButton: true, deltaX: 40, deltaY: -120, ctrlKey: false },
      sensitivity: MOUSE_TILT_SENSITIVITY,
      baseline: zeroBaseline,
      // 40 * 0.5 = 20 rotation; -(-120) * 0.5 = 60 pitch
      expected: { rotation: 20, pitch: 60 },
    },
    {
      label: 'honors a custom sensitivity multiplier',
      gesture: { rightButton: true, deltaX: 100, deltaY: -100, ctrlKey: false },
      sensitivity: 0.25,
      baseline: zeroBaseline,
      expected: { rotation: 25, pitch: 25 },
    },
    {
      label: 'treats ctrl + left-drag as a tilt gesture',
      gesture: { leftButton: true, deltaX: 20, deltaY: 0, ctrlKey: true },
      sensitivity: MOUSE_TILT_SENSITIVITY,
      baseline: zeroBaseline,
      expected: { rotation: 10, pitch: 0 },
    },
    {
      // Second tilt drag: delta starts near zero again, but the camera is
      // already pitched to 45° / rotated 30°. The command must build on that
      // baseline instead of snapping back to zero.
      label: 'continues from the baseline so a new drag does not snap to zero',
      gesture: { rightButton: true, deltaX: 10, deltaY: -20, ctrlKey: false },
      sensitivity: MOUSE_TILT_SENSITIVITY,
      baseline: { rotation: 30, pitch: 45 },
      // rotation 30 + 10*0.5 = 35; pitch 45 + (-(-20)*0.5) = 55
      expected: { rotation: 35, pitch: 55 },
    },
    {
      label: 'holds the current angle when a new drag has zero delta',
      gesture: { rightButton: true, deltaX: 0, deltaY: 0, ctrlKey: false },
      sensitivity: MOUSE_TILT_SENSITIVITY,
      baseline: { rotation: 30, pitch: 45 },
      expected: { rotation: 30, pitch: 45 },
    },
  ])('$label', ({ gesture, sensitivity, baseline, expected }) => {
    expect(tiltCommandFor(gesture, sensitivity, baseline)).toEqual(expected);
  });

  it('leaves pitch unclamped so the camera store owns the bound', () => {
    // A long upward drag pushes pitch past MapLibre's 85° render limit; the pure
    // mapping passes it straight through (clamping is the camera store's job).
    const command = tiltCommandFor(
      { rightButton: true, deltaX: 0, deltaY: -240, ctrlKey: false },
      MOUSE_TILT_SENSITIVITY,
      zeroBaseline,
    );

    expect(command.pitch).toBe(120);
  });

  it('normalizes a zero-delta tilt to +0, never -0', () => {
    // Negating `deltaY: 0` yields `-0`; the mapping must return a clean `0` so a
    // zero-delta frame does not leak `-0` into the camera state.
    const command = tiltCommandFor(
      { rightButton: true, deltaX: 0, deltaY: 0, ctrlKey: false },
      MOUSE_TILT_SENSITIVITY,
      zeroBaseline,
    );

    expect(Object.is(command.pitch, 0)).toBe(true);
    expect(Object.is(command.rotation, 0)).toBe(true);
  });
});
