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

import type { PickingInfo } from '@deck.gl/core';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import type { SerializablePickingInfo } from './types';

/**
 * Serializes PickingInfo for event bus transmission.
 * Omits viewport, layer, and sourceLayer (contain functions) but preserves layer IDs.
 *
 * @param info - The PickingInfo object from Deck.gl
 * @returns Serializable picking info with layer IDs extracted
 */
export function serializePickingInfo(
  info: PickingInfo,
): SerializablePickingInfo {
  const { viewport, layer, sourceLayer, ...infoRest } = info;
  return {
    layerId: layer?.id,
    sourceLayerId: sourceLayer?.id,
    ...infoRest,
  };
}

/**
 * Strips non-serializable properties from MjolnirGestureEvent for event bus transmission.
 * Removes functions, DOM elements, and PointerEvent objects that cannot be cloned.
 *
 * @param event - The MjolnirGestureEvent from Deck.gl
 * @returns Serializable gesture event with non-cloneable properties removed
 */
export function serializeMjolnirEvent(
  event: MjolnirGestureEvent,
): Omit<
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
 * Strips non-serializable properties from MjolnirPointerEvent for event bus transmission.
 * Removes functions and DOM elements that cannot be cloned.
 *
 * @param event - The MjolnirPointerEvent from Deck.gl
 * @returns Serializable pointer event with non-cloneable properties removed
 */
export function serializeMjolnirEvent(
  event: MjolnirPointerEvent,
): Omit<
  MjolnirPointerEvent,
  | 'stopPropagation'
  | 'preventDefault'
  | 'stopImmediatePropagation'
  | 'srcEvent'
  | 'rootElement'
  | 'target'
>;
export function serializeMjolnirEvent(
  event: MjolnirGestureEvent | MjolnirPointerEvent,
) {
  const {
    stopImmediatePropagation,
    stopPropagation,
    preventDefault,
    srcEvent,
    rootElement,
    target,
    ...rest
  } = event;

  // Remove pointer arrays if present (only on MjolnirGestureEvent)
  if ('changedPointers' in rest) {
    const { changedPointers, pointers, ...gestureRest } = rest;
    return gestureRest;
  }

  return rest;
}
