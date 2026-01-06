/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { uuid } from '@accelint/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockShapes } from '../__fixtures__/mock-shapes';
import { ShapeFeatureType } from '../shared/types';
import {
  cancelEditingFromLayer,
  clearEditingState,
  getEditingState,
  getOrCreateCancel,
  getOrCreateEdit,
  getOrCreateSave,
  getOrCreateServerSnapshot,
  getOrCreateSnapshot,
  getOrCreateSubscription,
  updateFeatureFromLayer,
} from './store';
import type { UniqueId } from '@accelint/core';
import type { Shape } from '../shared/types';

// Get fixture shapes by type
const mockCircle = mockShapes.find((s) => s.shapeType === 'Circle');
const mockPolygon = mockShapes.find((s) => s.shapeType === 'Polygon');
const mockEllipse = mockShapes.find((s) => s.shapeType === 'Ellipse');
const mockRectangle = mockShapes.find((s) => s.shapeType === 'Rectangle');
const mockLineString = mockShapes.find((s) => s.shapeType === 'LineString');
const mockPoint = mockShapes.find((s) => s.shapeType === 'Point');

if (
  !mockCircle ||
  !mockPolygon ||
  !mockEllipse ||
  !mockRectangle ||
  !mockLineString ||
  !mockPoint
) {
  throw new Error('Missing fixture shapes');
}

/**
 * Create a mock Shape for testing with a unique ID
 */
function createMockShape(overrides?: Partial<Shape>): Shape {
  return {
    id: uuid(),
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    name: mockPolygon!.name,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    shapeType: mockPolygon!.shapeType,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    feature: mockPolygon!.feature,
    lastUpdated: Date.now(),
    ...overrides,
  } as Shape;
}

/**
 * Create a mock circle Shape for testing
 */
function createMockCircleShape(): Shape {
  return {
    id: uuid(),
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    name: mockCircle!.name,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    shapeType: mockCircle!.shapeType,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    feature: mockCircle!.feature,
    lastUpdated: Date.now(),
  } as Shape;
}

/**
 * Create a mock ellipse Shape for testing
 */
function createMockEllipseShape(): Shape {
  return {
    id: uuid(),
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    name: mockEllipse!.name,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    shapeType: mockEllipse!.shapeType,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    feature: mockEllipse!.feature,
    lastUpdated: Date.now(),
  } as Shape;
}

/**
 * Create a mock point Shape for testing
 */
function createMockPointShape(): Shape {
  return {
    id: uuid(),
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    name: mockPoint!.name,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    shapeType: mockPoint!.shapeType,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    feature: mockPoint!.feature,
    lastUpdated: Date.now(),
  } as Shape;
}

