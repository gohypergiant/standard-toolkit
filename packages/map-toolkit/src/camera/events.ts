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
 * Namespace prefix for all camera-related events.
 *
 * @example
 * ```typescript
 * import { CameraEventNamespace } from '@accelint/map-toolkit/camera';
 *
 * const customEvent = `${CameraEventNamespace}:customAction`;
 * // Result: 'camera:customAction'
 * ```
 */
export const CameraEventNamespace = 'camera';

/**
 * Event type constants for camera operations.
 *
 * Use these constants with the broadcast bus to control camera behavior across
 * your application. Each event type corresponds to a specific camera operation.
 *
 * @example
 * ```typescript
 * import { Broadcast } from '@accelint/bus';
 * import { CameraEventTypes } from '@accelint/map-toolkit/camera';
 * import type { CameraEvent } from '@accelint/map-toolkit/camera';
 *
 * const bus = Broadcast.getInstance<CameraEvent>();
 *
 * // Set camera center
 * bus.emit(CameraEventTypes.setCenter, {
 *   id: 'map-1',
 *   latitude: 37.7749,
 *   longitude: -122.4194,
 *   zoom: 10,
 * });
 *
 * // Change view mode
 * bus.emit(CameraEventTypes.setView, {
 *   id: 'map-1',
 *   view: '2.5D',
 * });
 *
 * // Reset camera to initial state
 * bus.emit(CameraEventTypes.reset, {
 *   id: 'map-1',
 * });
 * ```
 */
export const CameraEventTypes = {
  setView: `${CameraEventNamespace}:setView`,
  setProjection: `${CameraEventNamespace}:setProjection`,
  setZoom: `${CameraEventNamespace}:setZoom`,
  setRotation: `${CameraEventNamespace}:setRotation`,
  setPitch: `${CameraEventNamespace}:setPitch`,
  setCenter: `${CameraEventNamespace}:setCenter`,
  fitBounds: `${CameraEventNamespace}:fitBounds`,
  reset: `${CameraEventNamespace}:reset`,
} as const;
