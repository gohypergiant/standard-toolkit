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

import { hashKey, notifyManager } from '@tanstack/query-core';
import { Stream } from './stream';
import { Subscribable } from './subscribable';
import type {
  DecodeFn,
  StreamCacheLike,
  StreamCacheNotifyEvent,
  StreamObserverLike,
  StreamState,
} from './stream';
import type { TransportKind } from './transport';
import type { StreamKey } from './types';

type StreamCacheListener = (event: StreamCacheNotifyEvent) => void;

/** QueryCache analog: stores Streams by hashed key. State lives on Stream. */
export class StreamCache
  extends Subscribable<StreamCacheListener>
  implements StreamCacheLike
{
  #streams = new Map<string, Stream>();

  /** Get existing or create. QueryCache#build analog. */
  build<T = unknown>(
    streamKey: StreamKey,
    uri: string,
    options?: {
      decodeFn?: DecodeFn;
      gcTime?: number;
      messageHistory?: number;
      transport?: TransportKind;
    },
  ): Stream<T> {
    const streamHash = hashKey(streamKey);
    const existing = this.#streams.get(streamHash);

    if (existing) {
      // every consumer ratchets linger up — longest wins
      existing.setGcTime(options?.gcTime);
      existing.setMessageHistory(options?.messageHistory);

      if (existing.uri !== uri) {
        // key is identity, uri only used at creation — mismatch means the
        // caller silently gets the original uri's data
        console.error(
          `[StreamCache] Stream ${streamHash} already exists for uri "${existing.uri}"; ignoring different uri "${uri}". Include the uri (or what it derives from) in the streamKey.`,
        );
      }

      // one key = one transport; mixing hooks silently serves the original
      if (
        options?.transport !== undefined &&
        options.transport !== existing.transport
      ) {
        console.error(
          `[StreamCache] Stream ${streamHash} already exists on transport "${existing.transport}"; ignoring request for "${options.transport}". Use a distinct streamKey per transport.`,
        );
      }

      return existing as Stream<T>;
    }

    const stream = new Stream<T>({
      streamKey,
      streamHash,
      uri,
      cache: this,
      decodeFn: options?.decodeFn,
      gcTime: options?.gcTime,
      messageHistory: options?.messageHistory,
      transport: options?.transport,
    });
    this.add(stream);

    return stream;
  }

  add(stream: Stream): void {
    if (!this.#streams.has(stream.streamHash)) {
      this.#streams.set(stream.streamHash, stream);
      this.notify({ type: 'added', stream, streamKey: stream.streamKey });
    }
  }

  remove(stream: Stream): void {
    const streamInMap = this.#streams.get(stream.streamHash);

    if (streamInMap) {
      // disarm gc — no timer may fire on a stream the cache no longer owns
      stream.destroy();
      stream.close();

      if (streamInMap === stream) {
        this.#streams.delete(stream.streamHash);
      }

      this.notify({ type: 'removed', stream, streamKey: stream.streamKey });
    }
  }

  get<T = unknown>(key: StreamKey): Stream<T> | undefined {
    const hash = hashKey(key);
    return this.#streams.get(hash) as Stream<T> | undefined;
  }

  getAll(): Stream[] {
    return Array.from(this.#streams.values());
  }

  getState<T>(key: StreamKey): StreamState<T> | undefined {
    return this.get<T>(key)?.state;
  }

  notify(event: StreamCacheNotifyEvent): void {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }

  getKeys(): string[] {
    return Array.from(this.#streams.keys());
  }

  getStreamCount(): number {
    return this.#streams.size;
  }

  getObservers(key: StreamKey): Set<StreamObserverLike<unknown>> {
    const stream = this.get(key);
    return stream ? new Set(stream.observers) : new Set();
  }

  clear(): void {
    this.getAll().forEach((stream) => {
      this.remove(stream);
    });
  }
}

// defined in stream.ts for acyclicity; still this module's public surface
export type { StreamCacheNotifyEvent, StreamState } from './stream';
