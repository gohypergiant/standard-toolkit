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
import { MapModeEvents } from './events';
import {
  destroyStore,
  getOrCreateStore,
  getStore,
  MapModeStore,
} from './store';
import type { MapModeEventType } from './types';

describe('MapModeStore', () => {
  let store: MapModeStore;
  let id: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance<MapModeEventType>>;

  beforeEach(() => {
    // Mock BroadcastChannel FIRST
    mockBroadcastChannel();

    // Create fresh instances for each test
    id = uuid();

    // Get bus instance AFTER mocking
    bus = Broadcast.getInstance<MapModeEventType>();

    // Create store AFTER bus is initialized
    store = new MapModeStore(id);
  });

  afterEach(() => {
    // Clean up store and bus
    store.destroy();
    resetMockBroadcastChannel();
  });

  describe('Initialization', () => {
    it('initializes with default mode', () => {
      expect(store.getSnapshot()).toBe('default');
    });

    it('accepts id in constructor', () => {
      const customId = uuid();
      const customStore = new MapModeStore(customId);

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
    it('notifies subscribers on mode change', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      store.requestModeChange('drawing', 'owner1');

      expect(listener).toHaveBeenCalled();

      unsubscribe();
    });

    it('does not notify after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);
      unsubscribe();

      store.requestModeChange('drawing', 'owner1');

      expect(listener).not.toHaveBeenCalled();
    });

    it('returns unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');

      unsubscribe();
    });
  });

  describe('Input Validation', () => {
    it('throws error for empty desiredMode', () => {
      expect(() => {
        store.requestModeChange('', 'owner1');
      }).toThrow('requestModeChange requires non-empty desiredMode');
    });

    it('throws error for whitespace-only desiredMode', () => {
      expect(() => {
        store.requestModeChange('   ', 'owner1');
      }).toThrow('requestModeChange requires non-empty desiredMode');
    });

    it('throws error for empty requestOwner', () => {
      expect(() => {
        store.requestModeChange('drawing', '');
      }).toThrow('requestModeChange requires non-empty requestOwner');
    });

    it('throws error for whitespace-only requestOwner', () => {
      expect(() => {
        store.requestModeChange('drawing', '   ');
      }).toThrow('requestModeChange requires non-empty requestOwner');
    });

    it('trims whitespace from desiredMode', () => {
      const listener = vi.fn();
      bus.on(MapModeEvents.changeRequest, listener);

      store.requestModeChange('  drawing  ', 'owner1');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            desiredMode: 'drawing',
          }),
        }),
      );
    });

    it('trims whitespace from requestOwner', () => {
      const listener = vi.fn();
      bus.on(MapModeEvents.changeRequest, listener);

      store.requestModeChange('drawing', '  owner1  ');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            owner: 'owner1',
          }),
        }),
      );
    });
  });

  describe('Event Bus Communication', () => {
    it('emits changeRequest event when mode change is requested', () => {
      const listener = vi.fn();
      bus.on(MapModeEvents.changeRequest, listener);

      store.requestModeChange('drawing', 'owner1');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            desiredMode: 'drawing',
            owner: 'owner1',
            id,
          },
        }),
      );
    });

    it('emits changed event when mode changes', () => {
      const listener = vi.fn();
      bus.on(MapModeEvents.changed, listener);

      store.requestModeChange('drawing', 'owner1');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            previousMode: 'default',
            currentMode: 'drawing',
            id,
          },
        }),
      );
    });

    it('does not change mode if already in that mode', () => {
      const listener = vi.fn();
      bus.on(MapModeEvents.changed, listener);

      store.requestModeChange('default', 'owner1');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Instance Isolation', () => {
    it('only responds to events for its own id', () => {
      const otherId = uuid();
      const listener = vi.fn();

      bus.on(MapModeEvents.changed, listener);

      // Emit a request for a different instance
      bus.emit(MapModeEvents.changeRequest, {
        desiredMode: 'drawing',
        owner: 'owner1',
        id: otherId,
      });

      // Our store should not change
      expect(store.getSnapshot()).toBe('default');
      expect(listener).not.toHaveBeenCalled();
    });

    it('ignores authorization decisions for other instances', () => {
      const otherId = uuid();

      // Set up a mode that requires authorization
      store.requestModeChange('drawing', 'owner1');
      expect(store.getSnapshot()).toBe('drawing');

      // Another owner tries to change mode (triggers auth request)
      store.requestModeChange('measuring', 'owner2');
      expect(store.getSnapshot()).toBe('drawing'); // Still drawing

      // Send decision for wrong instance
      bus.emit(MapModeEvents.changeDecision, {
        authId: 'any-id',
        approved: true,
        owner: 'owner1',
        id: otherId,
      });

      // Mode should not have changed
      expect(store.getSnapshot()).toBe('drawing');
    });
  });

  describe('Auto-Accept Scenarios', () => {
    it('auto-accepts when no ownership conflicts exist', () => {
      store.requestModeChange('drawing', 'owner1');

      expect(store.getSnapshot()).toBe('drawing');
    });

    it('auto-accepts when owner requests different mode', () => {
      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');
      expect(store.getSnapshot()).toBe('drawing');

      // Owner1 switches to measuring
      store.requestModeChange('measuring', 'owner1');
      expect(store.getSnapshot()).toBe('measuring');
    });

    it('auto-accepts when owner returns to default', () => {
      store.requestModeChange('drawing', 'owner1');
      expect(store.getSnapshot()).toBe('drawing');

      store.requestModeChange('default', 'owner1');
      expect(store.getSnapshot()).toBe('default');
    });

    it('auto-accepts when entering owned mode from default', () => {
      // Owner1 claims drawing mode
      store.requestModeChange('drawing', 'owner1');
      expect(store.getSnapshot()).toBe('drawing');

      // Return to default
      store.requestModeChange('default', 'owner1');
      expect(store.getSnapshot()).toBe('default');

      // Owner1 can re-enter their owned mode
      store.requestModeChange('drawing', 'owner1');
      expect(store.getSnapshot()).toBe('drawing');
    });
  });

  describe('Authorization Flow', () => {
    it('requires authorization when different owner requests mode change', () => {
      const authListener = vi.fn();
      bus.on(MapModeEvents.changeAuthorization, authListener);

      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');
      expect(store.getSnapshot()).toBe('drawing');

      // Owner2 tries to switch to measuring - should trigger auth
      store.requestModeChange('measuring', 'owner2');

      expect(authListener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            desiredMode: 'measuring',
            currentMode: 'drawing',
            id,
          }),
        }),
      );

      // Mode should not have changed yet
      expect(store.getSnapshot()).toBe('drawing');
    });

    it('changes mode when authorization is approved', () => {
      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');
      expect(store.getSnapshot()).toBe('drawing');

      // Capture the auth request
      let capturedAuthId: string | undefined;
      bus.on(MapModeEvents.changeAuthorization, (event) => {
        capturedAuthId = event.payload.authId;
      });

      // Owner2 tries to change to measuring
      store.requestModeChange('measuring', 'owner2');
      expect(store.getSnapshot()).toBe('drawing');

      // Owner1 approves the request
      expect(capturedAuthId).toBeDefined();
      bus.emit(MapModeEvents.changeDecision, {
        authId: capturedAuthId as string,
        approved: true,
        owner: 'owner1',
        id,
      });

      // Mode should now be measuring
      expect(store.getSnapshot()).toBe('measuring');
    });

    it('does not change mode when authorization is rejected', () => {
      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Capture the auth request
      let capturedAuthId: string | undefined;
      bus.on(MapModeEvents.changeAuthorization, (event) => {
        capturedAuthId = event.payload.authId;
      });

      // Owner2 tries to change to measuring
      store.requestModeChange('measuring', 'owner2');

      // Owner1 rejects the request
      expect(capturedAuthId).toBeDefined();
      bus.emit(MapModeEvents.changeDecision, {
        authId: capturedAuthId as string,
        approved: false,
        owner: 'owner1',
        id,
      });

      // Mode should still be drawing
      expect(store.getSnapshot()).toBe('drawing');
    });

    it('ignores authorization decisions from non-owners', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Capture the auth request
      let capturedAuthId: string | undefined;
      bus.on(MapModeEvents.changeAuthorization, (event) => {
        capturedAuthId = event.payload.authId;
      });

      // Owner2 tries to change mode
      store.requestModeChange('measuring', 'owner2');

      // Owner3 (not the current owner) tries to approve
      expect(capturedAuthId).toBeDefined();
      bus.emit(MapModeEvents.changeDecision, {
        authId: capturedAuthId as string,
        approved: true,
        owner: 'owner3',
        id,
      });

      // Mode should still be drawing
      expect(store.getSnapshot()).toBe('drawing');

      // Should log warning
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Authorization decision from "owner3" ignored'),
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Pending Requests', () => {
    it('stores pending request when authorization is required', () => {
      const authListener = vi.fn();
      bus.on(MapModeEvents.changeAuthorization, authListener);

      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Owner2 tries to change - creates pending request
      store.requestModeChange('measuring', 'owner2');

      expect(authListener).toHaveBeenCalledOnce();
    });

    it('replaces pending request from same requester', () => {
      const authListener = vi.fn();
      bus.on(MapModeEvents.changeAuthorization, authListener);

      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Owner2 makes first request
      store.requestModeChange('measuring', 'owner2');
      expect(authListener).toHaveBeenCalledTimes(1);

      // Owner2 changes their mind and requests different mode
      store.requestModeChange('editing', 'owner2');

      // Should have two auth requests (one for each)
      expect(authListener).toHaveBeenCalledTimes(2);

      // Second request should be for editing
      expect(authListener).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            desiredMode: 'editing',
          }),
        }),
      );
    });

    it('clears pending request when mode changes successfully', () => {
      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Capture auth request
      let capturedAuthId: string | undefined;
      bus.on(MapModeEvents.changeAuthorization, (event) => {
        capturedAuthId = event.payload.authId;
      });

      // Owner2 requests measuring
      store.requestModeChange('measuring', 'owner2');

      // Approve the request
      expect(capturedAuthId).toBeDefined();
      bus.emit(MapModeEvents.changeDecision, {
        authId: capturedAuthId as string,
        approved: true,
        owner: 'owner1',
        id,
      });

      expect(store.getSnapshot()).toBe('measuring');

      // If Owner2 requests again, should auto-accept (they're now the owner)
      const authListener = vi.fn();
      bus.on(MapModeEvents.changeAuthorization, authListener);

      store.requestModeChange('editing', 'owner2');

      // Should not require auth
      expect(authListener).not.toHaveBeenCalled();
      expect(store.getSnapshot()).toBe('editing');
    });

    it('auto-accepts first pending request when owner returns to default', () => {
      const decisionListener = vi.fn();
      bus.on(MapModeEvents.changeDecision, decisionListener);

      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Owner2 requests measuring (pending)
      store.requestModeChange('measuring', 'owner2');

      // Owner1 returns to default - should auto-accept owner2's request
      store.requestModeChange('default', 'owner1');

      // Should emit approval decision
      expect(decisionListener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            approved: true,
            reason: 'Auto-accepted when mode owner returned to default',
          }),
        }),
      );

      // Mode should be measuring (owner2's request)
      expect(store.getSnapshot()).toBe('measuring');
    });

    it('rejects all pending requests if first request is for default mode', () => {
      const decisionListener = vi.fn();
      bus.on(MapModeEvents.changeDecision, decisionListener);

      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Owner2 requests default (pending)
      store.requestModeChange('default', 'owner2');

      // Owner1 returns to default
      store.requestModeChange('default', 'owner1');

      // Should reject owner2's request (already in default)
      expect(decisionListener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            approved: false,
            reason: 'Request rejected - already in requested mode',
          }),
        }),
      );

      expect(store.getSnapshot()).toBe('default');
    });

    it('rejects other pending requests when one is approved', () => {
      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Owner2 requests measuring
      let authId2: string | undefined;
      const authListener = vi.fn((event) => {
        if (event.payload.desiredMode === 'measuring') {
          authId2 = event.payload.authId;
        }
      });
      bus.on(MapModeEvents.changeAuthorization, authListener);
      store.requestModeChange('measuring', 'owner2');

      // Owner3 requests editing
      store.requestModeChange('editing', 'owner3');

      // Listen for decision events
      const decisionListener = vi.fn();
      bus.on(MapModeEvents.changeDecision, decisionListener);

      // Owner1 approves owner2's request
      expect(authId2).toBeDefined();
      bus.emit(MapModeEvents.changeDecision, {
        authId: authId2 as string,
        approved: true,
        owner: 'owner1',
        id,
      });

      // Should have rejection for owner3
      expect(decisionListener).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            approved: false,
            reason:
              'Request auto-rejected because another request was approved',
          }),
        }),
      );

      expect(store.getSnapshot()).toBe('measuring');
    });
  });

  describe('Mode Ownership Tracking', () => {
    it('tracks mode ownership', () => {
      // Owner1 enters drawing mode
      store.requestModeChange('drawing', 'owner1');

      // Owner1 can switch freely
      store.requestModeChange('measuring', 'owner1');
      expect(store.getSnapshot()).toBe('measuring');
    });

    it('does not assign owner to default mode', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      // Start in default
      expect(store.getSnapshot()).toBe('default');

      // Try to approve a fake auth for default mode from a non-existent owner
      bus.emit(MapModeEvents.changeDecision, {
        authId: 'fake-id',
        approved: true,
        owner: 'owner1',
        id,
      });

      // Should warn that owner1 is not the owner of default
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('not the owner of mode "default"'),
      );

      consoleWarnSpy.mockRestore();
    });

    it('preserves ownership after returning to default', () => {
      // Owner1 claims drawing
      store.requestModeChange('drawing', 'owner1');

      // Return to default
      store.requestModeChange('default', 'owner1');

      // Owner1 can re-enter drawing without auth
      store.requestModeChange('drawing', 'owner1');
      expect(store.getSnapshot()).toBe('drawing');
    });
  });

  describe('Cleanup and Destroy', () => {
    it('unsubscribes from bus events on destroy', () => {
      const listener = vi.fn();
      bus.on(MapModeEvents.changed, listener);

      store.destroy();

      // Manually emit event
      bus.emit(MapModeEvents.changeRequest, {
        desiredMode: 'drawing',
        owner: 'owner1',
        id,
      });

      // Store should not respond after destroy
      expect(listener).not.toHaveBeenCalled();
    });

    it('clears all state on destroy', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      // Set up some state
      store.requestModeChange('drawing', 'owner1');

      store.destroy();

      // Listeners should be cleared (calling requestModeChange won't notify)
      // Note: We can't actually call requestModeChange after destroy because
      // the event listeners are gone, but we can verify the listener wasn't called
      expect(listener).toHaveBeenCalled(); // Called once from the first request
      listener.mockClear();

      // Create a new event manually to verify store doesn't respond
      bus.emit(MapModeEvents.changeRequest, {
        desiredMode: 'measuring',
        owner: 'owner1',
        id,
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
