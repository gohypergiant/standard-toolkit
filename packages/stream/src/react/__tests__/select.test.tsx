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
import { MockEventSource } from '../../test/utils';
import { StreamClientProvider } from '../stream-client-provider';
import { useSSEStream } from '../use-sse-stream';
import type { ReactNode } from 'react';

type Frame = {
  cpu: { load: number };
  memory: { used: number };
  seq: number;
};

const URI = 'http://localhost:3000/stream';

describe('StreamObserver select (QueryObserver semantics)', () => {
  let client: StreamClient;

  beforeEach(() => {
    vi.stubGlobal('EventSource', MockEventSource);
    client = new StreamClient();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const wrapper = ({ children }: { children?: ReactNode }) => (
    <StreamClientProvider client={client}>{children}</StreamClientProvider>
  );

  function eventSourceFor(key: readonly unknown[]) {
    return client
      .getStreamCache()
      .get(key)
      ?.getEventSource() as unknown as MockEventSource;
  }

  it('delivers the selected slice as data', async () => {
    const key = ['select-slice'];
    const { result } = renderHook(
      () =>
        useSSEStream<Frame, Frame['cpu']>({
          streamKey: key,
          uri: URI,
          select: (frame) => frame.cpu,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isConnected).toBe(true));
    eventSourceFor(key).simulateMessage({
      cpu: { load: 1 },
      memory: { used: 10 },
      seq: 1,
    });

    await waitFor(() => expect(result.current.data).toEqual({ load: 1 }));
  });

  it('keeps the slice reference across frames when the slice is deep-equal', async () => {
    const key = ['select-stable-ref'];
    const { result } = renderHook(
      () =>
        useSSEStream<Frame, Frame['cpu']>({
          streamKey: key,
          uri: URI,
          select: (frame) => frame.cpu,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isConnected).toBe(true));
    eventSourceFor(key).simulateMessage({
      cpu: { load: 1 },
      memory: { used: 10 },
      seq: 1,
    });
    await waitFor(() => expect(result.current.data).toEqual({ load: 1 }));
    const firstSlice = result.current.data;
    const firstUpdatedAt = result.current.dataUpdatedAt;

    // cpu unchanged, sibling field changed → new frame, deep-equal slice
    eventSourceFor(key).simulateMessage({
      cpu: { load: 1 },
      memory: { used: 99 },
      seq: 2,
    });

    await waitFor(() =>
      expect(result.current.dataUpdatedAt).toBeGreaterThan(firstUpdatedAt),
    );
    expect(result.current.data).toBe(firstSlice);
  });

  it('memoizes: a stable select is not re-run when raw data identity is unchanged', async () => {
    const key = ['select-memo'];
    const select = vi.fn((frame: Frame) => frame.cpu);
    const { result, rerender } = renderHook(
      () =>
        useSSEStream<Frame, Frame['cpu']>({ streamKey: key, uri: URI, select }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isConnected).toBe(true));
    eventSourceFor(key).simulateMessage({
      cpu: { load: 2 },
      memory: { used: 10 },
      seq: 1,
    });
    await waitFor(() => expect(result.current.data).toEqual({ load: 2 }));
    const callsAfterFrame = select.mock.calls.length;

    rerender();
    rerender();

    expect(select.mock.calls.length).toBe(callsAfterFrame);
  });

  it('shares one connection between observers with different selects', async () => {
    const key = ['select-shared'];
    const { result: cpuResult } = renderHook(
      () =>
        useSSEStream<Frame, Frame['cpu']>({
          streamKey: key,
          uri: URI,
          select: (frame) => frame.cpu,
        }),
      { wrapper },
    );
    const { result: memoryResult } = renderHook(
      () =>
        useSSEStream<Frame, Frame['memory']>({
          streamKey: key,
          uri: URI,
          select: (frame) => frame.memory,
        }),
      { wrapper },
    );

    await waitFor(() => expect(cpuResult.current.isConnected).toBe(true));
    expect(client.getStreamCache().get(key)?.getObserversCount()).toBe(2);

    eventSourceFor(key).simulateMessage({
      cpu: { load: 3 },
      memory: { used: 30 },
      seq: 1,
    });

    await waitFor(() => expect(cpuResult.current.data).toEqual({ load: 3 }));
    expect(memoryResult.current.data).toEqual({ used: 30 });
  });

  it('a throwing select logs and keeps the previous slice (decodeFn precedent)', async () => {
    const key = ['select-throws'];
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => vi.fn());
    const { result } = renderHook(
      () =>
        useSSEStream<Frame & { bad?: boolean }, Frame['cpu']>({
          streamKey: key,
          uri: URI,
          select: (frame) => {
            if (frame.bad) {
              throw new Error('select exploded');
            }
            return frame.cpu;
          },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isConnected).toBe(true));
    eventSourceFor(key).simulateMessage({
      cpu: { load: 4 },
      memory: { used: 10 },
      seq: 1,
    });
    await waitFor(() => expect(result.current.data).toEqual({ load: 4 }));

    eventSourceFor(key).simulateMessage({
      cpu: { load: 5 },
      memory: { used: 10 },
      seq: 2,
      bad: true,
    });

    await waitFor(() =>
      expect(
        errorSpy.mock.calls.some((call) =>
          String(call[0]).includes('select threw'),
        ),
      ).toBe(true),
    );
    expect(result.current.data).toEqual({ load: 4 });
    errorSpy.mockRestore();
  });
});
