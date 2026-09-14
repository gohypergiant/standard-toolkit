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

import type { StreamStatus } from './constants';
import type { Stream, StreamState } from './stream';
import type { TransportKind } from './transport';

/**
 * Stream identity, hashed structurally (via `hashKey`) exactly like
 * TanStack Query's `QueryKey` — everyone using the same key shares one
 * stream and its connection.
 */
export type StreamKey = readonly unknown[];

/** Cache-wide stream filters (`useStreamState`), TanStack query-filter shaped. */
export type StreamFilters = {
  /**
   * Prefix-matched (TanStack's `partialMatchKey`): `['cortex', 'activations']`
   * matches every activations stream. Set `exact` for whole-key matching.
   */
  streamKey?: StreamKey;
  exact?: boolean;
  status?: StreamStatus;
  transport?: TransportKind;
  /**
   * Final gate after the declarative filters (`QueryFilters.predicate`):
   * multi-status, observer counts, custom key logic.
   */
  predicate?: (stream: Stream) => boolean;
};

export type UseStreamStateOptions<TResult = StreamState> = {
  filters?: StreamFilters;
  /**
   * Narrows what each stream contributes AND what re-renders. No select =
   * full state incl. `data` → every message re-renders. Select stable fields
   * (e.g. status) to stay referentially frozen until they change.
   */
  select?: (stream: Stream) => TResult;
};
