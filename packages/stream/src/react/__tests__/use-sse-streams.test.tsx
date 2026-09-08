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
import { useSSEStreams } from '../use-sse-streams';
import type { ReactNode } from 'react';
import type { UseSSEStreamsConfig } from '../use-sse-streams';

type Payload = { value: number };

function configFor<T = unknown, TData = T>(
  id: string,
  extra?: Partial<UseSSEStreamsConfig<T, TData>>,
): UseSSEStreamsConfig<T, TData> {
  return {
    streamKey: ['multi', id],
    uri: `http://localhost:3000/stream/${id}`,
    ...extra,
  };
}

describe('useSSEStreams', () => {
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

  function eventSourceFor(key: readonly unknown[]) {
    return client
      .getStreamCache()
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
  }

  it('returns one result per config from a single hook call', async () => {
    const { result } = renderHook(
      () => useSSEStreams([configFor('a'), configFor('b')]),
      { wrapper: createWrapper() },
    );

    expect(result.current).toHaveLength(2);
    expect(result.current[0]?.status).toBe(STREAM_STATUS.CONNECTING);

    await waitFor(() => {
      expect(result.current[0]?.isConnected).toBe(true);
      expect(result.current[1]?.isConnected).toBe(true);
    });
    expect(client.getStreamCount()).toBe(2);
  });

  it('returns an empty array for an empty config array', () => {
    const { result } = renderHook(() => useSSEStreams([]), {
      wrapper: createWrapper(),
    });

    expect(result.current).toEqual([]);
    expect(client.getStreamCount()).toBe(0);
  });

  it('delivers data per stream and keeps unchanged results by reference', async () => {
    const { result } = renderHook(
      () => useSSEStreams([configFor('a'), configFor('b')]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current[0]?.isConnected).toBe(true);
      expect(result.current[1]?.isConnected).toBe(true);
    });

    const untouched = result.current[1];

    act(() => {
      eventSourceFor(['multi', 'a']).simulateMessage({ from: 'a' });
    });

    await waitFor(() => {
      expect(result.current[0]?.data).toEqual({ from: 'a' });
    });
    expect(result.current[1]).toBe(untouched);
  });

  it('routes callbacks to the owning config', async () => {
    const onMessageA = vi.fn();
    const onMessageB = vi.fn();

    renderHook(
      () =>
        useSSEStreams([
          configFor('a', { onMessage: onMessageA }),
          configFor('b', { onMessage: onMessageB }),
        ]),
      { wrapper: createWrapper() },
    );

    const cache = client.getStreamCache();
    await waitFor(() => {
      expect(cache.get(['multi', 'a'])).toBeDefined();
    });

    act(() => {
      eventSourceFor(['multi', 'a']).simulateMessage({ from: 'a' });
    });

    await waitFor(() => {
      expect(onMessageA).toHaveBeenCalledWith({ from: 'a' });
    });
    expect(onMessageB).not.toHaveBeenCalled();
  });

  it('populates messages only for configs that opt into messageHistory', async () => {
    const { result } = renderHook(
      () =>
        useSSEStreams([configFor('a', { messageHistory: 5 }), configFor('b')]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current[0]?.isConnected).toBe(true);
      expect(result.current[1]?.isConnected).toBe(true);
    });

    act(() => {
      eventSourceFor(['multi', 'a']).simulateMessage({ count: 1 });
      eventSourceFor(['multi', 'a']).simulateMessage({ count: 2 });
      eventSourceFor(['multi', 'b']).simulateMessage({ count: 3 });
    });

    await waitFor(() => {
      expect(result.current[0]?.messages).toHaveLength(2);
    });
    expect(result.current[0]?.messages.map((message) => message.data)).toEqual([
      { count: 1 },
      { count: 2 },
    ]);
    expect(result.current[1]?.messages).toHaveLength(0);
    expect(result.current[1]?.data).toEqual({ count: 3 });
  });

  it('grows and shrinks the config array without dropping surviving state', async () => {
    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) =>
        useSSEStreams(ids.map((id) => configFor(id))),
      { wrapper: createWrapper(), initialProps: { ids: ['a'] } },
    );

    await waitFor(() => {
      expect(result.current[0]?.isConnected).toBe(true);
    });

    rerender({ ids: ['a', 'b'] });

    // the new shape is visible immediately (optimistic reconcile)
    expect(result.current).toHaveLength(2);

    await waitFor(() => {
      expect(result.current[1]?.isConnected).toBe(true);
    });

    act(() => {
      eventSourceFor(['multi', 'b']).simulateMessage({ from: 'b' });
    });

    await waitFor(() => {
      expect(result.current[1]?.data).toEqual({ from: 'b' });
    });

    const survivor = result.current[1];

    rerender({ ids: ['b'] });

    expect(result.current).toHaveLength(1);
    // hash-matched reconcile keeps the surviving observer and its result
    expect(result.current[0]).toBe(survivor);
    expect(result.current[0]?.data).toBe(survivor?.data);

    const cache = client.getStreamCache();
    await waitFor(() => {
      expect(cache.get(['multi', 'a'])?.getObserversCount()).toBe(0);
    });
    // removed stream lingers for gc rather than closing immediately
    expect(cache.get(['multi', 'a'])).toBeDefined();
    expect(cache.get(['multi', 'b'])?.getObserversCount()).toBe(1);
  });

  it('returns a reference-stable combined value', async () => {
    const { result, rerender } = renderHook(
      () =>
        useSSEStreams([configFor<Payload>('a'), configFor<Payload>('b')], {
          combine: (results) => ({
            a: results[0]?.data ?? null,
            b: results[1]?.data ?? null,
          }),
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(client.getStreamCount()).toBe(2);
    });

    act(() => {
      eventSourceFor(['multi', 'b']).simulateMessage({ value: 1 });
    });

    await waitFor(() => {
      expect(result.current.b).toEqual({ value: 1 });
    });

    const combined = result.current;
    const bSlice = result.current.b;

    // nothing changed — the combined value keeps its reference across renders
    rerender();
    expect(result.current).toBe(combined);

    // dispatch to A: only the slices that depend on A change reference
    act(() => {
      eventSourceFor(['multi', 'a']).simulateMessage({ value: 99 });
    });

    await waitFor(() => {
      expect(result.current.a).toEqual({ value: 99 });
    });
    expect(result.current).not.toBe(combined);
    expect(result.current.b).toBe(bSlice);
  });

  it('skips re-rendering when an update does not affect the combined value', async () => {
    let renders = 0;

    const { result } = renderHook(
      () => {
        renders += 1;
        return useSSEStreams(
          [configFor<Payload>('a'), configFor<Payload>('b')],
          {
            combine: (results) => ({
              b: results[1]?.data ?? null,
            }),
          },
        );
      },
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(client.getStreamCount()).toBe(2);
    });

    act(() => {
      eventSourceFor(['multi', 'b']).simulateMessage({ value: 1 });
    });

    await waitFor(() => {
      expect(result.current.b).toEqual({ value: 1 });
    });

    const combinedBefore = result.current;
    const rendersBefore = renders;

    // stream A updates, but the derivation only reads stream B
    act(() => {
      eventSourceFor(['multi', 'a']).simulateMessage({ value: 99 });
    });

    expect(result.current).toBe(combinedBefore);
    expect(renders).toBe(rendersBefore);

    // control: a B update notifies and re-renders
    act(() => {
      eventSourceFor(['multi', 'b']).simulateMessage({ value: 2 });
    });

    await waitFor(() => {
      expect(result.current.b).toEqual({ value: 2 });
    });
    expect(renders).toBeGreaterThan(rendersBefore);
  });
});
