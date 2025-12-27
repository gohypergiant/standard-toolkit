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

'use client';

import type { UniqueId } from '@accelint/core';
import type { DisplayShape } from '../shared/types';

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
} as const;

export type EditShapeEventType =
  (typeof EditShapeEvents)[keyof typeof EditShapeEvents];

/**
 * Payload for shapes:editing event.
 * Note: DisplayShape contains GeoJSON Feature which is structurally cloneable
 * but lacks the index signature TypeScript requires. We define the payload
 * separately and use type assertions when emitting.
 */
export type ShapeEditingPayload = {
  /** The shape being edited */
  shape: DisplayShape;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
};

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
 * Note: DisplayShape contains GeoJSON Feature which is structurally cloneable
 * but lacks the index signature TypeScript requires. We define the payload
 * separately and use type assertions when emitting.
 */
export type ShapeUpdatedPayload = {
  /** The updated shape with new geometry */
  shape: DisplayShape;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
};

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
export type ShapeEditCanceledPayload = {
  /** The shape that was being edited (original, unchanged) */
  shape: DisplayShape;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
};

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
 * Union of all edit shape event types
 */
export type EditShapeEvent =
  | ShapeEditingEvent
  | ShapeUpdatedEvent
  | ShapeEditCanceledEvent;
