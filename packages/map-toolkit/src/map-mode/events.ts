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

/**
 * Namespace prefix for all map mode events.
 */
export const MapModeEventsNamespace = 'map-mode';

/**
 * Event type constants for map mode state management.
 *
 * These events are emitted through the `@accelint/bus` event bus to coordinate
 * map mode changes across components in a decoupled manner.
 *
 * @example
 * ```ts
 * import { useOn, useEmit } from '@accelint/bus/react';
 * import { MapModeEvents } from '@accelint/map-toolkit/map-mode';
 *
 * // Listen for mode changes
 * useOn(MapModeEvents.changed, (event) => {
 *   console.log('Mode changed to:', event.payload.currentMode);
 * });
 *
 * // Emit a decision
 * const emitDecision = useEmit(MapModeEvents.changeDecision);
 * emitDecision({ authId, approved: true, owner: 'my-id', mapInstanceId });
 * ```
 */
export const MapModeEvents = {
  /** Emitted when the map mode has successfully changed */
  changed: `${MapModeEventsNamespace}:changed`,
  /** Emitted when a component requests a mode change */
  changeRequest: `${MapModeEventsNamespace}:change:request`,
  /** Emitted when authorization is required for a mode change */
  changeAuthorization: `${MapModeEventsNamespace}:change:authorization`,
  /** Emitted when an authorization decision is made (approve/reject) */
  changeDecision: `${MapModeEventsNamespace}:change:decision`,
} as const;
