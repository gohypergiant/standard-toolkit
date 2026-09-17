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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';

/**
 * Namespace for all measurement-related events.
 */
export const MeasurementEventsNamespace = 'measurement';

/**
 * Event keys for measurement lifecycle events.
 * Emitted through the event bus when measurement state changes.
 *
 * @example
 * ```typescript
 * import { Broadcast } from '@accelint/bus';
 * import { MeasurementEvents } from '@accelint/map-toolkit/deckgl/measurement-layer';
 * import type { MeasurementEventType } from '@accelint/map-toolkit/deckgl/measurement-layer';
 *
 * const bus = Broadcast.getInstance<MeasurementEventType>();
 *
 * bus.on(MeasurementEvents.start, (event) => {
 *   console.log('Measurement started at:', event.payload.pointA);
 * });
 * ```
 */
export const MeasurementEvents = {
  /** Emitted when measurement begins (dragStart with pointA set) */
  start: `${MeasurementEventsNamespace}:start`,
  /** Emitted on each drag update with the current pointB */
  update: `${MeasurementEventsNamespace}:update`,
  /** Emitted when the measurement finishes: on drag end, or when the required modifier key is released mid-drag */
  complete: `${MeasurementEventsNamespace}:complete`,
  /** Emitted when the measurement is cleared and state is reset to idle */
  clear: `${MeasurementEventsNamespace}:clear`,
} as const;

/**
 * Payload for measurement lifecycle events.
 */
export type MeasurementPayload = {
  /** The map instance this measurement belongs to */
  mapId: UniqueId;
  /** The origin coordinate as `[longitude, latitude]` */
  pointA: [number, number];
  /** The destination coordinate as `[longitude, latitude]`, or `null` before the first drag move */
  pointB: [number, number] | null;
};

/** Bus event type for `measurement:start`; pairs the event name with {@link MeasurementPayload}. */
export type MeasurementStartEvent = Payload<
  typeof MeasurementEvents.start,
  MeasurementPayload
>;

/** Bus event type for `measurement:update`; pairs the event name with {@link MeasurementPayload}. */
export type MeasurementUpdateEvent = Payload<
  typeof MeasurementEvents.update,
  MeasurementPayload
>;

/**
 * Payload for `measurement:complete`. Unlike {@link MeasurementPayload}, `pointB`
 * is always present: a measurement that ends without a destination is cleared
 * (`measurement:clear`) rather than completed.
 */
export type MeasurementCompletePayload = {
  /** The map instance the measurement belongs to */
  mapId: UniqueId;
  /** Origin coordinate `[longitude, latitude]` */
  pointA: [number, number];
  /** Destination coordinate `[longitude, latitude]` */
  pointB: [number, number];
};

/** Bus event type for `measurement:complete`; pairs the event name with {@link MeasurementPayload}. */
export type MeasurementCompleteEvent = Payload<
  typeof MeasurementEvents.complete,
  MeasurementCompletePayload
>;

/**
 * Payload for the measurement clear event.
 */
export type MeasurementClearPayload = {
  /** The map instance this measurement belongs to */
  mapId: UniqueId;
};

/** Bus event type for `measurement:clear`; pairs the event name with {@link MeasurementClearPayload}. */
export type MeasurementClearEvent = Payload<
  typeof MeasurementEvents.clear,
  MeasurementClearPayload
>;

/**
 * Union of all measurement event types for use with the event bus.
 */
export type MeasurementEventType =
  | MeasurementStartEvent
  | MeasurementUpdateEvent
  | MeasurementCompleteEvent
  | MeasurementClearEvent;
