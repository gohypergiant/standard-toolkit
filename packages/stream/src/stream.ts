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
import { Removable } from './removable';
import { createTransport, EventSourceTransport } from './transport';
import type { StreamStatus } from './constants';
import type { StreamTransport, TransportKind } from './transport';
import type { StreamKey } from './types';

/**
 * Decoded wire frame — the lib's only contract with a backend format.
 * data → state + observers, error → ERROR status, ignore → drop
 * (keepalives, unknown message types).
 */
export type StreamFrame<T = unknown> =
  | { kind: 'data'; data: T }
  | { kind: 'error'; error: unknown }
  | { kind: 'ignore' };

/** Per-stream frame decoder, injected like queryFn — no wire protocol assumed. */
export type DecodeFn<T = unknown> = (raw: string) => StreamFrame<T>;

/** Default: every frame is JSON data. */
export function defaultDecodeFn<T>(raw: string): StreamFrame<T> {
  return { kind: 'data', data: JSON.parse(raw) as T };
}

export type StreamState<T = unknown> = {
  data: T | null;
  /** Data dispatch count — dataUpdatedAt can't distinguish same-ms messages. */
  dataUpdateCount: number;
  dataUpdatedAt: number;
  status: StreamStatus;
};

/** One retained message (messageHistory > 0). */
export type StreamMessage<T = unknown> = {
  /**
   * Structurally shared like `state.data` — a payload deep-equal to the
   * previous message keeps its reference (`entry.data === previous.data`
   * detects duplicates).
   */
  data: T;
  dataUpdatedAt: number;
  /** `dataUpdateCount` at dispatch — stable across ring-buffer eviction. */
  sequence: number;
};

/** Shared empty so history-off streams never churn result identity. */
const NO_MESSAGES: readonly StreamMessage<never>[] = Object.freeze([]);

/**
 * Observer surface a Stream invokes. Structural, so stream.ts never imports
 * stream-observer.ts (keeps stream ← stream-cache ← stream-observer acyclic).
 */
export interface StreamObserverLike<T = unknown> {
  onStreamUpdate(): void;
  onStreamMessage(data: T): void;
}

/** Carried on 'updated' events so consumers can tell messages from status flaps. */
export type StreamUpdateAction = 'data' | 'status';

export type StreamCacheNotifyEvent =
  | { type: 'added'; stream: Stream; streamKey: StreamKey }
  | { type: 'removed'; stream: Stream; streamKey: StreamKey }
  | {
      type: 'updated';
      stream: Stream;
      streamKey: StreamKey;
      action: StreamUpdateAction;
    }
  | {
      type: 'observerAdded';
      stream: Stream;
      observer: StreamObserverLike<unknown>;
      streamKey: StreamKey;
    }
  | {
      type: 'observerRemoved';
      stream: Stream;
      observer: StreamObserverLike<unknown>;
      streamKey: StreamKey;
    }
  | {
      type: 'observerResultsUpdated';
      stream: Stream;
      streamKey: StreamKey;
    };

/** Cache surface a Stream invokes. Structural, same acyclicity reason. */
export interface StreamCacheLike {
  notify(event: StreamCacheNotifyEvent): void;
  remove(stream: Stream): void;
}

type StreamConfig = {
  streamKey: StreamKey;
  streamHash: string;
  uri: string;
  cache: StreamCacheLike;
  gcTime?: number;
  transport?: TransportKind;
  /** Fixed at creation like uri — first consumer's decoder wins. */
  decodeFn?: DecodeFn;
  /** Retained-message cap. Default 0 (off); ratchets up like gcTime. */
  messageHistory?: number;
};

/**
 * One stream connection. Query-class analog: owns state, transport
 * lifecycle, observers; gc's itself after gcTime unobserved (Removable).
 *
 * Connects lazily on first observer — construction happens during
 * render/SSR, where opening a connection would leak.
 *
 * Gc linger keeps the transport OPEN so transient unmounts (StrictMode
 * double mount, route hops, Suspense blips) re-attach with zero reconnect
 * churn. Cost: a held server connection, hence 30s default vs TanStack's
 * 5min (see removable.ts). Explicit removal stays immediate.
 */
export class Stream<T = unknown> extends Removable {
  streamKey: StreamKey;
  streamHash: string;
  state: StreamState<T>;
  observers: StreamObserverLike<unknown>[] = [];
  /** Fixed at creation, like uri. */
  readonly transport: TransportKind;

  #uri: string;
  #cache: StreamCacheLike;
  #transport?: StreamTransport;
  #decodeFn: DecodeFn;
  #messageHistory = 0;
  #messages: readonly StreamMessage<T>[] = NO_MESSAGES;

  constructor(config: StreamConfig) {
    super();

    this.streamKey = config.streamKey;
    this.streamHash = config.streamHash;
    this.#uri = config.uri;
    this.#cache = config.cache;
    this.transport = config.transport ?? 'sse';
    this.#decodeFn = config.decodeFn ?? defaultDecodeFn;
    this.setMessageHistory(config.messageHistory);

    this.state = {
      data: null,
      dataUpdateCount: 0,
      dataUpdatedAt: 0,
      status: STREAM_STATUS.CONNECTING,
    };

    // built-but-never-observed collects itself
    this.updateGcTime(config.gcTime);
    this.scheduleGc();
  }

