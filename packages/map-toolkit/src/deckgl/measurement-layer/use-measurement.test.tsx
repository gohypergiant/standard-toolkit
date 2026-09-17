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
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '@/deckgl/base-map/events';
import { makeDragPayload } from './__fixtures__/drag-payload';
import { MeasurementEvents } from './events';
import { measurementStore } from './store';
import { useMeasurement } from './use-measurement';
import type { UniqueId } from '@accelint/core';
import type { MapEventType } from '@/deckgl/base-map/types';
import type { Modifiers } from './__fixtures__/drag-payload';
import type { MeasurementEventType } from './events';

type DragEventName =
  | typeof MapEvents.dragStart
  | typeof MapEvents.drag
  | typeof MapEvents.dragEnd;

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

  /** Emit one drag event for the test map inside `act` so hook state flushes synchronously. */
  function emitDrag(
    event: DragEventName,
    coordinate: [number, number],
    modifiers?: Modifiers,
  ) {
    act(() => {
      bus.emit(event, makeDragPayload(mapId, coordinate, modifiers));
    });
  }

  describe('initial state', () => {
    it('returns null points and isMeasuring false on mount', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      expect(result.current.isMeasuring).toBe(false);
      expect(result.current.pointA).toBe(null);
      expect(result.current.pointB).toBe(null);
      expect(result.current.distanceMeters).toBe(0);
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
    it('starts measuring on dragStart event', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      emitDrag(MapEvents.dragStart, [10, 20]);

      expect(result.current.isMeasuring).toBe(true);
      expect(result.current.pointA).toEqual([10, 20]);
      expect(result.current.pointB).toBe(null);
    });

    it('updates pointB on drag event while measuring', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      emitDrag(MapEvents.dragStart, [10, 20]);
      emitDrag(MapEvents.drag, [11, 21]);

      expect(result.current.pointB).toEqual([11, 21]);
    });

    it('completes measurement on dragEnd event', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      emitDrag(MapEvents.dragStart, [10, 20]);
      emitDrag(MapEvents.drag, [11, 21]);
      emitDrag(MapEvents.dragEnd, [11, 21]);

      expect(result.current.isMeasuring).toBe(false);
      // pointA and pointB are preserved after completion
      expect(result.current.pointA).toEqual([10, 20]);
      expect(result.current.pointB).toEqual([11, 21]);
    });

    it('ignores drag events for other map IDs', () => {
      const otherId = uuid();
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(otherId, [10, 20]));
      });

      expect(result.current.isMeasuring).toBe(false);
      expect(result.current.pointA).toBe(null);
    });

    it('ignores drag event when not currently measuring', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      emitDrag(MapEvents.drag, [11, 21]);

      expect(result.current.pointB).toBe(null);
    });
  });

  describe('bus event emissions', () => {
    it('emits measurement:clear and map:enablePan when clear() is called mid-drag', () => {
      const onClear = vi.fn();
      const onComplete = vi.fn();
      const onEnablePan = vi.fn();
      measurementBus.on(MeasurementEvents.clear, onClear);
      measurementBus.on(MeasurementEvents.complete, onComplete);
      bus.on(MapEvents.enablePan, onEnablePan);
      const { result } = renderHook(() => useMeasurement(mapId));
      emitDrag(MapEvents.dragStart, [10, 20]);
      emitDrag(MapEvents.drag, [11, 21]);

      act(() => {
        result.current.clear();
      });

      expect(onClear).toHaveBeenCalledWith(
        expect.objectContaining({ payload: { mapId } }),
      );
      expect(onEnablePan).toHaveBeenCalledTimes(1);

      emitDrag(MapEvents.dragEnd, [11, 21]);

      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onEnablePan).toHaveBeenCalledTimes(1);
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('emits each lifecycle event once when two hook instances share a map', () => {
      const onStart = vi.fn();
      const onUpdate = vi.fn();
      const onComplete = vi.fn();
      const onDisablePan = vi.fn();
      measurementBus.on(MeasurementEvents.start, onStart);
      measurementBus.on(MeasurementEvents.update, onUpdate);
      measurementBus.on(MeasurementEvents.complete, onComplete);
      bus.on(MapEvents.disablePan, onDisablePan);
      renderHook(() => {
        useMeasurement(mapId);
        useMeasurement(mapId);
      });

      emitDrag(MapEvents.dragStart, [10, 20]);
      emitDrag(MapEvents.drag, [11, 21]);
      emitDrag(MapEvents.drag, [12, 22]);
      emitDrag(MapEvents.dragEnd, [12, 22]);

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onDisablePan).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledTimes(2);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
    it('finishes an in-flight measurement and restores pan when the last hook unmounts', () => {
      const onEnablePan = vi.fn();
      bus.on(MapEvents.enablePan, onEnablePan);
      const { unmount } = renderHook(() => useMeasurement(mapId));

      emitDrag(MapEvents.dragStart, [10, 20]);
      emitDrag(MapEvents.drag, [11, 21]);
      unmount();

      expect(onEnablePan).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ payload: { id: mapId } }),
      );
      expect(measurementStore.get(mapId).isMeasuring).toBe(false);
    });
  });

  describe('modifier key filtering', () => {
    it('ignores dragStart when requiresModifier=shift and shift is not pressed', () => {
      const { result } = renderHook(() => useMeasurement(mapId, 'shift'));

      emitDrag(MapEvents.dragStart, [10, 20], { shiftKey: false });

      expect(result.current.isMeasuring).toBe(false);
    });

    it.each([
      ['shift', { shiftKey: true }],
      ['ctrl', { ctrlKey: true }],
      ['alt', { altKey: true }],
    ] as const)('starts measuring when requiresModifier=%s and that key is held', (modifier, modifiers) => {
      const { result } = renderHook(() => useMeasurement(mapId, modifier));

      emitDrag(MapEvents.dragStart, [10, 20], modifiers);

      expect(result.current.isMeasuring).toBe(true);
      expect(result.current.pointA).toEqual([10, 20]);
    });

    it('completes the measurement when the modifier is released mid-drag', () => {
      const onComplete = vi.fn();
      const onEnablePan = vi.fn();
      measurementBus.on(MeasurementEvents.complete, onComplete);
      bus.on(MapEvents.enablePan, onEnablePan);
      const { result } = renderHook(() => useMeasurement(mapId, 'shift'));
      emitDrag(MapEvents.dragStart, [10, 20], { shiftKey: true });
      emitDrag(MapEvents.drag, [11, 21], { shiftKey: true });

      emitDrag(MapEvents.drag, [12, 22], { shiftKey: false });

      expect(result.current.isMeasuring).toBe(false);
      expect(result.current.pointB).toEqual([11, 21]);
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { mapId, pointA: [10, 20], pointB: [11, 21] },
        }),
      );
      expect(onEnablePan).toHaveBeenCalledTimes(1);

      emitDrag(MapEvents.dragEnd, [12, 22], { shiftKey: false });

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onEnablePan).toHaveBeenCalledTimes(1);
    });
  });

  describe('geodesic calculations', () => {
    it('calculates distanceMeters when both points are set', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      // London to Paris is ~343.6 km
      emitDrag(MapEvents.dragStart, [-0.1278, 51.5074]);
      emitDrag(MapEvents.drag, [2.3522, 48.8566]);

      expect(result.current.distanceMeters).toBeCloseTo(343556, -2);
    });

    it('calculates bearingDeg when both points are set', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      // Due north
      emitDrag(MapEvents.dragStart, [0, 0]);
      emitDrag(MapEvents.drag, [0, 1]);

      expect(result.current.bearingDeg).toBe(0);
    });

    it('returns zero geodesic values when pointB is null', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      // No drag yet — pointB is null
      emitDrag(MapEvents.dragStart, [10, 20]);

      expect(result.current.distanceMeters).toBe(0);
      expect(result.current.bearingDeg).toBe(0);
    });
  });

  describe('imperative actions', () => {
    it('exposes a start action to begin measurement imperatively', () => {
      const { result } = renderHook(() => useMeasurement(mapId));

      act(() => {
        result.current.start([10, 20]);
      });

      expect(result.current.isMeasuring).toBe(true);
      expect(result.current.pointA).toEqual([10, 20]);
    });

    it('exposes a clear action to reset measurement state', () => {
      const { result } = renderHook(() => useMeasurement(mapId));
      emitDrag(MapEvents.dragStart, [10, 20]);

      act(() => {
        result.current.clear();
      });

      expect(result.current.isMeasuring).toBe(false);
      expect(result.current.pointA).toBe(null);
      expect(result.current.pointB).toBe(null);
    });
  });
});
