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

import type { UniqueId } from '@accelint/core';
import type { StructuredCloneable } from 'type-fest';

/**
 * Broadcast configuration type.
 *
 * @property channelName - The name of the BroadcastChannel to use for cross-context communication.
 * @property debug - Enable debug logging (optional).
 */
export type BroadcastConfig = {
  channelName: string;
  debug?: boolean;
};

/**
 * Listener object type.
 *
 * @template P - The payload type for the event.
 *
 * @property id - Unique identifier for the listener.
 * @property once - Whether the listener should be removed after first invocation (optional).
 * @property callback - The callback function to execute when the event is received.
 */
export type Listener<P extends { type: string; payload?: unknown } = Payload> =
  {
    id: UniqueId;
    once?: boolean;
    callback: (data: P) => void;
  };

/**
 * Type alias for data that can be serialized using the structured clone algorithm.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 */
export type StructuredCloneableData = StructuredCloneable;

/**
 * Listener callback payload type.
 *
 * @template T - The event type identifier.
 * @template P - The payload data type (must be structured cloneable).
 *
 * @property type - The event type identifier.
 * @property payload - The event data (only present when P is not undefined).
 * @property source - The unique ID of the Broadcast instance that emitted the event.
 * @property target - The unique ID of the intended recipient (optional, omit for broadcast to all).
 */
export type Payload<
  T extends string = string,
  P extends StructuredCloneableData = undefined,
> = P extends undefined
  ? {
      type: T;
      source: UniqueId;
      target?: UniqueId;
    }
  : {
      type: T;
      payload: P;
      source: UniqueId;
      target?: UniqueId;
    };

/**
 * Utility type to extract a specific event from a union of event types.
 *
 * @template P - The union of all possible payload types.
 * @template T - The specific event type to extract.
 *
 * @example
 * ```typescript
 * type Events = Payload<'click', { x: number }> | Payload<'hover', { id: string }>;
 * type ClickEvent = ExtractEvent<Events, 'click'>; // { type: 'click', payload: { x: number }, source: UniqueId, target?: UniqueId }
 * ```
 */
export type ExtractEvent<
  P extends { type: string; payload?: unknown } = Payload<
    string,
    StructuredCloneableData
  >,
  T extends P['type'] = P['type'],
> = {
  [K in P['type']]: Extract<P, { type: K }>;
}[T];

/**
 * Options for controlling event emission behavior.
 *
 * @property target - Controls who receives the event:
 *   - 'all': Deliver to all listeners including the emitting instance (default)
 *   - 'others': Deliver to all listeners except the emitting instance
 *   - 'self': Deliver only to the emitting instance
 *   - UniqueId: Deliver only to a specific Broadcast instance by ID
 */
export type EmitOptions = {
  target?: 'all' | 'others' | 'self' | UniqueId;
};
