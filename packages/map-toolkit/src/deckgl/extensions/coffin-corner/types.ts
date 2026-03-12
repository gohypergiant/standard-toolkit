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
 * Event type constants for coffin corner interactions.
 * Used as keys with the Broadcast event bus.
 */
export const CoffinCornerEvents = {
  /** Emitted when an entity is selected (click on a new entity). */
  SELECTED: 'coffin-corner:selected',
  /** Emitted when the current selection is cleared. */
  DESELECTED: 'coffin-corner:deselected',
  /** Emitted when the hovered entity changes. */
  HOVERED: 'coffin-corner:hovered',
} as const;

/** String literal union of all coffin corner event type keys. */
export type CoffinCornerEventType =
  (typeof CoffinCornerEvents)[keyof typeof CoffinCornerEvents];

/** Unique identifier for an entity managed by the coffin corner extension. */
export type EntityId = string | number;

/** Payload emitted when an entity is selected. Contains the selected ID and map instance. */
export type CoffinCornerSelectedEvent = Payload<
  typeof CoffinCornerEvents.SELECTED,
  { selectedId: EntityId; mapId: UniqueId }
>;

/** Payload emitted when selection is cleared. */
export type CoffinCornerDeselectedEvent = Payload<
  typeof CoffinCornerEvents.DESELECTED,
  { mapId: UniqueId; selectedId: undefined }
>;

/** Payload emitted when the hovered entity changes. `hoveredId` is undefined when hover ends. */
export type CoffinCornerHoveredEvent = Payload<
  typeof CoffinCornerEvents.HOVERED,
  { hoveredId?: EntityId; mapId: UniqueId }
>;

/** Union of all coffin corner event payloads for type-safe bus subscription. */
export type CoffinCornerEvent =
  | CoffinCornerSelectedEvent
  | CoffinCornerDeselectedEvent
  | CoffinCornerHoveredEvent;
