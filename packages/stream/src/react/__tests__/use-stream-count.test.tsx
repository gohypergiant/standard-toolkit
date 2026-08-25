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
import { StreamClient, StreamObserver } from '../../index';
import { MockEventSource } from '../../test/utils';
import { StreamClientProvider } from '../stream-client-provider';
import { useStreamCount } from '../use-stream-count';
import type { ReactNode } from 'react';

const URI = 'http://c:8080/stream';

describe('useStreamCount', () => {
  let client: StreamClient;
  const unsubscribers: Array<() => void> = [];

  beforeEach(() => {
    vi.stubGlobal('EventSource', MockEventSource);
    client = new StreamClient();
  });

  afterEach(() => {
    for (const unsubscribe of unsubscribers.splice(0)) {
      unsubscribe();
    }
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

  function openStream(streamKey: readonly unknown[]) {
    const observer = new StreamObserver(client.getStreamCache(), {
      streamKey,
      uri: URI,
    });
    unsubscribers.push(observer.subscribe(vi.fn()));
    return client.getStreamCache().get(streamKey);
  }

  it('counts streams matching a status filter and tracks transitions', async () => {
    const streamA = openStream(['count', 'a']);
    openStream(['count', 'b']);

    const { result: connected } = renderHook(
      () => useStreamCount({ status: 'connected' }),
      { wrapper: createWrapper() },
    );
    const { result: errored } = renderHook(
      () => useStreamCount({ status: 'error' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(connected.current).toBe(2);
    });
    expect(errored.current).toBe(0);

    // One stream dies: both counts move, in opposite directions.
    const sourceA = streamA?.getEventSource() as unknown as MockEventSource;
    act(() => {
      sourceA.simulateError();
    });
    await waitFor(() => {
      expect(connected.current).toBe(1);
      expect(errored.current).toBe(1);
    });
  });

  it('counts everything without filters and composes with key prefixes', async () => {
    openStream(['count', 'a']);
    openStream(['other', 'b']);

    const { result: total } = renderHook(() => useStreamCount(), {
      wrapper: createWrapper(),
    });
    const { result: scoped } = renderHook(
      () => useStreamCount({ streamKey: ['count'] }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(total.current).toBe(2);
    });
    expect(scoped.current).toBe(1);
  });
});
