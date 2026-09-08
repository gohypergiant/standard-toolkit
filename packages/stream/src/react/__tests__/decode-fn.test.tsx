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
import type { StreamFrame } from '../../index';

/** Envelope-style decoder mirroring the cortex protocol shape. */
function envelopeDecode<T>(raw: string): StreamFrame<T> {
  const frame = JSON.parse(raw) as { type?: string; payload?: unknown };
  if (frame.type === 'data') {
    return { kind: 'data', data: frame.payload as T };
  }
  if (frame.type === 'error') {
    return { kind: 'error', error: frame.payload };
  }
  return { kind: 'ignore' };
}

describe('decodeFn', () => {
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

  it('defaults to JSON-as-data when no decodeFn is given (pre-envelope behavior)', async () => {
    const { result } = renderHook(
      () =>
        useSSEStream<{ count: number }>({
          streamKey: ['decode-default'],
          uri: 'http://x/stream',
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    const eventSource = client
      .getStreamCache()
      .get(['decode-default'])
      ?.getEventSource() as unknown as MockEventSource;
    eventSource.simulateMessage({ count: 1 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 1 });
    });
  });

  it('routes data frames through state and error frames through the ERROR status path', async () => {
    const onError = vi.fn();
    const { result } = renderHook(
      () =>
        useSSEStream<{ count: number }>({
          decodeFn: envelopeDecode,
          onError,
          streamKey: ['decode-envelope'],
          uri: 'http://x/stream',
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
    const eventSource = client
      .getStreamCache()
      .get(['decode-envelope'])
      ?.getEventSource() as unknown as MockEventSource;

    // data frame → unwrapped payload reaches state
    eventSource.simulateMessage({ payload: { count: 7 }, type: 'data' });
    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 7 });
    });

    // error frame → server-declared failure drives the same path as a
    // transport error: status + onError, WITHOUT clobbering the data
    // (and without logging — the API surfaces it, TanStack v5 style)
    eventSource.simulateMessage({
      payload: { message: 'geoserver exploded' },
      type: 'error',
    });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(onError).toHaveBeenCalledWith('error');
    expect(result.current.data).toEqual({ count: 7 });
  });

  it('drops ignore frames without touching state or observers', async () => {
    const localOnMessage = vi.fn();
    const { result } = renderHook(
      () =>
        useSSEStream<{ count: number }>({
          decodeFn: envelopeDecode,
          onMessage: localOnMessage,
          streamKey: ['decode-ignore'],
          uri: 'http://x/stream',
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
    const eventSource = client
      .getStreamCache()
      .get(['decode-ignore'])
      ?.getEventSource() as unknown as MockEventSource;

    eventSource.simulateMessage({ type: 'future-frame-kind' });

    expect(result.current.data).toBeNull();
    expect(result.current.dataUpdatedAt).toBe(0);
    expect(localOnMessage).not.toHaveBeenCalled();
  });

  it('contains decodeFn throws: logs and keeps the stream alive', async () => {
    const errorLogSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const { result } = renderHook(
      () =>
        useSSEStream<{ count: number }>({
          decodeFn: envelopeDecode,
          streamKey: ['decode-throws'],
          uri: 'http://x/stream',
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
    const eventSource = client
      .getStreamCache()
      .get(['decode-throws'])
      ?.getEventSource() as unknown as MockEventSource;

    // Raw non-JSON frame: decode throws, stream survives.
    eventSource.onmessage?.(
      new MessageEvent('message', { data: 'not-json{{' }),
    );
    expect(errorLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to decode frame'),
      expect.any(Error),
    );

    // Next valid frame still lands.
    eventSource.simulateMessage({ payload: { count: 2 }, type: 'data' });
    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 2 });
    });
  });
});
