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

'use client';
import { notifyManager } from '@tanstack/query-core';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { StreamObserver } from '../index';
import { useStreamClient } from './stream-client-provider';
import type {
  StreamClient,
  StreamObserverOptions,
  StreamObserverResult,
} from '../index';

export type UseStreamOptions<T, TData = T> = Omit<
  StreamObserverOptions<T, TData>,
  'streamKey' | 'uri'
> & {
  streamKey: readonly unknown[];
  uri: string;
  client?: StreamClient;
};

/**
 * Shared core of `useSSEStream`/`useWebSocketStream` — the hooks only pick
 * the transport. Same streamKey shares one connection; observers differ by
 * `select` (QueryObserver semantics — see StreamObserverOptions).
 */
export function useStream<T = unknown, TData = T>(
  options: UseStreamOptions<T, TData>,
): StreamObserverResult<TData, T> {
  const streamClient = useStreamClient(options.client);
  const cache = streamClient.getStreamCache();

  // observer is pinned to its cache. If the provider swaps clients (HMR
  // resets the browser singleton → fresh client), a kept observer streams
  // against the dead cache forever. Rebuild during render (React's
  // adjust-state-on-prop-change pattern); useSyncExternalStore keys
  // subscribe on the observer, so the old one unsubscribes (stream → gc
  // linger) and the new one subscribes on the new cache.
  const [current, setCurrent] = useState(() => ({
    cache,
    observer: new StreamObserver<T, TData>(cache, options),
  }));
  const next =
    current.cache === cache
      ? current
      : { cache, observer: new StreamObserver<T, TData>(cache, options) };
  if (next !== current) {
    setCurrent(next);
  }
  const { observer } = next;

  useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);

  const result = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        const unsubscribe = observer.subscribe(
          notifyManager.batchCalls(onStoreChange),
        );

        return unsubscribe;
      },
      [observer],
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult(),
  );

  return result;
}
