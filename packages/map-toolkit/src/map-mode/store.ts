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
import type {
  ModeChangeAuthorizationPayload,
  ModeChangeDecisionEvent,
  ModeChangeDecisionPayload,
  ModeChangedEvent,
  ModeChangedPayload,
  ModeChangeRequestEvent,
  ModeChangeRequestPayload,
} from './types';

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

const DEFAULT_MODE = 'default';

/**
 * External store for managing map mode state.
 *
 * This store implements the observable pattern for use with React's `useSyncExternalStore` hook.
 * It manages all mode state, ownership tracking, authorization flow, and event bus communication
 * outside of React's component tree.
 *
 * Each store instance is identified by a unique `mapInstanceId` and operates independently,
 * enabling scenarios with multiple isolated map instances (e.g., main map + minimap).
 * Stores communicate via the event bus and filter events by `mapInstanceId` to ensure isolation.
 *
 * @see {getOrCreateStore} - Creates or retrieves a store for a given map instance
 * @see {destroyStore} - Destroys a store and cleans up its resources
 */
export class MapModeStore {
  private mode: string;
  private readonly mapInstanceId: UniqueId;
  private readonly defaultMode: string;
  private readonly modeOwners = new Map<string, string>();
  private readonly pendingRequests = new Map<string, PendingRequest>();
  private readonly listeners = new Set<() => void>();
  private readonly bus = Broadcast.getInstance();
  private readonly unsubscribers: Array<() => void> = [];

  constructor(mapInstanceId: UniqueId, defaultMode = DEFAULT_MODE) {
    this.mapInstanceId = mapInstanceId;
    this.defaultMode = defaultMode;
    this.mode = defaultMode;

    // Subscribe to bus events
    this.setupEventListeners();
  }

  /**
   * Get current mode snapshot (for useSyncExternalStore)
   */
  getSnapshot = (): string => {
    return this.mode;
  };

  /**
   * Subscribe to mode changes (for useSyncExternalStore)
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Request a mode change
   */
  requestModeChange = (desiredMode: string, requestOwner: string): void => {
    if (!desiredMode) {
      throw new Error('requestModeChange requires non-empty desiredMode');
    }
    if (!requestOwner) {
      throw new Error('requestModeChange requires non-empty requestOwner');
    }

    (
      this.bus.emit as unknown as (
        type: string,
        payload: ModeChangeRequestPayload,
      ) => void
    )(MapModeEvents.changeRequest, {
      desiredMode,
      owner: requestOwner,
      mapInstanceId: this.mapInstanceId,
    } satisfies ModeChangeRequestPayload);
  };

  /**
   * Notify all subscribers of state change
   */
  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Setup event listeners for bus events
   */
  private setupEventListeners(): void {
    // Listen for mode change requests
    const unsubRequest = this.bus.on(MapModeEvents.changeRequest, (event) => {
      const {
        desiredMode,
        owner: requestOwner,
        mapInstanceId,
      } = (event as ModeChangeRequestEvent).payload;

      // Filter: only handle if targeted at this instance
      if (mapInstanceId !== this.mapInstanceId || desiredMode === this.mode) {
        return;
      }

      this.handleModeChangeRequest(desiredMode, requestOwner);
    });
    this.unsubscribers.push(unsubRequest);

    // Listen for authorization decisions
    const unsubDecision = this.bus.on(MapModeEvents.changeDecision, (event) => {
      const { mapInstanceId, approved, authId, owner } = (
        event as ModeChangeDecisionEvent
      ).payload;

      // Filter: only handle if targeted at this instance
      if (mapInstanceId !== this.mapInstanceId) {
        return;
      }

      this.handleAuthorizationDecision({ approved, authId, owner });
    });
    this.unsubscribers.push(unsubDecision);

    // Listen for mode changes to handle pending requests
    const unsubChanged = this.bus.on(MapModeEvents.changed, (event) => {
      const { currentMode, previousMode, mapInstanceId } = (
        event as ModeChangedEvent
      ).payload;

      // Filter: only handle if targeted at this instance
      if (mapInstanceId !== this.mapInstanceId) {
        return;
      }

      // When mode owner changes to default mode, handle pending requests
      if (currentMode === this.defaultMode && this.pendingRequests.size > 0) {
        this.handlePendingRequestsOnDefaultMode(previousMode);
      }
    });
    this.unsubscribers.push(unsubChanged);
  }

