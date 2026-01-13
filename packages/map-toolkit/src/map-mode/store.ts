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
 * Map Mode Store
 *
 * Manages mode state with ownership-based authorization.
 *
 * @example
 * ```tsx
 * import { modeStore } from '@accelint/map-toolkit/map-mode';
 *
 * function MapControls({ mapId }) {
 *   const { state, requestModeChange } = modeStore.use(mapId);
 *
 *   return (
 *     <div>
 *       <p>Current mode: {state.mode}</p>
 *       <button onClick={() => requestModeChange('draw', 'draw-layer')}>
 *         Draw Mode
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */

import { Broadcast } from '@accelint/bus';
import { uuid } from '@accelint/core';
import { getLogger } from '@accelint/logger';
import {
  createMapStore,
  mapClear,
  mapDelete,
  mapSet,
} from '../shared/create-map-store';
import { MapModeEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { StoreHelpers } from '../shared/create-map-store';
import type { MapModeEventType, ModeChangeDecisionPayload } from './types';

const logger = getLogger({
  enabled:
    process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  level: 'warn',
  prefix: '[MapMode]',
  pretty: true,
});

const DEFAULT_MODE = 'default';

/**
 * Typed event bus instance for map mode events.
 */
const mapModeBus = Broadcast.getInstance<MapModeEventType>();

/**
 * Internal type for tracking pending authorization requests.
 */
type PendingRequest = {
  authId: string;
  desiredMode: string;
  currentMode: string;
  requestOwner: string;
};

/**
 * State shape for map mode
 */
type MapModeState = {
  mode: string;
  modeOwners: Map<string, string>;
  pendingRequests: Map<string, PendingRequest>;
};

/**
 * Actions for map mode
 */
type MapModeActions = {
  /** Request a mode change */
  requestModeChange: (desiredMode: string, requestOwner: string) => void;
};

/**
 * Determine if a mode change request should be auto-accepted without authorization
 */
function shouldAutoAcceptRequest(
  state: MapModeState,
  desiredMode: string,
  requestOwner: string,
): boolean {
  const currentModeOwner = state.modeOwners.get(state.mode);
  const desiredModeOwner = state.modeOwners.get(desiredMode);

  // Owner returning to default mode
  if (desiredMode === DEFAULT_MODE && requestOwner === currentModeOwner) {
    return true;
  }

  // Owner switching between their own modes
  if (requestOwner === currentModeOwner) {
    return true;
  }

  // No ownership conflicts exist
  if (!(currentModeOwner || desiredModeOwner)) {
    return true;
  }

  // Entering an owned mode from default mode
  if (state.mode === DEFAULT_MODE && requestOwner === desiredModeOwner) {
    return true;
  }

  return false;
}

/**
 * Approve a request and reject all others (immutable update)
 */
function approveRequestAndRejectOthers(
  instanceId: UniqueId,
  state: MapModeState,
  approvedRequest: PendingRequest,
  excludeAuthId: string,
  decisionOwner: string,
  reason: string,
  emitApproval: boolean,
  set: StoreHelpers<MapModeState>['set'],
): void {
  // Collect all other pending requests to emit rejections for
  const requestsToReject: PendingRequest[] = [];
  for (const request of state.pendingRequests.values()) {
    if (request.authId !== excludeAuthId) {
      requestsToReject.push(request);
    }
  }

  // Build immutable updates: clear pending requests, update owners
  const newModeOwners =
    approvedRequest.desiredMode !== DEFAULT_MODE
      ? mapSet(
          state.modeOwners,
          approvedRequest.desiredMode,
          approvedRequest.requestOwner,
        )
      : state.modeOwners;

  // Immutable update: clear pending requests, update owners, change mode
  set({
    mode: approvedRequest.desiredMode,
    pendingRequests: mapClear<string, PendingRequest>(),
    modeOwners: newModeOwners,
  });

  // Emit mode changed event
  mapModeBus.emit(MapModeEvents.changed, {
    previousMode: state.mode,
    currentMode: approvedRequest.desiredMode,
    id: instanceId,
  });

  // Emit approval decision if requested
  if (emitApproval) {
    mapModeBus.emit(MapModeEvents.changeDecision, {
      authId: approvedRequest.authId,
      approved: true,
      owner: decisionOwner,
      reason,
      id: instanceId,
    });
  }

  // Emit rejection events for all other pending requests
  for (const request of requestsToReject) {
    mapModeBus.emit(MapModeEvents.changeDecision, {
      authId: request.authId,
      approved: false,
      owner: decisionOwner,
      reason: 'Request auto-rejected because another request was approved',
      id: instanceId,
    });
  }
}

/**
 * Handle pending requests when returning to default mode (immutable update)
 */
function handlePendingRequestsOnDefaultMode(
  instanceId: UniqueId,
  state: MapModeState,
  previousMode: string,
  set: StoreHelpers<MapModeState>['set'],
): void {
  const firstEntry = Array.from(state.pendingRequests.values())[0];
  if (!firstEntry) {
    return;
  }

  const previousModeOwner = state.modeOwners.get(previousMode);

  if (!previousModeOwner) {
    return;
  }

  // If the first pending request is for default mode, reject all requests
  if (firstEntry.desiredMode === DEFAULT_MODE) {
    const allRequests = Array.from(state.pendingRequests.values());

    // Immutable update: clear pending requests
    set({ pendingRequests: mapClear<string, PendingRequest>() });

    for (const request of allRequests) {
      mapModeBus.emit(MapModeEvents.changeDecision, {
        authId: request.authId,
        approved: false,
        owner: previousModeOwner,
        reason: 'Request rejected - already in requested mode',
        id: instanceId,
      } satisfies ModeChangeDecisionPayload);
    }
  } else {
    // Auto-accept the first pending request for a different mode
    approveRequestAndRejectOthers(
      instanceId,
      state,
      firstEntry,
      firstEntry.authId,
      previousModeOwner,
      'Auto-accepted when mode owner returned to default',
      true,
      set,
    );
  }
}

/**
 * Handle authorization decision (immutable update)
 */
function handleAuthorizationDecision(
  instanceId: UniqueId,
  state: MapModeState,
  payload: {
    approved: boolean;
    authId: string;
    owner: string;
  },
  set: StoreHelpers<MapModeState>['set'],
): void {
  const { approved, authId, owner: decisionOwner } = payload;

  // Verify decision is from current mode's owner
  const currentModeOwner = state.modeOwners.get(state.mode);
  if (decisionOwner !== currentModeOwner) {
    logger.warn(
      `Authorization decision from "${decisionOwner}" ignored - not the owner of mode "${state.mode}" (owner: ${currentModeOwner || 'none'})`,
    );
    return;
  }

  // Find the request with matching authId
  let matchingRequestOwner: string | null = null;
  let matchingRequest: PendingRequest | null = null;

  for (const [requestOwner, request] of state.pendingRequests.entries()) {
    if (request.authId === authId) {
      matchingRequestOwner = requestOwner;
      matchingRequest = request;
      break;
    }
  }

  if (!(matchingRequest && matchingRequestOwner)) {
    return;
  }

  if (approved) {
    approveRequestAndRejectOthers(
      instanceId,
      state,
      matchingRequest,
      authId,
      decisionOwner,
      '',
      false,
      set,
    );
  } else {
    // Immutable update: remove the rejected request
    set({
      pendingRequests: mapDelete(state.pendingRequests, matchingRequestOwner),
    });
  }
}

/**
 * Handle mode change request logic (immutable update)
 */
function handleModeChangeRequest(
  instanceId: UniqueId,
  state: MapModeState,
  desiredMode: string,
  requestOwner: string,
  set: StoreHelpers<MapModeState>['set'],
): void {
  const desiredModeOwner = state.modeOwners.get(desiredMode);

  // Check if this request should be auto-accepted
  if (shouldAutoAcceptRequest(state, desiredMode, requestOwner)) {
    // Build immutable updates
    const newModeOwners =
      desiredMode !== DEFAULT_MODE && !desiredModeOwner
        ? mapSet(state.modeOwners, desiredMode, requestOwner)
        : state.modeOwners;

    // Clear requester's pending request since mode changed successfully
    const newPendingRequests = mapDelete(state.pendingRequests, requestOwner);

    const previousMode = state.mode;

    // Immutable update
    set({
      mode: desiredMode,
      modeOwners: newModeOwners,
      pendingRequests: newPendingRequests,
    });

    mapModeBus.emit(MapModeEvents.changed, {
      previousMode,
      currentMode: desiredMode,
      id: instanceId,
    });

    return;
  }

  // Otherwise, send authorization request
  const authId = uuid();

  // Immutable update: add pending request
  set({
    pendingRequests: mapSet(state.pendingRequests, requestOwner, {
      authId,
      desiredMode,
      currentMode: state.mode,
      requestOwner,
    }),
  });

  mapModeBus.emit(MapModeEvents.changeAuthorization, {
    authId,
    desiredMode,
    currentMode: state.mode,
    id: instanceId,
  });
}

/**
 * Map mode store
 */
export const modeStore = createMapStore<MapModeState, MapModeActions>({
  name: 'mode',
  defaultState: {
    mode: DEFAULT_MODE,
    modeOwners: new Map(),
    pendingRequests: new Map(),
  },

  actions: (instanceId) => ({
    requestModeChange: (desiredMode: string, requestOwner: string) => {
      const trimmedDesiredMode = desiredMode.trim();
      const trimmedRequestOwner = requestOwner.trim();

      if (!trimmedDesiredMode) {
        throw new Error('requestModeChange requires non-empty desiredMode');
      }
      if (!trimmedRequestOwner) {
        throw new Error('requestModeChange requires non-empty requestOwner');
      }

      mapModeBus.emit(MapModeEvents.changeRequest, {
        desiredMode: trimmedDesiredMode,
        owner: trimmedRequestOwner,
        id: instanceId,
      });
    },
  }),

  bus: (instanceId, { get, set }) => {
    // Listen for mode change requests
    const unsubRequest = mapModeBus.on(MapModeEvents.changeRequest, (event) => {
      const { desiredMode, owner: requestOwner, id } = event.payload;

      const state = get();
      // Filter: only handle if targeted at this map
      if (id !== instanceId || desiredMode === state.mode) {
        return;
      }

      handleModeChangeRequest(
        instanceId,
        state,
        desiredMode,
        requestOwner,
        set,
      );
    });

    // Listen for authorization decisions
    const unsubDecision = mapModeBus.on(
      MapModeEvents.changeDecision,
      (event) => {
        const { id, approved, authId, owner } = event.payload;

        // Filter: only handle if targeted at this map
        if (id !== instanceId) {
          return;
        }

        handleAuthorizationDecision(
          instanceId,
          get(),
          { approved, authId, owner },
          set,
        );
      },
    );

    // Listen for mode changes to handle pending requests
    const unsubChanged = mapModeBus.on(MapModeEvents.changed, (event) => {
      const { currentMode, previousMode, id } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== instanceId) {
        return;
      }

      const state = get();
      // When mode owner changes to default mode, handle pending requests
      if (currentMode === DEFAULT_MODE && state.pendingRequests.size > 0) {
        handlePendingRequestsOnDefaultMode(
          instanceId,
          state,
          previousMode,
          set,
        );
      }
    });

    return () => {
      unsubRequest();
      unsubDecision();
      unsubChanged();
    };
  },
});

// =============================================================================
// Convenience exports
// =============================================================================

/**
 * Get the current mode for a map instance
 */
export function getMode(mapId: UniqueId): string {
  return modeStore.get(mapId).mode;
}

/**
 * Hook for current mode value
 */
export function useMode(mapId: UniqueId): string {
  return modeStore.useSelector(mapId, (state) => state.mode);
}

/**
 * Get the owner of the current mode for a given map instance
 * @internal - For internal map-toolkit use only
 */
export function getCurrentModeOwner(instanceId: UniqueId): string | undefined {
  const state = modeStore.get(instanceId);
  return state.modeOwners.get(state.mode);
}

/**
 * Check if a given owner is registered as the owner of any mode.
 * This includes both active mode owners and pending mode requests.
 * @internal - For internal map-toolkit use only
 */
export function isRegisteredModeOwner(
  instanceId: UniqueId,
  owner: string,
): boolean {
  const state = modeStore.get(instanceId);

  // Check active mode owners
  for (const modeOwner of state.modeOwners.values()) {
    if (modeOwner === owner) {
      return true;
    }
  }

  // Check pending mode requests (owner is the key in pendingRequests map)
  if (state.pendingRequests.has(owner)) {
    return true;
  }

  return false;
}

/**
 * Manually clear map mode state for a specific instanceId.
 */
export function clearMapModeState(instanceId: UniqueId): void {
  modeStore.clear(instanceId);
}
