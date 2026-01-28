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
import type { UniqueId } from '@accelint/core/utility/uuid';
import type { Bounds } from '@/deckgl/base-map/types';
import type { CameraEventTypes } from './events';

/**
 * Map projection types supported by the camera system.
 *
 * - `mercator`: Web Mercator projection for 2D and 2.5D views
 * - `globe`: Spherical globe projection for 3D views
 */
export type ProjectionType = 'mercator' | 'globe';

/**
 * Camera view modes defining perspective and interaction capabilities.
 *
 * - `2D`: Traditional flat map view with rotation
 * - `2.5D`: Tilted perspective view with pitch and rotation
 * - `3D`: Globe view with fixed orientation
 */
export type ViewType = '2D' | '2.5D' | '3D';

/**
 * Payload for setting camera center position.
 */
export type CameraSetCenterPayload = {
  /** Identifier of the camera */
  id: UniqueId;
  /** Latitude of the target coordinate */
  latitude: number;
  /** Longitude of the target coordinate */
  longitude: number;
  /** Optional zoom level */
  zoom?: number;
  /** Optional heading angle */
  heading?: number;
  /** Optional pitch angle */
  pitch?: number;
};

/**
 * Payload for fitting camera to show a bounding box.
 */
export type CameraFitBoundsPayload = {
  /** Identifier of the camera */
  id: UniqueId;
  /** Bounds of the area to fit [minLon, minLat, maxLon, maxLat] */
  bounds: Bounds;
  /** Viewport width in pixels */
  width: number;
  /** Viewport height in pixels */
  height: number;
  /** Optional padding in pixels */
  padding?: number;
  /** Optional heading angle */
  heading?: number;
  /** Optional pitch angle */
  pitch?: number;
};

/**
 * Payload for resetting camera to initial state.
 *
 * Set property to `false` to preserve that property during reset.
 * By default, all properties are reset to initial values.
 *
 * @example
 * ```typescript
 * import type { CameraResetPayload } from '@accelint/map-toolkit/camera';
 *
 * // Full reset
 * const fullReset: CameraResetPayload = {
 *   id: 'map-1',
 * };
 *
 * // Reset but keep current zoom
 * const keepZoom: CameraResetPayload = {
 *   id: 'map-1',
 *   zoom: false,
 * };
 * ```
 */
export type CameraResetPayload = {
  /** Identifier of the camera */
  id: UniqueId;
  /** Set to false to preserve current zoom during reset */
  zoom?: boolean;
  /** Set to false to preserve current pitch during reset */
  pitch?: boolean;
  /** Set to false to preserve current rotation during reset */
  rotation?: boolean;
};

/**
 * Event type for setting camera center position.
 */
export type CameraSetCenterEvent = Payload<
  typeof CameraEventTypes.setCenter,
  CameraSetCenterPayload
>;

/**
 * Event type for fitting camera to bounds.
 */
export type CameraFitBoundsEvent = Payload<
  typeof CameraEventTypes.fitBounds,
  CameraFitBoundsPayload
>;

/**
 * Event type for setting camera projection.
 */
export type CameraSetProjectionEvent = Payload<
  typeof CameraEventTypes.setProjection,
  { id: UniqueId; projection: ProjectionType }
>;

/**
 * Event type for setting camera view mode.
 */
export type CameraSetViewEvent = Payload<
  typeof CameraEventTypes.setView,
  { id: UniqueId; view: ViewType }
>;

/**
 * Event type for setting camera zoom level.
 */
export type CameraSetZoomEvent = Payload<
  typeof CameraEventTypes.setZoom,
  { id: UniqueId; zoom: number }
>;

/**
 * Event type for setting camera rotation angle.
 */
export type CameraSetRotationEvent = Payload<
  typeof CameraEventTypes.setRotation,
  { id: UniqueId; rotation: number }
>;

/**
 * Event type for setting camera pitch angle.
 */
export type CameraSetPitchEvent = Payload<
  typeof CameraEventTypes.setPitch,
  { id: UniqueId; pitch: number }
>;

/**
 * Event type for resetting camera to initial state.
 */
export type CameraResetEvent = Payload<
  typeof CameraEventTypes.reset,
  CameraResetPayload
>;

/**
 * Union type of all camera events.
 *
 * Use this type when registering bus listeners that handle multiple camera events.
 *
 * @example
 * ```typescript
 * import { Broadcast } from '@accelint/bus';
 * import type { CameraEvent } from '@accelint/map-toolkit/camera';
 *
 * const bus = Broadcast.getInstance<CameraEvent>();
 * ```
 */
export type CameraEvent =
  | CameraSetCenterEvent
  | CameraFitBoundsEvent
  | CameraSetProjectionEvent
  | CameraSetViewEvent
  | CameraSetZoomEvent
  | CameraSetRotationEvent
  | CameraSetPitchEvent
  | CameraResetEvent;
