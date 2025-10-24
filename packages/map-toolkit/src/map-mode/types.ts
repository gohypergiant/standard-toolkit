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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { MapModeEvents } from './events';

/**
 * Payload emitted when the map mode has successfully changed.
 */
export type ModeChangedPayload = {
  /** The mode before the change */
  previousMode: string;
  /** The mode after the change */
  currentMode: string;
  /** The ID of the map instance this event is for */
  mapInstanceId: UniqueId;
};

/**
 * Payload for requesting a map mode change.
 * This initiates the mode change flow.
 */
export type ModeChangeRequestPayload = {
  /** The mode being requested */
  desiredMode: string;
  /** The identifier of the component requesting the mode change */
  owner: string;
  /** The ID of the map instance this event is for */
  mapInstanceId: UniqueId;
};

/**
 * Payload emitted when a mode change requires authorization.
 * This is sent to the current mode owner to approve or reject the request.
 */
export type ModeChangeAuthorizationPayload = {
  /** Unique identifier for this authorization request */
  authId: string;
  /** The mode being requested */
  desiredMode: string;
  /** The current active mode */
  currentMode: string;
  /** The ID of the map instance this event is for */
  mapInstanceId: UniqueId;
};

/**
 * Payload for an authorization decision from the current mode owner.
 * This completes the authorization flow.
 */
export type ModeChangeDecisionPayload = {
  /** The authId from the corresponding authorization request */
  authId: string;
  /** Whether the mode change was approved */
  approved: boolean;
  /** The identifier of the component making the decision (must be current mode owner) */
  owner: string;
  /** Optional reason for rejection */
  reason?: string;
  /** The ID of the map instance this event is for */
  mapInstanceId: UniqueId;
};

/**
 * Event type for mode change notifications.
 * Emitted when the map mode has successfully changed.
 */
export type ModeChangedEvent = Payload<
  typeof MapModeEvents.changed,
  ModeChangedPayload
>;

/**
 * Event type for mode change requests.
 * Emitted when a component requests a mode change.
 */
export type ModeChangeRequestEvent = Payload<
  typeof MapModeEvents.changeRequest,
  ModeChangeRequestPayload
>;

/**
 * Event type for mode change authorization requests.
 * Emitted when a mode change requires approval from the current mode owner.
 */
export type ModeChangeAuthorizationEvent = Payload<
  typeof MapModeEvents.changeAuthorization,
  ModeChangeAuthorizationPayload
>;

/**
 * Event type for authorization decisions.
 * Emitted when the current mode owner approves or rejects a mode change request.
 */
export type ModeChangeDecisionEvent = Payload<
  typeof MapModeEvents.changeDecision,
  ModeChangeDecisionPayload
>;

/**
 * Union type of all map mode event types that can be emitted through the event bus.
 */
export type MapModeEventType =
  | ModeChangedEvent
  | ModeChangeRequestEvent
  | ModeChangeAuthorizationEvent
  | ModeChangeDecisionEvent;
