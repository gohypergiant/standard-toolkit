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
import type { UseSSEStreamOptions } from './use-sse-stream';
import type { UseStreamsOptions, UseStreamsResult } from './use-streams';

/** Per-stream entry — the singular SSE hook's options minus the shared client. */
export type UseSSEStreamsConfig<T = unknown, TData = T> = Omit<
  UseSSEStreamOptions<T, TData>,
  'client'
>;

export type UseSSEStreamsResult<T = unknown, TData = T> = UseStreamsResult<
  T,
  TData
>;

export type UseSSEStreamsOptions<
  T = unknown,
  TData = T,
  TCombined = UseSSEStreamsResult<T, TData>,
> = UseStreamsOptions<T, TData, TCombined>;

/**
 * `useSSEStreams` : `useQueries` = `useSSEStream` : `useQuery` — one hook
 * call for a dynamic-length array of SSE stream configs. Reach for this when
 * one component needs N streams and N changes at runtime (a merged feed);
 * with a component per dataset, prefer the singular hook per component.
 *
 * Without `combine`, returns per-stream results index-aligned with `configs`
 * (unchanged entries keep their references). With `combine`, returns the
 * derived value — structurally shared, so it keeps its reference when no
 * input changed, and re-renders skip when the derivation is unaffected.
 *
 * @example
 * const feed = useSSEStreams(
 *   datasets.map((dataset) => ({
 *     streamKey: ['activations', dataset.id],
 *     uri: `${baseUri}/datasets/${dataset.id}/stream`,
 *     messageHistory: 50,
 *   })),
 *   { combine: (results) => mergeByDataUpdatedAt(results) },
 * );
 */
export function useSSEStreams<
  T = unknown,
  TData = T,
  TCombined = UseSSEStreamsResult<T, TData>,
>(
  configs: readonly UseSSEStreamsConfig<T, TData>[],
  options?: UseSSEStreamsOptions<T, TData, TCombined>,
): TCombined {
  return useStreams<T, TData, TCombined>(
    configs.map((config) => ({ ...config, transport: 'sse' as const })),
    options,
  );
}
