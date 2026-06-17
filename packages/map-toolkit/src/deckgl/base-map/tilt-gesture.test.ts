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

  it('returns null for a plain left-drag pan', () => {
    const command = tiltCommandFor(
      { leftButton: true, deltaX: 50, deltaY: 50, ctrlKey: false },
      '2.5D',
      MOUSE_TILT_SENSITIVITY,
      zeroBaseline,
    );

    expect(command).toBeNull();
  });

  it('promotes a flat 2D view to 2.5D on a right-drag tilt', () => {
    const command = tiltCommandFor(
      { rightButton: true, deltaX: 0, deltaY: 0, ctrlKey: false },
      '2D',
      MOUSE_TILT_SENSITIVITY,
      zeroBaseline,
    );

    expect(command).toEqual({ promoteToTilt: true, rotation: 0, pitch: 0 });
  });

  it('does not promote when already in 2.5D', () => {
    const command = tiltCommandFor(
      { rightButton: true, deltaX: 0, deltaY: 0, ctrlKey: false },
      '2.5D',
      MOUSE_TILT_SENSITIVITY,
      zeroBaseline,
    );

    expect(command?.promoteToTilt).toBe(false);
  });

  it('maps deltaX to scaled rotation and negates deltaY for pitch', () => {
    const command = tiltCommandFor(
      { rightButton: true, deltaX: 40, deltaY: -120, ctrlKey: false },
      '2.5D',
      MOUSE_TILT_SENSITIVITY,
      zeroBaseline,
    );

    // 40 * 0.5 = 20 rotation; -(-120) * 0.5 = 60 pitch
    expect(command).toEqual({
      promoteToTilt: false,
      rotation: 40 * MOUSE_TILT_SENSITIVITY,
      pitch: 60,
    });
  });

  it('honors a custom sensitivity multiplier', () => {
    const command = tiltCommandFor(
      { rightButton: true, deltaX: 100, deltaY: -100, ctrlKey: false },
      '2.5D',
      0.25,
      zeroBaseline,
    );

    expect(command).toEqual({ promoteToTilt: false, rotation: 25, pitch: 25 });
  });

  it('treats ctrl + left-drag as a tilt gesture', () => {
    const command = tiltCommandFor(
      { leftButton: true, deltaX: 20, deltaY: 0, ctrlKey: true },
      '2.5D',
      MOUSE_TILT_SENSITIVITY,
      zeroBaseline,
    );

    expect(command).toEqual({ promoteToTilt: false, rotation: 10, pitch: 0 });
  });

  it('continues from the baseline so a new drag does not snap to zero', () => {
    // Second tilt drag: delta starts near zero again, but the camera is already
    // pitched to 45° / rotated 30°. The command must build on that baseline.
    const command = tiltCommandFor(
      { rightButton: true, deltaX: 10, deltaY: -20, ctrlKey: false },
      '2.5D',
      MOUSE_TILT_SENSITIVITY,
      { rotation: 30, pitch: 45 },
    );

    // rotation 30 + 10*0.5 = 35; pitch 45 + (-(-20)*0.5) = 45 + 10 = 55
    expect(command).toEqual({ promoteToTilt: false, rotation: 35, pitch: 55 });
  });

  it('holds the current angle when a new drag has zero delta (no snap)', () => {
    const command = tiltCommandFor(
      { rightButton: true, deltaX: 0, deltaY: 0, ctrlKey: false },
      '2.5D',
      MOUSE_TILT_SENSITIVITY,
      { rotation: 30, pitch: 45 },
    );

    expect(command).toEqual({ promoteToTilt: false, rotation: 30, pitch: 45 });
  });
});
