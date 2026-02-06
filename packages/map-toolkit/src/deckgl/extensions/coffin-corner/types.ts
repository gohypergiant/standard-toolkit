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

'use client';

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';

/**
 * Coffin corner interaction events
 */
export const CoffinCornerEvents = {
  SELECTED: 'coffin-corner:selected',
  DESELECTED: 'coffin-corner:deselected',
  HOVERED: 'coffin-corner:hovered',
} as const;

export type CoffinCornerEventType =
  (typeof CoffinCornerEvents)[keyof typeof CoffinCornerEvents];

/**
 * Icon ID type for coffin corner selection
 */
export type EntityId = string | number;

/**
 * Event payload types
 */
export type CoffinCornerSelectedEvent = Payload<
  typeof CoffinCornerEvents.SELECTED,
  { selectedId: EntityId; mapId: UniqueId }
>;

export type CoffinCornerDeselectedEvent = Payload<
  typeof CoffinCornerEvents.DESELECTED,
  { mapId: UniqueId; selectedId: undefined }
>;

export type CoffinCornerHoveredEvent = Payload<
  typeof CoffinCornerEvents.HOVERED,
  { hoveredId?: EntityId; mapId: UniqueId }
>;

/**
 * Union of all coffin corner event types
 */
export type CoffinCornerEvent =
  | CoffinCornerSelectedEvent
  | CoffinCornerDeselectedEvent
  | CoffinCornerHoveredEvent;
