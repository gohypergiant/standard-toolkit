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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '@/deckgl/base-map/events';
import { MeasurementEvents } from './events';
import { measurementStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { MapEventType } from '@/deckgl/base-map/types';
import type { MeasurementEventType } from './events';

describe('measurementStore', () => {
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();
  });

  afterEach(() => {
    measurementStore.clear(mapId);
  });

  describe('default state', () => {
    it('initializes with null points and isMeasuring false', () => {
      const state = measurementStore.get(mapId);

      expect(state.pointA).toBe(null);
      expect(state.pointB).toBe(null);
      expect(state.isMeasuring).toBe(false);
    });
  });

  describe('start action', () => {
    it('sets pointA and marks isMeasuring true', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([10, 20]);
      expect(state.pointB).toBe(null);
      expect(state.isMeasuring).toBe(true);
    });

    it('resets pointB when starting a new measurement after completing one', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.complete();
      actions.start([5, 5]);

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([5, 5]);
      expect(state.pointB).toBe(null);
      expect(state.isMeasuring).toBe(true);
    });

    it('restarts from the new point while a measurement is in progress', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.start([5, 5]);

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([5, 5]);
      expect(state.pointB).toBe(null);
      expect(state.isMeasuring).toBe(true);
    });
  });

  describe('updateEnd action', () => {
    it('sets pointB without changing pointA or isMeasuring', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([10, 20]);
      expect(state.pointB).toEqual([11, 21]);
      expect(state.isMeasuring).toBe(true);
    });
  });

  describe('complete action', () => {
    it('sets isMeasuring to false while preserving pointA and pointB', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.complete();

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([10, 20]);
      expect(state.pointB).toEqual([11, 21]);
      expect(state.isMeasuring).toBe(false);
    });
  });

  describe('clear action', () => {
    it('resets all state to defaults', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.complete();
      actions.clear();

      const state = measurementStore.get(mapId);

      expect(state.pointA).toBe(null);
      expect(state.pointB).toBe(null);
      expect(state.isMeasuring).toBe(false);
    });
  });

  describe('bus emissions and idempotency', () => {
    const mapBus = Broadcast.getInstance<MapEventType>();
    const measurementBus = Broadcast.getInstance<MeasurementEventType>();

    it('emits start and disablePan for every start call', () => {
      const onStart = vi.fn();
      const onDisablePan = vi.fn();
      measurementBus.on(MeasurementEvents.start, onStart);
      mapBus.on(MapEvents.disablePan, onDisablePan);
      const actions = measurementStore.actions(mapId);

      actions.start([10, 20]);
      actions.start([30, 40]);

      expect(measurementStore.get(mapId).pointA).toEqual([30, 40]);
      expect(onStart).toHaveBeenCalledTimes(2);
      expect(onStart).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: { mapId, pointA: [30, 40], pointB: null },
        }),
      );
      expect(onDisablePan).toHaveBeenCalledTimes(2);
    });

    it('updateEnd emits nothing when not measuring', () => {
      const onUpdate = vi.fn();
      measurementBus.on(MeasurementEvents.update, onUpdate);

      measurementStore.actions(mapId).updateEnd([11, 21]);

      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('emits update on every drag move, even when pointB is unchanged', () => {
      const onUpdate = vi.fn();
      measurementBus.on(MeasurementEvents.update, onUpdate);
      const actions = measurementStore.actions(mapId);

      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.updateEnd([11, 21]);

      expect(onUpdate).toHaveBeenCalledTimes(2);
    });

    it('clears instead of completing when no destination was captured', () => {
      const onComplete = vi.fn();
      const onClear = vi.fn();
      const onEnablePan = vi.fn();
      measurementBus.on(MeasurementEvents.complete, onComplete);
      measurementBus.on(MeasurementEvents.clear, onClear);
      mapBus.on(MapEvents.enablePan, onEnablePan);
      const actions = measurementStore.actions(mapId);

      actions.start([10, 20]);
      actions.complete();

      expect(onComplete).not.toHaveBeenCalled();
      expect(onClear).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ payload: { mapId } }),
      );
      expect(onEnablePan).toHaveBeenCalledTimes(1);
      expect(measurementStore.get(mapId)).toMatchObject({
        pointA: null,
        pointB: null,
        isMeasuring: false,
      });
    });

    it('emits update with pointA and the new pointB', () => {
      const onUpdate = vi.fn();
      measurementBus.on(MeasurementEvents.update, onUpdate);
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);

      actions.updateEnd([11, 21]);

      expect(onUpdate).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          payload: { mapId, pointA: [10, 20], pointB: [11, 21] },
        }),
      );
    });

    it('emits complete and enablePan once, and nothing when already idle', () => {
      const onComplete = vi.fn();
      const onEnablePan = vi.fn();
      measurementBus.on(MeasurementEvents.complete, onComplete);
      mapBus.on(MapEvents.enablePan, onEnablePan);
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);

      actions.complete();
      actions.complete();

      expect(onComplete).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          payload: { mapId, pointA: [10, 20], pointB: [11, 21] },
        }),
      );
      expect(onEnablePan).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ payload: { id: mapId } }),
      );
    });

    it('clear emits clear and restores pan when a drag is active', () => {
      const onClear = vi.fn();
      const onEnablePan = vi.fn();
      measurementBus.on(MeasurementEvents.clear, onClear);
      mapBus.on(MapEvents.enablePan, onEnablePan);
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);

      actions.clear();

      expect(onClear).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ payload: { mapId } }),
      );
      expect(onEnablePan).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ payload: { id: mapId } }),
      );
    });

    it('clear emits clear but not enablePan when idle', () => {
      const onClear = vi.fn();
      const onEnablePan = vi.fn();
      measurementBus.on(MeasurementEvents.clear, onClear);
      mapBus.on(MapEvents.enablePan, onEnablePan);
      const actions = measurementStore.actions(mapId);

      actions.clear();

      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onEnablePan).not.toHaveBeenCalled();
    });
  });

  describe('drag subscription', () => {
    const mapBus = Broadcast.getInstance<MapEventType>();

    function dragPayload(
      coordinate: [number, number],
      modifiers: Partial<{
        shiftKey: boolean;
        ctrlKey: boolean;
        altKey: boolean;
      }> = {},
    ) {
      return {
        id: mapId,
        coordinate,
        shiftKey: false,
        ctrlKey: false,
        altKey: false,
        ...modifiers,
      };
    }

    it('drives the measurement from map drag events while a subscriber is attached', () => {
      const unsubscribe = measurementStore.subscribe(mapId)(() => undefined);

      mapBus.emit(MapEvents.dragStart, dragPayload([10, 20]));
      mapBus.emit(MapEvents.drag, dragPayload([11, 21]));

      expect(measurementStore.get(mapId)).toMatchObject({
        pointA: [10, 20],
        pointB: [11, 21],
        isMeasuring: true,
      });

      mapBus.emit(MapEvents.dragEnd, dragPayload([11, 21]));

      expect(measurementStore.get(mapId).isMeasuring).toBe(false);
      unsubscribe();
    });

    it('ignores drags that lack the per-map required modifier', () => {
      const unsubscribe = measurementStore.subscribe(mapId)(() => undefined);
      measurementStore.actions(mapId).setRequiresModifier('alt');

      mapBus.emit(MapEvents.dragStart, dragPayload([10, 20]));

      expect(measurementStore.get(mapId).isMeasuring).toBe(false);

      mapBus.emit(MapEvents.dragStart, dragPayload([10, 20], { altKey: true }));

      expect(measurementStore.get(mapId).isMeasuring).toBe(true);
      unsubscribe();
    });

    it('finishes an in-flight measurement and restores pan when the last subscriber leaves', () => {
      const onEnablePan = vi.fn();
      mapBus.on(MapEvents.enablePan, onEnablePan);
      const unsubscribe = measurementStore.subscribe(mapId)(() => undefined);

      mapBus.emit(MapEvents.dragStart, dragPayload([10, 20]));
      mapBus.emit(MapEvents.drag, dragPayload([11, 21]));
      unsubscribe();

      expect(onEnablePan).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ payload: { id: mapId } }),
      );
    });
  });

  describe('multi-instance isolation', () => {
    it('keeps state isolated between different map IDs', () => {
      const mapId2 = uuid();

      try {
        const actions1 = measurementStore.actions(mapId);
        const actions2 = measurementStore.actions(mapId2);

        actions1.start([10, 20]);
        actions2.start([30, 40]);
        actions2.updateEnd([31, 41]);

        const state1 = measurementStore.get(mapId);
        const state2 = measurementStore.get(mapId2);

        expect(state1.pointA).toEqual([10, 20]);
        expect(state1.pointB).toBe(null);
        expect(state2.pointA).toEqual([30, 40]);
        expect(state2.pointB).toEqual([31, 41]);
      } finally {
        measurementStore.clear(mapId2);
      }
    });
  });
});
