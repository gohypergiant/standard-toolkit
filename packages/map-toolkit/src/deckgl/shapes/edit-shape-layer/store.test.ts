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

import { uuid } from '@accelint/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockShapes } from '../__fixtures__/mock-shapes';
import { ShapeFeatureType } from '../shared/types';
import {
  cancelEditingFromLayer,
  clearEditingState,
  editStore,
  getEditingState,
  updateFeatureFromLayer,
} from './store';
import type { UniqueId } from '@accelint/core';
import type { Shape } from '../shared/types';

// Get fixture shapes by type
const mockCircle = mockShapes.find((s) => s.shape === 'Circle');
const mockPolygon = mockShapes.find((s) => s.shape === 'Polygon');
const mockEllipse = mockShapes.find((s) => s.shape === 'Ellipse');
const mockRectangle = mockShapes.find((s) => s.shape === 'Rectangle');
const mockLineString = mockShapes.find((s) => s.shape === 'LineString');
const mockPoint = mockShapes.find((s) => s.shape === 'Point');

if (
  ![
    mockCircle,
    mockPolygon,
    mockEllipse,
    mockRectangle,
    mockLineString,
    mockPoint,
  ].every(Boolean)
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
    shape: mockPolygon!.shape,
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
    shape: mockCircle!.shape,
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
    shape: mockEllipse!.shape,
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
    shape: mockPoint!.shape,
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

  describe('editStore.subscribe', () => {
    it('creates a subscription function for a mapId', () => {
      const subscription = editStore.subscribe(mapId);
      expect(typeof subscription).toBe('function');
    });

    it('returns the same subscription function for the same mapId', () => {
      const subscription1 = editStore.subscribe(mapId);
      const subscription2 = editStore.subscribe(mapId);
      expect(subscription1).toBe(subscription2);
    });

    it('returns different subscription functions for different mapIds', () => {
      const mapId2 = uuid();
      const subscription1 = editStore.subscribe(mapId);
      const subscription2 = editStore.subscribe(mapId2);
      expect(subscription1).not.toBe(subscription2);
      clearEditingState(mapId2);
    });

    it('subscription notifies callback on store changes', () => {
      const subscription = editStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      const { edit } = editStore.actions(mapId);

      const shape = createMockShape();
      edit(shape);

      expect(callback).toHaveBeenCalled();

      unsubscribe();
    });

    it('unsubscribe removes callback from notifications', () => {
      const subscription = editStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      unsubscribe();

      callback.mockClear();

      const { edit } = editStore.actions(mapId);
      edit(createMockShape());

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('editStore.snapshot', () => {
    it('creates a snapshot function for a mapId', () => {
      const snapshot = editStore.snapshot(mapId);
      expect(typeof snapshot).toBe('function');
    });

    it('returns the same snapshot function for the same mapId', () => {
      const snapshot1 = editStore.snapshot(mapId);
      const snapshot2 = editStore.snapshot(mapId);
      expect(snapshot1).toBe(snapshot2);
    });

    it('snapshot returns state (lazy initialization)', () => {
      const snapshot = editStore.snapshot(mapId);
      const state = snapshot();
      expect(state).not.toBeNull();
      expect(state?.editingShape).toBeNull();
      expect(state?.editMode).toBe('view');
      expect(state?.featureBeingEdited).toBeNull();
    });
  });

  describe('editStore.serverSnapshot', () => {
    it('server snapshot returns default state', () => {
      const serverSnapshot = editStore.serverSnapshot();
      expect(serverSnapshot.editingShape).toBeNull();
      expect(serverSnapshot.editMode).toBe('view');
    });
  });

  describe('editStore.actions().edit', () => {
    it('creates an edit function for a mapId', () => {
      const { edit } = editStore.actions(mapId);
      expect(typeof edit).toBe('function');
    });

    it('returns the same actions for the same mapId', () => {
      const actions1 = editStore.actions(mapId);
      const actions2 = editStore.actions(mapId);
      expect(actions1.edit).toBe(actions2.edit);
    });

    it('edit starts editing and updates state', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockShape();
      edit(shape);

      const state = editStore.get(mapId);
      expect(state?.editingShape).toEqual(shape);
      expect(state?.featureBeingEdited).toEqual(shape.feature);
    });

    it('edit cancels existing editing before starting new one', () => {
      const { edit } = editStore.actions(mapId);

      const shape1 = createMockShape({ name: 'Shape 1' });
      const shape2 = createMockShape({ name: 'Shape 2' });

      edit(shape1);
      expect(editStore.get(mapId)?.editingShape?.name).toBe('Shape 1');

      edit(shape2);
      expect(editStore.get(mapId)?.editingShape?.name).toBe('Shape 2');
    });

    it('edit does not allow editing locked shapes', () => {
      const { edit } = editStore.actions(mapId);

      const lockedShape = createMockShape({ locked: true });
      edit(lockedShape);

      expect(editStore.get(mapId)?.editingShape).toBeNull();
    });

    it('edit allows editing unlocked shapes', () => {
      const { edit } = editStore.actions(mapId);

      const unlockedShape = createMockShape({ locked: false });
      edit(unlockedShape);

      expect(editStore.get(mapId)?.editingShape).toEqual(unlockedShape);
    });
  });

  describe('Edit mode selection', () => {
    it('sets vertex-transform mode for polygons', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockShape({ shape: ShapeFeatureType.Polygon });
      edit(shape);

      expect(editStore.get(mapId)?.editMode).toBe('vertex-transform');
    });

    it('sets vertex-transform mode for linestrings', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockShape({
        shape: ShapeFeatureType.LineString,
        // biome-ignore lint/style/noNonNullAssertion: mockLineString is verified in beforeAll
        feature: mockLineString!.feature,
      });
      edit(shape);

      expect(editStore.get(mapId)?.editMode).toBe('vertex-transform');
    });

    it('sets circle-transform mode for circles', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockCircleShape();
      edit(shape);

      expect(editStore.get(mapId)?.editMode).toBe('circle-transform');
    });

    it('sets bounding-transform mode for ellipses', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockEllipseShape();
      edit(shape);

      expect(editStore.get(mapId)?.editMode).toBe('bounding-transform');
    });

    it('sets bounding-transform mode for rectangles', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockShape({
        shape: ShapeFeatureType.Rectangle,
        // biome-ignore lint/style/noNonNullAssertion: mockRectangle is verified in beforeAll
        feature: mockRectangle!.feature,
      });
      edit(shape);

      expect(editStore.get(mapId)?.editMode).toBe('bounding-transform');
    });

    it('sets translate mode for points', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockPointShape();
      edit(shape);

      expect(editStore.get(mapId)?.editMode).toBe('translate');
    });

    it('allows mode override via options', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockShape({ shape: ShapeFeatureType.Polygon });
      edit(shape, { mode: 'circle-transform' });

      expect(editStore.get(mapId)?.editMode).toBe('circle-transform');
    });
  });

  describe('editStore.actions().save', () => {
    it('creates a save function for a mapId', () => {
      const { save } = editStore.actions(mapId);
      expect(typeof save).toBe('function');
    });

    it('returns the same save function for the same mapId', () => {
      const actions1 = editStore.actions(mapId);
      const actions2 = editStore.actions(mapId);
      expect(actions1.save).toBe(actions2.save);
    });

    it('save stops editing and resets state', () => {
      const { edit, save } = editStore.actions(mapId);

      const shape = createMockShape();
      edit(shape);
      expect(editStore.get(mapId)?.editingShape).not.toBeNull();

      save();
      expect(editStore.get(mapId)?.editingShape).toBeNull();
      expect(editStore.get(mapId)?.editMode).toBe('view');
    });

    it('save does nothing when not editing', () => {
      const { save } = editStore.actions(mapId);

      // Should not throw
      save();
      expect(editStore.get(mapId)?.editingShape).toBeNull();
    });
  });

  describe('editStore.actions().cancel', () => {
    it('creates a cancel function for a mapId', () => {
      const { cancel } = editStore.actions(mapId);
      expect(typeof cancel).toBe('function');
    });

    it('returns the same cancel function for the same mapId', () => {
      const actions1 = editStore.actions(mapId);
      const actions2 = editStore.actions(mapId);
      expect(actions1.cancel).toBe(actions2.cancel);
    });

    it('cancel stops editing and resets state', () => {
      const { edit, cancel } = editStore.actions(mapId);

      const shape = createMockShape();
      edit(shape);
      expect(editStore.get(mapId)?.editingShape).not.toBeNull();

      cancel();
      expect(editStore.get(mapId)?.editingShape).toBeNull();
      expect(editStore.get(mapId)?.editMode).toBe('view');
    });

    it('cancel does nothing when not editing', () => {
      const { cancel } = editStore.actions(mapId);

      // Should not throw
      cancel();
      expect(editStore.get(mapId)?.editingShape).toBeNull();
    });
  });

  describe('updateFeatureFromLayer', () => {
    it('updates the feature being edited', () => {
      const { edit } = editStore.actions(mapId);

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

      expect(editStore.get(mapId)?.featureBeingEdited).toEqual(updatedFeature);
    });
  });

  describe('cancelEditingFromLayer', () => {
    it('cancels editing from the layer component', () => {
      const { edit } = editStore.actions(mapId);

      const shape = createMockShape();
      edit(shape);
      expect(editStore.get(mapId)?.editingShape).not.toBeNull();

      cancelEditingFromLayer(mapId);

      expect(editStore.get(mapId)?.editingShape).toBeNull();
    });
  });

  describe('getEditingState', () => {
    it('returns null when no state exists', () => {
      expect(getEditingState(mapId)).toBeNull();
    });

    it('returns state after initialization', () => {
      // Initialize by getting actions
      editStore.actions(mapId);
      const state = getEditingState(mapId);
      expect(state).not.toBeNull();
      expect(state?.editingShape).toBeNull();
    });
  });

  describe('clearEditingState', () => {
    it('clears all state for a mapId', () => {
      const { edit } = editStore.actions(mapId);
      edit(createMockShape());

      expect(getEditingState(mapId)).not.toBeNull();

      clearEditingState(mapId);

      expect(getEditingState(mapId)).toBeNull();
    });

    it('cancels active editing before clearing', () => {
      const { edit } = editStore.actions(mapId);
      edit(createMockShape());

      // Should not throw
      clearEditingState(mapId);

      expect(getEditingState(mapId)).toBeNull();
    });
  });

  describe('cleanup behavior', () => {
    it('cleans up state when last subscriber unsubscribes', () => {
      const subscription = editStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);

      // Unsubscribe should trigger cleanup
      unsubscribe();

      // State should be cleared
      expect(getEditingState(mapId)).toBeNull();
    });

    it('maintains state while subscribers exist', () => {
      const subscription = editStore.subscribe(mapId);
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
