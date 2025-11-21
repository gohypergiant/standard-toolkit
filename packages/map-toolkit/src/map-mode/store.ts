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

import { Broadcast } from '@accelint/bus';
import { uuid } from '@accelint/core';
import { MapModeEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { MapModeEventType, ModeChangeDecisionPayload } from './types';

const DEFAULT_MODE = 'default';

/**
 * Typed event bus instance for map mode events.
 * Provides type-safe event emission and listening for all map mode state changes.
 */
const mapModeBus = Broadcast.getInstance<MapModeEventType>();

/**
 * Internal type for tracking pending authorization requests.
 * @internal
 */
type PendingRequest = {
  authId: string;
  desiredMode: string;
  currentMode: string;
  requestOwner: string;
};

/**
 * Type representing the state for a single map mode instance
 */
type MapModeState = {
  mode: string;
  modeOwners: Map<string, string>;
  pendingRequests: Map<string, PendingRequest>;
};

/**
 * Store for map mode state keyed by instanceId
 */
const modeStore = new Map<UniqueId, MapModeState>();

/**
 * Track React component subscribers per instanceId (for fan-out notifications).
 * Each Set contains onStoreChange callbacks from useSyncExternalStore.
 */
const componentSubscribers = new Map<UniqueId, Set<() => void>>();

/**
 * Cache of bus unsubscribe functions (1 per instanceId).
 * This ensures we only have one bus listener per map mode instance, regardless of
 * how many React components subscribe to it.
 */
const busUnsubscribers = new Map<UniqueId, () => void>();

type Subscription = (onStoreChange: () => void) => () => void;
/**
 * Cache of subscription functions per instanceId to avoid recreating on every render
 */
const subscriptionCache = new Map<UniqueId, Subscription>();

/**
 * Cache of snapshot functions per instanceId to maintain referential stability
 */
const snapshotCache = new Map<UniqueId, () => string>();

/**
 * Cache of requestModeChange functions per instanceId to maintain referential stability
 */
const requestModeChangeCache = new Map<
  UniqueId,
  (desiredMode: string, requestOwner: string) => void
>();

/**
 * Get or create mode state for a given instanceId
 */
function getOrCreateState(instanceId: UniqueId): MapModeState {
  if (!modeStore.has(instanceId)) {
    modeStore.set(instanceId, {
      mode: DEFAULT_MODE,
      modeOwners: new Map(),
      pendingRequests: new Map(),
    });
  }
  // biome-ignore lint/style/noNonNullAssertion: State guaranteed to exist after has() check above
  return modeStore.get(instanceId)!;
}

/**
 * Notify all React subscribers for a given instanceId
 */
function notifySubscribers(instanceId: UniqueId): void {
  const subscribers = componentSubscribers.get(instanceId);
  if (subscribers) {
    for (const onStoreChange of subscribers) {
      onStoreChange();
    }
  }
}

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
 * Set mode and emit change event
 */
function setMode(
  instanceId: UniqueId,
  state: MapModeState,
  newMode: string,
): void {
  const previousMode = state.mode;
  state.mode = newMode;

  mapModeBus.emit(MapModeEvents.changed, {
    previousMode,
    currentMode: newMode,
    id: instanceId,
  });

  notifySubscribers(instanceId);
}

/**
 * Approve a request and reject all others
 */
function approveRequestAndRejectOthers(
  instanceId: UniqueId,
  state: MapModeState,
  approvedRequest: PendingRequest,
  excludeAuthId: string,
  decisionOwner: string,
  reason: string,
  emitApproval: boolean,
): void {
  // Collect all other pending requests to emit rejections for
  const requestsToReject: PendingRequest[] = [];
  for (const request of state.pendingRequests.values()) {
    if (request.authId !== excludeAuthId) {
      requestsToReject.push(request);
    }
  }

  // Clear all pending requests BEFORE changing mode
  state.pendingRequests.clear();

  // Change mode
  setMode(instanceId, state, approvedRequest.desiredMode);

  // Store the new mode's owner (unless it's default mode)
  if (approvedRequest.desiredMode !== DEFAULT_MODE) {
    state.modeOwners.set(
      approvedRequest.desiredMode,
      approvedRequest.requestOwner,
    );
  }

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
 * Handle pending requests when returning to default mode
 */
function handlePendingRequestsOnDefaultMode(
  instanceId: UniqueId,
  state: MapModeState,
  previousMode: string,
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
    state.pendingRequests.clear();

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
    );
  }
}

