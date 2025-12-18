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
import type { ShapeId } from './types';

/**
 * Shape interaction events for DisplayShapeLayer
 */
export const ShapeEvents = {
  /** Shape selected */
  selected: 'shapes:selected',
  /** Selection cleared */
  deselected: 'shapes:deselected',
  /** Shape hovered (for cursor changes) */
  hovered: 'shapes:hovered',
} as const;

export type ShapeEventType = (typeof ShapeEvents)[keyof typeof ShapeEvents];

/**
 * Event payload types (all payloads are serializable)
 */

export type ShapeSelectedEvent = Payload<
  'shapes:selected',
  {
    shapeId: ShapeId;
    /** Map instance ID for multi-map event isolation */
    mapId: UniqueId;
  }
>;

export type ShapeDeselectedEvent = Payload<
  'shapes:deselected',
  {
    /** Map instance ID for multi-map event isolation */
    mapId: UniqueId;
  }
>;

export type ShapeHoveredEvent = Payload<
  'shapes:hovered',
  {
    /** Shape ID being hovered, or null when hover ends */
    shapeId: ShapeId | null;
    /** Map instance ID for multi-map event isolation */
    mapId: UniqueId;
  }
>;

/**
 * Union of all shape event types
 */
export type ShapeEvent =
  | ShapeSelectedEvent
  | ShapeDeselectedEvent
  | ShapeHoveredEvent;

/**
 * Aliases for backward compatibility
 */
export const SHAPE_EVENTS = ShapeEvents;
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
