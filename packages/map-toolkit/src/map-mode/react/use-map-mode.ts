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
import { getStore } from '../store';
import { MapIdContext } from './provider';
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
 * - Map instance identity (from `MapIdContext` or parameter)
 * - Mode state management (from `MapModeStore` via `useSyncExternalStore`)
 *
 * @param mapInstanceId - Optional map instance ID. If not provided, will use the ID from `MapIdContext`.
 * @returns The current map mode and requestModeChange function
 * @throws Error if no `mapInstanceId` is provided and hook is used outside of `MapIdProvider`
 * @throws Error if store doesn't exist for the given instance ID
 *
 * @example
 * ```tsx
 * // Inside MapIdProvider - uses context
 * function MyLayer() {
 *   const { mode, requestModeChange } = useMapMode();
 *
 *   const handleClick = () => {
 *     requestModeChange('editing', 'my-layer-uuid');
 *   };
 *
 *   return <div>Current mode: {mode}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Outside MapIdProvider - pass mapInstanceId directly
 * function ExternalControl({ mapId }: { mapId: UniqueId }) {
 *   const { mode, requestModeChange } = useMapMode(mapId);
 *
 *   return <button onClick={() => requestModeChange('default', 'external')}>
 *     Reset to Default (current: {mode})
 *   </button>;
 * }
 * ```
 */
export function useMapMode(mapInstanceId?: UniqueId): UseMapModeReturn {
  const contextId = useContext(MapIdContext);
  const actualId = mapInstanceId ?? contextId;

  if (!actualId) {
    throw new Error(
      'useMapMode requires either a mapInstanceId parameter or to be used within a MapIdProvider',
    );
  }

  // Get the store for this map instance
  const store = getStore(actualId);

  if (!store) {
    throw new Error(
      `MapModeStore not found for instance: ${actualId}. Ensure a store has been created for this map instance (e.g., via MapIdProvider or getOrCreateStore).`,
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
