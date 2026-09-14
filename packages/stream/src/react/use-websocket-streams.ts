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
import { useStreams } from './use-streams';
import type { UseWebSocketStreamOptions } from './use-websocket-stream';
import type { UseStreamsOptions, UseStreamsResult } from './use-streams';

/** Per-stream entry — the singular WS hook's options minus the shared client. */
export type UseWebSocketStreamsConfig<T = unknown, TData = T> = Omit<
  UseWebSocketStreamOptions<T, TData>,
  'client'
>;

export type UseWebSocketStreamsResult<
  T = unknown,
  TData = T,
> = UseStreamsResult<T, TData>;

export type UseWebSocketStreamsOptions<
  T = unknown,
  TData = T,
  TCombined = UseWebSocketStreamsResult<T, TData>,
> = UseStreamsOptions<T, TData, TCombined>;

/**
 * `useSSEStreams` over WebSockets: one hook call for a dynamic-length array
 * of WS stream configs, same reconcile/combine semantics. Each stream keeps
 * the singular hook's WS behavior (http(s) uri conversion, doubling-backoff
 * reconnect, one streamKey = one transport).
 */
export function useWebSocketStreams<
  T = unknown,
  TData = T,
  TCombined = UseWebSocketStreamsResult<T, TData>,
>(
  configs: readonly UseWebSocketStreamsConfig<T, TData>[],
  options?: UseWebSocketStreamsOptions<T, TData, TCombined>,
): TCombined {
  return useStreams<T, TData, TCombined>(
    configs.map((config) => ({ ...config, transport: 'websocket' as const })),
    options,
  );
}
