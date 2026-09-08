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
import { STREAM_STATUS, StreamClient } from '../../index';
import { MockEventSource } from '../../test/utils';
import { StreamClientProvider } from '../stream-client-provider';
import { useSSEStream } from '../use-sse-stream';
import type { ReactNode } from 'react';

describe('useSSEStream', () => {
  let client: StreamClient;

  beforeEach(() => {
    // no fake timers — renderHook doesn't flush updates synchronously with them
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

  it('should start connecting when component mounts', () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { result } = renderHook(() => useSSEStream({ streamKey: key, uri }), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe(STREAM_STATUS.CONNECTING);
    expect(result.current.isConnecting).toBe(true);
  });

  it('should update to connected status', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { result } = renderHook(() => useSSEStream({ streamKey: key, uri }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    expect(result.current.status).toBe(STREAM_STATUS.CONNECTED);
  });

  it('should receive data from stream', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { result } = renderHook(
      () => useSSEStream<{ count: number }>({ streamKey: key, uri }),
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
    eventSource.simulateMessage({ count: 42 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 42 });
    });
  });

  it('should share connection between multiple hooks with same key', async () => {
    const key = ['shared-stream'];
    const uri = 'http://localhost:3000/stream';

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

    await waitFor(() => {
      expect(client.getStreamCount()).toBe(1);
    });

    const cache = client.getStreamCache();
    const eventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateMessage({ value: 'shared' });

    await waitFor(() => {
      expect(result1.current.data).toEqual({ value: 'shared' });
      expect(result2.current.data).toEqual({ value: 'shared' });
    });
  });

  it('should call onOpen callback when connection opens', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';
    const onOpen = vi.fn();

    renderHook(() => useSSEStream({ streamKey: key, uri, onOpen }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onOpen).toHaveBeenCalledWith(STREAM_STATUS.CONNECTED);
    });
  });

  it('should call onMessage callback when receiving data', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';
    const onMessage = vi.fn();

    renderHook(() => useSSEStream({ streamKey: key, uri, onMessage }), {
      wrapper: createWrapper(),
    });

    const cache = client.getStreamCache();
    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
    });

    const eventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateMessage({ value: 'test' });

    await waitFor(() => {
      expect(onMessage).toHaveBeenCalledWith({ value: 'test' });
    });
  });

  it('should call onError callback when connection errors', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';
    const onError = vi.fn();

    renderHook(() => useSSEStream({ streamKey: key, uri, onError }), {
      wrapper: createWrapper(),
    });

    const cache = client.getStreamCache();
    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
    });

    const eventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateError();

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(STREAM_STATUS.ERROR);
    });
  });

  it('should linger for gcTime after all hooks unmount, then close', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { unmount: unmount1 } = renderHook(
      () => useSSEStream({ streamKey: key, uri, gcTime: 100 }),
      {
        wrapper: createWrapper(),
      },
    );

    const { unmount: unmount2 } = renderHook(
      () => useSSEStream({ streamKey: key, uri, gcTime: 100 }),
      {
        wrapper: createWrapper(),
      },
    );

    const cache = client.getStreamCache();
    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
    });

    unmount1();

    // second hook still subscribed
    expect(cache.get(key)).toBeDefined();

    unmount2();

    // gc linger: still cached, EventSource open
    expect(cache.get(key)).toBeDefined();

    // only after gcTime unobserved is it removed
    await waitFor(() => {
      expect(cache.get(key)).toBeUndefined();
    });
  });

  it('should update callbacks when options change', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';
    const onMessage1 = vi.fn();
    const onMessage2 = vi.fn();

    const { rerender } = renderHook(
      ({ onMessage }) => useSSEStream({ streamKey: key, uri, onMessage }),
      {
        wrapper: createWrapper(),
        initialProps: { onMessage: onMessage1 },
      },
    );

    const cache = client.getStreamCache();
    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
    });

    const eventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateMessage({ value: 1 });

    await waitFor(() => {
      expect(onMessage1).toHaveBeenCalledWith({ value: 1 });
    });

    rerender({ onMessage: onMessage2 });

    eventSource.simulateMessage({ value: 2 });

    await waitFor(() => {
      expect(onMessage2).toHaveBeenCalledWith({ value: 2 });
    });

    expect(onMessage1).toHaveBeenCalledTimes(1);
  });

  it('should update dataUpdatedAt timestamp', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { result } = renderHook(() => useSSEStream({ streamKey: key, uri }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const initialUpdatedAt = result.current.dataUpdatedAt;
    expect(initialUpdatedAt).toBe(0);

    const cache = client.getStreamCache();
    const eventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateMessage({ value: 'test' });

    await waitFor(() => {
      expect(result.current.dataUpdatedAt).toBeGreaterThan(0);
    });
  });

  it('should call onMessage for every message even when payloads are identical', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';
    const onMessage = vi.fn();

    const { result } = renderHook(
      () => useSSEStream({ streamKey: key, uri, onMessage }),
      {
        wrapper: createWrapper(),
      },
    );

    const cache = client.getStreamCache();
    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
    });

    const eventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;

    // duplicates are distinct events — structural sharing must not swallow onMessage
    eventSource.simulateMessage({ value: 'same' });
    eventSource.simulateMessage({ value: 'same' });

    await waitFor(() => {
      expect(onMessage).toHaveBeenCalledTimes(2);
    });
    expect(result.current.data).toEqual({ value: 'same' });
  });

  it('should stay paused across re-renders and reconnect on resume', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { result, rerender } = renderHook(
      () => useSSEStream({ streamKey: key, uri }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const cache = client.getStreamCache();
    const eventSourceBeforePause = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;

    act(() => {
      result.current.pause();
    });

    // pause detaches the observer; the stream lingers with its EventSource open
    await waitFor(() => {
      expect(result.current.isEnabled).toBe(false);
    });
    expect(client.getStreamCount()).toBe(1);

    // a re-render (fresh options object) must not undo the pause
    rerender();

    expect(result.current.isEnabled).toBe(false);
    expect(client.getStreamCount()).toBe(1);

    act(() => {
      result.current.resume();
    });

    // resume inside the linger re-attaches to the SAME EventSource
    await waitFor(() => {
      expect(result.current.isEnabled).toBe(true);
      expect(result.current.isConnected).toBe(true);
    });
    expect(client.getStreamCount()).toBe(1);
    expect(cache.get(key)?.getEventSource()).toBe(eventSourceBeforePause);
  });

  it('should reconnect with a new EventSource when retry is called', async () => {
    const key = ['test'];
    const uri = 'http://localhost:3000/stream';

    const { result } = renderHook(() => useSSEStream({ streamKey: key, uri }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const cache = client.getStreamCache();
    const firstEventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;

    firstEventSource.simulateError();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const secondEventSource = cache
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
    expect(secondEventSource).toBeDefined();
    expect(secondEventSource).not.toBe(firstEventSource);
    expect(firstEventSource.readyState).toBe(MockEventSource.CLOSED);
  });

  it('should reset the result when the streamKey changes', async () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) =>
        useSSEStream({
          streamKey: ['keyed', id],
          uri: `http://localhost:3000/stream/${id}`,
        }),
      {
        wrapper: createWrapper(),
        initialProps: { id: 'a' },
      },
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const cache = client.getStreamCache();
    const eventSourceA = cache
      .get(['keyed', 'a'])
      ?.getEventSource() as unknown as MockEventSource;
    eventSourceA.simulateMessage({ from: 'a' });

    await waitFor(() => {
      expect(result.current.data).toEqual({ from: 'a' });
    });

    rerender({ id: 'b' });

    // old stream's data must not linger in the RESULT
    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });
    // the old stream itself stays cached for gcTime
    expect(cache.get(['keyed', 'a'])).toBeDefined();
    expect(cache.get(['keyed', 'a'])?.getObserversCount()).toBe(0);

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const eventSourceB = cache
      .get(['keyed', 'b'])
      ?.getEventSource() as unknown as MockEventSource;
    eventSourceB.simulateMessage({ from: 'b' });

    await waitFor(() => {
      expect(result.current.data).toEqual({ from: 'b' });
    });
  });

  it('should maintain separate connections for different keys', async () => {
    const key1 = ['stream-1'];
    const key2 = ['stream-2'];
    const uri1 = 'http://localhost:3000/stream-1';
    const uri2 = 'http://localhost:3000/stream-2';

    const { result: result1 } = renderHook(
      () => useSSEStream({ streamKey: key1, uri: uri1 }),
      {
        wrapper: createWrapper(),
      },
    );

    const { result: result2 } = renderHook(
      () => useSSEStream({ streamKey: key2, uri: uri2 }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(client.getStreamCount()).toBe(2);
    });

    const cache = client.getStreamCache();
    const eventSource1 = cache
      .get(key1)
      ?.getEventSource() as unknown as MockEventSource;
    const eventSource2 = cache
      .get(key2)
      ?.getEventSource() as unknown as MockEventSource;

    eventSource1.simulateMessage({ stream: 1 });
    eventSource2.simulateMessage({ stream: 2 });

    await waitFor(() => {
      expect(result1.current.data).toEqual({ stream: 1 });
      expect(result2.current.data).toEqual({ stream: 2 });
    });
  });
});
