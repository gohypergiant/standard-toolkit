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

import { notifyManager, replaceEqualDeep } from '@tanstack/query-core';
import { STREAM_STATUS } from './constants';
import { Subscribable } from './subscribable';
import type { StreamStatus } from './constants';
import type {
  DecodeFn,
  Stream,
  StreamMessage,
  StreamObserverLike,
} from './stream';
import type { StreamCache } from './stream-cache';
import type { TransportKind } from './transport';
import type { StreamKey } from './types';

export type StreamObserverOptions<T, TData = T> = {
  streamKey: StreamKey;
  uri: string;
  enabled?: boolean;
  /**
   * Unobserved linger (connection open) before gc. Ratchets up across
   * observers; Infinity disables. 30s browser default (see removable.ts).
   */
  gcTime?: number;
  /** Set by the public hooks — one streamKey = one stream on one transport. */
  transport?: TransportKind;
  /**
   * Frame decoder (the lib's queryFn). Defaults to JSON-as-data. Fixed at
   * first build — first consumer wins.
   */
  decodeFn?: DecodeFn<T>;
  /**
   * Derive this observer's slice from stream data — QueryObserver
   * semantics: memoized on (data identity, select identity), result
   * structurally shared so a deep-equal slice keeps its reference. A
   * throwing select logs and keeps the previous slice (decodeFn
   * precedent). `onMessage` stays raw — select shapes state, not events.
   */
  select?: (data: T) => TData;
  /**
   * Retained-message cap for `result.messages`. Default 0 (off — no
   * retention cost); ratchets up across observers like gcTime. Entries
   * stay raw (select shapes `data`, not events).
   */
  messageHistory?: number;
  onOpen?: (status: StreamStatus) => void;
  onMessage?: (data: T) => void;
  onError?: (status: StreamStatus) => void;
};

export type StreamObserverResult<TData, TMessage = TData> = {
  data: TData | null;
  dataUpdatedAt: number;
  /**
   * Retained raw messages, oldest first (empty until `messageHistory` is
   * set). Shared per stream: identity changes on every retained message.
   */
  messages: readonly StreamMessage<TMessage>[];
  status: StreamStatus;
  isConnecting: boolean;
  isConnected: boolean;
  isError: boolean;
  isDisconnected: boolean;
  isEnabled: boolean;
  retry: () => void;
  pause: () => void;
  resume: () => void;
};

type StreamObserverListener<TData, TMessage> = (
  result: StreamObserverResult<TData, TMessage>,
) => void;

/** Shared empty for observers without a stream (mirrors Stream's constant). */
const NO_MESSAGES: readonly StreamMessage<never>[] = Object.freeze([]);

/**
 * QueryObserver analog: resolves the Stream from cache, subscribes, derives
 * results, fires user callbacks.
 */
