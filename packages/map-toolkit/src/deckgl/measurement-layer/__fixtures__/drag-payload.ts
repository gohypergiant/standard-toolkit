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

import type { UniqueId } from '@accelint/core';
import type { MapDragPayload } from '@/deckgl/base-map/types';

/** Modifier-key flags for a drag payload; unset flags default to `false`. */
export type Modifiers = Partial<
  Pick<MapDragPayload, 'shiftKey' | 'ctrlKey' | 'altKey'>
>;

/** Build a drag payload for the given map and coordinate. */
export function makeDragPayload(
  mapId: UniqueId,
  coordinate: [number, number],
  modifiers?: Modifiers,
): MapDragPayload {
  return {
    id: mapId,
    coordinate,
    shiftKey: modifiers?.shiftKey ?? false,
    ctrlKey: modifiers?.ctrlKey ?? false,
    altKey: modifiers?.altKey ?? false,
  };
}