/**
 * Handle authorization decision
 *
 * Processes approval/rejection decisions from mode owners. Only the current mode's owner
 * can make authorization decisions. If a decision comes from a non-owner, a warning is
 * logged and the decision is ignored to prevent unauthorized mode changes.
 *
 * @param instanceId - The unique identifier for this map instance
 * @param state - The mode state for this instance
 * @param payload - The authorization decision containing authId, approved status, and owner
 */
function handleAuthorizationDecision(
  instanceId: UniqueId,
  state: MapModeState,
  payload: {
    approved: boolean;
    authId: string;
    owner: string;
  },
): void {
  const { approved, authId, owner: decisionOwner } = payload;

  // Verify decision is from current mode's owner
  // Logs a warning if unauthorized component attempts to make decisions
  const currentModeOwner = state.modeOwners.get(state.mode);
  if (decisionOwner !== currentModeOwner) {
    console.warn(
      `[MapMode] Authorization decision from "${decisionOwner}" ignored - not the owner of mode "${state.mode}" (owner: ${currentModeOwner || 'none'})`,
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
    );
  } else {
    state.pendingRequests.delete(matchingRequestOwner);
  }
}

/**
 * Handle mode change request logic
 */
function handleModeChangeRequest(
  instanceId: UniqueId,
  state: MapModeState,
  desiredMode: string,
  requestOwner: string,
): void {
  const desiredModeOwner = state.modeOwners.get(desiredMode);

  // Check if this request should be auto-accepted
  if (shouldAutoAcceptRequest(state, desiredMode, requestOwner)) {
    setMode(instanceId, state, desiredMode);

    // Store the desired mode's owner unless it's default
    if (desiredMode !== DEFAULT_MODE && !desiredModeOwner) {
      state.modeOwners.set(desiredMode, requestOwner);
    }

    // Clear requester's pending request since mode changed successfully
    state.pendingRequests.delete(requestOwner);
    return;
  }

  // Otherwise, send authorization request
  const authId = uuid();

  state.pendingRequests.set(requestOwner, {
    authId,
    desiredMode,
    currentMode: state.mode,
    requestOwner,
  });

  mapModeBus.emit(MapModeEvents.changeAuthorization, {
    authId,
    desiredMode,
    currentMode: state.mode,
    id: instanceId,
  });
}

/**
 * Ensures a single bus listener exists for the given instanceId.
 * All React subscribers will be notified via fan-out when the bus events fire.
 * This prevents creating N bus listeners for N React components.
 *
 * @param instanceId - The unique identifier for the map mode instance
 */
function ensureBusListener(instanceId: UniqueId): void {
  if (busUnsubscribers.has(instanceId)) {
    return; // Already listening
  }

  const state = getOrCreateState(instanceId);

  // Listen for mode change requests
  const unsubRequest = mapModeBus.on(MapModeEvents.changeRequest, (event) => {
    const { desiredMode, owner: requestOwner, id } = event.payload;

    // Filter: only handle if targeted at this map
    if (id !== instanceId || desiredMode === state.mode) {
      return;
    }

    handleModeChangeRequest(instanceId, state, desiredMode, requestOwner);
  });

  // Listen for authorization decisions
  const unsubDecision = mapModeBus.on(MapModeEvents.changeDecision, (event) => {
    const { id, approved, authId, owner } = event.payload;

    // Filter: only handle if targeted at this map
    if (id !== instanceId) {
      return;
    }

    handleAuthorizationDecision(instanceId, state, { approved, authId, owner });
  });

  // Listen for mode changes to handle pending requests
  const unsubChanged = mapModeBus.on(MapModeEvents.changed, (event) => {
    const { currentMode, previousMode, id } = event.payload;

    // Filter: only handle if targeted at this map
    if (id !== instanceId) {
      return;
    }

    // When mode owner changes to default mode, handle pending requests
    if (currentMode === DEFAULT_MODE && state.pendingRequests.size > 0) {
      handlePendingRequestsOnDefaultMode(instanceId, state, previousMode);
    }
  });

  // Store composite cleanup function
  busUnsubscribers.set(instanceId, () => {
    unsubRequest();
    unsubDecision();
    unsubChanged();
  });
}

/**
 * Cleans up the bus listener if no React subscribers remain.
 *
 * @param instanceId - The unique identifier for the map mode instance
 */