export class StreamObserver<T = unknown, TData = T>
  extends Subscribable<StreamObserverListener<TData, T>>
  implements StreamObserverLike<T>
{
  #cache: StreamCache;
  #stream?: Stream<T>;
  #currentResult: StreamObserverResult<TData, T>;
  // apart from options.enabled so setOptions (every render) can't undo pause()
  #paused = false;
  // select memoization (QueryObserver's #selectFn/#selectResult)
  #selectFn?: (data: T) => TData;
  #selectSource?: T;
  #selectResult?: TData;

  options: StreamObserverOptions<T, TData>;

  constructor(cache: StreamCache, options: StreamObserverOptions<T, TData>) {
    super();

    this.#cache = cache;
    this.options = options;

    if (this.#enabled) {
      this.#stream = this.#buildStream();
    }

    this.#currentResult = this.#createResultFromStream();
  }

  get #enabled(): boolean {
    return (this.options.enabled ?? true) && !this.#paused;
  }

  /**
   * Resolve this observer's stream from the cache — the one home for the
   * DecodeFn<T> → DecodeFn variance erasure.
   */
  #buildStream(): Stream<T> {
    return this.#cache.build<T>(this.options.streamKey, this.options.uri, {
      decodeFn: this.options.decodeFn as DecodeFn,
      gcTime: this.options.gcTime,
      messageHistory: this.options.messageHistory,
      transport: this.options.transport,
    });
  }

  protected override onSubscribe(): void {
    this.#subscribe();

    // pick up dispatches between construction (render) and subscription (commit)
    this.#updateResultFromStream();
  }

  protected override onUnsubscribe(): void {
    if (!this.hasListeners()) {
      this.#unsubscribe();
    }
  }

  setOptions(options: StreamObserverOptions<T, TData>) {
    const prevEnabled = this.#enabled;

    this.options = options;

    const nextEnabled = this.#enabled;

    this.#updateStream();

    if (nextEnabled && !prevEnabled && this.hasListeners()) {
      this.#subscribe();
    } else if (!nextEnabled && prevEnabled) {
      this.#unsubscribe();
    }

    // re-derive so a changed streamKey doesn't keep showing the previous
    // stream's data/status (no-op when nothing changed)
    this.#updateResultFromStream();
  }

  /** Rebuild from cache and resubscribe if the stream changed. */
  #updateStream() {
    if (!this.#enabled) {
      if (this.#stream) {
        this.#unsubscribe();
      }
      return;
    }

    const stream = this.#buildStream();

    if (stream === this.#stream) {
      return;
    }

    const prevStream = this.#stream;
    this.#stream = stream;

    if (this.hasListeners()) {
      prevStream?.removeObserver(this);
      stream.addObserver(this);
    }
  }

  /** Rebuilds the stream if a prior unsubscribe released it. */
  #subscribe() {
    if (!this.#enabled) {
      return;
    }

    if (!this.#stream) {
      this.#stream = this.#buildStream();
    }

    this.#stream.addObserver(this);
  }

  #unsubscribe() {
    if (this.#stream) {
      this.#stream.removeObserver(this);
      this.#stream = undefined;
    }
  }

  getCurrentResult(): StreamObserverResult<TData, T> {
    return this.#currentResult;
  }

  /**
   * Reconnect. Re-resolves from cache first: after an external removal
   * (devtools Close/Clear All) the held ref is detached — retrying it would
   * open a connection the cache doesn't own. A swap to a rebuilt stream
   * already opened a fresh connection = the retry.
   */
  retry = () => {
    if (!this.#enabled) {
      return;
    }

    const previousStream = this.#stream;
    this.#updateStream();
    if (!this.#stream && this.hasListeners()) {
      this.#subscribe();
    }
    if (this.#stream !== previousStream) {
      this.#updateResultFromStream();
      return;
    }

    this.#stream?.retry();
  };

  /** Release the stream (closes if last observer) until resume(). */
  pause = () => {
    if (this.#paused) {
      return;
    }
    this.#paused = true;
    this.#unsubscribe();
    this.#updateResultFromStream();
  };

  resume = () => {
    if (!this.#paused) {
      return;
    }
    this.#paused = false;
    if (this.hasListeners()) {
      this.#subscribe();
    }
    this.#updateResultFromStream();
  };

  onStreamUpdate(): void {
    this.#updateResultFromStream();
  }

  /**
   * Fires per raw message, even payloads deep-equal to current data —
   * SSE sources are event emitters, not state replicators.
   */
  onStreamMessage(data: T): void {
    this.options.onMessage?.(data);
  }

  /**
   * QueryObserver's select mechanism: reuse the memoized slice when both
   * the raw data and the select fn are identity-stable; otherwise re-run
   * select and structurally share against the previous slice so deep-equal
   * output keeps its reference (inline select fns re-run, but their output
   * still dedupes). Throw → log + keep the previous slice.
   */
  #selectData(rawData: T | null): TData | null {
    const select = this.options.select;
    if (!select) {
      return rawData as unknown as TData | null;
    }
    if (rawData === null) {
      return null;
    }
    if (this.#selectFn === select && this.#selectSource === rawData) {
      return this.#selectResult ?? null;
    }
    try {
      const selected = replaceEqualDeep(this.#selectResult, select(rawData));
      this.#selectFn = select;
      this.#selectSource = rawData;
      this.#selectResult = selected;
      return selected ?? null;
    } catch (error) {
      console.error(
        `[StreamObserver] select threw for ${String(this.options.streamKey)}; keeping previous slice`,
        error,
      );
      return this.#selectResult ?? null;
    }
  }

  #createResultFromStream(): StreamObserverResult<TData, T> {
    const state = this.#stream?.state;

    const data = this.#selectData(state?.data ?? null);
    const dataUpdatedAt = state?.dataUpdatedAt ?? 0;
    const status = state?.status ?? STREAM_STATUS.CONNECTING;

    return {
      data,
      dataUpdatedAt,
      messages: this.#stream?.getMessages() ?? NO_MESSAGES,
      status,
      isConnecting: status === STREAM_STATUS.CONNECTING,
      isConnected: status === STREAM_STATUS.CONNECTED,
      isError: status === STREAM_STATUS.ERROR,
      isDisconnected: status === STREAM_STATUS.DISCONNECTED,
      isEnabled: this.#enabled,
      retry: this.retry,
      pause: this.pause,
      resume: this.resume,
    };
  }

  #updateResultFromStream(): void {
    const prevResult = this.#currentResult;
    const nextResult = this.#createResultFromStream();

    if (shallowEqual(prevResult, nextResult)) {
      return;
    }

    this.#currentResult = nextResult;

    if (
      nextResult.status === STREAM_STATUS.CONNECTED &&
      prevResult.status !== STREAM_STATUS.CONNECTED
    ) {
      this.options.onOpen?.(nextResult.status);
    }
    if (
      nextResult.status === STREAM_STATUS.ERROR &&
      prevResult.status !== STREAM_STATUS.ERROR
    ) {
      this.options.onError?.(nextResult.status);
    }

    this.#notify();
  }

  #notify() {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(this.#currentResult);
      });

      if (this.#stream) {
        this.#cache.notify({
          type: 'observerResultsUpdated',
          stream: this.#stream,
          streamKey: this.options.streamKey,
        });
      }
    });
  }
}

/** TanStack Query's shallowEqualObjects. */
// biome-ignore lint/suspicious/noExplicitAny: copied from tanstack
function shallowEqual<T extends Record<string, any>>(
  a: T,
  b: T | undefined,
): boolean {
  if (!b || Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
