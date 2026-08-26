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

import { StreamCache } from './stream-cache';
import { matchStream } from './utils';
import type { Stream } from './stream';
import type { StreamState } from './stream-cache';
import type { StreamFilters, StreamKey } from './types';

export type StreamClientConfig = {
  cache?: StreamCache;
  // Future: defaultOptions, logger, etc.
};

/** QueryClient analog — entry point for managing streams. */
export class StreamClient {
  #cache: StreamCache;
  #mountCount = 0;

  constructor(config: StreamClientConfig = {}) {
    this.#cache = config.cache || new StreamCache();
  }

  getStreamCache(): StreamCache {
    return this.#cache;
  }

  /** QueryClient.getQueryData analog. */
  getStreamState<T = unknown>(
    streamKey: StreamKey,
  ): StreamState<T> | undefined {
    return this.#cache.getState<T>(streamKey);
  }

  getStreamKeys(): string[] {
    return this.#cache.getKeys();
  }

  /** Streams matching filters (all if none) — imperative useStreamState sibling. */
  getStreams(filters?: StreamFilters): Stream[] {
    if (!filters) {
      return this.#cache.getAll();
    }
    return this.#cache
      .getAll()
      .filter((stream) => matchStream(filters, stream));
  }

  /** Count matching filters — queryClient.isFetching analog. */
  getStreamCount(filters?: StreamFilters): number {
    if (!filters) {
      return this.#cache.getStreamCount();
    }
    return this.getStreams(filters).length;
  }

  clear(): void {
    this.#cache.clear();
  }

  /** Provider mount refcount — supports multiple providers. */
  mount(): void {
    this.#mountCount++;
    // Future: subscribe to focus/online managers
  }

  unmount(): void {
    this.#mountCount--;
    if (this.#mountCount === 0) {
      // Future: unsubscribe from managers
    }
  }
}