function cleanupBusListenerIfNeeded(instanceId: UniqueId): void {
  const subscribers = componentSubscribers.get(instanceId);

  if (!subscribers || subscribers.size === 0) {
    // No more React subscribers - clean up bus listener
    const unsub = busUnsubscribers.get(instanceId);
    if (unsub) {
      unsub();
      busUnsubscribers.delete(instanceId);
    }

    // Clean up all state
    modeStore.delete(instanceId);
    componentSubscribers.delete(instanceId);
    subscriptionCache.delete(instanceId);
    snapshotCache.delete(instanceId);
    requestModeChangeCache.delete(instanceId);
  }
}

/**
 * Creates or retrieves a cached subscription function for a given instanceId.
 * Uses a fan-out pattern: 1 bus listener -> N React subscribers.
 * Automatically cleans up map mode state when the last subscriber unsubscribes.
 *
 * @param instanceId - The unique identifier for the map mode instance
 * @returns A subscription function for useSyncExternalStore
 */
export function getOrCreateSubscription(
  instanceId: UniqueId,
): (onStoreChange: () => void) => () => void {
  const subscription =
    subscriptionCache.get(instanceId) ??
    ((onStoreChange: () => void) => {
      // Ensure state exists
      getOrCreateState(instanceId);

      // Ensure single bus listener exists for this instanceId
      ensureBusListener(instanceId);

      // Get or create the subscriber set for this map instance, then add this component's callback
      let subscriberSet = componentSubscribers.get(instanceId);
      if (!subscriberSet) {
        subscriberSet = new Set();
        componentSubscribers.set(instanceId, subscriberSet);
      }
      subscriberSet.add(onStoreChange);

      // Return cleanup function to remove this component's subscription
      return () => {
        const currentSubscriberSet = componentSubscribers.get(instanceId);
        if (currentSubscriberSet) {
          currentSubscriberSet.delete(onStoreChange);
        }

        // Clean up bus listener if this was the last React subscriber
        cleanupBusListenerIfNeeded(instanceId);
      };
    });

  subscriptionCache.set(instanceId, subscription);

  return subscription;
}

/**
 * Creates or retrieves a cached snapshot function for a given instanceId.
 * The string returned gets equality checked, so it needs to be stable or React re-renders unnecessarily.
 *
 * @param instanceId - The unique identifier for the map mode instance
 * @returns A snapshot function for useSyncExternalStore
 */
export function getOrCreateSnapshot(instanceId: UniqueId): () => string {
  const snapshot =
    snapshotCache.get(instanceId) ??
    (() => {
      const state = modeStore.get(instanceId);
      if (!state) {
        return DEFAULT_MODE;
      }
      return state.mode;
    });

  snapshotCache.set(instanceId, snapshot);

  return snapshot;
}

/**
 * Creates or retrieves a cached requestModeChange function for a given instanceId.
 * This maintains referential stability for the function reference.
 *
 * @param instanceId - The unique identifier for the map mode instance
 * @returns A requestModeChange function for this instance
 */
export function getOrCreateRequestModeChange(
  instanceId: UniqueId,
): (desiredMode: string, requestOwner: string) => void {
  const requestModeChange =
    requestModeChangeCache.get(instanceId) ??
    ((desiredMode: string, requestOwner: string) => {
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
    });

  requestModeChangeCache.set(instanceId, requestModeChange);

  return requestModeChange;
}

/**
 * Get the owner of the current mode for a given map instance
 * @internal - For internal map-toolkit use only
 */
export function getCurrentModeOwner(instanceId: UniqueId): string | undefined {
  const state = modeStore.get(instanceId);
  if (!state) {
    return undefined;
  }
  return state.modeOwners.get(state.mode);
}

/**
 * Manually clear map mode state for a specific instanceId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 *
 * @param instanceId - The unique identifier for the map mode instance to clear
 *
 * @example
 * ```tsx
 * // Manual cleanup (rarely needed)
 * clearMapModeState('my-map-instance');
 * ```
 */
export function clearMapModeState(instanceId: UniqueId): void {
  // Unsubscribe from bus if listening
  const unsub = busUnsubscribers.get(instanceId);
  if (unsub) {
    unsub();
    busUnsubscribers.delete(instanceId);
  }

  // Clear all state
  modeStore.delete(instanceId);
  componentSubscribers.delete(instanceId);
  subscriptionCache.delete(instanceId);
  snapshotCache.delete(instanceId);
  requestModeChangeCache.delete(instanceId);
}
