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
import { type UniqueId, uuid } from '@accelint/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockBroadcastChannel,
  resetMockBroadcastChannel,
} from 'vitest-broadcast-channel-mock';
import { MapCursorEvents } from './events';
import {
  destroyStore,
  getOrCreateStore,
  getStore,
  MapCursorStore,
} from './store';
import type { MapCursorEventType } from './types';

// Mock map-mode store to control mode owner
vi.mock('../map-mode/store', () => ({
  getStore: vi.fn(() => ({
    getCurrentModeOwner: vi.fn(() => undefined),
  })),
}));

describe('MapCursorStore', () => {
  let store: MapCursorStore;
  let id: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance<MapCursorEventType>>;

  beforeEach(() => {
    // Mock BroadcastChannel FIRST
    mockBroadcastChannel();

    // Create fresh instances for each test
    id = uuid();

    // Get bus instance AFTER mocking
    bus = Broadcast.getInstance<MapCursorEventType>();

    // Create store AFTER bus is initialized
    store = new MapCursorStore(id);
  });

  afterEach(() => {
    // Clean up store and bus
    store.destroy();
    resetMockBroadcastChannel();
  });

  describe('Initialization', () => {
    it('initializes with default cursor', () => {
      expect(store.getSnapshot()).toBe('default');
    });

    it('accepts id in constructor', () => {
      const customId = uuid();
      const customStore = new MapCursorStore(customId);

      expect(customStore.getSnapshot()).toBe('default');

      customStore.destroy();
    });
  });

  describe('Store Registry', () => {
    it('creates and retrieves store by map id', () => {
      const id = uuid();
      const newStore = getOrCreateStore(id);

      expect(getStore(id)).toBe(newStore);

      destroyStore(id);
    });

    it('returns existing store for same map id', () => {
      const id = uuid();
      const store1 = getOrCreateStore(id);
      const store2 = getOrCreateStore(id);

      expect(store1).toBe(store2);

      destroyStore(id);
    });

    it('removes store from registry on destroy', () => {
      const id = uuid();
      getOrCreateStore(id);
      destroyStore(id);

      expect(getStore(id)).toBeUndefined();
    });
  });

  describe('Observable Pattern (useSyncExternalStore)', () => {
    it('notifies subscribers on cursor change', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      store.requestCursorChange('pointer', 'test-owner');

      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
    });

    it('does not notify after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      store.requestCursorChange('pointer', 'test-owner');

      expect(listener).not.toHaveBeenCalled();
    });

    it('allows multiple subscribers', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsubscribe1 = store.subscribe(listener1);
      const unsubscribe2 = store.subscribe(listener2);

      store.requestCursorChange('pointer', 'test-owner');

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);

      unsubscribe1();
      unsubscribe2();
    });
  });

  describe('Cursor Change Requests', () => {
    it('accepts cursor change request and updates cursor', () => {
      store.requestCursorChange('pointer', 'test-owner');

      expect(store.getSnapshot()).toBe('pointer');
    });

    it('emits cursor:changed event on successful change', () => {
      const changedListener = vi.fn();
      bus.on(MapCursorEvents.changed, changedListener);

      store.requestCursorChange('crosshair', 'test-owner');

      expect(changedListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MapCursorEvents.changed,
          payload: expect.objectContaining({
            previousCursor: 'default',
            currentCursor: 'crosshair',
            owner: 'test-owner',
            id,
          }),
        }),
      );
    });

    it('supports multiple owners updating cursors', () => {
      store.requestCursorChange('pointer', 'owner-1');
      expect(store.getSnapshot()).toBe('pointer');

      store.requestCursorChange('crosshair', 'owner-2');
      // In default mode (no mode owner), most recent request wins
      expect(store.getSnapshot()).toBe('crosshair');
    });

    it('throws error for empty cursor', () => {
      expect(() => store.requestCursorChange('', 'test-owner')).toThrow(
        'requestCursorChange requires non-empty cursor',
      );
    });

    it('throws error for empty owner', () => {
      expect(() => store.requestCursorChange('pointer', '')).toThrow(
        'requestCursorChange requires non-empty requestOwner',
      );
    });

    it('trims whitespace from cursor and owner', () => {
      const changedListener = vi.fn();
      bus.on(MapCursorEvents.changed, changedListener);

      store.requestCursorChange('  pointer  ', '  test-owner  ');

      expect(changedListener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            currentCursor: 'pointer',
            owner: 'test-owner',
          }),
        }),
      );
    });
  });

  describe('Clear Cursor', () => {
    it('clears cursor for specific owner', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.requestCursorChange('pointer', 'test-owner');
      expect(store.getSnapshot()).toBe('pointer');
      listener.mockClear();

      store.clearCursor('test-owner');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(store.getSnapshot()).toBe('default');
    });

    it('does not notify if owner had no cursor', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.clearCursor('non-existent-owner');

      expect(listener).not.toHaveBeenCalled();
    });

    it('falls back to default after clearing current owner', () => {
      store.requestCursorChange('pointer', 'owner-1');
      store.requestCursorChange('crosshair', 'owner-2');

      // owner-2 was the most recent, so their cursor is shown
      expect(store.getSnapshot()).toBe('crosshair');

      // Clearing the current owner resets to default
      store.clearCursor('owner-2');
      expect(store.getSnapshot()).toBe('default');
    });
  });

  describe('Mode Owner Priority', () => {
    it('rejects cursor change from non-owner when mode has owner', async () => {
      // Mock mode store to return an owner
      const { getStore: getModeStore } = await import('../map-mode/store');
      vi.mocked(getModeStore).mockReturnValue({
        getCurrentModeOwner: vi.fn(() => 'mode-owner'),
      } as never);

      const rejectedListener = vi.fn();
      bus.on(MapCursorEvents.rejected, rejectedListener);

      store.requestCursorChange('pointer', 'non-owner');

      expect(rejectedListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MapCursorEvents.rejected,
          payload: expect.objectContaining({
            rejectedCursor: 'pointer',
            rejectedOwner: 'non-owner',
            currentOwner: 'mode-owner',
            id,
          }),
        }),
      );

      // Cursor should not have changed
      expect(store.getSnapshot()).toBe('default');
    });

    it('accepts cursor change from mode owner', async () => {
      const { getStore: getModeStore } = await import('../map-mode/store');
      vi.mocked(getModeStore).mockReturnValue({
        getCurrentModeOwner: vi.fn(() => 'mode-owner'),
      } as never);

      store.requestCursorChange('crosshair', 'mode-owner');

      expect(store.getSnapshot()).toBe('crosshair');
    });

    it('accepts cursor change when no mode owner exists', async () => {
      const { getStore: getModeStore } = await import('../map-mode/store');
      vi.mocked(getModeStore).mockReturnValue({
        getCurrentModeOwner: vi.fn(() => undefined),
      } as never);

      store.requestCursorChange('pointer', 'any-owner');

      expect(store.getSnapshot()).toBe('pointer');
    });

    it('gives priority to mode owner cursor', async () => {
      const { getStore: getModeStore } = await import('../map-mode/store');

      // First, no mode owner
      vi.mocked(getModeStore).mockReturnValue({
        getCurrentModeOwner: vi.fn(() => undefined),
      } as never);

      store.requestCursorChange('pointer', 'owner-1');
      expect(store.getSnapshot()).toBe('pointer');

      // Now mode owner sets cursor
      vi.mocked(getModeStore).mockReturnValue({
        getCurrentModeOwner: vi.fn(() => 'mode-owner'),
      } as never);

      store.requestCursorChange('crosshair', 'mode-owner');
      expect(store.getSnapshot()).toBe('crosshair');
    });
  });

  describe('Event Bus Integration', () => {
    it('only processes events for its own map id', () => {
      const otherId = uuid();
      const listener = vi.fn();
      store.subscribe(listener);

      bus.emit(MapCursorEvents.changeRequest, {
        cursor: 'pointer',
        owner: 'test-owner',
        id: otherId, // Different map ID
      });

      expect(listener).not.toHaveBeenCalled();
      expect(store.getSnapshot()).toBe('default');
    });

    it('processes events for correct map id', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      bus.emit(MapCursorEvents.changeRequest, {
        cursor: 'pointer',
        owner: 'test-owner',
        id, // Correct map ID
      });

      expect(listener).toHaveBeenCalled();
      expect(store.getSnapshot()).toBe('pointer');
    });
  });

  describe('Cleanup', () => {
    it('clears all state on destroy', () => {
      store.requestCursorChange('pointer', 'test-owner');

      const listener = vi.fn();
      store.subscribe(listener);

      store.destroy();

      // Try to notify - should not call listener
      bus.emit(MapCursorEvents.changeRequest, {
        cursor: 'crosshair',
        owner: 'test-owner',
        id,
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
