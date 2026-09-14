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

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StreamClient } from '../../index';
import { MockWebSocket } from '../../test/utils';
import { StreamClientProvider } from '../stream-client-provider';
import { useWebSocketStreams } from '../use-websocket-streams';
import type { ReactNode } from 'react';
import type { UseWebSocketStreamsConfig } from '../use-websocket-streams';

type Payload = { value: number };

describe('useWebSocketStreams', () => {
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

  it('connects each config over WebSocket from a single hook call', async () => {
    const { result } = renderHook(
      () =>
        useWebSocketStreams([
          { streamKey: ['ws-a'], uri: 'http://cortex:8080/ws/a' },
          { streamKey: ['ws-b'], uri: 'ws://cortex:8080/ws/b' },
        ]),
      { wrapper: createWrapper() },
    );

    expect(result.current).toHaveLength(2);

    await waitFor(() => {
      expect(result.current[0]?.isConnected).toBe(true);
      expect(result.current[1]?.isConnected).toBe(true);
    });
    expect(sockets.map((socket) => socket.url)).toEqual([
      'ws://cortex:8080/ws/a',
      'ws://cortex:8080/ws/b',
    ]);
    expect(client.getStreamCache().get(['ws-a'])?.transport).toBe('websocket');

    act(() => {
      sockets[0]?.simulateMessage({ from: 'a' });
    });

    await waitFor(() => {
      expect(result.current[0]?.data).toEqual({ from: 'a' });
    });
    expect(result.current[1]?.data).toBeNull();
  });

  it('supports combine with the same semantics as useSSEStreams', async () => {
    const configs: UseWebSocketStreamsConfig<Payload>[] = [
      { streamKey: ['ws-a'], uri: 'ws://x/a' },
      { streamKey: ['ws-b'], uri: 'ws://x/b' },
    ];
    const { result } = renderHook(
      () =>
        useWebSocketStreams(configs, {
          combine: (results) => ({ b: results[1]?.data ?? null }),
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(sockets).toHaveLength(2);
      expect(sockets[1]?.readyState).toBe(MockWebSocket.OPEN);
    });

    act(() => {
      sockets[1]?.simulateMessage({ value: 2 });
    });

    await waitFor(() => {
      expect(result.current.b).toEqual({ value: 2 });
    });

    const combined = result.current;

    // an update the derivation ignores keeps the combined reference
    act(() => {
      sockets[0]?.simulateMessage({ value: 99 });
    });

    expect(result.current).toBe(combined);
  });
});
