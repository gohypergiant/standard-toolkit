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
'use client';

import 'client-only';
import { useContext, useMemo } from 'react';
import { MapContext } from '../deckgl/base-map/provider';
import { modeStore } from './store';
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
 * This hook uses `useSyncExternalStore` to subscribe to map mode state changes,
 * providing concurrent-safe mode state updates. Uses a fan-out pattern where
 * a single bus listener per map instance notifies N React component subscribers.
 *
 * @param id - Optional map instance ID. If not provided, will use the ID from `MapContext`.
 * @returns The current map mode and requestModeChange function
 * @throws Error if no `id` is provided and hook is used outside of `MapProvider`
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

  // Use selector to get just the mode string (primitive comparison works with useSyncExternalStore)
  const mode = modeStore.useSelector(actualId, (state) => state.mode);

  // Get actions separately (stable reference)
  const { requestModeChange } = modeStore.actions(actualId);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      mode,
      requestModeChange,
    }),
    [mode, requestModeChange],
  );
}
