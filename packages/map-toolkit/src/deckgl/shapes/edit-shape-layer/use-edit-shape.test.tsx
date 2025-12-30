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

import { Broadcast } from '@accelint/bus';
import { uuid } from '@accelint/core';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockShapes } from '../__fixtures__/mock-shapes';
import { ShapeFeatureType } from '../shared/types';
import { EditShapeEvents } from './events';
import { clearEditingState } from './store';
import { useEditShape } from './use-edit-shape';
import type { UniqueId } from '@accelint/core';
import type { Shape } from '../shared/types';
import type {
  EditShapeEvent,
  ShapeEditCanceledEvent,
  ShapeUpdatedEvent,
} from './events';

// Get fixture shapes by type
const mockCircle = mockShapes.find((s) => s.shapeType === 'Circle');
const mockPolygon = mockShapes.find((s) => s.shapeType === 'Polygon');
const mockEllipse = mockShapes.find((s) => s.shapeType === 'Ellipse');

if (!mockCircle) {
  throw new Error('Missing Circle fixture shape');
}

if (!mockPolygon) {
  throw new Error('Missing Polygon fixture shape');
}

if (!mockEllipse) {
  throw new Error('Missing Ellipse fixture shape');
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
 * Create a mock circle Shape for testing ResizeCircleMode
 */
function createMockCircleShape(overrides?: Partial<Shape>): Shape {
  return {
    id: uuid(),
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    name: mockCircle!.name,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    shapeType: mockCircle!.shapeType,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    feature: mockCircle!.feature,
    lastUpdated: Date.now(),
    ...overrides,
  } as Shape;
}

/**
 * Create a mock ellipse Shape for testing TransformMode
 */
function createMockEllipseShape(overrides?: Partial<Shape>): Shape {
  return {
    id: uuid(),
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    name: mockEllipse!.name,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    shapeType: mockEllipse!.shapeType,
    // biome-ignore lint/style/noNonNullAssertion: Existence verified above with throw
    feature: mockEllipse!.feature,
    lastUpdated: Date.now(),
    ...overrides,
  } as Shape;
}

describe('useEditShape', () => {
  let mapId: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance<EditShapeEvent>>;

  beforeEach(() => {
    mapId = uuid();
    bus = Broadcast.getInstance();
    // Clear any existing state for this mapId
    clearEditingState(mapId);
  });

  describe('initial state', () => {
    it('returns null for editingShape when not editing', () => {
      const { result } = renderHook(() => useEditShape(mapId));

      expect(result.current.editingShape).toBeNull();
      expect(result.current.isEditing).toBe(false);
    });

    it('provides edit, save, and cancel functions', () => {
      const { result } = renderHook(() => useEditShape(mapId));

      expect(typeof result.current.edit).toBe('function');
      expect(typeof result.current.save).toBe('function');
      expect(typeof result.current.cancel).toBe('function');
    });

    it('throws when used without mapId and outside MapProvider', () => {
      expect(() => {
        renderHook(() => useEditShape());
      }).toThrow(
        'useEditShape requires either a mapId parameter or to be used within a MapProvider',
      );
    });
  });

  describe('edit function', () => {
    it('starts editing and updates isEditing state', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape();

      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(true);
        expect(result.current.editingShape).toEqual(shape);
      });
    });

    it('emits shapes:editing event when starting', async () => {
      const editingSpy = vi.fn();
      bus.on(EditShapeEvents.editing, editingSpy);

      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape();

      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(editingSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              shape,
              mapId,
            }),
          }),
        );
      });

      bus.off(EditShapeEvents.editing, editingSpy);
    });

    it('sets vertex-transform mode for polygons', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape({ shapeType: ShapeFeatureType.Polygon });

      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.editingState?.editMode).toBe('vertex-transform');
      });
    });

    it('sets vertex-transform mode for lines', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape({ shapeType: ShapeFeatureType.LineString });

      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.editingState?.editMode).toBe('vertex-transform');
      });
    });

    it('sets bounding-transform mode for rectangles', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape({ shapeType: ShapeFeatureType.Rectangle });

      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.editingState?.editMode).toBe(
          'bounding-transform',
        );
      });
    });

    it('sets translate mode for points', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape({ shapeType: ShapeFeatureType.Point });

      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.editingState?.editMode).toBe('translate');
      });
    });

    it('sets resize-circle mode for circles', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockCircleShape();

      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.editingState?.editMode).toBe('resize-circle');
      });
    });

    it('sets bounding-transform mode for ellipses', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockEllipseShape();

      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.editingState?.editMode).toBe(
          'bounding-transform',
        );
      });
    });

    it('allows mode override via options', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape({ shapeType: ShapeFeatureType.Polygon });

      act(() => {
        result.current.edit(shape, { mode: 'resize-circle' });
      });

      await waitFor(() => {
        expect(result.current.editingState?.editMode).toBe('resize-circle');
      });
    });

    it('does not allow editing locked shapes', async () => {
      const editingSpy = vi.fn();
      bus.on(EditShapeEvents.editing, editingSpy);

      const { result } = renderHook(() => useEditShape(mapId));
      const lockedShape = createMockShape({ locked: true });

      act(() => {
        result.current.edit(lockedShape);
      });

      // Wait a tick to ensure no async updates
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should not enter editing state
      expect(result.current.isEditing).toBe(false);
      expect(result.current.editingShape).toBeNull();
      // Should not emit editing event
      expect(editingSpy).not.toHaveBeenCalled();

      bus.off(EditShapeEvents.editing, editingSpy);
    });

    it('allows editing unlocked shapes', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const unlockedShape = createMockShape({ locked: false });

      act(() => {
        result.current.edit(unlockedShape);
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(true);
        expect(result.current.editingShape).toEqual(unlockedShape);
      });
    });
  });

  describe('save function', () => {
    it('saves editing and updates state', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape();

      // Start editing first
      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(true);
      });

      // Then save
      act(() => {
        result.current.save();
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(false);
        expect(result.current.editingShape).toBeNull();
      });
    });

    it('emits shapes:updated event when saving', async () => {
      const updatedSpy = vi.fn();
      const updatedBus = Broadcast.getInstance<ShapeUpdatedEvent>();
      updatedBus.on(EditShapeEvents.updated, updatedSpy);

      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape();

      // Start editing first
      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(true);
      });

      // Then save
      act(() => {
        result.current.save();
      });

      await waitFor(() => {
        expect(updatedSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              shape: expect.objectContaining({
                id: shape.id,
              }),
              mapId,
            }),
          }),
        );
      });

      updatedBus.off(EditShapeEvents.updated, updatedSpy);
    });

    it('does nothing when not actively editing', () => {
      const updatedSpy = vi.fn();
      const updatedBus = Broadcast.getInstance<ShapeUpdatedEvent>();
      updatedBus.on(EditShapeEvents.updated, updatedSpy);

      const { result } = renderHook(() => useEditShape(mapId));

      // Try to save without starting
      act(() => {
        result.current.save();
      });

      expect(updatedSpy).not.toHaveBeenCalled();

      updatedBus.off(EditShapeEvents.updated, updatedSpy);
    });
  });

  describe('cancel function', () => {
    it('cancels editing and updates state', async () => {
      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape();

      // Start editing first
      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(true);
      });

      // Then cancel
      act(() => {
        result.current.cancel();
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(false);
        expect(result.current.editingShape).toBeNull();
      });
    });

    it('emits shapes:edit-canceled event when canceling', async () => {
      const canceledSpy = vi.fn();
      const canceledBus = Broadcast.getInstance<ShapeEditCanceledEvent>();
      canceledBus.on(EditShapeEvents.canceled, canceledSpy);

      const { result } = renderHook(() => useEditShape(mapId));
      const shape = createMockShape();

      // Start editing first
      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(true);
      });

      // Then cancel
      act(() => {
        result.current.cancel();
      });

      await waitFor(() => {
        expect(canceledSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              shape,
              mapId,
            }),
          }),
        );
      });

      canceledBus.off(EditShapeEvents.canceled, canceledSpy);
    });

    it('does nothing when not actively editing', () => {
      const canceledSpy = vi.fn();
      const canceledBus = Broadcast.getInstance<ShapeEditCanceledEvent>();
      canceledBus.on(EditShapeEvents.canceled, canceledSpy);

      const { result } = renderHook(() => useEditShape(mapId));

      // Try to cancel without starting
      act(() => {
        result.current.cancel();
      });

      expect(canceledSpy).not.toHaveBeenCalled();

      canceledBus.off(EditShapeEvents.canceled, canceledSpy);
    });
  });

  describe('callbacks', () => {
    it('calls onUpdate callback when shape is saved', async () => {
      const onUpdateSpy = vi.fn();

      const { result } = renderHook(() =>
        useEditShape(mapId, {
          onUpdate: onUpdateSpy,
        }),
      );

      const shape = createMockShape();

      // Start editing
      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(true);
      });

      // Save
      act(() => {
        result.current.save();
      });

      await waitFor(() => {
        expect(onUpdateSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            id: shape.id,
          }),
        );
      });
    });

    it('does not call onUpdate for different mapId', async () => {
      const onUpdateSpy = vi.fn();
      const updatedBus = Broadcast.getInstance<ShapeUpdatedEvent>();
      const otherMapId = uuid();

      renderHook(() =>
        useEditShape(mapId, {
          onUpdate: onUpdateSpy,
        }),
      );

      // Simulate updated event for different map
      act(() => {
        // biome-ignore lint/suspicious/noExplicitAny: Test workaround for bus type
        (updatedBus as any).emit(EditShapeEvents.updated, {
          shape: createMockShape(),
          mapId: otherMapId,
        });
      });

      // Wait a tick
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(onUpdateSpy).not.toHaveBeenCalled();
    });

    it('calls onCancel callback when editing is canceled', async () => {
      const onCancelSpy = vi.fn();

      const { result } = renderHook(() =>
        useEditShape(mapId, {
          onCancel: onCancelSpy,
        }),
      );

      const shape = createMockShape();

      // Start editing
      act(() => {
        result.current.edit(shape);
      });

      await waitFor(() => {
        expect(result.current.isEditing).toBe(true);
      });

      // Cancel
      act(() => {
        result.current.cancel();
      });

      await waitFor(() => {
        expect(onCancelSpy).toHaveBeenCalledWith(shape);
      });
    });

    it('does not call onCancel for different mapId', async () => {
      const onCancelSpy = vi.fn();
      const canceledBus = Broadcast.getInstance<ShapeEditCanceledEvent>();
      const otherMapId = uuid();

      renderHook(() =>
        useEditShape(mapId, {
          onCancel: onCancelSpy,
        }),
      );

      // Simulate canceled event for different map
      act(() => {
        // biome-ignore lint/suspicious/noExplicitAny: Test workaround for bus type
        (canceledBus as any).emit(EditShapeEvents.canceled, {
          shape: createMockShape(),
          mapId: otherMapId,
        });
      });

      // Wait a tick
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(onCancelSpy).not.toHaveBeenCalled();
    });
  });

  describe('multiple map instances', () => {
    it('isolates state between different mapIds', async () => {
      const mapId1 = uuid();
      const mapId2 = uuid();
      const shape1 = createMockShape({ name: 'Shape 1' });
      const shape2 = createMockShape({ name: 'Shape 2' });

      // Test map1 in isolation first
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useEditShape(mapId1),
      );

      act(() => {
        result1.current.edit(shape1);
      });

      await waitFor(() => {
        expect(result1.current.isEditing).toBe(true);
        expect(result1.current.editingShape?.name).toBe('Shape 1');
      });

      // Cleanup map1
      unmount1();
      clearEditingState(mapId1);

      // Now test map2 - should start fresh
      const { result: result2, unmount: unmount2 } = renderHook(() =>
        useEditShape(mapId2),
      );

      // Map2 should be idle (not affected by map1's state)
      expect(result2.current.isEditing).toBe(false);
      expect(result2.current.editingShape).toBeNull();

      // Map2 can edit independently
      act(() => {
        result2.current.edit(shape2);
      });

      await waitFor(() => {
        expect(result2.current.isEditing).toBe(true);
        expect(result2.current.editingShape?.name).toBe('Shape 2');
      });

      // Clean up
      unmount2();
      clearEditingState(mapId2);
    });
  });

  describe('all shape types', () => {
    it('supports editing all shape types', async () => {
      const shapeTypes = [
        ShapeFeatureType.Point,
        ShapeFeatureType.LineString,
        ShapeFeatureType.Polygon,
        ShapeFeatureType.Rectangle,
        ShapeFeatureType.Circle,
        ShapeFeatureType.Ellipse,
      ];

      for (const shapeType of shapeTypes) {
        const testMapId = uuid();
        const shape = createMockShape({ shapeType });
        const { result, unmount } = renderHook(() => useEditShape(testMapId));

        act(() => {
          result.current.edit(shape);
        });

        await waitFor(() => {
          expect(result.current.editingShape?.shapeType).toBe(shapeType);
        });

        // Unmount the hook before cleaning up state
        unmount();

        // Clean up
        clearEditingState(testMapId);
      }
    });
  });
});