describe('edit-shape-layer store', () => {
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();
  });

  afterEach(() => {
    clearEditingState(mapId);
  });

  describe('getOrCreateSubscription', () => {
    it('creates a subscription function for a mapId', () => {
      const subscription = getOrCreateSubscription(mapId);
      expect(typeof subscription).toBe('function');
    });

    it('returns the same subscription function for the same mapId', () => {
      const subscription1 = getOrCreateSubscription(mapId);
      const subscription2 = getOrCreateSubscription(mapId);
      expect(subscription1).toBe(subscription2);
    });

    it('returns different subscription functions for different mapIds', () => {
      const mapId2 = uuid();
      const subscription1 = getOrCreateSubscription(mapId);
      const subscription2 = getOrCreateSubscription(mapId2);
      expect(subscription1).not.toBe(subscription2);
      clearEditingState(mapId2);
    });

    it('subscription notifies callback on store changes', () => {
      const subscription = getOrCreateSubscription(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      const edit = getOrCreateEdit(mapId);

      const shape = createMockShape();
      edit(shape);

      expect(callback).toHaveBeenCalled();

      unsubscribe();
    });

    it('unsubscribe removes callback from notifications', () => {
      const subscription = getOrCreateSubscription(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      unsubscribe();

      callback.mockClear();

      const edit = getOrCreateEdit(mapId);
      edit(createMockShape());

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('getOrCreateSnapshot', () => {
    it('creates a snapshot function for a mapId', () => {
      const snapshot = getOrCreateSnapshot(mapId);
      expect(typeof snapshot).toBe('function');
    });

    it('returns the same snapshot function for the same mapId', () => {
      const snapshot1 = getOrCreateSnapshot(mapId);
      const snapshot2 = getOrCreateSnapshot(mapId);
      expect(snapshot1).toBe(snapshot2);
    });

    it('snapshot returns null when no state exists', () => {
      const snapshot = getOrCreateSnapshot(mapId);
      expect(snapshot()).toBeNull();
    });

    it('snapshot returns state after subscription initializes it', () => {
      getOrCreateSubscription(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const state = snapshot();
      expect(state).not.toBeNull();
      expect(state?.editingShape).toBeNull();
      expect(state?.editMode).toBe('view');
      expect(state?.featureBeingEdited).toBeNull();
    });
  });

  describe('getOrCreateServerSnapshot', () => {
    it('creates a server snapshot function for a mapId', () => {
      const serverSnapshot = getOrCreateServerSnapshot(mapId);
      expect(typeof serverSnapshot).toBe('function');
    });

    it('returns the same server snapshot function for the same mapId', () => {
      const serverSnapshot1 = getOrCreateServerSnapshot(mapId);
      const serverSnapshot2 = getOrCreateServerSnapshot(mapId);
      expect(serverSnapshot1).toBe(serverSnapshot2);
    });

    it('server snapshot always returns null (client-only state)', () => {
      const serverSnapshot = getOrCreateServerSnapshot(mapId);

      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      edit(createMockShape());

      expect(serverSnapshot()).toBeNull();
    });
  });

  describe('getOrCreateEdit', () => {
    it('creates an edit function for a mapId', () => {
      const edit = getOrCreateEdit(mapId);
      expect(typeof edit).toBe('function');
    });

    it('returns the same edit function for the same mapId', () => {
      const edit1 = getOrCreateEdit(mapId);
      const edit2 = getOrCreateEdit(mapId);
      expect(edit1).toBe(edit2);
    });

    it('edit starts editing and updates state', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockShape();
      edit(shape);

      const state = snapshot();
      expect(state?.editingShape).toEqual(shape);
      expect(state?.featureBeingEdited).toEqual(shape.feature);
    });

    it('edit cancels existing editing before starting new one', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape1 = createMockShape({ name: 'Shape 1' });
      const shape2 = createMockShape({ name: 'Shape 2' });

      edit(shape1);
      expect(snapshot()?.editingShape?.name).toBe('Shape 1');

      edit(shape2);
      expect(snapshot()?.editingShape?.name).toBe('Shape 2');
    });

    it('edit does not allow editing locked shapes', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const lockedShape = createMockShape({ locked: true });
      edit(lockedShape);

      expect(snapshot()?.editingShape).toBeNull();
    });

    it('edit allows editing unlocked shapes', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const unlockedShape = createMockShape({ locked: false });
      edit(unlockedShape);

      expect(snapshot()?.editingShape).toEqual(unlockedShape);
    });
  });

  describe('Edit mode selection', () => {
    it('sets vertex-transform mode for polygons', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockShape({ shapeType: ShapeFeatureType.Polygon });
      edit(shape);

      expect(snapshot()?.editMode).toBe('vertex-transform');
    });

    it('sets vertex-transform mode for linestrings', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      // biome-ignore lint/style/noNonNullAssertion: Existence verified above
      const shape = createMockShape({
        shapeType: ShapeFeatureType.LineString,
        feature: mockLineString!.feature,
      });
      edit(shape);

      expect(snapshot()?.editMode).toBe('vertex-transform');
    });

    it('sets circle-transform mode for circles', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockCircleShape();
      edit(shape);

      expect(snapshot()?.editMode).toBe('circle-transform');
    });

    it('sets bounding-transform mode for ellipses', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockEllipseShape();
      edit(shape);

      expect(snapshot()?.editMode).toBe('bounding-transform');
    });

    it('sets bounding-transform mode for rectangles', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      // biome-ignore lint/style/noNonNullAssertion: Existence verified above
      const shape = createMockShape({
        shapeType: ShapeFeatureType.Rectangle,
        feature: mockRectangle!.feature,
      });
      edit(shape);

      expect(snapshot()?.editMode).toBe('bounding-transform');
    });

    it('sets translate mode for points', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockPointShape();
      edit(shape);

      expect(snapshot()?.editMode).toBe('translate');
    });

    it('allows mode override via options', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockShape({ shapeType: ShapeFeatureType.Polygon });
      edit(shape, { mode: 'circle-transform' });

      expect(snapshot()?.editMode).toBe('circle-transform');
    });
  });

  describe('getOrCreateSave', () => {
    it('creates a save function for a mapId', () => {
      const save = getOrCreateSave(mapId);
      expect(typeof save).toBe('function');
    });

    it('returns the same save function for the same mapId', () => {
      const save1 = getOrCreateSave(mapId);
      const save2 = getOrCreateSave(mapId);
      expect(save1).toBe(save2);
    });

    it('save stops editing and resets state', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const save = getOrCreateSave(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockShape();
      edit(shape);
      expect(snapshot()?.editingShape).not.toBeNull();

      save();
      expect(snapshot()?.editingShape).toBeNull();
      expect(snapshot()?.editMode).toBe('view');
    });

    it('save does nothing when not editing', () => {
      getOrCreateSubscription(mapId);
      const save = getOrCreateSave(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      // Should not throw
      save();
      expect(snapshot()?.editingShape).toBeNull();
    });
  });

  describe('getOrCreateCancel', () => {
    it('creates a cancel function for a mapId', () => {
      const cancel = getOrCreateCancel(mapId);
      expect(typeof cancel).toBe('function');
    });

    it('returns the same cancel function for the same mapId', () => {
      const cancel1 = getOrCreateCancel(mapId);
      const cancel2 = getOrCreateCancel(mapId);
      expect(cancel1).toBe(cancel2);
    });

    it('cancel stops editing and resets state', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const cancel = getOrCreateCancel(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockShape();
      edit(shape);
      expect(snapshot()?.editingShape).not.toBeNull();

      cancel();
      expect(snapshot()?.editingShape).toBeNull();
      expect(snapshot()?.editMode).toBe('view');
    });

    it('cancel does nothing when not editing', () => {
      getOrCreateSubscription(mapId);
      const cancel = getOrCreateCancel(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      // Should not throw
      cancel();
      expect(snapshot()?.editingShape).toBeNull();
    });
  });

  describe('updateFeatureFromLayer', () => {
    it('updates the feature being edited', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockShape();
      edit(shape);

      const updatedFeature = {
        ...shape.feature,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [
            [
              [1, 1],
              [2, 1],
              [2, 2],
              [1, 2],
              [1, 1],
            ],
          ],
        },
      };

      updateFeatureFromLayer(mapId, updatedFeature);

      expect(snapshot()?.featureBeingEdited).toEqual(updatedFeature);
    });
  });

  describe('cancelEditingFromLayer', () => {
    it('cancels editing from the layer component', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const shape = createMockShape();
      edit(shape);
      expect(snapshot()?.editingShape).not.toBeNull();

      cancelEditingFromLayer(mapId);

      expect(snapshot()?.editingShape).toBeNull();
    });
  });

  describe('getEditingState', () => {
    it('returns null when no state exists', () => {
      expect(getEditingState(mapId)).toBeNull();
    });

    it('returns state after initialization', () => {
      getOrCreateSubscription(mapId);
      const state = getEditingState(mapId);
      expect(state).not.toBeNull();
      expect(state?.editingShape).toBeNull();
    });
  });

  describe('clearEditingState', () => {
    it('clears all state for a mapId', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      edit(createMockShape());

      expect(getEditingState(mapId)).not.toBeNull();

      clearEditingState(mapId);

      expect(getEditingState(mapId)).toBeNull();
    });

    it('cancels active editing before clearing', () => {
      getOrCreateSubscription(mapId);
      const edit = getOrCreateEdit(mapId);
      edit(createMockShape());

      // Should not throw
      clearEditingState(mapId);

      expect(getEditingState(mapId)).toBeNull();
    });
  });

  describe('cleanup behavior', () => {
    it('cleans up state when last subscriber unsubscribes', () => {
      const subscription = getOrCreateSubscription(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);

      // Unsubscribe should trigger cleanup
      unsubscribe();

      // State should be cleared
      expect(getEditingState(mapId)).toBeNull();
    });

    it('maintains state while subscribers exist', () => {
      const subscription = getOrCreateSubscription(mapId);
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = subscription(callback1);
      const unsubscribe2 = subscription(callback2);

      // Unsubscribe first callback
      unsubscribe1();

      // State should still exist (second subscriber still active)
      expect(getEditingState(mapId)).not.toBeNull();

      // Unsubscribe second callback
      unsubscribe2();

      // Now state should be cleaned up
      expect(getEditingState(mapId)).toBeNull();
    });
  });
});
