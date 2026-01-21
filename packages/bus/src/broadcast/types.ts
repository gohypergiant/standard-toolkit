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
 * Configuration options for initializing a Broadcast instance.
 *
 * @example
 * ```typescript
 * const config: BroadcastConfig = {
 *   channelName: 'my-app-events',
 *   debug: true
 * };
 * ```
 */
export type BroadcastConfig = {
  channelName: string;
  debug?: boolean;
};

/**
 * Internal listener object that stores event handler metadata.
 *
 * @template P - Event payload type
 *
 * @example
 * ```typescript
 * const listener: Listener<MyPayload> = {
 *   id: uuid(),
 *   once: false,
 *   callback: (data) => console.log(data)
 * };
 * ```
 */
export type Listener<P extends { type: string; payload?: unknown } = Payload> =
  {
    id: UniqueId;
    once?: boolean;
    callback: (data: P) => void;
  };

/**
 * Type alias for data that can be serialized using the structured clone algorithm.
 * Used for event payloads transmitted via BroadcastChannel.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 *
 * @example
 * ```typescript
 * type MyEventPayload = StructuredCloneableData;
 * ```
 */
export type StructuredCloneableData = StructuredCloneable;

/**
 * Event payload type with optional data and targeting information.
 * Supports both payloaded and payload-less events.
 *
 * @template T - Event type identifier string
 * @template P - Event payload data (defaults to undefined for payload-less events)
 *
 * @example
 * ```typescript
 * // Event with payload
 * type LoginEvent = Payload<'USER_LOGIN', { userId: string }>;
 *
 * // Event without payload
 * type LogoutEvent = Payload<'USER_LOGOUT'>;
 * ```
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
 * Utility type to extract a specific event type from a union of events.
 * Maps event types to their corresponding payload structures.
 *
 * @template P - Union type of all event payloads
 * @template T - Specific event type to extract
 *
 * @example
 * ```typescript
 * type Events = Payload<'LOGIN', { userId: string }> | Payload<'LOGOUT'>;
 * type LoginEvent = ExtractEvent<Events, 'LOGIN'>;
 * // Result: { type: 'LOGIN', payload: { userId: string }, source: UniqueId, target?: UniqueId }
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
 * Options for controlling event emission targeting.
 *
 * @example
 * ```typescript
 * const options: EmitOptions = { target: 'self' }; // Only this instance
 * const options2: EmitOptions = { target: 'others' }; // All except this instance
 * const options3: EmitOptions = { target: 'all' }; // All instances (default)
 * const options4: EmitOptions = { target: specificId }; // Specific instance by ID
 * ```
 */
export type EmitOptions = {
  target?: 'all' | 'others' | 'self' | UniqueId;
};
