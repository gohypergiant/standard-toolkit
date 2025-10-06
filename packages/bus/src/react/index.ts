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
import type { EmitOptions, ExtractEvent, Payload } from '../broadcast/types';

/**
 * A convenience wrapper for useEmit & useOn, to pass down types instead of having
 * to reimplement generics each time
 * @param options emit options that will be applied for all emits of all events
 */
export function useBus<
  // biome-ignore lint/suspicious/noExplicitAny: intentional
  P extends { type: string; payload?: unknown } = Payload<string, any>,
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
 * @template P union of event types
 * @template T type of event
 * @param type of type T, one of the event types
 * @param options emit options that will be applied for all emits of this event
 * @returns callback that will accept the cooresponding payload to the previously entered event type, callback will accept options as well that are not applied to all emits of this event type
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
 * @param type event type
 * @param callback handler that matches event type and receives cooresponding payload
 */
export function useOn<
  // biome-ignore lint/suspicious/noExplicitAny: intentional
  P extends { type: string; payload?: unknown } = Payload<string, any>,
  T extends P['type'] = P['type'],
>(type: T, callback: (data: ExtractEvent<P, T>) => void) {
  const bus = useRef(Broadcast.getInstance<P>());
  const onCallback = useEffectEvent(callback);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onCallback is stable
  useEffect(() => bus.current.on(type, onCallback), [type]);
}

/**
 * React hook to attach event bus listener with type safe callback, once
 * @param type event type
 * @param callback handler that matches event type and receives cooresponding payload
 */
export function useOnce<
  // biome-ignore lint/suspicious/noExplicitAny: intentional
  P extends { type: string; payload?: unknown } = Payload<string, any>,
  T extends P['type'] = P['type'],
>(type: T, callback: (data: ExtractEvent<P, T>) => void) {
  const bus = useRef(Broadcast.getInstance<P>());
  const onCallback = useEffectEvent(callback);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onCallback is stable
  useEffect(() => bus.current.once(type, onCallback), [type]);
}
