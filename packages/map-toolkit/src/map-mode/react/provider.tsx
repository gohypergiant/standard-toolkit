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
import { uuid } from '@accelint/core';
import { createContext, type ReactNode, useEffect, useRef } from 'react';
import { destroyStore, getOrCreateStore } from '../store';
import type { UniqueId } from '@accelint/core';

/**
 * React context for map instance ID.
 * Use the `useMapMode` hook to access the map mode state.
 */
export const MapIdContext = createContext<UniqueId | null>(null);

/**
 * Props for the MapIdProvider component.
 */
export type MapIdProviderProps = {
  /** Child components that will have access to map mode context */
  children: ReactNode;
  /** The default mode to start with. Defaults to 'default' */
  defaultMode?: string;
  /**
   * Optional unique identifier for this map instance.
   *
   * Used to isolate mode changes between different map instances (e.g., main map vs minimap).
   * If not provided, a unique ID is automatically generated.
   *
   * @example
   * ```tsx
   * // Multiple independent map instances
   * <MapIdProvider mapId="main-map-uuid-123">
   *   <BaseMap />
   *   <Toolbar />
   * </MapIdProvider>
   *
   * <MapIdProvider mapId="minimap-uuid-456">
   *   <BaseMap />
   * </MapIdProvider>
   * ```
   */
  mapId?: UniqueId;
};

const DEFAULT_MODE = 'default';

/**
 * Provider component for managing map modes with ownership and authorization.
 *
 * This component uses a hybrid architecture combining React Context (for map instance identity)
 * with an external observable store (for state management). The provider:
 * - Provides a unique `mapInstanceId` via Context
 * - Creates an isolated MapModeStore instance for this map
 * - Allows components to subscribe to mode changes via `useMapMode` hook (which uses `useSyncExternalStore`)
 *
 * The external store manages a state machine for map modes where components can request
 * mode changes with ownership. When a mode is owned by a component, other components
 * must request authorization to change to a different mode. The store handles:
 *
 * - Automatic mode changes when no ownership conflicts exist
 * - Authorization flow when switching between owned modes
 * - Per-mode ownership tracking that persists throughout the session
 * - Pending request management (one pending request per requester)
 * - Auto-acceptance of first pending request when mode owner returns to default
 * - Auto-rejection of other pending requests when one is approved
 * - Event emission through a centralized event bus
 * - Instance isolation for multiple map scenarios (main map + minimap)
 *
 * ## Instance Isolation
 *
 * Each MapIdProvider instance operates independently. Mode changes in one instance
 * do not affect other instances, even when multiple maps are rendered on the same page.
 * This enables scenarios like:
 * - Main map in "drawing" mode while minimap stays in "view" mode
 * - Multiple independent map views with different interaction modes
 *
 * Events are scoped to specific instances using an instanceId that is either provided
 * via the `mapId` prop or auto-generated. The event bus filters events to ensure each
 * provider only responds to events for its own instance.
 *
 * ## Pending Request Behavior
 *
 * - Pending requests are stored by requester ID (not mode owner)
 * - Each requester can have only one pending request at a time
 * - New requests from the same requester auto-replace previous requests
 * - Pending requests persist when mode owner switches between their own modes
 * - When any request is approved, all other pending requests are auto-rejected
 * - When mode owner returns to default mode:
 *   - If first pending request is for default mode, all pending requests are rejected (already in requested mode)
 *   - If first pending request is for a different mode, that request is auto-approved and others are rejected
 *
 * @param props - Provider props including children, optional defaultMode, and optional mapId
 * @returns Provider component that wraps children with map instance identity context
 *
 * @example
 * Basic usage:
 * ```tsx
 * import { MapIdProvider } from '@accelint/map-toolkit/map-mode/react';
 *
 * function App() {
 *   return (
 *     <MapIdProvider defaultMode="view">
 *       <MapView />
 *     </MapIdProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple independent map instances with unique IDs
 * <MapIdProvider mapId="main-map-uuid-abc" defaultMode="drawing">
 *   <BaseMap />
 *   <Toolbar />
 * </MapIdProvider>
 *
 * <MapIdProvider mapId="minimap-uuid-xyz" defaultMode="view">
 *   <BaseMap />
 * </MapIdProvider>
 *
 * // With authorization handling - include mapInstanceId
 * useOn(MapModeEvents.changeAuthorization, (event) => {
 *   const { authId, mapInstanceId } = event.payload;
 *   emitDecision({ authId, approved: true, owner: 'tool', mapInstanceId });
 * });
 * ```
 */
export function MapIdProvider({
  children,
  defaultMode = DEFAULT_MODE,
  mapId,
}: MapIdProviderProps) {
  // Generate stable instance ID (only once per provider mount)
  const autoIdRef = useRef<UniqueId>(null);
  if (!autoIdRef.current) {
    autoIdRef.current = uuid();
  }
  const mapInstanceId: UniqueId = mapId ?? autoIdRef.current;

  // Create or get the store for this map instance synchronously
  // This must happen before any child components try to use useMapMode
  const storeRef = useRef<boolean>(false);
  if (!storeRef.current) {
    getOrCreateStore(mapInstanceId, defaultMode);
    storeRef.current = true;
  }

  // Cleanup: destroy store when provider unmounts
  useEffect(() => {
    return () => {
      destroyStore(mapInstanceId);
    };
  }, [mapInstanceId]);

  return (
    <MapIdContext.Provider value={mapInstanceId}>
      {children}
    </MapIdContext.Provider>
  );
}
