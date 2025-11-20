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

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { MapContext } from '../deckgl/base-map/provider';
import {
  clearCursor as clearCursorModule,
  getSnapshotGetter,
  getSubscription,
  requestCursorChange as requestCursorChangeModule,
} from './store';
import type { UniqueId } from '@accelint/core';
import type { CSSCursorType } from './types';

/**
 * Return value for the useMapCursor hook
 */
export type UseMapCursorReturn = {
  /** The current active cursor */
  cursor: CSSCursorType;
  /** Function to request a cursor change with ownership */
  requestCursorChange: (cursor: CSSCursorType, requestOwner: string) => void;
  /** Function to clear cursor for an owner */
  clearCursor: (owner: string) => void;
};

/**
 * Hook to access the map cursor state and actions.
 *
 * This hook uses `useSyncExternalStore` to subscribe to the external `MapCursorStore`,
 * providing concurrent-safe cursor state updates. The hybrid architecture separates:
 * - Map instance identity (from `MapContext` or parameter)
 * - Cursor state management (from `MapCursorStore` via `useSyncExternalStore`)
 *
 * **Owner-based Priority System:**
 * - Mode owners (from MapModeStore) have highest priority
 * - Non-owners can set cursors only in default/ownerless modes
 * - Rejected requests emit events with rejection reasons
 *
 * @param id - Optional map instance ID. If not provided, will use the ID from `MapContext`.
 * @returns The current cursor, requestCursorChange function, and clearCursor function
 * @throws Error if no `id` is provided and hook is used outside of `MapProvider`
 * @throws Error if store doesn't exist for the given map ID
 *
 * @example
 * ```tsx
 * // Inside MapProvider (within BaseMap children)
 * function CustomDeckLayer() {
 *   const { cursor, requestCursorChange, clearCursor } = useMapCursor();
 *
 *   const handleHover = (info: PickingInfo) => {
 *     if (info.object) {
 *       requestCursorChange('pointer', 'custom-layer-id');
 *     } else {
 *       clearCursor('custom-layer-id');
 *     }
 *   };
 *
 *   return <ScatterplotLayer onHover={handleHover} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Outside MapProvider - pass id directly
 * function ExternalControl({ mapId }: { mapId: UniqueId }) {
 *   const { cursor, requestCursorChange } = useMapCursor(mapId);
 *
 *   return (
 *     <button onClick={() => requestCursorChange('crosshair', 'external-control')}>
 *       Set Crosshair (current: {cursor})
 *     </button>
 *   );
 * }
 * ```
 */
export function useMapCursor(id?: UniqueId): UseMapCursorReturn {
  const contextId = useContext(MapContext);
  const actualId = id ?? contextId;

  if (!actualId) {
    throw new Error(
      'useMapCursor requires either an id parameter or to be used within a MapProvider',
    );
  }

  // Subscribe to store using useSyncExternalStore with module functions
  const cursor = useSyncExternalStore(
    getSubscription(actualId),
    getSnapshotGetter(actualId),
  );

  // Create stable callback functions
  const requestCursorChange = useCallback(
    (cursor: CSSCursorType, owner: string) => {
      requestCursorChangeModule(actualId, cursor, owner);
    },
    [actualId],
  );

  const clearCursor = useCallback(
    (owner: string) => {
      clearCursorModule(actualId, owner);
    },
    [actualId],
  );

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      cursor,
      requestCursorChange,
      clearCursor,
    }),
    [cursor, requestCursorChange, clearCursor],
  );
}

/**
 * Hook to automatically manage cursor for a component's lifecycle.
 *
 * This hook automatically requests a cursor when mounted and clears it when unmounted.
 * Useful for components that need to consistently show a specific cursor.
 *
 * @param cursor - The cursor to request
 * @param owner - The owner identifier
 * @param id - Optional map instance ID
 *
 * @example
 * ```tsx
 * function DrawingMode() {
 *   useMapCursorEffect('crosshair', 'drawing-mode');
 *
 *   return <div>Drawing mode active with crosshair cursor</div>;
 * }
 * ```
 */
export function useMapCursorEffect(
  cursor: CSSCursorType,
  owner: string,
  id?: UniqueId,
): void {
  const { requestCursorChange, clearCursor } = useMapCursor(id);

  useEffect(() => {
    requestCursorChange(cursor, owner);

    return () => {
      clearCursor(owner);
    };
  }, [cursor, owner, requestCursorChange, clearCursor]);
}
