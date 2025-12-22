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
import type { PickingInfo } from '@deck.gl/core';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import type { MapEvents } from './events';
import type { DeckglProps } from '@deckgl-fiber-renderer/types';

/**
 * Props for the BaseMap component.
 * Extends all Deck.gl props and adds additional map-specific properties.
 */
export type BaseMapProps = DeckglProps & {
  /** Optional CSS class name to apply to the map container element */
  className?: string;
  /**
   * Whether to enable listening for map control events (pan/zoom enable/disable).
   * When true, the map will respond to control events emitted via the event bus.
   * @default true
   */
  enableControlEvents?: boolean;
  /**
   * Unique identifier for this map instance (required).
   *
   * Used to isolate map mode state between multiple map instances (e.g., main map vs minimap).
   * This should be a UUID generated using `uuid()` from `@accelint/core`.
   *
   * The same id should be passed to `useMapMode()` when accessing map mode state
   * from components rendered outside of the BaseMap's children (i.e., as siblings).
   */
  id: UniqueId;
  /**
   * Default view for the map: '2D', '2.5D', or '3D'. Defaults to '2D'.
   */
  defaultView?: '2D' | '2.5D' | '3D';
};

/**
 * PickingInfo modified for serialization through the event bus.
 * Omits viewport, layer, and sourceLayer (which contain non-serializable functions),
 * and adds layerId and sourceLayerId extracted from the original layer objects.
 */
export type SerializablePickingInfo = Omit<
  PickingInfo,
  'viewport' | 'layer' | 'sourceLayer'
> & {
  /** ID of the picked layer (extracted from layer.id before omission) */
  layerId?: NonNullable<PickingInfo['layer']>['id'];
  /** ID of the source layer if applicable (extracted from sourceLayer.id before omission) */
  sourceLayerId?: NonNullable<PickingInfo['sourceLayer']>['id'];
};

/**
 * MjolnirGestureEvent without function properties and non-serializable objects.
 * These properties are omitted to allow the event to be serialized through the event bus.
 */
type NonFuncMjolnirGestureEvent = Omit<
  MjolnirGestureEvent,
  | 'stopPropagation'
  | 'preventDefault'
  | 'stopImmediatePropagation'
  | 'srcEvent'
  | 'rootElement'
  | 'target'
  | 'changedPointers'
  | 'pointers'
>;

/**
 * MjolnirPointerEvent without function properties and non-serializable objects.
 * These properties are omitted to allow the event to be serialized through the event bus.
 */
type NonFuncMjolnirPointerEvent = Omit<
  MjolnirPointerEvent,
  | 'stopPropagation'
  | 'preventDefault'
  | 'stopImmediatePropagation'
  | 'srcEvent'
  | 'rootElement'
  | 'target'
>;

/**
 * Payload for map click events emitted through the event bus.
 * Contains picking information about what was clicked and the gesture event details.
 */
export type MapClickPayload = {
  /** Information about the picked object and its properties */
  info: SerializablePickingInfo;
  /** The gesture event that triggered the click */
  event: NonFuncMjolnirGestureEvent;
  /** The map instance the event occurred within */
  id: UniqueId;
};

/**
 * Payload for map hover events emitted through the event bus.
 * Contains picking information about what is being hovered and the pointer event details.
 */
export type MapHoverPayload = {
  /** Information about the picked object and its properties */
  info: SerializablePickingInfo;
  /** The pointer event that triggered the hover */
  event: NonFuncMjolnirPointerEvent;
  /** The map instance the event occurred within */
  id: UniqueId;
};

export type Bounds = [
  minLon: number,
  minLat: number,
  maxLon: number,
  maxLat: number,
];

export type MapViewportPayload = {
  /** Viewport bounds, undefined if viewport not yet initialized */
  bounds?: Bounds;
  latitude: number;
  longitude: number;
  zoom: number;
  /** Viewport width in pixels */
  width: number;
  /** Viewport height in pixels */
  height: number;
  id: UniqueId;
};

/**
 * Type for map click events in the event bus.
 * Combines the event name with the click payload.
 */
export type MapClickEvent = Payload<typeof MapEvents.click, MapClickPayload>;

/**
 * Type for map hover events in the event bus.
 * Combines the event name with the hover payload.
 */
export type MapHoverEvent = Payload<typeof MapEvents.hover, MapHoverPayload>;

export type MapViewportEvent = Payload<
  typeof MapEvents.viewport,
  MapViewportPayload
>;

/**
 * Payload for map control events that target a specific map instance.
 * Used for enablePan, disablePan, enableZoom, disableZoom events.
 */
export type MapControlPayload = {
  /** The map instance to apply the control change to */
  id: UniqueId;
};

export type MapEnablePanEvent = Payload<
  typeof MapEvents.enablePan,
  MapControlPayload
>;

export type MapDisablePanEvent = Payload<
  typeof MapEvents.disablePan,
  MapControlPayload
>;

export type MapEnableZoomEvent = Payload<
  typeof MapEvents.enableZoom,
  MapControlPayload
>;

export type MapDisableZoomEvent = Payload<
  typeof MapEvents.disableZoom,
  MapControlPayload
>;

export type MapEventType =
  | MapClickEvent
  | MapHoverEvent
  | MapViewportEvent
  | MapEnablePanEvent
  | MapDisablePanEvent
  | MapEnableZoomEvent
  | MapDisableZoomEvent;
