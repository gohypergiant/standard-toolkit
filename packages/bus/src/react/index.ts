// __private-exports
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

import { useEffect, useRef } from 'react';
import { Broadcast } from '../broadcast';
import { useEffectEvent } from './ponyfill';
import type { StructuredCloneable } from 'type-fest';
import type { EmitOptions, ExtractEvent, Payload } from '../broadcast/types';

export { useEffectEvent } from './ponyfill';

/**
 * A convenience wrapper for useEmit & useOn, to pass down types instead of having
 * to reimplement generics each time
 *
 * @template P - The union of all possible event payload types.
 * @param options - Emit options that will be applied for all emits of all events.
 * @returns Object containing useEmit, useOn, and useOnce hooks with proper typing.
 *
 * @example
 * ```typescript
 * type Events = Payload<'click', { x: number }> | Payload<'hover', { id: string }>;
 * const { useEmit, useOn } = useBus<Events>();
 * const emitClick = useEmit('click');
 * useOn('hover', (e) => console.log(e.payload.id));
 * ```
 */
export function useBus<
  P extends { type: string; payload?: unknown } = Payload<
    string,
    StructuredCloneable
  >,
>(options?: EmitOptions | null) {
  const bus = useRef(Broadcast.getInstance<P>());

  useEffect(() => {
    if (options !== undefined) {
      bus.current.setGlobalEmitOptions(options);
    }
  }, [options]);

  // casting here because we lose inference on the type parameter
  return {
    useEmit: useEmit as <T extends P['type']>(
      type: T,
      options?: EmitOptions | null,
    ) => ReturnType<typeof useEmit<P, T>>,
    useOn: useOn as <T extends P['type']>(
      type: T,
      callback: (data: ExtractEvent<P, T>) => void,
    ) => void,
    useOnce: useOnce as <T extends P['type']>(
      type: T,
      callback: (data: ExtractEvent<P, T>) => void,
    ) => void,
  };
}

/**
 * React hook to enable render-safe emitting of event with payload that is type safe
 *
 * @template P - Union of event types.
 * @template T - Type of event.
 * @param type - Type of event, one of the event types.
 * @param options - Emit options that will be applied for all emits of this event.
 * @returns Callback that will accept the corresponding payload to the previously entered event type, callback will accept options as well that are not applied to all emits of this event type.
 *
 * @example
 * ```typescript
 * const emitClick = useEmit('click', { target: 'others' });
 * emitClick({ x: 100, y: 200 });
 * ```
 */
export function useEmit<
  // biome-ignore lint/suspicious/noExplicitAny: intentional
  P extends { type: string; payload?: unknown } = Payload<string, any>,
  T extends P['type'] = P['type'],
>(
  type: T,
  options?: EmitOptions | null,
): ExtractEvent<P, T> extends { payload: infer Data }
  ? (payload: Data, options?: EmitOptions) => void
  : (payload?: undefined, options?: EmitOptions) => void {
  const bus = useRef(Broadcast.getInstance<P>());

  useEffect(() => {
    if (options !== undefined) {
      bus.current.setEventEmitOptions(type, options);
    }
  }, [options, type]);

  return useEffectEvent(
    (
      payload: ExtractEvent<P, T> extends { payload: infer Data }
        ? Data
        : never,
      options?: EmitOptions,
    ) => {
      bus.current.emit(type, payload, options);
    },
  ) as ReturnType<typeof useEmit<P, T>>;
}

/**
 * React hook to attach event bus listener with type safe callback
 *
 * @template P - Union of event types.
 * @template T - Type of event.
 * @param type - Event type.
 * @param callback - Handler that matches event type and receives corresponding payload.
 * @returns void
 *
 * @example
 * ```typescript
 * useOn('click', (e) => {
 *   console.log('Clicked at', e.payload.x, e.payload.y);
 * });
 * ```
 */
export function useOn<
  P extends { type: string; payload?: unknown } = Payload<
    string,
    StructuredCloneable
  >,
  T extends P['type'] = P['type'],
>(type: T, callback: (data: ExtractEvent<P, T>) => void) {
  const bus = useRef(Broadcast.getInstance<P>());
  const onCallback = useEffectEvent(callback);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onCallback is stable
  useEffect(() => bus.current.on(type, onCallback), [type]);
}

/**
 * React hook to attach event bus listener with type safe callback, once
 *
 * @template P - Union of event types.
 * @template T - Type of event.
 * @param type - Event type.
 * @param callback - Handler that matches event type and receives corresponding payload.
 * @returns void
 *
 * @example
 * ```typescript
 * useOnce('init', (e) => {
 *   console.log('Initialized with', e.payload);
 * });
 * ```
 */
export function useOnce<
  P extends { type: string; payload?: unknown } = Payload<
    string,
    StructuredCloneable
  >,
  T extends P['type'] = P['type'],
>(type: T, callback: (data: ExtractEvent<P, T>) => void) {
  const bus = useRef(Broadcast.getInstance<P>());
  const onCallback = useEffectEvent(callback);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onCallback is stable
  useEffect(() => bus.current.once(type, onCallback), [type]);
}
