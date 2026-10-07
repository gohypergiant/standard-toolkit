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
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MapEvents } from '@/deckgl/base-map/events';
import {
  clearMapModeState,
  DEFAULT_MODE,
  getCurrentModeOwner,
  getMode,
  modeStore,
} from '@/map-mode/store';
import { MEASUREMENT_LAYER_ID, MEASUREMENT_MODE } from './constants';
import { makeDragPayload } from './__fixtures__/drag-payload';
import { listen } from './__fixtures__/listen';
import { MeasurementEvents } from './events';
import { measurementStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { MapEventType } from '@/deckgl/base-map/types';
import type { MeasurementEventType } from './events';

describe('measurementStore', () => {
  const mapBus = Broadcast.getInstance<MapEventType>();
  const measurementBus = Broadcast.getInstance<MeasurementEventType>();
  /** Unsubscribe functions from `bus.on`, released after each test so listeners don't accumulate on the singleton. */
  const offListeners: (() => void)[] = [];
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();
  });

  afterEach(() => {
    measurementStore.clear(mapId);

    for (const off of offListeners.splice(0)) {
      off();
    }
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
    it('emits start and disablePan for every start call', () => {
      const onStart = listen(
        measurementBus,
        MeasurementEvents.start,
        offListeners,
      );
      const onDisablePan = listen(mapBus, MapEvents.disablePan, offListeners);
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
      const onUpdate = listen(
        measurementBus,
        MeasurementEvents.update,
        offListeners,
      );

      measurementStore.actions(mapId).updateEnd([11, 21]);

      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('emits update on every drag move, even when pointB is unchanged', () => {
      const onUpdate = listen(
        measurementBus,
        MeasurementEvents.update,
        offListeners,
      );
      const actions = measurementStore.actions(mapId);

      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.updateEnd([11, 21]);

      expect(onUpdate).toHaveBeenCalledTimes(2);
    });

    it('clears instead of completing when no destination was captured', () => {
      const onComplete = listen(
        measurementBus,
        MeasurementEvents.complete,
        offListeners,
      );
      const onClear = listen(
        measurementBus,
        MeasurementEvents.clear,
        offListeners,
      );
      const onEnablePan = listen(mapBus, MapEvents.enablePan, offListeners);
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
      const onUpdate = listen(
        measurementBus,
        MeasurementEvents.update,
        offListeners,
      );
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
      const onComplete = listen(
        measurementBus,
        MeasurementEvents.complete,
        offListeners,
      );
      const onEnablePan = listen(mapBus, MapEvents.enablePan, offListeners);
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
      const onClear = listen(
        measurementBus,
        MeasurementEvents.clear,
        offListeners,
      );
      const onEnablePan = listen(mapBus, MapEvents.enablePan, offListeners);
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
      const onClear = listen(
        measurementBus,
        MeasurementEvents.clear,
        offListeners,
      );
      const onEnablePan = listen(mapBus, MapEvents.enablePan, offListeners);
      const actions = measurementStore.actions(mapId);

      actions.clear();

      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onEnablePan).not.toHaveBeenCalled();
    });
  });

  describe('drag subscription', () => {
    it('drives the measurement from map drag events while a subscriber is attached', () => {
      const unsubscribe = measurementStore.subscribe(mapId)(() => undefined);

      mapBus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      mapBus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));

      expect(measurementStore.get(mapId)).toMatchObject({
        pointA: [10, 20],
        pointB: [11, 21],
        isMeasuring: true,
      });

      mapBus.emit(MapEvents.dragEnd, makeDragPayload(mapId, [11, 21]));

      expect(measurementStore.get(mapId).isMeasuring).toBe(false);
      unsubscribe();
    });

    it('ignores drags that lack the per-map required modifier', () => {
      const unsubscribe = measurementStore.subscribe(mapId)(() => undefined);
      measurementStore.actions(mapId).setRequiresModifier('alt');

      mapBus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));

      expect(measurementStore.get(mapId).isMeasuring).toBe(false);

      mapBus.emit(
        MapEvents.dragStart,
        makeDragPayload(mapId, [10, 20], { altKey: true }),
      );

      expect(measurementStore.get(mapId).isMeasuring).toBe(true);
      unsubscribe();
    });

    it('finishes an in-flight measurement and restores pan when the last subscriber leaves', () => {
      const onComplete = listen(
        measurementBus,
        MeasurementEvents.complete,
        offListeners,
      );
      const onEnablePan = listen(mapBus, MapEvents.enablePan, offListeners);
      const unsubscribe = measurementStore.subscribe(mapId)(() => undefined);

      mapBus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      mapBus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      unsubscribe();

      expect(onComplete).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          payload: { mapId, pointA: [10, 20], pointB: [11, 21] },
        }),
      );
      expect(onEnablePan).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ payload: { id: mapId } }),
      );
    });

    it('emits nothing when the last subscriber leaves while idle', () => {
      const onClear = listen(
        measurementBus,
        MeasurementEvents.clear,
        offListeners,
      );
      const onComplete = listen(
        measurementBus,
        MeasurementEvents.complete,
        offListeners,
      );
      const onEnablePan = listen(mapBus, MapEvents.enablePan, offListeners);
      const unsubscribe = measurementStore.subscribe(mapId)(() => undefined);

      unsubscribe();

      expect(onClear).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
      expect(onEnablePan).not.toHaveBeenCalled();
    });
  });

  describe('map mode', () => {
    const otherMode = 'draw-shape';
    const otherOwner = 'draw-shape-layer';
    let unsubscribeMode: () => void;

    beforeEach(() => {
      // The mode store only handles requests while it has a subscriber.
      unsubscribeMode = modeStore.subscribe(mapId)(() => undefined);
    });

    afterEach(() => {
      unsubscribeMode();
      clearMapModeState(mapId);
    });

    it('claims the measurement mode on start and releases it on complete', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);

      expect(getMode(mapId)).toBe(MEASUREMENT_MODE);
      expect(getCurrentModeOwner(mapId)).toBe(MEASUREMENT_LAYER_ID);

      actions.updateEnd([11, 21]);
      actions.complete();

      expect(getMode(mapId)).toBe(DEFAULT_MODE);
    });

    it('releases the measurement mode on clear', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.clear();

      expect(getMode(mapId)).toBe(DEFAULT_MODE);
    });

    it('keeps the mode when restarting mid-drag', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.start([12, 22]);

      expect(measurementStore.get(mapId).pointA).toEqual([12, 22]);
      expect(getMode(mapId)).toBe(MEASUREMENT_MODE);
    });

    it('ignores drags and start() while another owner holds the mode', () => {
      const onStart = listen(
        measurementBus,
        MeasurementEvents.start,
        offListeners,
      );
      const unsubscribe = measurementStore.subscribe(mapId)(() => undefined);
      modeStore.actions(mapId).requestModeChange(otherMode, otherOwner);

      mapBus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
      measurementStore.actions(mapId).start([10, 20]);

      expect(measurementStore.get(mapId).isMeasuring).toBe(false);
      expect(onStart).not.toHaveBeenCalled();
      expect(getMode(mapId)).toBe(otherMode);
      unsubscribe();
    });

    it('grants a mode requested during the drag once the measurement ends', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      modeStore.actions(mapId).requestModeChange(otherMode, otherOwner);

      expect(getMode(mapId)).toBe(MEASUREMENT_MODE);

      actions.updateEnd([11, 21]);
      actions.complete();

      expect(getMode(mapId)).toBe(otherMode);
      expect(getCurrentModeOwner(mapId)).toBe(otherOwner);
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
