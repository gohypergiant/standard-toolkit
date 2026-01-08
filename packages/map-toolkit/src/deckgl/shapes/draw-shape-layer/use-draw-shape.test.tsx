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
import { ShapeFeatureType } from '../shared/types';
import { DrawShapeEvents } from './events';
import { clearDrawingState } from './store';
import { useDrawShape } from './use-draw-shape';
import type { UniqueId } from '@accelint/core';
import type {
  DrawShapeEvent,
  ShapeDrawCanceledEvent,
  ShapeDrawnEvent,
} from './events';

describe('useDrawShape', () => {
  let mapId: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance<DrawShapeEvent>>;

  beforeEach(() => {
    mapId = uuid();
    bus = Broadcast.getInstance();
    // Clear any existing state for this mapId
    clearDrawingState(mapId);
  });

  describe('initial state', () => {
    it('returns null for activeShapeType when not drawing', () => {
      const { result } = renderHook(() => useDrawShape(mapId));

      expect(result.current.activeShapeType).toBeNull();
      expect(result.current.isDrawing).toBe(false);
    });

    it('provides draw and cancel functions', () => {
      const { result } = renderHook(() => useDrawShape(mapId));

      expect(typeof result.current.draw).toBe('function');
      expect(typeof result.current.cancel).toBe('function');
    });

    it('throws when used without mapId and outside MapProvider', () => {
      expect(() => {
        renderHook(() => useDrawShape());
      }).toThrow(
        'useDrawShape requires either a mapId parameter or to be used within a MapProvider',
      );
    });
  });

  describe('draw function', () => {
    it('starts drawing and updates isDrawing state', async () => {
      const { result } = renderHook(() => useDrawShape(mapId));

      act(() => {
        result.current.draw(ShapeFeatureType.Polygon);
      });

      await waitFor(() => {
        expect(result.current.isDrawing).toBe(true);
        expect(result.current.activeShapeType).toBe(ShapeFeatureType.Polygon);
      });
    });

    it('emits shapes:drawing event when starting', async () => {
      const drawingSpy = vi.fn();
      bus.on(DrawShapeEvents.drawing, drawingSpy);

      const { result } = renderHook(() => useDrawShape(mapId));

      act(() => {
        result.current.draw(ShapeFeatureType.Point);
      });

      await waitFor(() => {
        expect(drawingSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: {
              shapeType: ShapeFeatureType.Point,
              mapId,
            },
          }),
        );
      });

      bus.off(DrawShapeEvents.drawing, drawingSpy);
    });

    it('supports all shape types', async () => {
      const shapeTypes = [
        ShapeFeatureType.Point,
        ShapeFeatureType.LineString,
        ShapeFeatureType.Polygon,
        ShapeFeatureType.Rectangle,
        ShapeFeatureType.Circle,
      ];

      for (const shapeType of shapeTypes) {
        const testMapId = uuid();
        const { result, unmount } = renderHook(() => useDrawShape(testMapId));

        act(() => {
          result.current.draw(shapeType);
        });

        await waitFor(() => {
          expect(result.current.activeShapeType).toBe(shapeType);
        });

        // Unmount the hook before cleaning up state
        unmount();

        // Clean up
        clearDrawingState(testMapId);
      }
    });
  });

  describe('cancel function', () => {
    it('cancels drawing and updates state', async () => {
      const { result } = renderHook(() => useDrawShape(mapId));

      // Start drawing first
      act(() => {
        result.current.draw(ShapeFeatureType.Polygon);
      });

      await waitFor(() => {
        expect(result.current.isDrawing).toBe(true);
      });

      // Then cancel
      act(() => {
        result.current.cancel();
      });

      await waitFor(() => {
        expect(result.current.isDrawing).toBe(false);
        expect(result.current.activeShapeType).toBeNull();
      });
    });

    it('emits shapes:draw-canceled event when canceling', async () => {
      const canceledSpy = vi.fn();
      const canceledBus = Broadcast.getInstance<ShapeDrawCanceledEvent>();
      canceledBus.on(DrawShapeEvents.canceled, canceledSpy);

      const { result } = renderHook(() => useDrawShape(mapId));

      // Start drawing first
      act(() => {
        result.current.draw(ShapeFeatureType.LineString);
      });

      await waitFor(() => {
        expect(result.current.isDrawing).toBe(true);
      });

      // Then cancel
      act(() => {
        result.current.cancel();
      });

      await waitFor(() => {
        expect(canceledSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: {
              shapeType: ShapeFeatureType.LineString,
              mapId,
            },
          }),
        );
      });

      canceledBus.off(DrawShapeEvents.canceled, canceledSpy);
    });

    it('does nothing when not actively drawing', () => {
      const canceledSpy = vi.fn();
      const canceledBus = Broadcast.getInstance<ShapeDrawCanceledEvent>();
      canceledBus.on(DrawShapeEvents.canceled, canceledSpy);

      const { result } = renderHook(() => useDrawShape(mapId));

      // Try to cancel without starting
      act(() => {
        result.current.cancel();
      });

      expect(canceledSpy).not.toHaveBeenCalled();

      canceledBus.off(DrawShapeEvents.canceled, canceledSpy);
    });
  });

  describe('callbacks', () => {
    it('calls onCreate callback when shape is drawn', async () => {
      const onCreateSpy = vi.fn();
      const drawnBus = Broadcast.getInstance<ShapeDrawnEvent>();

      renderHook(() =>
        useDrawShape(mapId, {
          onCreate: onCreateSpy,
        }),
      );

      // Simulate shape drawn event
      const mockShape = {
        id: uuid(),
        name: 'Test Shape',
        shapeType: ShapeFeatureType.Polygon,
        feature: {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
          properties: {
            styleProperties: {
              fillColor: [255, 0, 0, 255],
              lineColor: [0, 0, 0, 255],
              lineWidth: 2,
              linePattern: 'solid',
            },
          },
        },
        lastUpdated: Date.now(),
      };

      act(() => {
        // biome-ignore lint/suspicious/noExplicitAny: Test workaround for bus type
        (drawnBus as any).emit(DrawShapeEvents.drawn, {
          shape: mockShape,
          mapId,
        });
      });

      await waitFor(() => {
        expect(onCreateSpy).toHaveBeenCalledWith(mockShape);
      });
    });

    it('does not call onCreate for different mapId', async () => {
      const onCreateSpy = vi.fn();
      const drawnBus = Broadcast.getInstance<ShapeDrawnEvent>();
      const otherMapId = uuid();

      renderHook(() =>
        useDrawShape(mapId, {
          onCreate: onCreateSpy,
        }),
      );

      // Simulate shape drawn event for different map
      act(() => {
        // biome-ignore lint/suspicious/noExplicitAny: Test workaround for bus type
        (drawnBus as any).emit(DrawShapeEvents.drawn, {
          shape: { id: uuid() },
          mapId: otherMapId,
        });
      });

      // Wait a tick
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(onCreateSpy).not.toHaveBeenCalled();
    });

    it('calls onCancel callback when drawing is canceled', async () => {
      const onCancelSpy = vi.fn();

      const { result } = renderHook(() =>
        useDrawShape(mapId, {
          onCancel: onCancelSpy,
        }),
      );

      // Start drawing
      act(() => {
        result.current.draw(ShapeFeatureType.Circle);
      });

      await waitFor(() => {
        expect(result.current.isDrawing).toBe(true);
      });

      // Cancel
      act(() => {
        result.current.cancel();
      });

      await waitFor(() => {
        expect(onCancelSpy).toHaveBeenCalledWith(ShapeFeatureType.Circle);
      });
    });

    it('does not call onCancel for different mapId', async () => {
      const onCancelSpy = vi.fn();
      const canceledBus = Broadcast.getInstance<ShapeDrawCanceledEvent>();
      const otherMapId = uuid();

      renderHook(() =>
        useDrawShape(mapId, {
          onCancel: onCancelSpy,
        }),
      );

      // Simulate canceled event for different map
      act(() => {
        canceledBus.emit(DrawShapeEvents.canceled, {
          shapeType: ShapeFeatureType.Polygon,
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

      // Test map1 in isolation first
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useDrawShape(mapId1),
      );

      act(() => {
        result1.current.draw(ShapeFeatureType.Polygon);
      });

      await waitFor(() => {
        expect(result1.current.isDrawing).toBe(true);
        expect(result1.current.activeShapeType).toBe(ShapeFeatureType.Polygon);
      });

      // Cleanup map1
      unmount1();
      clearDrawingState(mapId1);

      // Now test map2 - should start fresh
      const { result: result2, unmount: unmount2 } = renderHook(() =>
        useDrawShape(mapId2),
      );

      // Map2 should be idle (not affected by map1's state)
      expect(result2.current.isDrawing).toBe(false);
      expect(result2.current.activeShapeType).toBeNull();

      // Map2 can draw independently
      act(() => {
        result2.current.draw(ShapeFeatureType.Circle);
      });

      await waitFor(() => {
        expect(result2.current.isDrawing).toBe(true);
        expect(result2.current.activeShapeType).toBe(ShapeFeatureType.Circle);
      });

      // Clean up
      unmount2();
      clearDrawingState(mapId2);
    });
  });
});
