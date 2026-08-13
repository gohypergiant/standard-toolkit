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
 * Namespace for all map-related events.
 */
export const MapEventsNamespace = 'map';

/**
 * Event keys for map interactions and control changes.
 * These events are emitted through the event bus for communication between map components and consumers.
 *
 * @example
 * ```typescript
 * import { Broadcast } from '@accelint/bus';
 * import { MapEvents } from '@accelint/map-toolkit/deckgl/base-map';
 * import type { MapEventType } from '@accelint/map-toolkit/deckgl/base-map';
 *
 * const bus = Broadcast.getInstance<MapEventType>();
 *
 * // Listen for click events
 * bus.on(MapEvents.click, (event) => {
 *   console.log('Map clicked:', event.payload.info);
 * });
 *
 * // Listen for viewport changes
 * bus.on(MapEvents.viewport, (event) => {
 *   console.log('Viewport changed:', event.payload.bounds);
 * });
 *
 * // Emit control events
 * bus.emit(MapEvents.disablePan, { id: mapId });
 * bus.emit(MapEvents.enableZoom, { id: mapId });
 * ```
 */
export const MapEvents = {
  click: `${MapEventsNamespace}:click`,
  hover: `${MapEventsNamespace}:hover`,
  viewport: `${MapEventsNamespace}:viewport`,
  // Control events
  enablePan: `${MapEventsNamespace}:enablePan`,
  disablePan: `${MapEventsNamespace}:disablePan`,
  enableZoom: `${MapEventsNamespace}:enableZoom`,
  disableZoom: `${MapEventsNamespace}:disableZoom`,
} as const;
