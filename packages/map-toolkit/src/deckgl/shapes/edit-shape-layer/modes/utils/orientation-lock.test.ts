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

import type {
  FeatureCollection,
  ModeProps,
} from '@deck.gl-community/editable-layers';
import type { Feature, Point } from 'geojson';
import { describe, expect, it } from 'vitest';
import { OrientationLock } from './orientation-lock';
import { BBOX_ORIENTATION_CONFIG_KEY } from '../oriented-scale-mode';

/**
 * Sentinel bounding-box type for the generic parameter. The lock never
 * inspects the value — it just stores and returns it — so the test can
 * use any tagged shape.
 */
type TestBox = { tag: 'box'; angleAtSnapshot: number };

/**
 * Build a minimal Feature with optional shape-id and rotation-angle
 * properties. Geometry is a degenerate Point because the lock only
 * reads `properties`.
 */
function makeFeature(args: {
  shapeId?: string;
  rotationAngle?: number;
}): Feature<Point> {
  const properties: Record<string, unknown> = {};

  if (args.shapeId !== undefined) {
    properties.shapeId = args.shapeId;
  }

  if (args.rotationAngle !== undefined) {
    properties.rotationAngle = args.rotationAngle;
  }

  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties,
  };
}

/**
 * Bind a fresh lock + a `computeBoundingBox` closure that records the
 * angle it was called with — handy for asserting which angle the
 * scale-snapshot captured.
 */
function setup(): {
  lock: OrientationLock<TestBox>;
  computeBoundingBox: (angleDeg: number) => TestBox;
} {
  const lock = new OrientationLock<TestBox>();
  const computeBoundingBox = (angleDeg: number): TestBox => ({
    tag: 'box',
    angleAtSnapshot: angleDeg,
  });

  return { lock, computeBoundingBox };
}

const noBox = () => null;