  /** Ratchet up — longest requested linger wins (TanStack semantics). */
  setGcTime(gcTime: number | undefined): void {
    this.updateGcTime(gcTime);
  }

  /** Ratchet up — largest requested cap wins (gcTime semantics). */
  setMessageHistory(cap: number | undefined): void {
    this.#messageHistory = Math.max(this.#messageHistory, cap ?? 0);
  }

  /**
   * Retained messages, oldest first — immutable snapshot, new identity per
   * append, `NO_MESSAGES` constant while history is off.
   */
  getMessages(): readonly StreamMessage<T>[] {
    return this.#messages;
  }

  /** Gc fire — remove only if still unobserved. */
  protected optionalRemove(): void {
    if (this.observers.length === 0) {
      this.#cache.remove(this);
    }
  }

  get uri(): string {
    return this.#uri;
  }

  /** decodeFn boundary — a throwing decoder drops the frame (console-only). */
  #decode(raw: string): StreamFrame<T> | undefined {
    try {
      return this.#decodeFn(raw) as StreamFrame<T>;
    } catch (error) {
      console.error(
        `[Stream] Failed to decode frame for ${this.streamHash}`,
        error,
      );
      return undefined;
    }
  }

  #connect(): void {
    if (this.#transport) {
      return;
    }
    this.#transport = createTransport(this.transport, this.#uri, {
      onOpen: () => {
        this.#dispatch({ status: STREAM_STATUS.CONNECTED });
      },
      onMessage: (raw) => {
        const frame = this.#decode(raw);
        if (!frame) {
          return;
        }

        switch (frame.kind) {
          case 'data': {
            this.#dispatch({ data: frame.data, dataUpdatedAt: Date.now() });

            // fan out apart from state: structural sharing keeps identical
            // payloads referentially stable, but onMessage fires per message
            notifyManager.batch(() => {
              this.observers.forEach((observer) => {
                observer.onStreamMessage(frame.data);
              });
            });
            break;
          }
          case 'error': {
            // server-declared failure — same status path as transport error
            this.#dispatch({ status: STREAM_STATUS.ERROR });
            break;
          }
          default: {
            // 'ignore': drop
            break;
          }
        }
      },
      onError: () => {
        this.#dispatch({ status: STREAM_STATUS.ERROR });
      },
    });
  }

  /** Ring append, newest last; entry shares the structurally-shared data ref. */
  #recordMessage(state: StreamState<T>): void {
    if (this.#messageHistory === 0) {
      return;
    }
    this.#messages = [
      ...this.#messages,
      {
        data: state.data as T,
        dataUpdatedAt: state.dataUpdatedAt,
        sequence: state.dataUpdateCount,
      },
    ].slice(-this.#messageHistory);
  }

  #dispatch(partial: Partial<StreamState<T>>): void {
    const newState: StreamState<T> = {
      ...this.state,
      ...partial,
    };

    const action: StreamUpdateAction =
      partial.data !== undefined ? 'data' : 'status';
    if (action === 'data') {
      newState.data = replaceEqualDeep<T | null>(
        this.state.data,
        partial.data as T,
      );
      newState.dataUpdateCount = this.state.dataUpdateCount + 1;
      this.#recordMessage(newState);
    }

    this.state = newState;

    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onStreamUpdate();
      });

      this.#cache.notify({
        type: 'updated',
        stream: this,
        streamKey: this.streamKey,
        action,
      });
    });
  }

  /** First observer opens the connection. */
  addObserver(observer: StreamObserverLike<unknown>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);

      this.clearGcTimeout();

      this.#connect();

      this.#cache.notify({
        type: 'observerAdded',
        stream: this,
        observer,
        streamKey: this.streamKey,
      });
    }
  }

  removeObserver(observer: StreamObserverLike<unknown>): void {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x) => x !== observer);

      this.#cache.notify({
        type: 'observerRemoved',
        stream: this,
        observer,
        streamKey: this.streamKey,
      });

      if (this.observers.length === 0) {
        this.scheduleGc();
      }
    }
  }

  getObserversCount(): number {
    return this.observers.length;
  }

  /** Live transport; undefined until first observer or after teardown. Devtools inject/simulate path. */
  getTransport(): StreamTransport | undefined {
    return this.#transport;
  }

  /** Underlying EventSource (SSE only; undefined pre-connect or for WS). Test hook. */
  getEventSource(): EventSource | undefined {
    return this.#transport instanceof EventSourceTransport
      ? this.#transport.eventSource
      : undefined;
  }

  /**
   * Close + reopen. Manual escape hatch — EventSource stops auto-reconnecting
   * after fatal errors. Must work with no transport too, else Retry is dead
   * after a devtools Close.
   */
  retry(): void {
    this.#transport?.close();
    this.#transport = undefined;
    this.#dispatch({ status: STREAM_STATUS.CONNECTING });

    if (this.observers.length > 0) {
      this.#connect();
    }
  }

  close(): void {
    this.#transport?.close();
    this.#transport = undefined;
    this.#dispatch({ status: STREAM_STATUS.DISCONNECTED });
  }
}
