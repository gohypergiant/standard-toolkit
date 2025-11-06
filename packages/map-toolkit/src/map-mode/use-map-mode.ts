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

import { useContext, useMemo, useSyncExternalStore } from 'react';
import { MapContext } from '../deckgl/base-map/provider';
import { getStore } from './store';
import type { UniqueId } from '@accelint/core';

/**
 * Return value for the useMapMode hook
 */
export type UseMapModeReturn = {
  /** The current active map mode */
  mode: string;
  /** Function to request a mode change with ownership */
  requestModeChange: (desiredMode: string, requestOwner: string) => void;
};

/**
 * Hook to access the map mode state and actions.
 *
 * This hook uses `useSyncExternalStore` to subscribe to the external `MapModeStore`,
 * providing concurrent-safe mode state updates. The hybrid architecture separates:
 * - Map instance identity (from `MapContext` or parameter)
 * - Mode state management (from `MapModeStore` via `useSyncExternalStore`)
 *
 * @param id - Optional map instance ID. If not provided, will use the ID from `MapContext`.
 * @returns The current map mode and requestModeChange function
 * @throws Error if no `id` is provided and hook is used outside of `MapProvider`
 * @throws Error if store doesn't exist for the given map ID
 *
 * @example
 * ```tsx
 * // Inside MapProvider (within BaseMap children) - uses context
 * // Only Deck.gl layer components can be children
 * function CustomDeckLayer() {
 *   const { mode, requestModeChange } = useMapMode();
 *
 *   const handleClick = (info: PickingInfo) => {
 *     requestModeChange('editing', 'custom-layer-id');
 *   };
 *
 *   return <ScatterplotLayer onClick={handleClick} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Outside MapProvider - pass id directly
 * function ExternalControl({ mapId }: { mapId: UniqueId }) {
 *   const { mode, requestModeChange } = useMapMode(mapId);
 *
 *   return <button onClick={() => requestModeChange('default', 'external')}>
 *     Reset to Default (current: {mode})
 *   </button>;
 * }
 * ```
 */
export function useMapMode(id?: UniqueId): UseMapModeReturn {
  const contextId = useContext(MapContext);
  const actualId = id ?? contextId;

  if (!actualId) {
    throw new Error(
      'useMapMode requires either an id parameter or to be used within a MapProvider',
    );
  }

  // Get the store for this map instance
  const store = getStore(actualId);

  if (!store) {
    throw new Error(
      `MapModeStore not found for map instance: ${actualId}. Ensure a store has been created for this map instance (e.g., via MapProvider or getOrCreateStore).`,
    );
  }

  // Subscribe to store using useSyncExternalStore
  const mode = useSyncExternalStore(store.subscribe, store.getSnapshot);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      mode,
      requestModeChange: store.requestModeChange,
    }),
    [mode, store],
  );
}
