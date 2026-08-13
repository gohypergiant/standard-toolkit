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

/**
 * Edit Shape Events
 *
 * Payload types are wrapped with `BusCloneable<T>` (see shared/types.ts) so the
 * bus's `StructuredCloneable` constraint is satisfied for `Shape`/`Feature`
 * fields. GeoJSON data is cloneable at runtime, but type-fest's
 * `StructuredCloneable` requires an index signature that GeoJSON types lack —
 * `BusCloneable` adds that signature via intersection. Events that only carry
 * primitives can use the `Payload<T, P>` helper from `@accelint/bus` directly
 * (see shared/events.ts for examples).
 */

'use client';

import type { UniqueId } from '@accelint/core';
import type { Feature } from 'geojson';
import type { BusCloneable, Shape } from '../shared/types';

/**
 * Edit shape lifecycle events
 */
export const EditShapeEvents = {
  /** Editing has started for a shape */
  editing: 'shapes:editing',
  /** Shape has been successfully updated */
  updated: 'shapes:updated',
  /** Editing was canceled */
  canceled: 'shapes:edit-canceled',
  /** Continuous edit event — fires during drag with editType info */
  featureEditing: 'shapes:feature-editing',
} as const;

export type EditShapeEventType =
  (typeof EditShapeEvents)[keyof typeof EditShapeEvents];

/**
 * Payload for shapes:editing event.
 */
export type ShapeEditingPayload = BusCloneable<{
  /** The shape being edited */
  shape: Shape;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
}>;

/**
 * Event payload for shapes:editing
 * Emitted when editing starts
 */
export type ShapeEditingEvent = {
  type: 'shapes:editing';
  payload: ShapeEditingPayload;
  source: UniqueId;
  target?: UniqueId;
};

/**
 * Payload for shapes:updated event.
 */
export type ShapeUpdatedPayload = BusCloneable<{
  /** The updated shape with new geometry */
  shape: Shape;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
}>;

/**
 * Event payload for shapes:updated
 * Emitted when shape edits are saved
 */
export type ShapeUpdatedEvent = {
  type: 'shapes:updated';
  payload: ShapeUpdatedPayload;
  source: UniqueId;
  target?: UniqueId;
};

/**
 * Payload for shapes:edit-canceled event.
 */
export type ShapeEditCanceledPayload = BusCloneable<{
  /** The shape that was being edited (original, unchanged) */
  shape: Shape;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
}>;

/**
 * Event payload for shapes:edit-canceled
 * Emitted when editing is canceled
 */
export type ShapeEditCanceledEvent = {
  type: 'shapes:edit-canceled';
  payload: ShapeEditCanceledPayload;
  source: UniqueId;
  target?: UniqueId;
};

/**
 * Payload for shapes:feature-editing event.
 * Emitted on every edit action (continuous and completion) with the raw editType.
 */
export type FeatureEditingPayload = BusCloneable<{
  /** The updated feature geometry */
  feature: Feature;
  /** The raw edit type string from editable-layers (e.g. 'scaling', 'scaled', 'rotating', 'rotated', 'translating', 'translated') */
  editType: string;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
}>;

/**
 * Event payload for shapes:feature-editing
 * Emitted during continuous drag and on completion with the editType.
 */
export type FeatureEditingEvent = {
  type: 'shapes:feature-editing';
  payload: FeatureEditingPayload;
  source: UniqueId;
  target?: UniqueId;
};

/**
 * Union of all edit shape event types
 */
export type EditShapeEvent =
  | ShapeEditingEvent
  | ShapeUpdatedEvent
  | ShapeEditCanceledEvent
  | FeatureEditingEvent;