describe('OrientationLock', () => {
  it('should start with zero angle and no scale lock', () => {
    const { lock, computeBoundingBox } = setup();

    const snapshot = lock.observe({
      feature: undefined,
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(0);
    expect(snapshot.lockedBoundingBox).toBeNull();
  });

  it('should hold angle at zero while rotation is still in progress', () => {
    const { lock, computeBoundingBox } = setup();

    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 15 }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(0);
  });

  it('should commit rotation delta on drag-end transition', () => {
    const { lock, computeBoundingBox } = setup();

    // Frame N: rotation in progress
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 15 }),
      isScaling: false,
      computeBoundingBox,
    });

    // Frame N+1: rotationAngle drops (drag ended) — commits the 15° delta
    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(15);
  });

  it('should accumulate deltas across multiple drag cycles', () => {
    const { lock, computeBoundingBox } = setup();

    // First drag: 15°
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 15 }),
      isScaling: false,
      computeBoundingBox,
    });
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    // Second drag: 30°
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 30 }),
      isScaling: false,
      computeBoundingBox,
    });
    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(45);
  });

  it('should normalize cumulative angle above 360 into [0, 360)', () => {
    const { lock, computeBoundingBox } = setup();

    // 200° + 200° = 400° → normalizes to 40°
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 200 }),
      isScaling: false,
      computeBoundingBox,
    });
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 200 }),
      isScaling: false,
      computeBoundingBox,
    });
    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(40);
  });

  it('should normalize negative cumulative angle into [0, 360)', () => {
    const { lock, computeBoundingBox } = setup();

    // -90° → normalizes to 270°
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: -90 }),
      isScaling: false,
      computeBoundingBox,
    });
    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(270);
  });

  it('should treat an exact 360° rotation as 0°', () => {
    const { lock, computeBoundingBox } = setup();

    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 360 }),
      isScaling: false,
      computeBoundingBox,
    });
    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(0);
  });

  it('should reset accumulated angle when shapeId changes', () => {
    const { lock, computeBoundingBox } = setup();

    // Accumulate 45° on shape-a
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 45 }),
      isScaling: false,
      computeBoundingBox,
    });
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    // Switch to shape-b
    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-b' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(0);
  });

  it('should not commit rotation when feature lacks a shapeId', () => {
    const { lock, computeBoundingBox } = setup();

    lock.observe({
      feature: makeFeature({ rotationAngle: 30 }),
      isScaling: false,
      computeBoundingBox,
    });
    const snapshot = lock.observe({
      feature: makeFeature({}),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(0);
  });

  it('should clear accumulated angle on reset()', () => {
    const { lock, computeBoundingBox } = setup();

    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 90 }),
      isScaling: false,
      computeBoundingBox,
    });
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    lock.reset();

    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.angleDeg).toBe(0);
  });

  it('should snapshot bounding box on first scaling frame', () => {
    const { lock, computeBoundingBox } = setup();

    // Establish 90° accumulated angle first
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 90 }),
      isScaling: false,
      computeBoundingBox,
    });
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    // First scaling frame snapshots
    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: true,
      computeBoundingBox,
    });

    expect(snapshot.lockedBoundingBox).toEqual({
      tag: 'box',
      angleAtSnapshot: 90,
    });
  });

  it('should hold the same locked box across subsequent scaling frames', () => {
    const { lock, computeBoundingBox } = setup();

    const first = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: true,
      computeBoundingBox,
    });
    const second = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: true,
      computeBoundingBox,
    });

    expect(second.lockedBoundingBox).toBe(first.lockedBoundingBox);
  });

  it('should clear locked bounding box when scaling ends', () => {
    const { lock, computeBoundingBox } = setup();

    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: true,
      computeBoundingBox,
    });

    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.lockedBoundingBox).toBeNull();
  });

  it('should capture a fresh snapshot on a second scaling drag', () => {
    const { lock, computeBoundingBox } = setup();

    // First scale drag (angle = 0)
    const first = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: true,
      computeBoundingBox,
    });

    // Release
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    // Rotate to 45° between scale drags
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 45 }),
      isScaling: false,
      computeBoundingBox,
    });
    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    // Second scale drag captures fresh snapshot at the new angle
    const second = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: true,
      computeBoundingBox,
    });

    expect(first.lockedBoundingBox).toEqual({ tag: 'box', angleAtSnapshot: 0 });
    expect(second.lockedBoundingBox).toEqual({
      tag: 'box',
      angleAtSnapshot: 45,
    });
  });

  it('should clear locked bounding box on reset() mid-drag', () => {
    const { lock, computeBoundingBox } = setup();

    lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: true,
      computeBoundingBox,
    });

    lock.reset();

    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: false,
      computeBoundingBox,
    });

    expect(snapshot.lockedBoundingBox).toBeNull();
  });

  it('should pass through computeBoundingBox returning null without throwing', () => {
    const lock = new OrientationLock<TestBox>();

    const snapshot = lock.observe({
      feature: makeFeature({ shapeId: 'shape-a' }),
      isScaling: true,
      computeBoundingBox: noBox,
    });

    expect(snapshot.lockedBoundingBox).toBeNull();
  });

  describe('decorateProps', () => {
    it('should return the same props reference when angle is zero', () => {
      const lock = new OrientationLock<TestBox>();
      const props = {
        modeConfig: { foo: 'bar' },
      } as unknown as ModeProps<FeatureCollection>;

      const decorated = lock.decorateProps(props);

      expect(decorated).toBe(props);
    });

    it('should write the angle into modeConfig when non-zero', () => {
      const { lock, computeBoundingBox } = setup();

      lock.observe({
        feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 30 }),
        isScaling: false,
        computeBoundingBox,
      });
      lock.observe({
        feature: makeFeature({ shapeId: 'shape-a' }),
        isScaling: false,
        computeBoundingBox,
      });

      const props = {
        modeConfig: {},
      } as unknown as ModeProps<FeatureCollection>;

      const decorated = lock.decorateProps(props);

      expect(decorated).not.toBe(props);
      expect(decorated.modeConfig?.[BBOX_ORIENTATION_CONFIG_KEY]).toBe(30);
    });

    it('should preserve other modeConfig keys', () => {
      const { lock, computeBoundingBox } = setup();

      lock.observe({
        feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 30 }),
        isScaling: false,
        computeBoundingBox,
      });
      lock.observe({
        feature: makeFeature({ shapeId: 'shape-a' }),
        isScaling: false,
        computeBoundingBox,
      });

      const props = {
        modeConfig: { lockScaling: true, foo: 42 },
      } as unknown as ModeProps<FeatureCollection>;

      const decorated = lock.decorateProps(props);

      expect(decorated.modeConfig?.lockScaling).toBe(true);
      expect(decorated.modeConfig?.foo).toBe(42);
      expect(decorated.modeConfig?.[BBOX_ORIENTATION_CONFIG_KEY]).toBe(30);
    });

    it('should handle props with no modeConfig', () => {
      const { lock, computeBoundingBox } = setup();

      lock.observe({
        feature: makeFeature({ shapeId: 'shape-a', rotationAngle: 30 }),
        isScaling: false,
        computeBoundingBox,
      });
      lock.observe({
        feature: makeFeature({ shapeId: 'shape-a' }),
        isScaling: false,
        computeBoundingBox,
      });

      const props = {} as unknown as ModeProps<FeatureCollection>;

      const decorated = lock.decorateProps(props);

      expect(decorated.modeConfig?.[BBOX_ORIENTATION_CONFIG_KEY]).toBe(30);
    });
  });
});