  /**
   * Handle mode change request logic
   */
  private handleModeChangeRequest(
    desiredMode: string,
    requestOwner: string,
  ): void {
    const currentModeOwner = this.modeOwners.get(this.mode);
    const desiredModeOwner = this.modeOwners.get(desiredMode);

    // Auto-accept if:
    // 1. Desired mode is default AND requesting owner is the current mode owner
    // 2. Requesting owner is same as current mode owner
    // 3. No current or desired mode owner
    // 4. In default mode and the requester is the owner of the desired mode
    if (
      (desiredMode === this.defaultMode && requestOwner === currentModeOwner) ||
      requestOwner === currentModeOwner ||
      !(currentModeOwner || desiredModeOwner) ||
      (this.mode === this.defaultMode && requestOwner === desiredModeOwner)
    ) {
      this.setMode(desiredMode);

      // Store the desired mode's owner unless it's default
      if (desiredMode !== this.defaultMode && !desiredModeOwner) {
        this.modeOwners.set(desiredMode, requestOwner);
      }

      // Clear requester's pending request since mode changed successfully
      this.pendingRequests.delete(requestOwner);
      return;
    }

    // Otherwise, send authorization request
    const authId = uuid();

    this.pendingRequests.set(requestOwner, {
      authId,
      desiredMode,
      currentMode: this.mode,
      requestOwner,
    });

    (
      this.bus.emit as unknown as (
        type: string,
        payload: ModeChangeAuthorizationPayload,
      ) => void
    )(MapModeEvents.changeAuthorization, {
      authId,
      desiredMode,
      currentMode: this.mode,
      mapInstanceId: this.mapInstanceId,
    } satisfies ModeChangeAuthorizationPayload);
  }

  /**
   * Handle authorization decision
   */
  private handleAuthorizationDecision(payload: {
    approved: boolean;
    authId: string;
    owner: string;
  }): void {
    const { approved, authId, owner: decisionOwner } = payload;

    // Verify decision is from current mode's owner
    const currentModeOwner = this.modeOwners.get(this.mode);
    if (decisionOwner !== currentModeOwner) {
      return;
    }

    // Find the request with matching authId
    let matchingRequestOwner: string | null = null;
    let matchingRequest: PendingRequest | null = null;

    for (const [requestOwner, request] of this.pendingRequests.entries()) {
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
      this.approveRequestAndRejectOthers(
        matchingRequest,
        authId,
        decisionOwner,
        '',
        false,
      );
    } else {
      this.pendingRequests.delete(matchingRequestOwner);
    }
  }

  /**
   * Approve a request and reject all others
   */
  private approveRequestAndRejectOthers(
    approvedRequest: PendingRequest,
    excludeAuthId: string,
    decisionOwner: string,
    reason: string,
    emitApproval: boolean,
  ): void {
    // Collect all other pending requests to emit rejections for
    const requestsToReject: PendingRequest[] = [];
    for (const [, request] of this.pendingRequests.entries()) {
      if (request.authId !== excludeAuthId) {
        requestsToReject.push(request);
      }
    }

    // Clear all pending requests BEFORE changing mode
    this.pendingRequests.clear();

    // Change mode
    this.setMode(approvedRequest.desiredMode);

    // Store the new mode's owner (unless it's default mode)
    if (approvedRequest.desiredMode !== this.defaultMode) {
      this.modeOwners.set(
        approvedRequest.desiredMode,
        approvedRequest.requestOwner,
      );
    }

    // Emit approval decision if requested
    if (emitApproval) {
      (
        this.bus.emit as unknown as (
          type: string,
          payload: ModeChangeDecisionPayload,
        ) => void
      )(MapModeEvents.changeDecision, {
        authId: approvedRequest.authId,
        approved: true,
        owner: decisionOwner,
        reason,
        mapInstanceId: this.mapInstanceId,
      } satisfies ModeChangeDecisionPayload);
    }

    // Emit rejection events for all other pending requests
    for (const request of requestsToReject) {
      (
        this.bus.emit as unknown as (
          type: string,
          payload: ModeChangeDecisionPayload,
        ) => void
      )(MapModeEvents.changeDecision, {
        authId: request.authId,
        approved: false,
        owner: decisionOwner,
        reason: 'Request auto-rejected because another request was approved',
        mapInstanceId: this.mapInstanceId,
      } satisfies ModeChangeDecisionPayload);
    }
  }

