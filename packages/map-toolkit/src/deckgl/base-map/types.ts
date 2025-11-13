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

/**
 * PickingInfo without the viewport property, as it cannot be serialized through the event bus.
 * The viewport contains function properties that would break serialization.
 */
type NonFuncPickingInfo = Omit<PickingInfo, 'viewport'>;

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
  info: NonFuncPickingInfo;
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
  info: NonFuncPickingInfo;
  /** The pointer event that triggered the hover */
  event: NonFuncMjolnirPointerEvent;
  /** The map instance the event occurred within */
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

/**
 * Union type of all map event types that can be emitted through the event bus.
 */
export type MapEventType = MapClickEvent | MapHoverEvent;
