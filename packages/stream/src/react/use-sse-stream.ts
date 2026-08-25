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

export type UseSSEStreamOptions<T, TData = T> = Omit<
  UseStreamOptions<T, TData>,
  'transport'
>;

/**
 * TanStack Query-style SSE hook. Same streamKey shares one EventSource.
 * Thin wrapper pinning the transport — `useWebSocketStream` = same over WS.
 *
 * @example
 * const { data, status, isConnected } = useSSEStream({
 *   streamKey: ['cortex-stats', cortexUri],
 *   uri: `${cortexUri}/stream/health`,
 *   onMessage: (data) => console.log('New data:', data),
 *   onError: (status) => console.error('Error:', status),
 * });
 */
export function useSSEStream<T = unknown, TData = T>(
  options: UseSSEStreamOptions<T, TData>,
): StreamObserverResult<TData, T> {
  return useStream<T, TData>({ ...options, transport: 'sse' });
}
