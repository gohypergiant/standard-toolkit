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

type Frame = { count: number };

const URI = 'http://localhost:3000/stream';

describe('useSSEStream messageHistory', () => {
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

  it('exposes retained messages in the result, oldest first', async () => {
    const key = ['history'];
    const { result } = renderHook(
      () =>
        useSSEStream<Frame>({ streamKey: key, uri: URI, messageHistory: 3 }),
      { wrapper },
    );

    for (let i = 1; i <= 4; i++) {
      eventSourceFor(key).simulateMessage({ count: i });
    }

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(3);
    });
    expect(result.current.messages.map((m) => m.data.count)).toEqual([2, 3, 4]);
  });

  it('keeps messages raw when select narrows data', async () => {
    const key = ['history-select'];
    const { result } = renderHook(
      () =>
        useSSEStream<Frame, number>({
          streamKey: key,
          uri: URI,
          messageHistory: 2,
          select: (frame) => frame.count,
        }),
      { wrapper },
    );

    eventSourceFor(key).simulateMessage({ count: 7 });

    await waitFor(() => {
      expect(result.current.data).toBe(7);
    });
    // select shapes `data`, not events — entries keep the full frame
    expect(result.current.messages[0]?.data).toEqual({ count: 7 });
  });

  it('shares one history across observers of the same streamKey', async () => {
    const key = ['history-shared'];
    const withHistory = renderHook(
      () =>
        useSSEStream<Frame>({ streamKey: key, uri: URI, messageHistory: 5 }),
      { wrapper },
    );
    const without = renderHook(
      () => useSSEStream<Frame>({ streamKey: key, uri: URI }),
      { wrapper },
    );

    eventSourceFor(key).simulateMessage({ count: 1 });

    await waitFor(() => {
      expect(withHistory.result.current.messages).toHaveLength(1);
    });
    // history belongs to the shared stream, not the observer: this hook set
    // no messageHistory, but sees the buffer the other hook's cap enabled
    expect(without.result.current.messages).toHaveLength(1);
  });
});
