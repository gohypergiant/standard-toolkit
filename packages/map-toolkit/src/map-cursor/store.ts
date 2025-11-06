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
import { getStore as getModeStore } from '../map-mode/store';
import { MapCursorEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { CSSCursorType, MapCursorEventType } from './types';

/**
 * Default cursor values based on map interaction state
 */
const DEFAULT_CURSORS = {
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
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();

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
   * 2. Most recent cursor set (when in default/unowned mode)
   * 3. Default cursor
   */
  getSnapshot = (): CSSCursorType => {
    // Check if there's a mode owner with a cursor
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

    // When no mode owner exists (default mode), use the most recent cursor
    if (this.currentCursor) {
      return this.currentCursor;
    }

    // Default cursor
    return DEFAULT_CURSORS.default;
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
   * - **Accepted** if:
   *   - Requester is the mode owner
   *   - No mode owner exists (default/ownerless mode)
   * - **Rejected** if:
   *   - Requester is not the mode owner and a mode owner exists
   *
   * @param cursor - The desired CSS cursor type
   * @param requestOwner - Unique identifier of the component requesting the change
   * @throws Error if either parameter is empty or whitespace-only
   *
   * @example
   * ```ts
   * // Mode owner requesting cursor change (always accepted)
   * store.requestCursorChange('crosshair', 'drawing-tool');
   *
   * // Non-owner requesting in default mode (accepted)
   * store.requestCursorChange('pointer', 'layer-component');
   *
   * // Non-owner requesting in owned mode (rejected)
   * store.requestCursorChange('pointer', 'other-component'); // Rejected
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
  }

  /**
   * Handle cursor change request logic with owner-based priority
   */
  private handleCursorChangeRequest(
    cursor: CSSCursorType,
    requestOwner: string,
  ): void {
    const modeStore = getModeStore(this.id);
    const modeOwner = modeStore?.getCurrentModeOwner();

    // Check if requester has permission
    const hasPermission = !modeOwner || requestOwner === modeOwner;

    if (!hasPermission && modeOwner) {
      // Reject the request - modeOwner is guaranteed to exist here
      this.bus.emit(MapCursorEvents.rejected, {
        rejectedCursor: cursor,
        rejectedOwner: requestOwner,
        currentOwner: modeOwner,
        reason: `Cursor change to ${cursor} rejected: "${requestOwner}" is not the mode owner. To change cursor, request map mode change.`,
        id: this.id,
      });
      return;
    }

    // Accept the request
    const previousCursor = this.getSnapshot();
    this.cursorOwners.set(requestOwner, cursor);

    // Track the most recent cursor for use in default mode
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
