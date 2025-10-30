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
 * External store for managing map mode state.
 *
 * This store implements the observable pattern for use with React's `useSyncExternalStore` hook.
 * It manages all mode state, ownership tracking, authorization flow, and event bus communication
 * outside of React's component tree.
 *
 * Each store instance is identified by a unique `id` and operates independently,
 * enabling scenarios with multiple isolated map instances (e.g., main map + minimap).
 * Stores communicate via the event bus and filter events by `id` to ensure isolation.
 *
 * The store always initializes in 'default' mode and does not accept a custom default mode.
 *
 * @see {getOrCreateStore} - Creates or retrieves a store for a given map instance
 * @see {destroyStore} - Destroys a store and cleans up its resources
 */
export class MapModeStore {
  private mode = DEFAULT_MODE;
  private readonly defaultMode = DEFAULT_MODE;
  private readonly modeOwners = new Map<string, string>();
  private readonly pendingRequests = new Map<string, PendingRequest>();
  private readonly listeners = new Set<() => void>();
  private readonly bus = mapModeBus;
  private readonly unsubscribers: Array<() => void> = [];

  constructor(private readonly id: UniqueId) {
    this.id = id;
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
   *
   * If the mode change can be auto-accepted (no ownership conflicts), the mode changes immediately.
   * Otherwise, an authorization request is emitted and stored as a pending request.
   *
   * **Important**: If the requester already has a pending authorization request, it will be replaced
   * with this new request. Only one pending request per requester is maintained at a time.
   *
   * @param desiredMode - The mode to switch to (automatically trimmed of whitespace)
   * @param requestOwner - Unique identifier of the component requesting the change (automatically trimmed of whitespace)
   * @throws Error if either parameter is empty or whitespace-only
   *
   * @example
   * ```ts
   * // First request from 'drawing-tool'
   * store.requestModeChange('drawing', 'drawing-tool');
   * // → Creates pending request with authId 'abc-123'
   *
   * // Second request from same 'drawing-tool' before first is resolved
   * store.requestModeChange('measuring', 'drawing-tool');
   * // → Replaces pending request, new authId 'def-456', old 'abc-123' is discarded
   * ```
   */
  requestModeChange = (desiredMode: string, requestOwner: string): void => {
    const trimmedDesiredMode = desiredMode.trim();
    const trimmedRequestOwner = requestOwner.trim();

    if (!trimmedDesiredMode) {
      throw new Error('requestModeChange requires non-empty desiredMode');
    }
    if (!trimmedRequestOwner) {
      throw new Error('requestModeChange requires non-empty requestOwner');
    }

    this.bus.emit(MapModeEvents.changeRequest, {
      desiredMode: trimmedDesiredMode,
      owner: trimmedRequestOwner,
      id: this.id,
    });
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
   *
   * Note: Event listeners remain active even after early returns in handlers.
   * This is by design - cleanup happens in destroy() which is called automatically
   * by MapProvider on unmount. Consumers don't need to manually manage cleanup.
   */
  private setupEventListeners(): void {
    // Listen for mode change requests
    const unsubRequest = this.bus.on(MapModeEvents.changeRequest, (event) => {
      const { desiredMode, owner: requestOwner, id } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== this.id || desiredMode === this.mode) {
        return;
      }

      this.handleModeChangeRequest(desiredMode, requestOwner);
    });
    this.unsubscribers.push(unsubRequest);

    // Listen for authorization decisions
    const unsubDecision = this.bus.on(MapModeEvents.changeDecision, (event) => {
      const { id, approved, authId, owner } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== this.id) {
        return;
      }

      this.handleAuthorizationDecision({ approved, authId, owner });
    });
    this.unsubscribers.push(unsubDecision);

    // Listen for mode changes to handle pending requests
    const unsubChanged = this.bus.on(MapModeEvents.changed, (event) => {
      const { currentMode, previousMode, id } = event.payload;

      // Filter: only handle if targeted at this map
      if (id !== this.id) {
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
   * Determine if a mode change request should be auto-accepted without authorization
   */
  private shouldAutoAcceptRequest(
    desiredMode: string,
    requestOwner: string,
    currentModeOwner: string | undefined,
    desiredModeOwner: string | undefined,
  ): boolean {
    // Owner returning to default mode
    if (desiredMode === this.defaultMode && requestOwner === currentModeOwner) {
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
    if (this.mode === this.defaultMode && requestOwner === desiredModeOwner) {
      return true;
    }

    return false;
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

    // Check if this request should be auto-accepted
    if (
      this.shouldAutoAcceptRequest(
        desiredMode,
        requestOwner,
        currentModeOwner,
        desiredModeOwner,
      )
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

    this.bus.emit(MapModeEvents.changeAuthorization, {
      authId,
      desiredMode,
      currentMode: this.mode,
      id: this.id,
    });
  }

  /**
   * Handle authorization decision
   *
   * Processes approval/rejection decisions from mode owners. Only the current mode's owner
   * can make authorization decisions. If a decision comes from a non-owner, a warning is
   * logged and the decision is ignored to prevent unauthorized mode changes.
   *
   * @param payload - The authorization decision containing authId, approved status, and owner
   */
  private handleAuthorizationDecision(payload: {
    approved: boolean;
    authId: string;
    owner: string;
  }): void {
    const { approved, authId, owner: decisionOwner } = payload;

    // Verify decision is from current mode's owner
    // Logs a warning if unauthorized component attempts to make decisions
    const currentModeOwner = this.modeOwners.get(this.mode);
    if (decisionOwner !== currentModeOwner) {
      console.warn(
        `[MapMode] Authorization decision from "${decisionOwner}" ignored - not the owner of mode "${this.mode}" (owner: ${currentModeOwner || 'none'})`,
      );
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
    for (const request of this.pendingRequests.values()) {
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
      this.bus.emit(MapModeEvents.changeDecision, {
        authId: approvedRequest.authId,
        approved: true,
        owner: decisionOwner,
        reason,
        id: this.id,
      });
    }

    // Emit rejection events for all other pending requests
    for (const request of requestsToReject) {
      this.bus.emit(MapModeEvents.changeDecision, {
        authId: request.authId,
        approved: false,
        owner: decisionOwner,
        reason: 'Request auto-rejected because another request was approved',
        id: this.id,
      });
    }
  }

  /**
   * Handle pending requests when returning to default mode
   */
  private handlePendingRequestsOnDefaultMode(previousMode: string): void {
    const firstEntry = Array.from(this.pendingRequests.values())[0];
    if (!firstEntry) {
      return;
    }

    const previousModeOwner = this.modeOwners.get(previousMode);

    if (!previousModeOwner) {
      return;
    }

    // If the first pending request is for default mode, reject all requests
    if (firstEntry.desiredMode === this.defaultMode) {
      const allRequests = Array.from(this.pendingRequests.values());
      this.pendingRequests.clear();

      for (const request of allRequests) {
        this.bus.emit(MapModeEvents.changeDecision, {
          authId: request.authId,
          approved: false,
          owner: previousModeOwner,
          reason: 'Request rejected - already in requested mode',
          id: this.id,
        } satisfies ModeChangeDecisionPayload);
      }
    } else {
      // Auto-accept the first pending request for a different mode
      this.approveRequestAndRejectOthers(
        firstEntry,
        firstEntry.authId,
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

    this.bus.emit(MapModeEvents.changed, {
      previousMode,
      currentMode: newMode,
      id: this.id,
    });

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
export function getOrCreateStore(id: UniqueId): MapModeStore {
  if (!storeRegistry.has(id)) {
    storeRegistry.set(id, new MapModeStore(id));
  }
  // biome-ignore lint/style/noNonNullAssertion: Store guaranteed to exist after has() check above
  return storeRegistry.get(id)!;
}

/**
 * Destroy and remove a store from the registry
 */
export function destroyStore(id: UniqueId): void {
  const store = storeRegistry.get(id);
  if (store) {
    store.destroy();
    storeRegistry.delete(id);
  }
}

/**
 * Get a store by map ID (for testing/advanced use)
 */
export function getStore(id: UniqueId): MapModeStore | undefined {
  return storeRegistry.get(id);
}
