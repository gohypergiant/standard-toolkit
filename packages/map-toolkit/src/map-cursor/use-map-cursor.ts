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
'use client';

import 'client-only';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { MapContext } from '../deckgl/base-map/provider';
import { cursorStore, useCursor } from './store';
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
 * This hook uses `useSyncExternalStore` to subscribe to map cursor state changes,
 * providing concurrent-safe cursor state updates. Uses a fan-out pattern where
 * a single bus listener per map instance notifies N React component subscribers.
 *
 * **Owner-based Priority System:**
 * - Mode owners (from MapModeStore) have highest priority
 * - Non-owners can set cursors only in default/ownerless modes
 * - Rejected requests emit events with rejection reasons
 *
 * @param id - Optional map instance ID. If not provided, will use the ID from `MapContext`.
 * @returns The current cursor, requestCursorChange function, and clearCursor function
 * @throws Error if no `id` is provided and hook is used outside of `MapProvider`
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

  // Use the useCursor hook which computes effective cursor with priority
  const cursor = useCursor(actualId);

  // Get actions from the store - cursorStore.actions returns stable references
  // (cached per mapId), so we can memoize on actualId only
  const actions = useMemo(() => cursorStore.actions(actualId), [actualId]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      cursor,
      requestCursorChange: actions.requestCursorChange,
      clearCursor: actions.clearCursor,
    }),
    [cursor, actions],
  );
}

/**
 * Hook to automatically manage cursor for a component's lifecycle.
 *
 * This hook automatically requests a cursor when mounted and clears it when unmounted.
 * Useful for components that need to consistently show a specific cursor.
 *
 * NOTE: This hook does NOT re-render when cursor state changes. If you need to read
 * the current cursor value, use `useMapCursor` instead.
 *
 * @param cursorType - The cursor to request
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
  cursorType: CSSCursorType,
  owner: string,
  id?: UniqueId,
): void {
  const contextId = useContext(MapContext);
  const actualId = id ?? contextId;

  if (!actualId) {
    throw new Error(
      'useMapCursorEffect requires either an id parameter or to be used within a MapProvider',
    );
  }

  // Store values in refs for stable cleanup function access
  const cursorRef = useRef(cursorType);
  const ownerRef = useRef(owner);
  const idRef = useRef(actualId);

  // Update refs on each render
  cursorRef.current = cursorType;
  ownerRef.current = owner;
  idRef.current = actualId;

  // Subscribe to store (to ensure bus listeners are set up) on mount only
  useEffect(() => {
    const mapId = idRef.current;

    // Subscribe to store to ensure bus listeners are set up
    // The subscription callback is a no-op since we don't want to re-render
    const unsubscribe = cursorStore.subscribe(mapId)(() => {
      // No-op: we don't want cursor state changes to trigger re-renders
    });

    return () => {
      // Unsubscribe first to prevent re-render loops
      unsubscribe();

      // IMPORTANT: Defer cursor clear using queueMicrotask to avoid the React error:
      // "Cannot update a component while rendering a different component"
      //
      // Effect cleanup runs during React's commit phase. If clearCursor() triggers
      // a state update synchronously (via store.set() -> notify subscribers), it can
      // cause React to attempt re-rendering while still committing the current tree.
      //
      // queueMicrotask schedules the cleanup to run after the current commit phase
      // completes, allowing React to finish its work before the state update occurs.
      queueMicrotask(() => {
        const cleanupActions = cursorStore.actions(idRef.current);
        cleanupActions.clearCursor(ownerRef.current);
      });
    };
  }, []);

  // Request cursor when cursorType or owner changes
  useEffect(() => {
    const actions = cursorStore.actions(actualId);
    actions.requestCursorChange(cursorType, owner);
  }, [actualId, cursorType, owner]);
}
