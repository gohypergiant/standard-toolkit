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

export type ProjectionType = 'mercator' | 'globe';

export type ViewType = '2D' | '2.5D' | '3D';

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

export type CameraResetPayload = {
  /** Identifier of the camera */
  id: UniqueId;
  zoom?: boolean;
  pitch?: boolean;
  rotation?: boolean;
};

export type CameraSetCenterEvent = Payload<
  typeof CameraEventTypes.setCenter,
  CameraSetCenterPayload
>;

export type CameraFitBoundsEvent = Payload<
  typeof CameraEventTypes.fitBounds,
  CameraFitBoundsPayload
>;

export type CameraSetProjectionEvent = Payload<
  typeof CameraEventTypes.setProjection,
  { id: UniqueId; projection: ProjectionType }
>;

export type CameraSetViewEvent = Payload<
  typeof CameraEventTypes.setView,
  { id: UniqueId; view: ViewType }
>;

export type CameraSetZoomEvent = Payload<
  typeof CameraEventTypes.setZoom,
  { id: UniqueId; zoom: number }
>;

export type CameraSetRotationEvent = Payload<
  typeof CameraEventTypes.setRotation,
  { id: UniqueId; rotation: number }
>;

export type CameraSetPitchEvent = Payload<
  typeof CameraEventTypes.setPitch,
  { id: UniqueId; pitch: number }
>;

export type CameraResetEvent = Payload<
  typeof CameraEventTypes.reset,
  CameraResetPayload
>;

export type CameraEvent =
  | CameraSetCenterEvent
  | CameraFitBoundsEvent
  | CameraSetProjectionEvent
  | CameraSetViewEvent
  | CameraSetZoomEvent
  | CameraSetRotationEvent
  | CameraSetPitchEvent
  | CameraResetEvent;
