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
import { MapEvents, type MapEventType } from '@/deckgl';
import { MapModeEvents } from '../map-mode/events';
import { getStore as getModeStore } from '../map-mode/store';
import { MapCursorEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { ModeChangedEvent } from '../map-mode/types';
import type {
  CSSCursorType,
  CursorDefaults,
  CursorState,
  MapCursorEventType,
} from './types';

/**
 * Default cursor values based on map interaction state
 */
const DEFAULT_CURSORS: CursorDefaults = {
  /** Default cursor when not interacting */
  default: 'default' as CSSCursorType,
  /** Cursor when hovering over interactive elements */
  hover: 'pointer' as CSSCursorType,
  /** Cursor when dragging the map */
  drag: 'grabbing' as CSSCursorType,
} as const;

/**
 * Typed event bus instance for map cursor events.
 * Provides type-safe event emission and listening for all map cursor state changes.
 */
const mapCursorBus = Broadcast.getInstance<MapCursorEventType | MapEventType>();

/**
 * External store for managing map cursor state.
 *
 * This store implements the observable pattern for use with React's `useSyncExternalStore` hook.
 * It manages cursor state with owner-based priority, allowing components to request cursor changes
 * while respecting ownership hierarchy (mode owner > non-owners).
 *
 * Each store instance is identified by a unique `id` and operates independently,
 * enabling scenarios with multiple isolated map instances (e.g., main map + minimap).
 * Stores communicate via the event bus and filter events by `id` to ensure isolation.
 *
 * **Priority System**:
 * - Mode owner (from MapModeStore) has highest priority
 * - Only one cursor per owner (stored in Map<owner, cursor>)
 * - Non-owners can set cursors only in default mode or ownerless modes
 * - All requests are stored and auto-applied when requester becomes mode owner
 *
 * @see {getOrCreateStore} - Creates or retrieves a store for a given map instance
 * @see {destroyStore} - Destroys a store and cleans up its resources
 */
export class MapCursorStore {
  private readonly cursorOwners = new Map<string, CSSCursorType>();
  private readonly listeners = new Set<() => void>();
  private readonly bus = mapCursorBus;
  private readonly unsubscribers: Array<() => void> = [];
  private currentCursor: CSSCursorType | null = null;
  private currentOwner: string | null = null;
  private cursorState: CursorState = 'default';

  constructor(private readonly id: UniqueId) {
    this.id = id;
    // Subscribe to bus events
    this.setupEventListeners();
  }

  /**
   * Get current cursor snapshot (for useSyncExternalStore)
   *
   * Priority order:
   * 1. Mode owner's cursor (if exists and mode is owned)
   * 2. Most recent cursor (only if currentOwner still has an entry in storage)
   * 3. Default cursor
   *
   * The owner entry check prevents returning stale cursors after cleanup.
   * For example, when a mode owner returns to default, their cursor entry is
   * deleted from storage, so their cached cursor won't be returned.
   */
  getSnapshot = (): CSSCursorType => {
    // Priority 1: Mode owner's cursor
    const modeStore = getModeStore(this.id);
    if (modeStore) {
      const modeOwner = modeStore.getCurrentModeOwner();
      if (modeOwner) {
        const modeOwnerCursor = this.cursorOwners.get(modeOwner);
        if (modeOwnerCursor) {
          return modeOwnerCursor;
        }
      }
    }

    // Priority 2: Most recent cursor (only if owner entry still exists)
    if (this.currentCursor && this.currentOwner) {
      if (this.cursorOwners.has(this.currentOwner)) {
        return this.currentCursor;
      }
    }

    // Priority 3: Default cursor
    return DEFAULT_CURSORS[this.cursorState];
  };

  /**
   * Subscribe to cursor changes (for useSyncExternalStore)
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Request a cursor change
   *
   * Components request cursor changes via this method. The request will be:
   * - **Accepted and applied immediately** if:
   *   - Requester is the mode owner
   *   - No mode owner exists (default/ownerless mode)
   *   - Cursor is different from current cursor
   * - **Rejected for immediate application** if:
   *   - Requester is not the mode owner and a mode owner exists
   *   - Cursor is stored and will auto-apply when requester becomes owner
   * - **Skipped** if:
   *   - Same cursor is already stored for this owner (no event)
   *   - Same cursor is already displayed (no change event)
   *
   * @param cursor - The desired CSS cursor type
   * @param requestOwner - Unique identifier of the component requesting the change
   * @throws Error if either parameter is empty or whitespace-only
   *
   * @example
   * ```ts
   * // Mode owner requesting cursor change (accepted immediately)
   * store.requestCursorChange('crosshair', 'drawing-tool');
   *
   * // Non-owner requesting in default mode (accepted immediately)
   * store.requestCursorChange('pointer', 'layer-component');
   *
   * // Non-owner requesting in owned mode (rejected but stored)
   * store.requestCursorChange('pointer', 'other-component'); // Rejected, stored for later
   *
   * // Requesting same cursor again (skipped, no event)
   * store.requestCursorChange('pointer', 'layer-component'); // No-op
   * ```
   */
  requestCursorChange = (cursor: CSSCursorType, requestOwner: string): void => {
    const trimmedCursor = cursor.trim();
    const trimmedRequestOwner = requestOwner.trim();

    if (!trimmedCursor) {
      throw new Error('requestCursorChange requires non-empty cursor');
    }
    if (!trimmedRequestOwner) {
      throw new Error('requestCursorChange requires non-empty requestOwner');
    }

    this.bus.emit(MapCursorEvents.changeRequest, {
      cursor: trimmedCursor as CSSCursorType,
      owner: trimmedRequestOwner,
      id: this.id,
    });
  };

  /**
   * Notify all subscribers of state change
   */
  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Setup event listeners for bus events
   */
  private setupEventListeners(): void {
    // Listen for cursor change requests
    const unsubRequest = this.bus.on(MapCursorEvents.changeRequest, (event) => {
      const { cursor, owner: requestOwner, id } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== this.id) {
        return;
      }

      this.handleCursorChangeRequest(cursor, requestOwner);
    });
    this.unsubscribers.push(unsubRequest);

    // Listen for mode changes to handle cursor updates when ownership changes
    const modeBus = Broadcast.getInstance<ModeChangedEvent>();
    const unsubModeChange = modeBus.on(MapModeEvents.changed, (event) => {
      // Filter: only handle if targeted at this map
      if (event.payload.id !== this.id) {
        return;
      }

      const previousCursor = this.getSnapshot();

      // When returning to default mode, clear the previous mode owner's cursor
      // Preserves other components' stored cursor preferences for future use
      if (event.payload.currentMode === 'default') {
        if (this.currentOwner) {
          this.cursorOwners.delete(this.currentOwner);
        }
        this.currentCursor = null;
        this.currentOwner = null;

        // Notify immediately to trigger React re-render
        this.notify();
      }

      // Defer cursor change check until after new mode owner is registered
      // Mode changed event fires before ownership is established
      queueMicrotask(() => {
        const newCursor = this.getSnapshot();
        if (previousCursor !== newCursor) {
          const modeStore = getModeStore(this.id);
          const newModeOwner = modeStore?.getCurrentModeOwner() || 'system';
          this.bus.emit(MapCursorEvents.changed, {
            previousCursor,
            currentCursor: newCursor,
            owner: newModeOwner,
            id: this.id,
          });
          this.notify();
        }
      });
    });
    this.unsubscribers.push(unsubModeChange);

    const unsubHover = this.bus.on(MapEvents.hover, (event) => {
      const { id } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== this.id) {
        return;
      }

      this.handleCursorStateChange('hover');
    });
    this.unsubscribers.push(unsubHover);

    const unsubClick = this.bus.on(MapEvents.click, (event) => {
      const { id } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== this.id) {
        return;
      }

      this.handleCursorStateChange('default');
    });
    this.unsubscribers.push(unsubClick);
  }

  private handleCursorStateChange = (state: CursorState): void => {
    if (this.cursorState !== state) {
      this.cursorState = state;

      this.cursorOwners.clear();

      this.bus.emit(MapCursorEvents.changeState, {
        state,
        id: this.id,
      });

      this.notify();
    }
  };

  /**
   * Handle cursor change request logic with owner-based priority
   *
   * All cursor requests are stored in the cursorOwners map, regardless of permission.
   * This enables automatic cursor application when the requester later becomes mode owner.
   */
  private handleCursorChangeRequest(
    cursor: CSSCursorType,
    requestOwner: string,
  ): void {
    const modeStore = getModeStore(this.id);
    const modeOwner = modeStore?.getCurrentModeOwner();

    const hasPermission = !modeOwner || requestOwner === modeOwner;
    const previousCursor = this.getSnapshot();
    const existingCursor = this.cursorOwners.get(requestOwner);
    const isNewCursor = existingCursor !== cursor;

    // Store new cursor requests for auto-application when requester becomes owner
    if (isNewCursor) {
      this.cursorOwners.set(requestOwner, cursor);
    }

    if (!hasPermission && modeOwner) {
      // Reject immediate application, emit event only for new requests
      if (isNewCursor) {
        this.bus.emit(MapCursorEvents.rejected, {
          rejectedCursor: cursor,
          rejectedOwner: requestOwner,
          currentOwner: modeOwner,
          reason: `Cursor change to ${cursor} rejected: "${requestOwner}" is not the mode owner. To change cursor, request map mode change.`,
          id: this.id,
        });
      }
      return;
    }

    // Skip if cursor not changing
    if (previousCursor === cursor) {
      return;
    }

    // Accept and apply
    this.currentCursor = cursor;
    this.currentOwner = requestOwner;

    this.bus.emit(MapCursorEvents.changed, {
      previousCursor,
      currentCursor: cursor,
      owner: requestOwner,
      id: this.id,
    });

    this.notify();
  }

  /**
   * Clear cursor for a specific owner
   * Useful when a component unmounts or wants to relinquish cursor control
   *
   * @param owner - The owner whose cursor should be cleared
   */
  clearCursor = (owner: string): void => {
    const hadCursor = this.cursorOwners.has(owner);
    this.cursorOwners.delete(owner);

    // If clearing the current owner, reset to default or find next cursor
    if (this.currentOwner === owner) {
      this.currentCursor = null;
      this.currentOwner = null;
    }

    if (hadCursor) {
      this.notify();
    }
  };

  /**
   * Clean up store resources
   */
  destroy(): void {
    // Unsubscribe from all bus events
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
    this.unsubscribers.length = 0;

    // Clear all state
    this.cursorOwners.clear();
    this.listeners.clear();
  }
}

/**
 * Global store registry
 */
const storeRegistry = new Map<UniqueId, MapCursorStore>();

/**
 * Get or create a store for a given map instance
 */
export function getOrCreateStore(id: UniqueId): MapCursorStore {
  let store = storeRegistry.get(id);
  if (!store) {
    store = new MapCursorStore(id);
    storeRegistry.set(id, store);
  }
  return store;
}

/**
 * Destroy and remove a store from the registry
 */
export function destroyStore(id: UniqueId): void {
  const store = storeRegistry.get(id);
  if (store) {
    store.destroy();
    storeRegistry.delete(id);
  }
}

/**
 * Get a store by map ID (for testing/advanced use)
 */
export function getStore(id: UniqueId): MapCursorStore | undefined {
  return storeRegistry.get(id);
}
