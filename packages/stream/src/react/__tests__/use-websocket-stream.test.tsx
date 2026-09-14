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

import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StreamClient } from '../../index';
import { MockEventSource, MockWebSocket } from '../../test/utils';
import { StreamClientProvider } from '../stream-client-provider';
import { useSSEStream } from '../use-sse-stream';
import { useWebSocketStream } from '../use-websocket-stream';
import type { ReactNode } from 'react';

describe('useWebSocketStream', () => {
  const sockets: MockWebSocket[] = [];
  let client: StreamClient;

  class TrackingWebSocket extends MockWebSocket {
    constructor(url: string) {
      super(url);
      sockets.push(this);
    }
  }

  beforeEach(() => {
    sockets.length = 0;
    vi.stubGlobal('WebSocket', TrackingWebSocket);
    vi.stubGlobal('EventSource', MockEventSource);
    client = new StreamClient();
  });

  afterEach(() => {
    client.clear();
    vi.unstubAllGlobals();
  });

  function createWrapper() {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <StreamClientProvider client={client}>{children}</StreamClientProvider>
      );
    };
  }

  it('connects over WebSocket with the same result shape as useSSEStream', async () => {
    const onMessage = vi.fn();
    const { result } = renderHook(
      () =>
        useWebSocketStream<{ count: number }>({
          streamKey: ['ws-stream'],
          uri: 'http://cortex:8080/ws/stream',
          onMessage,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isConnecting).toBe(true);
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
    expect(sockets).toHaveLength(1);
    expect(sockets[0].url).toBe('ws://cortex:8080/ws/stream');
    expect(client.getStreamCache().get(['ws-stream'])?.transport).toBe(
      'websocket',
    );

    sockets[0].simulateMessage({ count: 7 });
    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 7 });
    });
    expect(onMessage).toHaveBeenCalledWith({ count: 7 });
  });

  it('shares one socket between hooks on the same streamKey', async () => {
    const { result: first } = renderHook(
      () => useWebSocketStream({ streamKey: ['ws-shared'], uri: 'ws://x/ws' }),
      { wrapper: createWrapper() },
    );
    const { result: second } = renderHook(
      () => useWebSocketStream({ streamKey: ['ws-shared'], uri: 'ws://x/ws' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(first.current.isConnected).toBe(true);
      expect(second.current.isConnected).toBe(true);
    });
    expect(sockets).toHaveLength(1);
    expect(client.getStreamCache().getStreamCount()).toBe(1);
  });

  it('logs an error when the same streamKey is requested on both transports', async () => {
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined as never);

    const { result: sse } = renderHook(
      () => useSSEStream({ streamKey: ['mixed-key'], uri: 'http://x/stream' }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(sse.current.isConnected).toBe(true);
    });

    renderHook(
      () =>
        useWebSocketStream({
          streamKey: ['mixed-key'],
          uri: 'http://x/stream',
        }),
      { wrapper: createWrapper() },
    );

    // The original SSE stream keeps serving the key; the conflict is loud.
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('already exists on transport "sse"'),
    );
    expect(client.getStreamCache().get(['mixed-key'])?.transport).toBe('sse');
    expect(sockets).toHaveLength(0);
  });
});
