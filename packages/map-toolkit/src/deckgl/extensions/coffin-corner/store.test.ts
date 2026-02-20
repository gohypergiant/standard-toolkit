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
import { MapEvents } from '../../base-map/events';
import {
  clearSelection,
  coffinCornerStore,
  getHoveredEntityId,
  getSelectedEntityId,
} from './store';
import { CoffinCornerEvents } from './types';
import type { UniqueId } from '@accelint/core';
import type { MapEventType } from '../../base-map/types';
import type { CoffinCornerEvent } from './types';

describe('coffin-corner store', () => {
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();
  });

  afterEach(() => {
    clearSelection(mapId);
  });

  describe('coffinCornerStore.subscribe', () => {
    it('should create a subscription function for a mapId', () => {
      const subscription = coffinCornerStore.subscribe(mapId);
      expect(typeof subscription).toBe('function');
    });

    it('should return the same subscription function for the same mapId', () => {
      const subscription1 = coffinCornerStore.subscribe(mapId);
      const subscription2 = coffinCornerStore.subscribe(mapId);
      expect(subscription1).toBe(subscription2);
    });

    it('should return different subscription functions for different mapIds', () => {
      const mapId2 = uuid();
      const subscription1 = coffinCornerStore.subscribe(mapId);
      const subscription2 = coffinCornerStore.subscribe(mapId2);
      expect(subscription1).not.toBe(subscription2);
      clearSelection(mapId2);
    });

    it('should notify callback on store changes', () => {
      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      const { setSelectedId } = coffinCornerStore.actions(mapId);

      setSelectedId('entity-1');

      expect(callback).toHaveBeenCalled();

      unsubscribe();
    });

    it('should stop notifying after unsubscribe', () => {
      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      unsubscribe();

      callback.mockClear();

      const { setSelectedId } = coffinCornerStore.actions(mapId);
      setSelectedId('entity-1');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('coffinCornerStore.snapshot', () => {
    it('should create a snapshot function for a mapId', () => {
      const snapshot = coffinCornerStore.snapshot(mapId);
      expect(typeof snapshot).toBe('function');
    });

    it('should return the same snapshot function for the same mapId', () => {
      const snapshot1 = coffinCornerStore.snapshot(mapId);
      const snapshot2 = coffinCornerStore.snapshot(mapId);
      expect(snapshot1).toBe(snapshot2);
    });

    it('should return default state from snapshot', () => {
      const snapshot = coffinCornerStore.snapshot(mapId);
      const state = snapshot();
      expect(state).not.toBeNull();
      expect(state?.selectedId).toBeUndefined();
      expect(state?.hoveredId).toBeUndefined();
      expect(state?.layerId).toBeUndefined();
    });
  });

  describe('coffinCornerStore.actions().setSelectedId', () => {
    it('should emit SELECTED event when selecting an entity', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();
      const selectedSpy = vi.fn();
      bus.on(CoffinCornerEvents.SELECTED, selectedSpy);

      const { setSelectedId } = coffinCornerStore.actions(mapId);
      setSelectedId('entity-1');

      expect(selectedSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { selectedId: 'entity-1', mapId },
        }),
      );

      bus.off(CoffinCornerEvents.SELECTED, selectedSpy);
    });

    it('should emit DESELECTED event when clearing selection', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();
      const deselectedSpy = vi.fn();
      bus.on(CoffinCornerEvents.DESELECTED, deselectedSpy);

      // Need a subscriber so bus listeners are active and state updates
      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      // First select something (bus listener updates state)
      const { setSelectedId } = coffinCornerStore.actions(mapId);
      setSelectedId('entity-1');

      // Then deselect
      setSelectedId(undefined);

      expect(deselectedSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { mapId, selectedId: undefined },
        }),
      );

      bus.off(CoffinCornerEvents.DESELECTED, deselectedSpy);
      unsubscribe();
    });

    it('should emit SELECTED when changing to a different entity', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();
      const selectedSpy = vi.fn();
      bus.on(CoffinCornerEvents.SELECTED, selectedSpy);

      const { setSelectedId } = coffinCornerStore.actions(mapId);
      setSelectedId('entity-1');
      setSelectedId('entity-2');

      expect(selectedSpy).toHaveBeenCalledTimes(2);
      expect(selectedSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: { selectedId: 'entity-2', mapId },
        }),
      );

      bus.off(CoffinCornerEvents.SELECTED, selectedSpy);
    });

    it('should do nothing when setting undefined with no current selection', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();
      const deselectedSpy = vi.fn();
      bus.on(CoffinCornerEvents.DESELECTED, deselectedSpy);

      const { setSelectedId } = coffinCornerStore.actions(mapId);
      setSelectedId(undefined);

      expect(deselectedSpy).not.toHaveBeenCalled();

      bus.off(CoffinCornerEvents.DESELECTED, deselectedSpy);
    });
  });

  describe('coffinCornerStore.actions().clearSelection', () => {
    it('should emit DESELECTED event', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();
      const deselectedSpy = vi.fn();
      bus.on(CoffinCornerEvents.DESELECTED, deselectedSpy);

      const { clearSelection: clear } = coffinCornerStore.actions(mapId);
      clear();

      expect(deselectedSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { mapId, selectedId: undefined },
        }),
      );

      bus.off(CoffinCornerEvents.DESELECTED, deselectedSpy);
    });
  });

  describe('coffinCornerStore.actions().setLayerId', () => {
    it('should update layerId in state', () => {
      const { setLayerId } = coffinCornerStore.actions(mapId);

      setLayerId('my-layer');

      const state = coffinCornerStore.get(mapId);
      expect(state.layerId).toBe('my-layer');
    });

    it('should not trigger update when layerId is unchanged', () => {
      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);

      setLayerId('my-layer');
      callback.mockClear();

      setLayerId('my-layer');

      expect(callback).not.toHaveBeenCalled();

      unsubscribe();
    });
  });

  describe('domain event → state', () => {
    it('should update selectedId in state on SELECTED event', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();

      // Initialize store with a subscriber so bus listeners are active
      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      bus.emit(CoffinCornerEvents.SELECTED, {
        selectedId: 'entity-42',
        mapId,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBe('entity-42');

      unsubscribe();
    });

    it('should clear selectedId in state on DESELECTED event', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      // Select first
      bus.emit(CoffinCornerEvents.SELECTED, {
        selectedId: 'entity-42',
        mapId,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBe('entity-42');

      // Deselect
      bus.emit(CoffinCornerEvents.DESELECTED, {
        mapId,
        selectedId: undefined,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBeUndefined();

      unsubscribe();
    });

    it('should update hoveredId in state on HOVERED event', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      bus.emit(CoffinCornerEvents.HOVERED, {
        hoveredId: 'entity-7',
        mapId,
      });

      expect(coffinCornerStore.get(mapId).hoveredId).toBe('entity-7');

      unsubscribe();
    });

    it('should ignore events for different mapId', () => {
      const bus = Broadcast.getInstance<CoffinCornerEvent>();
      const otherMapId = uuid();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      bus.emit(CoffinCornerEvents.SELECTED, {
        selectedId: 'entity-99',
        mapId: otherMapId,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBeUndefined();

      unsubscribe();
    });
  });

  describe('map click → domain events', () => {
    it('should select entity when clicking on matching layer object', () => {
      const mapBus = Broadcast.getInstance<MapEventType>();

      // Set up store with layerId
      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);
      setLayerId('symbols');

      mapBus.emit(MapEvents.click, {
        id: mapId,
        info: {
          layerId: 'symbols',
          object: { id: 'entity-1' },
          index: 0,
          picked: true,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBe('entity-1');

      unsubscribe();
    });

    it('should toggle selection when clicking same entity', () => {
      const mapBus = Broadcast.getInstance<MapEventType>();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);
      setLayerId('symbols');

      const clickInfo = {
        id: mapId,
        info: {
          layerId: 'symbols',
          object: { id: 'entity-1' },
          index: 0,
          picked: true,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      };

      // First click selects
      mapBus.emit(MapEvents.click, clickInfo);
      expect(coffinCornerStore.get(mapId).selectedId).toBe('entity-1');

      // Second click deselects
      mapBus.emit(MapEvents.click, clickInfo);
      expect(coffinCornerStore.get(mapId).selectedId).toBeUndefined();

      unsubscribe();
    });

    it('should deselect when clicking empty space', () => {
      const mapBus = Broadcast.getInstance<MapEventType>();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);
      setLayerId('symbols');

      // Select something first
      mapBus.emit(MapEvents.click, {
        id: mapId,
        info: {
          layerId: 'symbols',
          object: { id: 'entity-1' },
          index: 0,
          picked: true,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBe('entity-1');

      // Click empty space (index -1, no object)
      mapBus.emit(MapEvents.click, {
        id: mapId,
        info: {
          index: -1,
          picked: false,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBeUndefined();

      unsubscribe();
    });

    it('should ignore clicks for a different mapId', () => {
      const mapBus = Broadcast.getInstance<MapEventType>();
      const otherMapId = uuid();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);
      setLayerId('symbols');

      mapBus.emit(MapEvents.click, {
        id: otherMapId,
        info: {
          layerId: 'symbols',
          object: { id: 'entity-1' },
          index: 0,
          picked: true,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBeUndefined();

      unsubscribe();
    });

    it('should ignore clicks on a different layer', () => {
      const mapBus = Broadcast.getInstance<MapEventType>();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);
      setLayerId('symbols');

      mapBus.emit(MapEvents.click, {
        id: mapId,
        info: {
          layerId: 'other-layer',
          object: { id: 'entity-1' },
          index: 0,
          picked: true,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).selectedId).toBeUndefined();

      unsubscribe();
    });
  });

  describe('map hover → domain events', () => {
    it('should set hoveredId when hovering over matching layer object', () => {
      const mapBus = Broadcast.getInstance<MapEventType>();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);
      setLayerId('symbols');

      mapBus.emit(MapEvents.hover, {
        id: mapId,
        info: {
          layerId: 'symbols',
          object: { id: 'entity-3' },
          index: 0,
          picked: true,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).hoveredId).toBe('entity-3');

      unsubscribe();
    });

    it('should clear hoveredId when hovering away from objects', () => {
      const mapBus = Broadcast.getInstance<MapEventType>();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);
      setLayerId('symbols');

      // Hover over entity
      mapBus.emit(MapEvents.hover, {
        id: mapId,
        info: {
          layerId: 'symbols',
          object: { id: 'entity-3' },
          index: 0,
          picked: true,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).hoveredId).toBe('entity-3');

      // Hover away (no object)
      mapBus.emit(MapEvents.hover, {
        id: mapId,
        info: {
          index: -1,
          picked: false,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).hoveredId).toBeUndefined();

      unsubscribe();
    });

    it('should ignore hovers for a different mapId', () => {
      const mapBus = Broadcast.getInstance<MapEventType>();
      const otherMapId = uuid();

      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();
      const unsubscribe = subscription(callback);

      const { setLayerId } = coffinCornerStore.actions(mapId);
      setLayerId('symbols');

      mapBus.emit(MapEvents.hover, {
        id: otherMapId,
        info: {
          layerId: 'symbols',
          object: { id: 'entity-3' },
          index: 0,
          picked: true,
          x: 0,
          y: 0,
          coordinate: [0, 0],
          pixel: [0, 0],
          devicePixel: [0, 0],
          pixelRatio: 1,
          color: null,
        },
        event: {} as never,
      });

      expect(coffinCornerStore.get(mapId).hoveredId).toBeUndefined();

      unsubscribe();
    });
  });

  describe('convenience exports', () => {
    it('should return selectedId via getSelectedEntityId', () => {
      coffinCornerStore.set(mapId, {
        selectedId: 'entity-5',
        hoveredId: undefined,
        layerId: undefined,
      });

      expect(getSelectedEntityId(mapId)).toBe('entity-5');
    });

    it('should return hoveredId via getHoveredEntityId', () => {
      coffinCornerStore.set(mapId, {
        selectedId: undefined,
        hoveredId: 'entity-6',
        layerId: undefined,
      });

      expect(getHoveredEntityId(mapId)).toBe('entity-6');
    });

    it('should clear all state for a mapId via clearSelection', () => {
      coffinCornerStore.set(mapId, {
        selectedId: 'entity-5',
        hoveredId: 'entity-6',
        layerId: 'symbols',
      });

      clearSelection(mapId);

      expect(coffinCornerStore.exists(mapId)).toBe(false);
    });
  });

  describe('cleanup behavior', () => {
    it('should clean up state when last subscriber unsubscribes', () => {
      const subscription = coffinCornerStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      unsubscribe();

      expect(coffinCornerStore.exists(mapId)).toBe(false);
    });

    it('should maintain state while subscribers exist', () => {
      const subscription = coffinCornerStore.subscribe(mapId);
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = subscription(callback1);
      const unsubscribe2 = subscription(callback2);

      unsubscribe1();

      expect(coffinCornerStore.exists(mapId)).toBe(true);

      unsubscribe2();

      expect(coffinCornerStore.exists(mapId)).toBe(false);
    });
  });
});
