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
import { StreamsObserver } from '../index';
import { useStreamClient } from './stream-client-provider';
import type {
  StreamClient,
  StreamsCombineFn,
  StreamsObserverResults,
} from '../index';
import type { UseStreamOptions } from './use-stream';

/** Per-stream entry — the singular hook's options minus the shared client. */
export type UseStreamsConfig<T = unknown, TData = T> = Omit<
  UseStreamOptions<T, TData>,
  'client'
>;

export type UseStreamsResult<T = unknown, TData = T> = StreamsObserverResults<
  T,
  TData
>;

export type UseStreamsOptions<
  T = unknown,
  TData = T,
  TCombined = UseStreamsResult<T, TData>,
> = {
  combine?: StreamsCombineFn<T, TData, TCombined>;
  client?: StreamClient;
};

/**
 * `useQueries` analog over `useStream`: one hook call — one
 * `useSyncExternalStore` subscription — for a dynamic-length array of stream
 * configs, where mapping the singular hook would break the Rules of Hooks.
 * The returned value reflects this render's config-array shape immediately
 * (optimistic reconcile, `useQueries` wiring); changes WITHIN a surviving
 * config commit in an effect, like the singular hook.
 */
export function useStreams<
  T = unknown,
  TData = T,
  TCombined = UseStreamsResult<T, TData>,
>(
  configs: readonly UseStreamsConfig<T, TData>[],
  options?: UseStreamsOptions<T, TData, TCombined>,
): TCombined {
  const streamClient = useStreamClient(options?.client);
  const cache = streamClient.getStreamCache();
  const combine = options?.combine;

  // client-swap wiring shared with useStream — see its comment
  const [current, setCurrent] = useState(() => ({
    cache,
    observer: new StreamsObserver<T, TData, TCombined>(cache, {
      streams: configs,
      combine,
    }),
  }));
  const next =
    current.cache === cache
      ? current
      : {
          cache,
          observer: new StreamsObserver<T, TData, TCombined>(cache, {
            streams: configs,
            combine,
          }),
        };
  if (next !== current) {
    setCurrent(next);
  }
  const { observer } = next;

  // note: this must be called before useSyncExternalStore
  const [, getCombinedResult] = observer.getOptimisticResult(configs, combine);

  useSyncExternalStore(
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

  useEffect(() => {
    observer.setOptions({ streams: configs, combine });
  }, [observer, configs, combine]);

  return getCombinedResult();
}
