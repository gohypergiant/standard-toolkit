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
import { MockEventSource } from '../../test/utils';
import { StreamClientProvider } from '../stream-client-provider';
import { useSSEStream } from '../use-sse-stream';
import type { ReactNode } from 'react';

describe('SSE Integration Tests', () => {
  let client: StreamClient;

  beforeEach(() => {
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

  it('should handle complete lifecycle: mount → connect → message → unmount', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';
    const onOpen = vi.fn();
    const onMessage = vi.fn();

    const { result, unmount } = renderHook(
      () =>
        useSSEStream<{ count: number }>({
          streamKey: key,
          uri,
          gcTime: 100,
          onOpen,
          onMessage,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.isConnecting).toBe(true);
    expect(client.getStreamCount()).toBe(1);

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
      expect(onOpen).toHaveBeenCalled();
    });

    const cache = client.getStreamCache();
    const stream = cache.get(key);
    const eventSource = stream?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateMessage({ count: 1 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 1 });
      expect(onMessage).toHaveBeenCalledWith({ count: 1 });
    });

    eventSource.simulateMessage({ count: 2 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 2 });
      expect(onMessage).toHaveBeenCalledWith({ count: 2 });
    });

    // unmount detaches the observer; the stream lingers for gcTime
    unmount();
    expect(cache.get(key)).toBeDefined();

    await waitFor(() => {
      expect(client.getStreamCount()).toBe(0);
      expect(cache.get(key)).toBeUndefined();
    });
  });

  it('should share connection across multiple components in real-world scenario', async () => {
    const key = ['cortex-stats'];
    const uri = 'http://localhost:3000/stream/stats';

    const { result: result1 } = renderHook(
      () => useSSEStream({ streamKey: key, uri }),
      {
        wrapper: createWrapper(),
      },
    );

    const { result: result2 } = renderHook(
      () => useSSEStream({ streamKey: key, uri }),
      {
        wrapper: createWrapper(),
      },
    );

    const { result: result3, unmount: unmount3 } = renderHook(
      () => useSSEStream({ streamKey: key, uri }),
      {
        wrapper: createWrapper(),
      },
    );

    const cache = client.getStreamCache();
    expect(client.getStreamCount()).toBe(1);
    expect(cache.getObservers(key).size).toBe(3);

    const eventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateMessage({ cpu: 45, memory: 78 });

    await waitFor(() => {
      expect(result1.current.data).toEqual({ cpu: 45, memory: 78 });
      expect(result2.current.data).toEqual({ cpu: 45, memory: 78 });
      expect(result3.current.data).toEqual({ cpu: 45, memory: 78 });
    });

    unmount3();

    expect(client.getStreamCount()).toBe(1);
    expect(cache.getObservers(key).size).toBe(2);

    eventSource.simulateMessage({ cpu: 50, memory: 80 });

    await waitFor(() => {
      expect(result1.current.data).toEqual({ cpu: 50, memory: 80 });
      expect(result2.current.data).toEqual({ cpu: 50, memory: 80 });
    });
  });

  it('should handle error and recovery', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';
    const onError = vi.fn();

    const { result } = renderHook(
      () => useSSEStream({ streamKey: key, uri, onError }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const cache = client.getStreamCache();
    const eventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateMessage({ value: 'before error' });

    await waitFor(() => {
      expect(result.current.data).toEqual({ value: 'before error' });
    });

    eventSource.simulateError();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(onError).toHaveBeenCalled();
      // data survives the error state
      expect(result.current.data).toEqual({ value: 'before error' });
    });
  });

  it('should keep the live connection across rapid mount/unmount cycles (StrictMode simulation)', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { unmount: unmount1 } = renderHook(
      () => useSSEStream({ streamKey: key, uri }),
      {
        wrapper: createWrapper(),
      },
    );

    const cache = client.getStreamCache();
    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
    });
    const firstEventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;

    // quick unmount (StrictMode): linger keeps the EventSource OPEN
    unmount1();
    expect(cache.get(key)).toBeDefined();
    expect(firstEventSource.readyState).not.toBe(MockEventSource.CLOSED);

    // immediate re-mount re-attaches to the SAME EventSource
    const { result: result2 } = renderHook(
      () => useSSEStream({ streamKey: key, uri }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(cache.get(key)?.getObserversCount()).toBe(1);
    });
    expect(cache.get(key)?.getEventSource()).toBe(firstEventSource);

    firstEventSource.simulateMessage({ value: 'test' });

    await waitFor(() => {
      expect(result2.current.data).toEqual({ value: 'test' });
    });
  });

  it('should handle cache clear gracefully', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { result } = renderHook(() => useSSEStream({ streamKey: key, uri }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const firstStream = client.getStreamCache().get(key);

    act(() => {
      client.clear();
    });

    // mounted hooks rebuild a fresh stream instead of holding a stale result
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
    expect(client.getStreamCount()).toBe(1);
    expect(client.getStreamCache().get(key)).toBeDefined();
    expect(client.getStreamCache().get(key)).not.toBe(firstStream);
  });
});
