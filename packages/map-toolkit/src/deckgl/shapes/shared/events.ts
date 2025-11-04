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
import type { EditMode, ShapeId } from './types';

/**
 * Shape lifecycle and interaction events
 *
 * Note: No shapes:clicked or shapes:hovered events - use BaseMap's map:click and map:hover instead
 */
export const ShapeEvents = {
  /** Started drawing new shape */
  drawing: 'shapes:drawing',
  /** Finished drawing (temporary, not saved) */
  drawn: 'shapes:drawn',
  /** Started editing existing shape */
  editing: 'shapes:editing',
  /** Updated shape (temporary, not saved) */
  updated: 'shapes:updated',
  /** Cancelled draw/edit operation */
  cancelled: 'shapes:cancelled',
  /** Shape committed/saved */
  saved: 'shapes:saved',
  /** Shape deleted */
  deleted: 'shapes:deleted',
  /** Shape selected */
  selected: 'shapes:selected',
  /** Selection cleared */
  deselected: 'shapes:deselected',
  /** Validation error (consumer integrates with NoticeList) */
  validationError: 'shapes:validation-error',
} as const;

export type ShapeEventType = (typeof ShapeEvents)[keyof typeof ShapeEvents];

/**
 * Shape modes for map-mode integration
 */
export const ShapeModes = {
  DRAW_CIRCLE: 'shapes:draw:circle',
  DRAW_POLYGON: 'shapes:draw:polygon',
  DRAW_LINE: 'shapes:draw:line',
  DRAW_POINT: 'shapes:draw:point',
  EDIT_MODIFY: 'shapes:edit:modify',
  EDIT_TRANSLATE: 'shapes:edit:translate',
  // Future: Rectangle, Multi* shapes
} as const;

export type ShapeMode = (typeof ShapeModes)[keyof typeof ShapeModes];

/**
 * Event payload types (all payloads are serializable)
 */

export type ShapeDrawingEvent = Payload<
  'shapes:drawing',
  {
    mode: EditMode;
  }
>;

export type ShapeDrawnEvent = Payload<
  'shapes:drawn',
  {
    shapeId: ShapeId;
  }
>;

export type ShapeEditingEvent = Payload<
  'shapes:editing',
  {
    shapeId: ShapeId;
  }
>;

export type ShapeUpdatedEvent = Payload<
  'shapes:updated',
  {
    shapeId: ShapeId;
  }
>;

export type ShapeCancelledEvent = Payload<'shapes:cancelled', null>;

export type ShapeSavedEvent = Payload<
  'shapes:saved',
  {
    shapeId: ShapeId;
  }
>;

export type ShapeDeletedEvent = Payload<
  'shapes:deleted',
  {
    shapeId: ShapeId;
  }
>;

export type ShapeSelectedEvent = Payload<
  'shapes:selected',
  {
    shapeId: ShapeId;
  }
>;

export type ShapeDeselectedEvent = Payload<'shapes:deselected', null>;

export type ShapeValidationErrorEvent = Payload<
  'shapes:validation-error',
  {
    errors: string[];
    warnings?: string[];
  }
>;

/**
 * Union of all shape event types
 */
export type ShapeEvent =
  | ShapeDrawingEvent
  | ShapeDrawnEvent
  | ShapeEditingEvent
  | ShapeUpdatedEvent
  | ShapeCancelledEvent
  | ShapeSavedEvent
  | ShapeDeletedEvent
  | ShapeSelectedEvent
  | ShapeDeselectedEvent
  | ShapeValidationErrorEvent;

/**
 * Edit shape modes for EditableShapeLayer
 */
export type EditShapeMode =
  | 'view'
  | 'drawCircle'
  | 'drawPolygon'
  | 'drawLine'
  | 'drawPoint'
  | 'modify';

/**
 * Aliases for backward compatibility
 */
export const SHAPE_EVENTS = ShapeEvents;
export const SHAPE_MODES = ShapeModes;
export type ShapeEventPayload = ShapeEvent;
export type ShapeEventHandler<T extends ShapeEventType = ShapeEventType> = (
  event: Extract<ShapeEvent, { type: T }>,
) => void;

/**
 * Shape events namespace for bus integration
 */
export const ShapeEventsNamespace = 'shapes';

/**
 * Note: These utility functions are deprecated in favor of direct bus usage.
 * Use `useEmit` and `useOn` from '@accelint/bus/react' in React components instead.
 *
 * @example
 * ```tsx
 * import { useEmit, useOn } from '@accelint/bus/react';
 * import { ShapeEvents } from '@accelint/map-toolkit/deckgl/shapes';
 *
 * function MyComponent() {
 *   const emit = useEmit();
 *
 *   // Emit shape selected event
 *   emit(ShapeEvents.selected, { shapeId: 'some-id' });
 *
 *   // Listen to shape events
 *   useOn(ShapeEvents.selected, (event) => {
 *     console.log('Shape selected:', event.data.shapeId);
 *   });
 * }
 * ```
 */
