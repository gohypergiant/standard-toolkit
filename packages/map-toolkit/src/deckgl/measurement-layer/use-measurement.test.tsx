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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '@/deckgl/base-map/events';
import { MeasurementEvents } from './events';
import { measurementStore } from './store';
import { useMeasurement } from './use-measurement';
import type { UniqueId } from '@accelint/core';
import type { MapEventType } from '@/deckgl/base-map/types';
import type { MeasurementEventType } from './events';

/** Shared drag payload factory */
function makeDragPayload(
  id: UniqueId,
  coordinate: [number, number],
  modifiers?: { shiftKey?: boolean; ctrlKey?: boolean; altKey?: boolean },
) {
  return {
    id,
    coordinate,
    shiftKey: modifiers?.shiftKey ?? false,
    ctrlKey: modifiers?.ctrlKey ?? false,
    altKey: modifiers?.altKey ?? false,
  };
}

describe('useMeasurement', () => {
  let mapId: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance<MapEventType>>;
  let measurementBus: ReturnType<
    typeof Broadcast.getInstance<MeasurementEventType>
  >;

  beforeEach(() => {
    mapId = uuid();
    bus = Broadcast.getInstance<MapEventType>();
    measurementBus = Broadcast.getInstance<MeasurementEventType>();
  });

  afterEach(() => {
    measurementStore.clear(mapId);
  });

  describe('initial state', () => {
    it('returns null points and isMeasuring false on mount', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      expect(result.current.isMeasuring).toBe(false);
      expect(result.current.pointA).toBe(null);
      expect(result.current.pointB).toBe(null);
      expect(result.current.distanceKm).toBe(0);
      expect(result.current.distanceNM).toBe(0);
      expect(result.current.bearingDeg).toBe(0);
    });

    it('throws when used outside MapProvider without mapId', () => {
      expect(() => {
        renderHook(() => useMeasurement());
      }).toThrow(
        'useMeasurement requires either a mapId parameter or to be used within a MapProvider',
      );
    });
  });

  describe('drag event handling', () => {
    it('starts measuring on dragStart event', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() => {
        expect(result.current.isMeasuring).toBe(true);
        expect(result.current.pointA).toEqual([10, 20]);
        expect(result.current.pointB).toBe(null);
      });
    });

    it('updates pointB on drag event while measuring', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() => expect(result.current.isMeasuring).toBe(true));

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      });

      await waitFor(() => {
        expect(result.current.pointB).toEqual([11, 21]);
      });
    });

    it('completes measurement on dragEnd event', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() => expect(result.current.isMeasuring).toBe(true));

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      });

      await waitFor(() => expect(result.current.pointB).toEqual([11, 21]));

      act(() => {
        bus.emit(MapEvents.dragEnd, makeDragPayload(mapId, [11, 21]));
      });

      await waitFor(() => {
        expect(result.current.isMeasuring).toBe(false);
        // pointA and pointB are preserved after completion
        expect(result.current.pointA).toEqual([10, 20]);
        expect(result.current.pointB).toEqual([11, 21]);
      });
    });

    it('ignores drag events for other map IDs', () => {
      const otherId = uuid();
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(otherId, [10, 20]));
      });

      // State should remain idle
      expect(result.current.isMeasuring).toBe(false);
      expect(result.current.pointA).toBe(null);
    });

    it('ignores drag event when not currently measuring', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      // Emit drag without prior dragStart
      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      });

      expect(result.current.pointB).toBe(null);
    });
  });

  describe('bus event emissions', () => {
    it('emits measurement:start on dragStart', async () => {
      const onStart = vi.fn();
      measurementBus.on(MeasurementEvents.start, onStart);

      renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() => {
        expect(onStart).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              mapId,
              pointA: [10, 20],
              pointB: null,
            }),
          }),
        );
      });
    });

    it('emits measurement:update on drag', async () => {
      const onUpdate = vi.fn();
      measurementBus.on(MeasurementEvents.update, onUpdate);

      renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).isMeasuring).toBe(true),
      );

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      });

      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              mapId,
              pointA: [10, 20],
              pointB: [11, 21],
            }),
          }),
        );
      });
    });

    it('emits measurement:complete on dragEnd', async () => {
      const onComplete = vi.fn();
      measurementBus.on(MeasurementEvents.complete, onComplete);

      renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).isMeasuring).toBe(true),
      );

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).pointB).toEqual([11, 21]),
      );

      act(() => {
        bus.emit(MapEvents.dragEnd, makeDragPayload(mapId, [11, 21]));
      });

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              mapId,
              pointA: [10, 20],
            }),
          }),
        );
      });
    });

    it('emits map:disablePan on dragStart', async () => {
      const onDisablePan = vi.fn();
      bus.on(MapEvents.disablePan, onDisablePan);

      renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() => {
        expect(onDisablePan).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({ id: mapId }),
          }),
        );
      });
    });

    it('emits map:enablePan on dragEnd', async () => {
      const onEnablePan = vi.fn();
      bus.on(MapEvents.enablePan, onEnablePan);

      renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).isMeasuring).toBe(true),
      );

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).pointB).toEqual([11, 21]),
      );

      act(() => {
        bus.emit(MapEvents.dragEnd, makeDragPayload(mapId, [11, 21]));
      });

      await waitFor(() => {
        expect(onEnablePan).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({ id: mapId }),
          }),
        );
      });
    });
  });

  describe('modifier key filtering', () => {
    it('ignores dragStart when requiresModifier=shift and shift is not pressed', () => {
      const { result } = renderHook(() => useMeasurement(mapId, 'shift'));

      act(() => {
        bus.emit(
          MapEvents.dragStart,
          makeDragPayload(mapId, [10, 20], { shiftKey: false }),
        );
      });

      expect(result.current.isMeasuring).toBe(false);
    });

    it('starts measuring when requiresModifier=shift and shift is pressed', async () => {
      const { result } = renderHook(() => useMeasurement(mapId, 'shift'));

      act(() => {
        bus.emit(
          MapEvents.dragStart,
          makeDragPayload(mapId, [10, 20], { shiftKey: true }),
        );
      });

      await waitFor(() => {
        expect(result.current.isMeasuring).toBe(true);
        expect(result.current.pointA).toEqual([10, 20]);
      });
    });

    it('starts measuring with requiresModifier=ctrl when ctrl is pressed', async () => {
      const { result } = renderHook(() => useMeasurement(mapId, 'ctrl'));

      act(() => {
        bus.emit(
          MapEvents.dragStart,
          makeDragPayload(mapId, [10, 20], { ctrlKey: true }),
        );
      });

      await waitFor(() => {
        expect(result.current.isMeasuring).toBe(true);
      });
    });

    it('starts measuring with requiresModifier=alt when alt is pressed', async () => {
      const { result } = renderHook(() => useMeasurement(mapId, 'alt'));

      act(() => {
        bus.emit(
          MapEvents.dragStart,
          makeDragPayload(mapId, [10, 20], { altKey: true }),
        );
      });

      await waitFor(() => {
        expect(result.current.isMeasuring).toBe(true);
      });
    });

    it('activates measurement when no requiresModifier is set', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(
          MapEvents.dragStart,
          makeDragPayload(mapId, [10, 20], {
            shiftKey: false,
            ctrlKey: false,
            altKey: false,
          }),
        );
      });

      await waitFor(() => {
        expect(result.current.isMeasuring).toBe(true);
      });
    });
  });

  describe('geodesic calculations', () => {
    it('calculates distanceKm and distanceNM when both points are set', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      // London and Paris: approximately 341 km / 184 NM
      act(() => {
        bus.emit(
          MapEvents.dragStart,
          makeDragPayload(mapId, [-0.1278, 51.5074]),
        );
      });

      await waitFor(() => expect(result.current.isMeasuring).toBe(true));

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [2.3522, 48.8566]));
      });

      await waitFor(() => {
        expect(result.current.distanceKm).toBeGreaterThan(340);
        expect(result.current.distanceKm).toBeLessThan(345);
        expect(result.current.distanceNM).toBeGreaterThan(183);
        expect(result.current.distanceNM).toBeLessThan(187);
      });
    });

    it('calculates bearingDeg when both points are set', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      // Due north
      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [0, 0]));
      });

      await waitFor(() => expect(result.current.isMeasuring).toBe(true));

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [0, 1]));
      });

      await waitFor(() => {
        expect(result.current.bearingDeg).toBe(0);
      });
    });

    it('returns zero geodesic values when pointB is null', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() => expect(result.current.isMeasuring).toBe(true));

      // No drag yet — pointB is null
      expect(result.current.distanceKm).toBe(0);
      expect(result.current.distanceNM).toBe(0);
      expect(result.current.bearingDeg).toBe(0);
    });
  });

  describe('imperative actions', () => {
    it('exposes a start action to begin measurement imperatively', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        result.current.start([10, 20]);
      });

      await waitFor(() => {
        expect(result.current.isMeasuring).toBe(true);
        expect(result.current.pointA).toEqual([10, 20]);
      });
    });

    it('exposes a clear action to reset measurement state', async () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      });

      await waitFor(() => expect(result.current.isMeasuring).toBe(true));

      act(() => {
        result.current.clear();
      });

      await waitFor(() => {
        expect(result.current.isMeasuring).toBe(false);
        expect(result.current.pointA).toBe(null);
        expect(result.current.pointB).toBe(null);
      });
    });
  });
});
