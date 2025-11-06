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
import { MapCursorEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { CursorDefaults, CursorState, MapCursorEventType } from './types';

const DEFAULT_CURSOR: CursorDefaults = {
  default: 'auto',
  hover: 'pointer',
  drag: 'grab',
};
/**
 * Typed event bus instance for map cursor events.
 * Provides type-safe event emission and listening for all map cursor state changes.
 */
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();

export class MapCursorStore {
  private cursorDefaults = DEFAULT_CURSOR;
  private cursorState: CursorState = 'default';
  private readonly cursorOwners = new Map<string, string>();
  private readonly listeners = new Set<() => void>();
  private readonly bus = mapCursorBus;
  private readonly unsubscribers: Array<() => void> = [];

  constructor(
    private readonly id: UniqueId,
    cursorDefaults: CursorDefaults = DEFAULT_CURSOR,
  ) {
    this.id = id;
    this.cursorDefaults = cursorDefaults;
    // Subscribe to bus events
    // this.setupEventListeners();
  }

  /**
   * Get current cursor snapshot (for useSyncExternalStore)
   */
  getSnapshot = (): string => {
    //internal logic to pick the cursor: Mode owner > first item in cursorOwner map > default cursor for cursor state
    return (
      this.cursorOwners.values().next().value ??
      this.cursorDefaults[this.cursorState]
    );
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
   * Notify all subscribers of state change
   */
  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  updateCursorState = (state: CursorState): void => {
    if (this.cursorState !== state) {
      this.cursorState = state;

      this.cursorOwners.clear();

      this.bus.emit(MapCursorEvents.changeState, {
        state,
        id: this.id,
      });
    }

    this.notify();
  };

  addCursor = (desiredCursor: string, requestOwner: string): void => {
    const trimmedDesiredCursor = desiredCursor.trim();
    const trimmedRequestOwner = requestOwner.trim();

    if (!trimmedDesiredCursor) {
      throw new Error('requestCursorChange requires non-empty desiredCursor');
    }
    if (!trimmedRequestOwner) {
      throw new Error('requestCursorChange requires non-empty requestOwner');
    }

    this.cursorOwners.set(trimmedRequestOwner, trimmedDesiredCursor);
    this.notify();

    // this.bus.emit(MapCursorEvents.changeRequest, {
    //   desiredCursor: trimmedDesiredCursor,
    //   owner: trimmedRequestOwner,
    //   id: this.id,
    // });
  };

  removeCursor = (requestOwner: string): void => {
    const trimmedRequestOwner = requestOwner.trim();

    if (!trimmedRequestOwner) {
      throw new Error('requestCursorChange requires non-empty requestOwner');
    }

    this.cursorOwners.delete(trimmedRequestOwner);
    this.notify();
  };

  // private setupEventListeners(): void {
  //   // Listen for cursor change requests
  //   const unsubRequest = this.bus.on(MapCursorEvents.changeRequest, (event) => {
  //     const { desiredCursor, owner: requestOwner, id } = event.payload;

  //     // Filter: only handle if targeted at this map and desired cursor doesn't exist
  //     if (
  //       id !== this.id ||
  //       desiredCursor === this.cursorOwners.get(requestOwner)
  //     ) {
  //       return;
  //     }

  //     this.handleCursorChangeRequest(desiredCursor, requestOwner);
  //   });
  //   this.unsubscribers.push(unsubRequest);

  //   // Listen to map events for cursor state changes
  //   const unsubMapState = this.bus.on(MapCursorEvents.changeState, (event) => {
  //     const { state, id } = event.payload;

  //     // Filter: only handle if targeted at this map or state will change
  //     if (id !== this.id || state === this.cursorState) {
  //       return;
  //     }

  //     this.handleCursorStateChange(state);
  //   });
  //   this.unsubscribers.push(unsubMapState);
  // }

  // private handleCursorChangeRequest(
  //   desiredMode: string,
  //   requestOwner: string,
  // ): void {
  //   return;
  // }

  // private handleCursorStateChange(): void {
  //   this.cursorOwners.clear();
  // }

  /**
   * Clean up store resources
   */
  destroy(): void {
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
  if (!storeRegistry.has(id)) {
    storeRegistry.set(id, new MapCursorStore(id));
  }
  // biome-ignore lint/style/noNonNullAssertion: Store guaranteed to exist after has() check above
  return storeRegistry.get(id)!;
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
