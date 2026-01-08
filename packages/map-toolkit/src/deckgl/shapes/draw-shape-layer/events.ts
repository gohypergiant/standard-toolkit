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

/**
 * Draw Shape Events
 *
 * Note on event payload structure:
 * These events define explicit payload types rather than using the `Payload<T, P>` helper
 * from @accelint/bus. This is because the `Shape` type contains GeoJSON `Feature` objects
 * from the `geojson` package, which don't satisfy TypeScript's `StructuredCloneable` type
 * constraint used by the bus.
 *
 * The issue: `StructuredCloneable` (from type-fest) requires objects to have an index
 * signature `[key: string]: StructuredCloneable`, but GeoJSON interfaces define strict
 * property types without index signatures. At runtime, GeoJSON data IS structurally
 * cloneable (can be passed through postMessage, stored in IndexedDB, etc.), but
 * TypeScript can't verify this statically.
 *
 * Events that only contain primitive values (like ShapeId, mapId) can use the `Payload`
 * helper directly - see shared/events.ts for examples.
 *
 * When emitting these events via the bus, use type assertions:
 * @example
 * ```ts
 * bus.emit('shapes:drawn', {
 *   type: 'shapes:drawn',
 *   payload: { shape, mapId },
 *   source: componentId,
 * } as unknown as Payload);
 * ```
 */

'use client';

import type { UniqueId } from '@accelint/core';
import type { Shape, ShapeFeatureType } from '../shared/types';

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
  shapeType: ShapeFeatureType;
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
export type ShapeDrawnPayload = {
  /** The completed shape */
  shape: Shape;
  /** Map instance ID for multi-map event isolation */
  mapId: UniqueId;
};

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
  shapeType: ShapeFeatureType;
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
