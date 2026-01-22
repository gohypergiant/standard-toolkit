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
 */
export type BroadcastConfig = {
  /** The name of the BroadcastChannel to use for communication. */
  channelName: string;

  /** Enable debug logging for troubleshooting. */
  debug?: boolean;
};

/**
 * Listener object type.
 *
 * @template P - The payload type for events this listener handles.
 */
export type Listener<P extends { type: string; payload?: unknown } = Payload> =
  {
    /** Unique identifier for this listener. */
    id: UniqueId;

    /** Whether this listener should be removed after first invocation. */
    once?: boolean;

    /** The callback function to invoke when the event is received. */
    callback: (data: P) => void;
  };

/**
 * Data that can be serialized via the structured clone algorithm.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 */
export type StructuredCloneableData = StructuredCloneable;

/**
 * Listener callback payload type.
 *
 * @template T - The event type string.
 * @template P - The payload data type (optional, defaults to undefined for events without payloads).
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
 * Utility type to extract a specific event from a payload union by its type.
 *
 * @template P - The union of all payload types.
 * @template T - The specific event type to extract.
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
 * Options for controlling event delivery scope.
 */
export type EmitOptions = {
  /** Target audience for the event: 'all' contexts, 'others' (not self), 'self' only, or a specific context ID. */
  target?: 'all' | 'others' | 'self' | UniqueId;
};
