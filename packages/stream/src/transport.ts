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

import { timeoutManager } from '@tanstack/query-core';

/** Wire protocols a Stream can ride on. */
export type TransportKind = 'sse' | 'websocket';

/**
 * The Stream's real ingest path, same for every transport — keeps devtools
 * inject/simulate meaningful for both.
 */
export type TransportHandlers = {
  onOpen(): void;
  onMessage(raw: string): void;
  onError(): void;
};

/**
 * Live connection owned by a Stream. Implementations connect in their
 * constructor (Stream defers creation to preserve lazy connect).
 */
export interface StreamTransport {
  readonly kind: TransportKind;
  /** Tear down connection + pending reconnect. Idempotent. */
  close(): void;
  /** Devtools: feed a frame through the real message path. */
  injectMessage(raw: string): void;
  /** Devtools: drive the real failure path. */
  injectError(): void;
}

/** Browser reconnects natively (server `retry:` tunes delay). */
export class EventSourceTransport implements StreamTransport {
  readonly kind = 'sse';
  readonly eventSource: EventSource;
  #handlers: TransportHandlers;

  constructor(uri: string, handlers: TransportHandlers) {
    this.#handlers = handlers;

    const eventSource = new EventSource(uri);
    eventSource.onopen = () => handlers.onOpen();
    eventSource.onmessage = (event) => handlers.onMessage(event.data);
    eventSource.onerror = () => handlers.onError();
    this.eventSource = eventSource;
  }

  close(): void {
    this.eventSource.close();
  }

  injectMessage(raw: string): void {
    this.#handlers.onMessage(raw);
  }

  injectError(): void {
    this.#handlers.onError();
  }
}

/** EventSource-parity reconnect backoff: 1s doubling to a 15s ceiling. */
const WS_RECONNECT_BASE_MS = 1_000;
const WS_RECONNECT_MAX_MS = 15_000;

/** http(s) → ws(s) so both hooks share one uri config. */
export function toWebSocketUri(uri: string): string {
  if (uri.startsWith('https://')) {
    return `wss://${uri.slice('https://'.length)}`;
  }
  if (uri.startsWith('http://')) {
    return `ws://${uri.slice('http://'.length)}`;
  }
  return uri;
}

/**
 * WebSocket never reconnects on its own — retries closed connections with
 * doubling backoff (reset on open) until close(). Timers via TanStack's
 * timeoutManager, same as gc.
 *
 * No client-side liveness watchdog (browsers can't send WS pings): a
 * quiet-but-dead connection is only caught server-side, so WS endpoints
 * should heartbeat like the SSE ones.
 */
export class WebSocketTransport implements StreamTransport {
  readonly kind = 'websocket';
  #socket?: WebSocket;
  #handlers: TransportHandlers;
  #uri: string;
  #closed = false;
  #attempt = 0;
  #reconnectTimer?: ReturnType<(typeof timeoutManager)['setTimeout']>;

  constructor(uri: string, handlers: TransportHandlers) {
    this.#uri = toWebSocketUri(uri);
    this.#handlers = handlers;
    this.#open();
  }

  #open(): void {
    const socket = new WebSocket(this.#uri);

    socket.onopen = () => {
      this.#attempt = 0;
      this.#handlers.onOpen();
    };
    socket.onmessage = (event) => {
      if (typeof event.data === 'string') {
        this.#handlers.onMessage(event.data);
      }
    };
    // error is always followed by close; reconnect scheduled once, from onclose
    socket.onclose = () => {
      if (this.#closed) {
        return;
      }
      this.#handlers.onError();
      this.#scheduleReconnect();
    };

    this.#socket = socket;
  }

  #scheduleReconnect(): void {
    const delay = Math.min(
      WS_RECONNECT_BASE_MS * 2 ** this.#attempt,
      WS_RECONNECT_MAX_MS,
    );
    this.#attempt += 1;
    this.#reconnectTimer = timeoutManager.setTimeout(() => {
      if (!this.#closed) {
        this.#open();
      }
    }, delay);
  }

  close(): void {
    this.#closed = true;
    if (this.#reconnectTimer !== undefined) {
      timeoutManager.clearTimeout(this.#reconnectTimer);
      this.#reconnectTimer = undefined;
    }
    this.#socket?.close();
  }

  injectMessage(raw: string): void {
    this.#handlers.onMessage(raw);
  }

  injectError(): void {
    this.#handlers.onError();
  }
}

export function createTransport(
  kind: TransportKind,
  uri: string,
  handlers: TransportHandlers,
): StreamTransport {
  return kind === 'websocket'
    ? new WebSocketTransport(uri, handlers)
    : new EventSourceTransport(uri, handlers);
}
