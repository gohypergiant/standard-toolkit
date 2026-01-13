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
import { createMapStore, mapDelete, mapSet } from '../shared/create-map-store';
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

/**
 * Lazy import to avoid circular dependency between cursor and mode stores.
 * The mode store doesn't depend on cursor store, but importing it synchronously
 * at module load time can cause initialization order issues.
 *
 * This pattern ensures the import is resolved before first use (bus listeners
 * are set up on first subscriber, not at module load time).
 */
let getModeOwnerFn: ((mapId: UniqueId) => string | undefined) | null = null;
let isRegisteredModeOwnerFn:
  | ((mapId: UniqueId, owner: string) => boolean)
  | null = null;
let importPromise: Promise<void> | null = null;
let importFailed = false;

function ensureModeStoreImported(): void {
  if (getModeOwnerFn !== null || importFailed) {
    return;
  }
  if (importPromise === null) {
    importPromise = import('../map-mode/store')
      .then((mod) => {
        getModeOwnerFn = mod.getCurrentModeOwner;
        isRegisteredModeOwnerFn = mod.isRegisteredModeOwner;
      })
      .catch((error) => {
        importFailed = true;
        // Log error in development only - in production this is a silent fallback
        if (process.env.NODE_ENV !== 'production') {
          console.error('[MapCursor] Failed to import mode store:', error);
        }
      });
  }
}

// Start the import immediately so it's likely resolved by first use
ensureModeStoreImported();

function getModeOwner(mapId: UniqueId): string | undefined {
  // getModeOwnerFn will be available by the time bus listeners are set up
  // (which happens on first React subscriber, not at module load)
  return getModeOwnerFn?.(mapId);
}

function isRegisteredOwner(mapId: UniqueId, owner: string): boolean {
  return isRegisteredModeOwnerFn?.(mapId, owner) ?? false;
}

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
  name: 'cursor',
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
        // Clear current tracking if this was the owner
        const updates: Partial<CursorState> = {
          cursorOwners: mapDelete(state.cursorOwners, owner),
        };
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
        const newCursorOwners = mapSet(
          state.cursorOwners,
          requestOwner,
          cursor,
        );

        // Check ownership
        const currentModeOwner = getModeOwner?.(mapId);
        const isOwnerless = !currentModeOwner;
        const isCurrentModeOwner = requestOwner === currentModeOwner;
        const isAnyModeOwner = isRegisteredOwner(mapId, requestOwner);

        if (isOwnerless || isCurrentModeOwner) {
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
        } else if (isAnyModeOwner) {
          // Store but don't apply: requester owns a different mode (pending or not current).
          // When their mode becomes active, getEffectiveCursor will find their cursor.
          set({ cursorOwners: newCursorOwners });

          cursorBus.emit(MapCursorEvents.rejected, {
            rejectedCursor: cursor,
            rejectedOwner: requestOwner,
            currentOwner: state.currentOwner || currentModeOwner || 'unknown',
            reason: 'not-current-owner',
            id: mapId,
          });
        } else {
          // Reject: don't store. Non-owners should only set cursor in default mode.
          cursorBus.emit(MapCursorEvents.rejected, {
            rejectedCursor: cursor,
            rejectedOwner: requestOwner,
            currentOwner: state.currentOwner || currentModeOwner || 'unknown',
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
 * Hook for effective cursor value.
 *
 * **Internal use only** - not exported from the public API.
 * Use `useMapCursor` instead, which provides:
 * - MapContext integration (auto-resolves mapId inside MapProvider)
 * - Actions (requestCursorChange, clearCursor)
 * - Better ergonomics for consumers
 *
 * This hook exists for internal composition (used by useMapCursor).
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
