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
import { MapModeEvents } from '../map-mode/events';
// Import actual map-mode store functions for integration tests
import {
  destroyStore as destroyModeStore,
  getOrCreateStore as getOrCreateModeStore,
} from '../map-mode/store';
import { MapCursorEvents } from './events';
import {
  destroyStore,
  getOrCreateStore,
  getStore,
  MapCursorStore,
} from './store';
import type { MapModeEventType } from '../map-mode/types';
import type { MapCursorEventType } from './types';

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
    // Clean up stores and bus
    store.destroy();
    destroyModeStore(id);
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

    it('does not emit changed event when cursor is not changing', () => {
      const changedListener = vi.fn();
      bus.on(MapCursorEvents.changed, changedListener);

      // Set cursor to pointer
      store.requestCursorChange('pointer', 'test-owner');
      expect(changedListener).toHaveBeenCalledTimes(1);
      expect(store.getSnapshot()).toBe('pointer');

      changedListener.mockClear();

      // Request the same cursor again
      store.requestCursorChange('pointer', 'test-owner');

      // Should not emit changed event since cursor didn't change
      expect(changedListener).not.toHaveBeenCalled();
      expect(store.getSnapshot()).toBe('pointer');
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
    it('rejects cursor change from non-owner when mode has owner', () => {
      // Create mode store and set a mode owner
      const modeStore = getOrCreateModeStore(id);
      modeStore.requestModeChange('drawing', 'mode-owner');

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

      // Cursor should not have changed (but is stored for later)
      expect(store.getSnapshot()).toBe('default');
    });

    it('accepts cursor change from mode owner', () => {
      const modeStore = getOrCreateModeStore(id);
      modeStore.requestModeChange('drawing', 'mode-owner');

      store.requestCursorChange('crosshair', 'mode-owner');

      expect(store.getSnapshot()).toBe('crosshair');
    });

    it('accepts cursor change when no mode owner exists', () => {
      // Default mode has no owner
      store.requestCursorChange('pointer', 'any-owner');

      expect(store.getSnapshot()).toBe('pointer');
    });

    it('gives priority to mode owner cursor', () => {
      // First, no mode owner - any owner can set cursor
      store.requestCursorChange('pointer', 'owner-1');
      expect(store.getSnapshot()).toBe('pointer');

      // Now set a mode with owner
      const modeStore = getOrCreateModeStore(id);
      modeStore.requestModeChange('drawing', 'mode-owner');

      // Mode owner sets cursor
      store.requestCursorChange('crosshair', 'mode-owner');
      expect(store.getSnapshot()).toBe('crosshair');
    });

    it('stores rejected cursor requests for later use', () => {
      // Set up mode with owner
      const modeStore = getOrCreateModeStore(id);
      const modeBus = Broadcast.getInstance<MapModeEventType>();
      modeStore.requestModeChange('drawing', 'mode-owner');

      const rejectedListener = vi.fn();
      bus.on(MapCursorEvents.rejected, rejectedListener);

      // Non-owner requests cursor change - should be rejected but stored
      store.requestCursorChange('pointer', 'non-owner');

      // Should have emitted rejection event
      expect(rejectedListener).toHaveBeenCalled();

      // Cursor should not have changed yet
      expect(store.getSnapshot()).toBe('default');

      // Capture the auth ID when non-owner requests mode change
      let authId: string | undefined;
      modeBus.on(MapModeEvents.changeAuthorization, (event) => {
        if (event.payload.id === id) {
          authId = event.payload.authId;
        }
      });

      // Non-owner requests editing mode - requires authorization
      modeStore.requestModeChange('editing', 'non-owner');

      // Mode owner approves the request
      expect(authId).toBeDefined();
      modeBus.emit(MapModeEvents.changeDecision, {
        authId: authId as string,
        approved: true,
        owner: 'mode-owner',
        id,
      });

      // Verify non-owner is now the mode owner
      expect(modeStore.getCurrentModeOwner()).toBe('non-owner');

      // The stored cursor should now be applied automatically
      expect(store.getSnapshot()).toBe('pointer');
    });

    it('auto-applies stored cursor when requester becomes mode owner', async () => {
      // Set up mode with owner
      const modeStore = getOrCreateModeStore(id);
      const modeBus = Broadcast.getInstance<MapModeEventType>();
      modeStore.requestModeChange('drawing', 'owner-1');

      // owner-1 sets their cursor
      store.requestCursorChange('crosshair', 'owner-1');
      expect(store.getSnapshot()).toBe('crosshair');

      // owner-2 requests a cursor (will be rejected but stored)
      store.requestCursorChange('pointer', 'owner-2');
      expect(store.getSnapshot()).toBe('crosshair'); // Still owner-1's cursor

      // Set up listener to track cursor changes
      const changedListener = vi.fn();
      bus.on(MapCursorEvents.changed, changedListener);

      // Capture auth ID for owner-2's mode request
      let authId: string | undefined;
      modeBus.on(MapModeEvents.changeAuthorization, (event) => {
        if (event.payload.id === id) {
          authId = event.payload.authId;
        }
      });

      // owner-2 requests editing mode
      modeStore.requestModeChange('editing', 'owner-2');

      // Clear previous calls (mode change might emit events)
      changedListener.mockClear();

      // owner-1 approves the request - this should trigger cursor change
      expect(authId).toBeDefined();
      modeBus.emit(MapModeEvents.changeDecision, {
        authId: authId as string,
        approved: true,
        owner: 'owner-1',
        id,
      });

      // Wait for microtask to complete
      await Promise.resolve();

      // Cursor should automatically change to owner-2's stored cursor
      expect(store.getSnapshot()).toBe('pointer');

      // Should have emitted cursor changed event
      expect(changedListener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            previousCursor: 'crosshair',
            currentCursor: 'pointer',
            owner: 'owner-2',
            id,
          }),
        }),
      );
    });

    it('handles mode change to default with no pending cursor', async () => {
      const modeStore = getOrCreateModeStore(id);
      modeStore.requestModeChange('drawing', 'mode-owner');
      store.requestCursorChange('crosshair', 'mode-owner');

      const changedListener = vi.fn();
      bus.on(MapCursorEvents.changed, changedListener);

      // Return to default mode
      modeStore.requestModeChange('default', 'mode-owner');

      // Wait for microtask to complete
      await Promise.resolve();

      // Should emit changed event back to default
      expect(changedListener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            previousCursor: 'crosshair',
            currentCursor: 'default',
            id,
          }),
        }),
      );
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

  describe('Mode Integration', () => {
    it('clears cursor when returning to default mode', () => {
      // Create mode store for this map
      const modeStore = getOrCreateModeStore(id);

      // Set drawing mode with owner
      modeStore.requestModeChange('drawing', 'test-owner');

      // Set cursor as the mode owner
      store.requestCursorChange('crosshair', 'test-owner');
      expect(store.getSnapshot()).toBe('crosshair');

      // Return to default mode - cursor should reset to default
      modeStore.requestModeChange('default', 'test-owner');

      // Cursor should be cleared
      expect(store.getSnapshot()).toBe('default');
    });

    it('emits cursor changed event when mode changes to default', async () => {
      const modeStore = getOrCreateModeStore(id);
      const listener = vi.fn();

      bus.on(MapCursorEvents.changed, listener);

      // Set drawing mode with cursor
      modeStore.requestModeChange('drawing', 'test-owner');
      store.requestCursorChange('crosshair', 'test-owner');

      listener.mockClear();

      // Return to default mode
      modeStore.requestModeChange('default', 'test-owner');

      // Wait for microtask to complete
      await Promise.resolve();

      // Should emit cursor changed event
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            previousCursor: 'crosshair',
            currentCursor: 'default',
            owner: 'system',
            id,
          }),
        }),
      );
    });

    it('does not emit cursor changed if cursor was already default', () => {
      const modeStore = getOrCreateModeStore(id);
      const listener = vi.fn();

      bus.on(MapCursorEvents.changed, listener);

      // Set drawing mode but don't set custom cursor
      modeStore.requestModeChange('drawing', 'test-owner');

      listener.mockClear();

      // Return to default mode
      modeStore.requestModeChange('default', 'test-owner');

      // Should not emit cursor changed event since cursor was already default
      expect(listener).not.toHaveBeenCalled();
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
