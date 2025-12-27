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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { DisplayShape, ShapeFeatureType } from '../shared/types';

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
 * Event payload for shapes:drawing
 * Emitted when drawing starts
 */
export type ShapeDrawingEvent = Payload<
  'shapes:drawing',
  {
    /** The shape type being drawn */
    shapeType: ShapeFeatureType;
    /** Map instance ID for multi-map event isolation */
    mapId: UniqueId;
  }
>;

/**
 * Payload for shapes:drawn event.
 * Note: DisplayShape contains GeoJSON Feature which is structurally cloneable
 * but lacks the index signature TypeScript requires. We define the payload
 * separately and use type assertions when emitting.
 */
export type ShapeDrawnPayload = {
  /** The completed shape */
  shape: DisplayShape;
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
 * Event payload for shapes:draw-canceled
 * Emitted when drawing is canceled
 */
export type ShapeDrawCanceledEvent = Payload<
  'shapes:draw-canceled',
  {
    /** The shape type that was being drawn */
    shapeType: ShapeFeatureType;
    /** Map instance ID for multi-map event isolation */
    mapId: UniqueId;
  }
>;

/**
 * Union of all draw shape event types
 */
export type DrawShapeEvent =
  | ShapeDrawingEvent
  | ShapeDrawnEvent
  | ShapeDrawCanceledEvent;
