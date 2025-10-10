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
import type { MapModeEvents } from './events';

export type ModeChangedPayload = {
  previousMode: string;
  currentMode: string;
};

export type ModeChangeRequestPayload = {
  desiredMode: string;
  owner: string;
};

export type ModeChangeAuthorizationPayload = {
  authId: string;
  desiredMode: string;
  currentMode: string;
};

export type ModeChangeDecisionPayload = {
  authId: string;
  approved: boolean;
  owner: string;
  reason?: string;
};

export type ModeChangedEvent = Payload<
  typeof MapModeEvents.changed,
  ModeChangedPayload
>;

export type ModeChangeRequestEvent = Payload<
  typeof MapModeEvents.changeRequest,
  ModeChangeRequestPayload
>;

export type ModeChangeAuthorizationEvent = Payload<
  typeof MapModeEvents.changeAuthorization,
  ModeChangeAuthorizationPayload
>;

export type ModeChangeDecisionEvent = Payload<
  typeof MapModeEvents.changeDecision,
  ModeChangeDecisionPayload
>;

export type MapModeEventType =
  | ModeChangedEvent
  | ModeChangeRequestEvent
  | ModeChangeAuthorizationEvent
  | ModeChangeDecisionEvent;
