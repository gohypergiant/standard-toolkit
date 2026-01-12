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

import { Broadcast } from '@accelint/bus';
import { uuid } from '@accelint/core';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '../../base-map/events';
import {
  type ShapeDeselectedEvent,
  ShapeEvents,
  type ShapeSelectedEvent,
} from '../shared/events';
import { useSelectShape } from './use-select-shape';
import type { UniqueId } from '@accelint/core';
import type { MapClickEvent, MapClickPayload } from '../../base-map/types';

/**
 * Helper to create a mock MapClickPayload for testing
 */
function createMockMapClickPayload(
  id: UniqueId,
  index: number,
): MapClickPayload {
  return {
    id,
    info: { index },
    event: {} as MapClickPayload['event'],
  } as MapClickPayload;
}

describe('useSelectShape', () => {
  let mapId: UniqueId;
  let shapeId1: UniqueId;
  let shapeId2: UniqueId;
  let shapeBus: ReturnType<typeof Broadcast.getInstance<ShapeSelectedEvent>>;
  let mapBus: ReturnType<typeof Broadcast.getInstance<MapClickEvent>>;

  beforeEach(() => {
    mapId = uuid();
    shapeId1 = uuid();
    shapeId2 = uuid();
    shapeBus = Broadcast.getInstance();
    mapBus = Broadcast.getInstance();
  });

  describe('initial state', () => {
    it('returns undefined selectedId initially', () => {
      const { result } = renderHook(() => useSelectShape(mapId));

      expect(result.current.selectedId).toBeUndefined();
    });

    it('provides setSelectedId function', () => {
      const { result } = renderHook(() => useSelectShape(mapId));

      expect(typeof result.current.setSelectedId).toBe('function');
    });

    it('provides clearSelection function', () => {
      const { result } = renderHook(() => useSelectShape(mapId));

      expect(typeof result.current.clearSelection).toBe('function');
    });
  });

  describe('shapes:selected event handling', () => {
    it('updates selectedId when shapes:selected event is emitted', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));

      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId1,
          mapId,
        });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId1);
      });
    });

    it('ignores shapes:selected events for different mapId', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));
      const otherMapId = uuid();

      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId1,
          mapId: otherMapId,
        });
      });

      // Wait a tick to ensure event processing
      await waitFor(() => {
        expect(result.current.selectedId).toBeUndefined();
      });
    });

    it('replaces selection when new shape is selected', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));

      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId1,
          mapId,
        });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId1);
      });

      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId2,
          mapId,
        });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId2);
      });
    });
  });

  describe('shapes:deselected event handling', () => {
    it('clears selectedId when shapes:deselected event is emitted', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));
      const deselectedBus = Broadcast.getInstance<ShapeDeselectedEvent>();

      // First select a shape
      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId1,
          mapId,
        });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId1);
      });

      // Then deselect
      act(() => {
        deselectedBus.emit(ShapeEvents.deselected, { mapId });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBeUndefined();
      });
    });

    it('ignores shapes:deselected events for different mapId', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));
      const deselectedBus = Broadcast.getInstance<ShapeDeselectedEvent>();
      const otherMapId = uuid();

      // First select a shape
      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId1,
          mapId,
        });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId1);
      });

      // Try to deselect with different mapId
      act(() => {
        deselectedBus.emit(ShapeEvents.deselected, { mapId: otherMapId });
      });

      // Selection should remain
      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId1);
      });
    });
  });

  describe('map click auto-deselection', () => {
    it('emits deselected when clicking empty space with selection', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));
      const deselectedBus = Broadcast.getInstance<ShapeDeselectedEvent>();
      const deselectedSpy = vi.fn();
      deselectedBus.on(ShapeEvents.deselected, deselectedSpy);

      // First select a shape
      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId1,
          mapId,
        });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId1);
      });

      // Click on empty space (index === -1)
      act(() => {
        mapBus.emit(MapEvents.click, createMockMapClickPayload(mapId, -1));
      });

      await waitFor(() => {
        // Should have emitted deselected event
        expect(deselectedSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: { mapId },
          }),
        );
      });

      deselectedBus.off(ShapeEvents.deselected, deselectedSpy);
    });

    it('does not emit deselected when clicking empty space without selection', async () => {
      renderHook(() => useSelectShape(mapId));
      const deselectedBus = Broadcast.getInstance<ShapeDeselectedEvent>();
      const deselectedSpy = vi.fn();
      deselectedBus.on(ShapeEvents.deselected, deselectedSpy);

      // Click on empty space without any selection
      act(() => {
        mapBus.emit(MapEvents.click, createMockMapClickPayload(mapId, -1));
      });

      // Wait a tick to ensure event processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(deselectedSpy).not.toHaveBeenCalled();

      deselectedBus.off(ShapeEvents.deselected, deselectedSpy);
    });

    it('does not emit deselected when clicking on a shape (index >= 0)', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));
      const deselectedBus = Broadcast.getInstance<ShapeDeselectedEvent>();
      const deselectedSpy = vi.fn();
      deselectedBus.on(ShapeEvents.deselected, deselectedSpy);

      // First select a shape
      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId1,
          mapId,
        });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId1);
      });

      // Click on a shape (index >= 0)
      act(() => {
        mapBus.emit(MapEvents.click, createMockMapClickPayload(mapId, 0));
      });

      // Wait a tick to ensure event processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(deselectedSpy).not.toHaveBeenCalled();

      deselectedBus.off(ShapeEvents.deselected, deselectedSpy);
    });

    it('ignores map clicks for different mapId', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));
      const deselectedBus = Broadcast.getInstance<ShapeDeselectedEvent>();
      const deselectedSpy = vi.fn();
      const otherMapId = uuid();
      deselectedBus.on(ShapeEvents.deselected, deselectedSpy);

      // First select a shape
      act(() => {
        shapeBus.emit(ShapeEvents.selected, {
          shapeId: shapeId1,
          mapId,
        });
      });

      await waitFor(() => {
        expect(result.current.selectedId).toBe(shapeId1);
      });

      // Click on empty space with different mapId
      act(() => {
        mapBus.emit(MapEvents.click, createMockMapClickPayload(otherMapId, -1));
      });

      // Wait a tick to ensure event processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(deselectedSpy).not.toHaveBeenCalled();

      deselectedBus.off(ShapeEvents.deselected, deselectedSpy);
    });
  });

  describe('manual control functions', () => {
    it('setSelectedId updates selection directly', () => {
      const { result } = renderHook(() => useSelectShape(mapId));

      act(() => {
        result.current.setSelectedId(shapeId1);
      });

      expect(result.current.selectedId).toBe(shapeId1);
    });

    it('clearSelection emits deselected event', async () => {
      const { result } = renderHook(() => useSelectShape(mapId));
      const deselectedBus = Broadcast.getInstance<ShapeDeselectedEvent>();
      const deselectedSpy = vi.fn();
      deselectedBus.on(ShapeEvents.deselected, deselectedSpy);

      act(() => {
        result.current.clearSelection();
      });

      await waitFor(() => {
        expect(deselectedSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: { mapId },
          }),
        );
      });

      deselectedBus.off(ShapeEvents.deselected, deselectedSpy);
    });
  });
});
