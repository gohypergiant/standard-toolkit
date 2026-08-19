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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockEventSource, MockWebSocket } from '../test/utils';
import {
  EventSourceTransport,
  toWebSocketUri,
  WebSocketTransport,
} from '../transport';
import type { TransportHandlers } from '../transport';

function makeHandlers() {
  return {
    onError: vi.fn<() => void>(),
    onMessage: vi.fn<(raw: string) => void>(),
    onOpen: vi.fn<() => void>(),
  } satisfies TransportHandlers;
}

describe('toWebSocketUri', () => {
  it('maps http(s) onto ws(s) and leaves ws(s) untouched', () => {
    expect(toWebSocketUri('http://cortex:8080/ws/health')).toBe(
      'ws://cortex:8080/ws/health',
    );
    expect(toWebSocketUri('https://cortex/ws/health')).toBe(
      'wss://cortex/ws/health',
    );
    expect(toWebSocketUri('wss://cortex/ws/health')).toBe(
      'wss://cortex/ws/health',
    );
  });
});

describe('EventSourceTransport', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('EventSource', MockEventSource);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('forwards open/message/error to the handlers and exposes the EventSource', async () => {
    const handlers = makeHandlers();
    const transport = new EventSourceTransport('http://x/stream', handlers);
    const eventSource = transport.eventSource as unknown as MockEventSource;

    await vi.advanceTimersByTimeAsync(0);
    expect(handlers.onOpen).toHaveBeenCalledTimes(1);

    eventSource.simulateMessage({ tick: 1 });
    expect(handlers.onMessage).toHaveBeenCalledWith('{"tick":1}');

    eventSource.simulateError();
    expect(handlers.onError).toHaveBeenCalledTimes(1);

    transport.close();
    expect(eventSource.readyState).toBe(MockEventSource.CLOSED);
  });

  it('inject helpers drive the real handler paths', () => {
    const handlers = makeHandlers();
    const transport = new EventSourceTransport('http://x/stream', handlers);

    transport.injectMessage('{"fake":true}');
    expect(handlers.onMessage).toHaveBeenCalledWith('{"fake":true}');

    transport.injectError();
    expect(handlers.onError).toHaveBeenCalledTimes(1);
  });
});

describe('WebSocketTransport', () => {
  const sockets: MockWebSocket[] = [];

  class TrackingWebSocket extends MockWebSocket {
    constructor(url: string) {
      super(url);
      sockets.push(this);
    }
  }

  beforeEach(() => {
    vi.useFakeTimers();
    sockets.length = 0;
    vi.stubGlobal('WebSocket', TrackingWebSocket);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('connects with a ws uri and forwards open/message', async () => {
    const handlers = makeHandlers();
    new WebSocketTransport('http://cortex:8080/ws/health', handlers);

    expect(sockets).toHaveLength(1);
    expect(sockets[0].url).toBe('ws://cortex:8080/ws/health');

    await vi.advanceTimersByTimeAsync(0);
    expect(handlers.onOpen).toHaveBeenCalledTimes(1);

    sockets[0].simulateMessage({ tick: 1 });
    expect(handlers.onMessage).toHaveBeenCalledWith('{"tick":1}');
  });

  it('reconnects with doubling backoff after server-side closes', async () => {
    const handlers = makeHandlers();
    new WebSocketTransport('ws://cortex/ws', handlers);
    await vi.advanceTimersByTimeAsync(1);
    expect(handlers.onOpen).toHaveBeenCalledTimes(1);

    // Server drops the open connection: error surfaces, retry #1 after ~1s.
    sockets[0].simulateServerClose();
    expect(handlers.onError).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(999);
    expect(sockets).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(sockets).toHaveLength(2);

    // Refused before it ever opens: retry #2 doubles to ~2s.
    sockets[1].simulateServerClose();
    await vi.advanceTimersByTimeAsync(1999);
    expect(sockets).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(sockets).toHaveLength(3);

    // Let the third socket OPEN — a successful open resets the backoff…
    await vi.advanceTimersByTimeAsync(1);
    expect(handlers.onOpen).toHaveBeenCalledTimes(2);

    // …so the next drop retries at the ~1s base again, not ~4s.
    sockets[2].simulateServerClose();
    await vi.advanceTimersByTimeAsync(1001);
    expect(sockets).toHaveLength(4);
  });

  it('close() tears down and cancels any pending reconnect', async () => {
    const handlers = makeHandlers();
    const transport = new WebSocketTransport('ws://cortex/ws', handlers);
    await vi.advanceTimersByTimeAsync(0);

    sockets[0].simulateServerClose();
    transport.close();

    await vi.advanceTimersByTimeAsync(60_000);
    expect(sockets).toHaveLength(1);
  });

  it('intentional close() does not report an error', async () => {
    const handlers = makeHandlers();
    const transport = new WebSocketTransport('ws://cortex/ws', handlers);
    await vi.advanceTimersByTimeAsync(0);

    transport.close();
    // The browser fires onclose after close(); the transport must ignore it.
    sockets[0].onclose?.(new Event('close'));

    expect(handlers.onError).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(sockets).toHaveLength(1);
  });
});
