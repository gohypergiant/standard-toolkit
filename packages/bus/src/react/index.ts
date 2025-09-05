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
import type { ExtractEvent, Payload } from '../broadcast/types';

/**
 * A convenience wrapper for useEmit & useOn, to pass down types instead of having
 * to reimplement generics each time
 */
export function useBus<P extends Payload = Payload>() {
  return {
    useEmit: useEmit<P>,
    useOn: useOn<P>,
  };
}

/**
 * React hook to enable render-safe emitting of event with payload that is type safe
 * @template P union of event types
 * @template T type of event
 * @param type of type T, one of the event types
 * @returns callback that will accept the cooresponding payload to the previously entered event type
 */
export function useEmit<
  P extends Payload = Payload,
  T extends P['type'] = P['type'],
>(type: T) {
  const bus = useRef(Broadcast.getInstance<P>());

  return useEffectEvent((payload: ExtractEvent<P, T>['payload']) => {
    bus.current.emit(type, payload);
  });
}

/**
 * React hook to attach event bus listener with type safe callback
 * @param type event type
 * @param callback handler that matches event type and receives cooresponding payload
 */
export function useOn<
  P extends Payload = Payload,
  T extends P['type'] = P['type'],
>(type: T, callback: (data: ExtractEvent<P, T>) => void) {
  const bus = useRef(Broadcast.getInstance<P>());
  const onCallback = useEffectEvent(callback);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onCallback is stable
  useEffect(() => bus.current.on(type, onCallback), [type]);
}
