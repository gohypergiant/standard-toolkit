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
import type { UniqueId } from '@accelint/core';
import type { Rgba255Tuple } from '@accelint/predicates';

/**
 * Props added by the CoffinCornerExtension.
 *
 * @template TLayerProps - The host layer's props type to intersect with.
 */
export type CoffinCornerExtensionProps<TLayerProps = unknown> = {
  /** The currently selected entity ID. */
  selectedEntityId?: EntityId;
  /** The currently hovered entity ID. */
  hoveredEntityId?: EntityId;
  /**
   * RGBA color (0-255) for the selected-state bracket fill.
   * Alpha modulates the bracket opacity.
   * @default [57, 183, 250, 255] (#39B7FA, fully opaque)
   */
  selectedCoffinCornerColor?: Rgba255Tuple;
  /**
   * Accessor to extract an entity ID from a data item. Matched against
   * `selectedEntityId` and `hoveredEntityId` to drive the shader state.
   * @default (item) => item.id
   */
  // biome-ignore lint/suspicious/noExplicitAny: Data type is unknown at extension level.
  getEntityId?: (item: any) => EntityId;
} & TLayerProps;

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
