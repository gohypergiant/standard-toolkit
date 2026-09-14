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
import { useStream } from './use-stream';
import type { StreamObserverResult } from '../index';
import type { UseStreamOptions } from './use-stream';

export type UseWebSocketStreamOptions<T, TData = T> = Omit<
  UseStreamOptions<T, TData>,
  'transport'
>;

/**
 * `useSSEStream` over a WebSocket: same result shape, cache sharing, gcTime.
 * Reconnects with doubling backoff (WebSocket never retries on its own).
 * `uri` accepts http(s):// (converted) or ws(s)://. One streamKey = one
 * transport — reusing an SSE key logs an error, serves the original.
 *
 * @example
 * const { data, status, isConnected } = useWebSocketStream({
 *   streamKey: ['cortex-stats-ws', cortexUri],
 *   uri: `${cortexUri}/ws/health`,
 *   onMessage: (data) => console.log('New data:', data),
 * });
 */
export function useWebSocketStream<T = unknown, TData = T>(
  options: UseWebSocketStreamOptions<T, TData>,
): StreamObserverResult<TData, T> {
  return useStream<T, TData>({ ...options, transport: 'websocket' });
}
