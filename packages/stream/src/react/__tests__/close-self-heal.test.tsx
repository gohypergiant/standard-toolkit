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
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StreamClient } from '../../index';
import { MockEventSource } from '../../test/utils';
import { StreamClientProvider } from '../stream-client-provider';
import { useSSEStream } from '../use-sse-stream';
import type { ReactNode } from 'react';

describe('devtools Close self-heal repro', () => {
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

  it('retry() resurrects the connection even when the held stream was externally removed', async () => {
    const key = ['close-heal-retry'];
    const uri = 'http://localhost:3000/stream';

    // Plain observer, no React: nothing re-renders after the removal, so the
    // observer keeps pointing at the detached instance — the exact state the
    // health page's dead Retry button was in.
    const { StreamObserver } = await import('../../index');
    const cache = client.getStreamCache();
    const observer = new StreamObserver<{ count: number }>(cache, {
      streamKey: key,
      uri,
    });
    const unsubscribe = observer.subscribe(vi.fn());
    const firstStream = cache.get(key);
    await waitFor(() => {
      expect(observer.getCurrentResult().isConnected).toBe(true);
    });

    if (firstStream) {
      cache.remove(firstStream);
    }
    expect(cache.get(key)).toBeUndefined();
    expect(observer.getCurrentResult().isDisconnected).toBe(true);

    // Retry must re-resolve against the cache and open a fresh connection —
    // it used to silently no-op on the closed instance.
    observer.retry();

    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
      expect(observer.getCurrentResult().isConnected).toBe(true);
    });
    expect(cache.get(key)).not.toBe(firstStream);

    unsubscribe();
  });

  it('rebuilds the stream after a devtools-style close while the hook stays mounted', async () => {
    const key = ['close-heal'];
    const uri = 'http://localhost:3000/stream';

    const { result } = renderHook(
      () => useSSEStream<{ count: number }>({ streamKey: key, uri }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const cache = client.getStreamCache();
    const firstStream = cache.get(key);
    expect(firstStream).toBeDefined();

    // Exactly what the connector does for action-close.
    act(() => {
      if (firstStream) {
        cache.remove(firstStream);
      }
    });

    // Design intent per the action-row tooltip:
    // "cache.remove(stream) — observers self-heal on next render"
    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
      expect(result.current.isConnected).toBe(true);
    });
    expect(cache.get(key)).not.toBe(firstStream);
  });

  it('rebuilds after close under StrictMode (matches app config)', async () => {
    const key = ['close-heal-strict'];
    const uri = 'http://localhost:3000/stream';
    const Providers = createWrapper();

    const { result } = renderHook(
      () => useSSEStream<{ count: number }>({ streamKey: key, uri }),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <StrictMode>
            <Providers>{children}</Providers>
          </StrictMode>
        ),
      },
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const cache = client.getStreamCache();
    const firstStream = cache.get(key);

    act(() => {
      if (firstStream) {
        cache.remove(firstStream);
      }
    });

    await waitFor(() => {
      expect(cache.get(key)).toBeDefined();
      expect(result.current.isConnected).toBe(true);
    });
  });
});
