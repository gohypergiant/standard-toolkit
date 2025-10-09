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
import type { PickingInfo } from '@deck.gl/core';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import type { MapEvents } from './events';

// the bus cannot serialize functions, so we omit them from the event payloads
type NonFuncPickingInfo = Omit<PickingInfo, 'viewport'>;

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

type NonFuncMjolnirPointerEvent = Omit<
  MjolnirPointerEvent,
  | 'stopPropagation'
  | 'preventDefault'
  | 'stopImmediatePropagation'
  | 'srcEvent'
  | 'rootElement'
  | 'target'
>;

export type MapClickPayload = {
  info: NonFuncPickingInfo;
  event: NonFuncMjolnirGestureEvent;
};

export type MapHoverPayload = {
  info: NonFuncPickingInfo;
  event: NonFuncMjolnirPointerEvent;
};

export type MapClickEvent = Payload<typeof MapEvents.click, MapClickPayload>;
export type MapHoverEvent = Payload<typeof MapEvents.hover, MapHoverPayload>;

export type MapEventType = MapClickEvent | MapHoverEvent;
