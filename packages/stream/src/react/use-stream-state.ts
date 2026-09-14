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
import { notifyManager, replaceEqualDeep } from '@tanstack/query-core';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { matchStream } from '../index';
import { useStreamClient } from './stream-client-provider';
import type {
  StreamCache,
  StreamClient,
  StreamState,
  UseStreamStateOptions,
} from '../index';

/** Filter the cache and project each match through `select` (or its state). */
function getStreamStateResult<TResult = StreamState>(
  cache: StreamCache,
  options: UseStreamStateOptions<TResult>,
): TResult[] {
  return cache
    .getAll()
    .filter((stream) => matchStream(options.filters, stream))
    .map(
      (stream): TResult =>
        (options.select ? options.select(stream) : stream.state) as TResult,
    );
}

/**
 * Observe state of every stream matching `filters` — this library's version of
 * `useMutationState`/`useIsFetching`: a `useSyncExternalStore` read over the
 * cache itself, no separate app store to drift. Every change (transport
 * death, error, gc, devtools Close, reconnect) flows through the cache here.
 */
export function useStreamState<TResult = StreamState>(
  options: UseStreamStateOptions<TResult> = {},
  client?: StreamClient,
): TResult[] {
  const cache = useStreamClient(client).getStreamCache();
  const optionsRef = useRef(options);
  const result = useRef<TResult[] | null>(null);
  if (result.current === null) {
    result.current = getStreamStateResult(cache, options);
  }

  useEffect(() => {
    optionsRef.current = options;
  });

  return useSyncExternalStore(
    useCallback(
      (onStoreChange) =>
        cache.subscribe(() => {
          const nextResult = replaceEqualDeep(
            result.current,
            getStreamStateResult(cache, optionsRef.current),
          );
          if (result.current !== nextResult) {
            result.current = nextResult;
            notifyManager.schedule(onStoreChange);
          }
        }),
      [cache],
    ),
    () => result.current,
    () => result.current,
  ) as TResult[];
}
