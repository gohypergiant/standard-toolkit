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

/**
 * Map Cursor Store
 *
 * Manages cursor state with ownership-based priority.
 *
 * Priority order:
 * 1. Mode owner's cursor (if mode is owned)
 * 2. Most recent cursor request
 * 3. Default cursor
 *
 * @example
 * ```tsx
 * import { cursorStore } from '@accelint/map-toolkit/map-cursor';
 *
 * function MapContainer({ mapId }) {
 *   const cursor = cursorStore.useSelector(mapId, (s) => getEffectiveCursor(mapId, s));
 *   return <div style={{ cursor }}>...</div>;
 * }
 *
 * // Request cursor change from a layer:
 * cursorStore.actions(mapId).requestCursorChange('crosshair', 'draw-layer');
 * ```
 */

import { Broadcast } from '@accelint/bus';
import { MapModeEvents } from '../map-mode/events';
import { createMapStore } from '../shared/create-map-store';
import { MapCursorEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { ModeChangedEvent } from '../map-mode/types';
import type { CSSCursorType, MapCursorEventType } from './types';

const DEFAULT_CURSOR: CSSCursorType = 'default';

/**
 * State shape for map cursor
 */
type CursorState = {
  /** Map of owner -> cursor */
  cursorOwners: Map<string, CSSCursorType>;
  /** Current active cursor (for priority tracking) */
  currentCursor: CSSCursorType | null;
  /** Current cursor owner (for priority tracking) */
  currentOwner: string | null;
};

/**
 * Actions for cursor management
 */
type CursorActions = {
  /** Request a cursor change */
  requestCursorChange: (cursor: CSSCursorType, owner: string) => void;
  /** Clear cursor for an owner */
  clearCursor: (owner: string) => void;
};

const cursorBus = Broadcast.getInstance<MapCursorEventType>();
const modeBus = Broadcast.getInstance<ModeChangedEvent>();

// Import dynamically to avoid circular dependency
let getModeOwner: (mapId: UniqueId) => string | undefined;
import('../map-mode/store').then((mod) => {
  getModeOwner = mod.getCurrentModeOwner;
});

/**
 * Calculate effective cursor based on priority
 */
function getEffectiveCursor(
  mapId: UniqueId,
  state: CursorState,
): CSSCursorType {
  // Priority 1: Mode owner's cursor
  const modeOwner = getModeOwner?.(mapId);
  if (modeOwner) {
    const modeOwnerCursor = state.cursorOwners.get(modeOwner);
    if (modeOwnerCursor) {
      return modeOwnerCursor;
    }
  }

  // Priority 2: Current cursor (if owner still has entry)
  if (state.currentCursor && state.currentOwner) {
    if (state.cursorOwners.has(state.currentOwner)) {
      return state.currentCursor;
    }
  }

  // Priority 3: Default
  return DEFAULT_CURSOR;
}

/**
 * Cursor store
 */
export const cursorStore = createMapStore<CursorState, CursorActions>({
  defaultState: {
    cursorOwners: new Map(),
    currentCursor: null,
    currentOwner: null,
  },

  actions: (mapId, { get, set }) => ({
    requestCursorChange: (cursor: CSSCursorType, owner: string) => {
      const trimmedCursor = cursor.trim() as CSSCursorType;
      const trimmedOwner = owner.trim();

      if (!trimmedCursor) {
        throw new Error('requestCursorChange requires non-empty cursor');
      }
      if (!trimmedOwner) {
        throw new Error('requestCursorChange requires non-empty owner');
      }

      cursorBus.emit(MapCursorEvents.changeRequest, {
        cursor: trimmedCursor,
        owner: trimmedOwner,
        id: mapId,
      });
    },

    clearCursor: (owner: string) => {
      const state = get();
      const hadCursor = state.cursorOwners.has(owner);

      if (hadCursor) {
        // Create new Map for immutable update
        const newCursorOwners = new Map(state.cursorOwners);
        newCursorOwners.delete(owner);

        // Clear current tracking if this was the owner
        const updates: Partial<CursorState> = { cursorOwners: newCursorOwners };
        if (state.currentOwner === owner) {
          updates.currentCursor = null;
          updates.currentOwner = null;
        }

        set(updates);
      }
    },
  }),

  bus: (mapId, { get, set }) => {
    // Handle cursor change requests
    const unsubRequest = cursorBus.on(
      MapCursorEvents.changeRequest,
      (event) => {
        const { cursor, owner: requestOwner, id } = event.payload;
        if (id !== mapId) {
          return;
        }

        const state = get();
        const previousCursor = getEffectiveCursor(mapId, state);

        // Skip if same cursor already stored for this owner
        if (state.cursorOwners.get(requestOwner) === cursor) {
          return;
        }

        // Create new Map for immutable update
        const newCursorOwners = new Map(state.cursorOwners);
        newCursorOwners.set(requestOwner, cursor);

        // Check ownership
        const modeOwner = getModeOwner?.(mapId);
        const isOwnerless = !modeOwner;
        const isRequestOwnerModeOwner = requestOwner === modeOwner;

        if (isOwnerless || isRequestOwnerModeOwner) {
          // Accept: apply cursor with immutable update
          const newState: CursorState = {
            cursorOwners: newCursorOwners,
            currentCursor: cursor,
            currentOwner: requestOwner,
          };

          // Calculate new cursor with updated state
          const newCursor = getEffectiveCursor(mapId, newState);

          if (previousCursor !== newCursor) {
            set(newState);
            cursorBus.emit(MapCursorEvents.changed, {
              previousCursor,
              currentCursor: newCursor,
              owner: requestOwner,
              id: mapId,
            });
          } else {
            // Still need to update state even if cursor didn't change visually
            set(newState);
          }
        } else {
          // Reject: do NOT store the cursor, so the request can be retried
          // when conditions change (e.g., mode becomes unowned)
          cursorBus.emit(MapCursorEvents.rejected, {
            rejectedCursor: cursor,
            rejectedOwner: requestOwner,
            currentOwner: state.currentOwner || modeOwner || 'unknown',
            reason: 'not-owner',
            id: mapId,
          });
        }
      },
    );

    // Handle mode changes
    const unsubMode = modeBus.on(MapModeEvents.changed, (event) => {
      if (event.payload.id !== mapId) {
        return;
      }

      const state = get();
      const previousCursor = getEffectiveCursor(mapId, state);

      // Clear current tracking on mode change with immutable update
      if (
        event.payload.currentMode === 'default' ||
        event.payload.previousMode !== event.payload.currentMode
      ) {
        set({
          currentCursor: null,
          currentOwner: null,
        });
      }

      // Defer check until new mode owner is registered
      queueMicrotask(() => {
        // Re-get state after microtask since it may have changed
        const currentState = get();
        const newCursor = getEffectiveCursor(mapId, currentState);
        if (previousCursor !== newCursor) {
          const newModeOwner = getModeOwner?.(mapId) || 'system';
          cursorBus.emit(MapCursorEvents.changed, {
            previousCursor,
            currentCursor: newCursor,
            owner: newModeOwner,
            id: mapId,
          });
        }
      });
    });

    return () => {
      unsubRequest();
      unsubMode();
    };
  },
});

// =============================================================================
// Convenience exports
// =============================================================================

/**
 * Get effective cursor (computed from state)
 */
export function getCursor(mapId: UniqueId): CSSCursorType {
  return getEffectiveCursor(mapId, cursorStore.get(mapId));
}

/**
 * Hook for effective cursor value
 */
export function useCursor(mapId: UniqueId): CSSCursorType {
  return cursorStore.useSelector(mapId, (state) =>
    getEffectiveCursor(mapId, state),
  );
}

/**
 * Clear cursor state
 */
export function clearCursorState(mapId: UniqueId): void {
  cursorStore.clear(mapId);
}
