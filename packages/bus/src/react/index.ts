// __private-exports
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

import { useEffect, useRef } from 'react';
import { Broadcast } from '../broadcast';
import { useEffectEvent } from './ponyfill';
import type { StructuredCloneable } from 'type-fest';
import type {
  BasicPayload,
  EmitOptions,
  ExtractEvent,
  Payload,
} from '../broadcast/types';

export { useEffectEvent } from './ponyfill';

/**
 * A convenience wrapper for useEmit & useOn, to pass down types instead of having
 * to reimplement generics each time.
 *
 * @template Events - The union of all payload types for the bus.
 * @param options - Emit options that will be applied for all emits of all events.
 * @returns An object containing type-safe useEmit, useOn, and useOnce hooks.
 *
 * @example
 * ```typescript
 * type MyEvents = Payload<'user:login', { userId: string }> | Payload<'user:logout'>;
 * const { useEmit, useOn } = useBus<MyEvents>();
 * const emitLogin = useEmit('user:login');
 * useOn('user:logout', (event) => console.log('User logged out'));
 * ```
 */
export function useBus<
  Events extends BasicPayload = Payload<string, StructuredCloneable>,
>(options?: EmitOptions | null) {
  const bus = useRef(Broadcast.getInstance<Events>());

  useEffect(() => {
    if (options !== undefined) {
      bus.current.setGlobalEmitOptions(options);
    }
  }, [options]);

  // Casting here because we lose inference on the type parameter
  return {
    useEmit: useEmit as <Type extends Events['type']>(
      type: Type,
      options?: EmitOptions | null,
    ) => ReturnType<typeof useEmit<Events, Type>>,
    useOn: useOn as <Type extends Events['type']>(
      type: Type,
      callback: (data: ExtractEvent<Events, Type>) => void,
    ) => void,
    useOnce: useOnce as <Type extends Events['type']>(
      type: Type,
      callback: (data: ExtractEvent<Events, Type>) => void,
    ) => void,
  };
}

/**
 * React hook to enable render-safe emitting of event with payload that is type safe.
 *
 * @template Events - Union of event types.
 * @template Type - Type of event.
 * @param type - Event type, one of the event types in the union.
 * @param options - Emit options that will be applied for all emits of this event.
 * @returns Callback that will accept the corresponding payload to the previously entered event type; callback will accept options as well that are not applied to all emits of this event type.
 *
 * @example
 * ```typescript
 * const emitLogin = useEmit<MyEvents, 'user:login'>('user:login');
 * emitLogin({ userId: '123' });
 * ```
 */
export function useEmit<
  // biome-ignore lint/suspicious/noExplicitAny: intentional
  Events extends BasicPayload = Payload<string, any>,
  Type extends Events['type'] = Events['type'],
>(
  type: Type,
  options?: EmitOptions | null,
): ExtractEvent<Events, Type> extends { payload: infer Data }
  ? (payload: Data, options?: EmitOptions) => void
  : (payload?: undefined, options?: EmitOptions) => void {
  const bus = useRef(Broadcast.getInstance<Events>());

  useEffect(() => {
    if (options !== undefined) {
      bus.current.setEventEmitOptions(type, options);
    }
  }, [options, type]);

  return useEffectEvent(
    (
      payload: ExtractEvent<Events, Type> extends { payload: infer Data }
        ? Data
        : never,
      options?: EmitOptions,
    ) => {
      bus.current.emit(type, payload, options);
    },
  ) as ReturnType<typeof useEmit<Events, Type>>;
}

/**
 * React hook to attach event bus listener with type safe callback.
 *
 * @template Events - Union of event types.
 * @template Type - Type of event.
 * @param type - Event type.
 * @param callback - Handler that matches event type and receives corresponding payload.
 *
 * @example
 * ```typescript
 * useOn<MyEvents, 'user:login'>('user:login', (event) => {
 *   console.log('User logged in:', event.payload.userId);
 * });
 * ```
 */
export function useOn<
  Events extends BasicPayload = Payload<string, StructuredCloneable>,
  Type extends Events['type'] = Events['type'],
>(type: Type, callback: (data: ExtractEvent<Events, Type>) => void) {
  const bus = useRef(Broadcast.getInstance<Events>());
  const onCallback = useEffectEvent(callback);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onCallback is stable
  useEffect(() => bus.current.on(type, onCallback), [type]);
}

/**
 * React hook to attach event bus listener with type safe callback that executes only once.
 *
 * @template Events - Union of event types.
 * @template Type - Type of event.
 * @param type - Event type.
 * @param callback - Handler that matches event type and receives corresponding payload.
 *
 * @example
 * ```typescript
 * useOnce<MyEvents, 'user:login'>('user:login', (event) => {
 *   console.log('First login detected:', event.payload.userId);
 * });
 * ```
 */
export function useOnce<
  Events extends BasicPayload = Payload<string, StructuredCloneable>,
  Type extends Events['type'] = Events['type'],
>(type: Type, callback: (data: ExtractEvent<Events, Type>) => void) {
  const bus = useRef(Broadcast.getInstance<Events>());
  const onCallback = useEffectEvent(callback);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onCallback is stable
  useEffect(() => bus.current.once(type, onCallback), [type]);
}