  /**
   * Handle pending requests when returning to default mode
   */
  private handlePendingRequestsOnDefaultMode(previousMode: string): void {
    const firstEntry = Array.from(this.pendingRequests.entries())[0];
    if (!firstEntry) {
      return;
    }

    const [, firstRequest] = firstEntry;
    const previousModeOwner = this.modeOwners.get(previousMode);

    if (!previousModeOwner) {
      return;
    }

    // If the first pending request is for default mode, reject all requests
    if (firstRequest.desiredMode === this.defaultMode) {
      const allRequests = Array.from(this.pendingRequests.values());
      this.pendingRequests.clear();

      for (const request of allRequests) {
        (
          this.bus.emit as unknown as (
            type: string,
            payload: ModeChangeDecisionPayload,
          ) => void
        )(MapModeEvents.changeDecision, {
          authId: request.authId,
          approved: false,
          owner: previousModeOwner,
          reason: 'Request rejected - already in requested mode',
          mapInstanceId: this.mapInstanceId,
        } satisfies ModeChangeDecisionPayload);
      }
    } else {
      // Auto-accept the first pending request for a different mode
      this.approveRequestAndRejectOthers(
        firstRequest,
        firstRequest.authId,
        previousModeOwner,
        'Auto-accepted when mode owner returned to default',
        true,
      );
    }
  }

  /**
   * Set mode and notify listeners
   */
  private setMode(newMode: string): void {
    const previousMode = this.mode;
    this.mode = newMode;

    (
      this.bus.emit as unknown as (
        type: string,
        payload: ModeChangedPayload,
      ) => void
    )(MapModeEvents.changed, {
      previousMode,
      currentMode: newMode,
      mapInstanceId: this.mapInstanceId,
    } satisfies ModeChangedPayload);

    this.notify();
  }

  /**
   * Clean up store resources
   */
  destroy(): void {
    // Unsubscribe from all bus events
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
    this.unsubscribers.length = 0;

    // Clear all state
    this.modeOwners.clear();
    this.pendingRequests.clear();
    this.listeners.clear();
  }
}

/**
 * Global store registry
 */
const storeRegistry = new Map<UniqueId, MapModeStore>();

/**
 * Get or create a store for a given map instance
 */
export function getOrCreateStore(
  mapInstanceId: UniqueId,
  defaultMode: string,
): MapModeStore {
  if (!storeRegistry.has(mapInstanceId)) {
    storeRegistry.set(
      mapInstanceId,
      new MapModeStore(mapInstanceId, defaultMode),
    );
  }
  // biome-ignore lint/style/noNonNullAssertion: Store guaranteed to exist after has() check above
  return storeRegistry.get(mapInstanceId)!;
}

/**
 * Destroy and remove a store from the registry
 */
export function destroyStore(mapInstanceId: UniqueId): void {
  const store = storeRegistry.get(mapInstanceId);
  if (store) {
    store.destroy();
    storeRegistry.delete(mapInstanceId);
  }
}

/**
 * Get a store by instance ID (for testing/advanced use)
 */
export function getStore(mapInstanceId: UniqueId): MapModeStore | undefined {
  return storeRegistry.get(mapInstanceId);
}
