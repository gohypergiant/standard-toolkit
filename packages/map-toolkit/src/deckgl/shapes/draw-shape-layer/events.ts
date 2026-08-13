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
 * Draw Shape Events
 *
 * `ShapeDrawnPayload` is wrapped with `BusCloneable<T>` (see shared/types.ts)
 * because it carries a `Shape` (which contains a GeoJSON `Feature`); GeoJSON
 * data is cloneable at runtime but lacks the index signature type-fest's
 * `StructuredCloneable` requires. Payloads that only carry primitives don't
 * need the wrapper. Events restricted to primitive values can use the
 * `Payload<T, P>` helper from `@accelint/bus` directly (see shared/events.ts).
 */

'use client';

import type { UniqueId } from '@accelint/core';
import type { BusCloneable, Shape } from '../shared/types';
import type { DrawableShapeType } from './types';

/**
 * Drawing lifecycle events
 */
export const DrawShapeEvents = {
  /** Drawing has started for a shape type */
  drawing: 'shapes:drawing',
  /** Shape has been successfully drawn/created */
  drawn: 'shapes:drawn',
  /** Drawing was canceled */
  canceled: 'shapes:draw-canceled',
} as const;

export type DrawShapeEventType =
  (typeof DrawShapeEvents)[keyof typeof DrawShapeEvents];

/**
 * Payload for shapes:drawing event.
 */
export type ShapeDrawingPayload = {
  /** The shape type being drawn */
  shapeType: DrawableShapeType;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
};

/**
 * Event payload for shapes:drawing
 * Emitted when drawing starts
 */
export type ShapeDrawingEvent = {
  type: 'shapes:drawing';
  payload: ShapeDrawingPayload;
  source: UniqueId;
  target?: UniqueId;
};

/**
 * Payload for shapes:drawn event.
 */
export type ShapeDrawnPayload = BusCloneable<{
  /** The completed shape */
  shape: Shape;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
}>;

/**
 * Event payload for shapes:drawn
 * Emitted when a shape is successfully created
 */
export type ShapeDrawnEvent = {
  type: 'shapes:drawn';
  payload: ShapeDrawnPayload;
  source: UniqueId;
  target?: UniqueId;
};

/**
 * Payload for shapes:draw-canceled event.
 */
export type ShapeDrawCanceledPayload = {
  /** The shape type that was being drawn */
  shapeType: DrawableShapeType;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
};

/**
 * Event payload for shapes:draw-canceled
 * Emitted when drawing is canceled
 */
export type ShapeDrawCanceledEvent = {
  type: 'shapes:draw-canceled';
  payload: ShapeDrawCanceledPayload;
  source: UniqueId;
  target?: UniqueId;
};

/**
 * Union of all draw shape event types
 */
export type DrawShapeEvent =
  | ShapeDrawingEvent
  | ShapeDrawnEvent
  | ShapeDrawCanceledEvent;
