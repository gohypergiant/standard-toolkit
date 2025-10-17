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
import { useEmit, useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MapModeEvents } from './events';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
  ModeChangeRequestEvent,
} from './types';

/**
 * Internal type for tracking pending authorization requests.
 * @internal
 */
type PendingRequest = {
  desiredMode: string;
  currentMode: string;
  owner: string;
};

/**
 * Context value provided by MapModeProvider to consumers.
 */
export type MapModeContextValue = {
  /** The current active map mode */
  mode: string;
  /** Function to request a mode change with ownership */
  requestModeChange: (desiredMode: string, requestOwner: string) => void;
};

/**
 * React context for map mode state.
 * Use the `useMapMode` hook to access this context.
 */
export const MapModeContext = createContext<MapModeContextValue | null>(null);

/**
 * Props for the MapModeProvider component.
 */
export type MapModeProviderProps = {
  /** Child components that will have access to map mode context */
  children: ReactNode;
  /** The default mode to start with. Defaults to 'default' */
  defaultMode?: string;
};

const DEFAULT_MODE = 'default';

/**
 * Provider component for managing map modes with ownership and authorization.
 *
 * This component manages a state machine for map modes where components can request
 * mode changes with ownership. When a mode is owned by a component, other components
 * must request authorization to change to a different mode. The provider handles:
 *
 * - Automatic mode changes when no ownership conflicts exist
 * - Authorization flow when switching between owned modes
 * - Per-mode ownership tracking that persists throughout the session
 * - Event emission through a centralized event bus
 *
 * @param props - Provider props including children and optional defaultMode
 * @returns Provider component that wraps children with map mode context
 *
 * @example
 * Basic usage:
 * ```tsx
 * import { MapModeProvider } from '@accelint/map-toolkit/deckgl';
 *
 * function App() {
 *   return (
 *     <MapModeProvider defaultMode="view">
 *       <MapView />
 *     </MapModeProvider>
 *   );
 * }
 * ```
 *
 * @example
 * With authorization handling:
 * ```tsx
 * import { MapModeProvider, useMapMode } from '@accelint/map-toolkit/deckgl';
 * import { useOn, useEmit } from '@accelint/bus/react';
 * import { MapModeEvents } from '@accelint/map-toolkit/deckgl';
 *
 * function DrawingTool() {
 *   const { requestModeChange } = useMapMode();
 *   const emitDecision = useEmit(MapModeEvents.changeDecision);
 *
 *   // Listen for authorization requests
 *   useOn(MapModeEvents.changeAuthorization, (event) => {
 *     const { authId, desiredMode } = event.payload;
 *     // Approve or reject the request
 *     emitDecision({ authId, approved: true, owner: 'drawing-tool' });
 *   });
 *
 *   return (
 *     <button onClick={() => requestModeChange('drawing', 'drawing-tool')}>
 *       Start Drawing
 *     </button>
 *   );
 * }
 * ```
 */
export function MapModeProvider({
  children,
  defaultMode = DEFAULT_MODE,
}: MapModeProviderProps) {
  const [mode, setMode] = useState(defaultMode);
  // Store mode-to-owner mappings (persists throughout session, no re-renders needed)
  const modeOwnersRef = useRef<Map<string, string>>(new Map());
  // Store pending authorization requests by authId (no re-renders needed)
  const pendingRequestsRef = useRef<Map<string, PendingRequest>>(new Map());

  const emitChanged = useEmit<ModeChangedEvent>(MapModeEvents.changed);
  const emitAuthorization = useEmit<ModeChangeAuthorizationEvent>(
    MapModeEvents.changeAuthorization,
  );
  const emitRequest = useEmit<ModeChangeRequestEvent>(
    MapModeEvents.changeRequest,
  );

  // Centralized listener for mode change requests
  useOn<ModeChangeRequestEvent>(
    MapModeEvents.changeRequest,
    (event: ModeChangeRequestEvent) => {
      const { desiredMode, owner: requestOwner } = event.payload;

      // If current mode is same as desired, no change needed
      if (desiredMode === mode) {
        return;
      }

      // Get current mode's owner from the mapping
      const currentModeOwner = modeOwnersRef.current.get(mode);
      // Get desired mode's owner from the mapping
      const desiredModeOwner = modeOwnersRef.current.get(desiredMode);

      // Auto-accept if:
      // 1. Desired mode is 'default' AND requesting owner is the current mode owner
      // 2. Requesting owner is same as current mode owner, OR
      // 3. No current or desired mode owner, OR
      // 4. In default mode and the requester is the owner of the desired mode
      if (
        (desiredMode === defaultMode && requestOwner === currentModeOwner) ||
        requestOwner === currentModeOwner ||
        !(currentModeOwner || desiredModeOwner) ||
        (mode === defaultMode && requestOwner === desiredModeOwner)
      ) {
        setMode(desiredMode);
        emitChanged({
          previousMode: mode,
          currentMode: desiredMode,
        });

        // Store the desired mode's owner unless it's default (which stays ownerless),
        // and there's not another mode owner already
        if (desiredMode !== defaultMode && !desiredModeOwner) {
          modeOwnersRef.current.set(desiredMode, requestOwner);
        }

        // Clear any pending authorization requests since mode changed successfully
        pendingRequestsRef.current.clear();
        return;
      }

      // Otherwise, send authorization request
      // Generate authId and store the request for later lookup
      const authId = uuid();

      // Clear any existing pending requests and add the new one (only one pending request at a time)
      pendingRequestsRef.current.clear();
      pendingRequestsRef.current.set(authId, {
        desiredMode,
        currentMode: mode,
        owner: requestOwner,
      });

      emitAuthorization({
        authId,
        desiredMode,
        currentMode: mode,
      });
    },
  );

  // Centralized listener for authorization decisions
  useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
    const { approved, authId, owner: decisionOwner } = event.payload;

    // Lookup the request by authId
    const request = pendingRequestsRef.current.get(authId);
    if (!request) {
      // Unknown or stale authId, ignore
      return;
    }

    // Verify decision is from current mode's owner
    const currentModeOwner = modeOwnersRef.current.get(mode);
    if (decisionOwner !== currentModeOwner) {
      // Unauthorized decision, ignore (noop)
      return;
    }

    if (approved) {
      const previousMode = mode;
      setMode(request.desiredMode);
      emitChanged({
        previousMode,
        currentMode: request.desiredMode,
      });

      // Store the new mode's owner
      modeOwnersRef.current.set(request.desiredMode, request.owner);
    }

    // Remove the processed request
    pendingRequestsRef.current.delete(authId);
  });

  const requestModeChange = useCallback(
    (desiredMode: string, requestOwner: string) => {
      // Validate inputs
      if (!desiredMode) {
        throw new Error('requestModeChange requires non-empty desiredMode');
      }
      if (!requestOwner) {
        throw new Error('requestModeChange requires non-empty requestOwner');
      }

      emitRequest({
        desiredMode,
        owner: requestOwner,
      });
    },
    [emitRequest],
  );

  const value = useMemo(
    () => ({
      mode,
      requestModeChange,
    }),
    [mode, requestModeChange],
  );

  return (
    <MapModeContext.Provider value={value}>{children}</MapModeContext.Provider>
  );
}
