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
import { useStreamState } from '../use-stream-state';
import type { ReactNode } from 'react';

// Params ride as one object segment (hashKey sorts object keys, so the
// identity is deterministic) — lets filters deep-partial-match named fields.
const ACTIVATIONS_A = [
  'cortex',
  'activations',
  { cortexUri: 'http://c:8080', datasetId: 'dataset-a' },
];
const ACTIVATIONS_B = [
  'cortex',
  'activations',
  { cortexUri: 'http://c:8080', datasetId: 'dataset-b' },
];

function datasetIdOf(streamKey: readonly unknown[]): string | undefined {
  return (streamKey[2] as { datasetId?: string } | undefined)?.datasetId;
}
const HEALTH = ['cortex', 'health', 'http://c:8080'];
const URI = 'http://c:8080/stream';

describe('useStreamState', () => {
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

  it('returns selected state for streams matching a key prefix', async () => {
    openStream(ACTIVATIONS_A);
    openStream(ACTIVATIONS_B);
    openStream(HEALTH);

    const { result } = renderHook(
      () =>
        useStreamState({
          filters: { streamKey: ['cortex', 'activations'] },
          select: (stream) => ({
            datasetId: datasetIdOf(stream.streamKey),
            status: stream.state.status,
          }),
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current).toHaveLength(2);
      expect(result.current.map((entry) => entry.status)).toEqual([
        'connected',
        'connected',
      ]);
    });
    expect(result.current.map((entry) => entry.datasetId)).toEqual([
      'dataset-a',
      'dataset-b',
    ]);
  });

  it('keeps the result referentially stable across non-matching cache events', async () => {
    openStream(ACTIVATIONS_A);
    const healthStream = openStream(HEALTH);

    const { result } = renderHook(
      () =>
        useStreamState({
          filters: { streamKey: ['cortex', 'activations'] },
          select: (stream) => ({ status: stream.state.status }),
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(result.current).toEqual([{ status: 'connected' }]);
    });
    const firstResult = result.current;

    // Traffic on a NON-matching stream fires cache events, but the selected
    // data is unchanged — the array identity must survive (replaceEqualDeep).
    const healthSource =
      healthStream?.getEventSource() as unknown as MockEventSource;
    act(() => {
      healthSource.simulateMessage({ tick: 1 });
      healthSource.simulateMessage({ tick: 2 });
    });

    expect(result.current).toBe(firstResult);
  });

  it('reflects status changes and stream removal from any cause', async () => {
    const streamA = openStream(ACTIVATIONS_A);

    const { result } = renderHook(
      () =>
        useStreamState({
          filters: { streamKey: ['cortex', 'activations'] },
          select: (stream) => ({ status: stream.state.status }),
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(result.current).toEqual([{ status: 'connected' }]);
    });

    // Server-side death: transport error flows through the cache.
    const sourceA = streamA?.getEventSource() as unknown as MockEventSource;
    act(() => {
      sourceA.simulateError();
    });
    await waitFor(() => {
      expect(result.current).toEqual([{ status: 'error' }]);
    });

    // External close (devtools Close / gc): the stream disappears from the
    // cache, so it disappears here — no per-hook onClose callback needed.
    act(() => {
      if (streamA) {
        client.getStreamCache().remove(streamA);
      }
    });
    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it('deep-partial-matches named fields inside an object key segment', () => {
    openStream(ACTIVATIONS_A);
    openStream(ACTIVATIONS_B);

    // No positional index anywhere: address the dataset BY NAME inside the
    // params segment, exactly like TanStack query filters on object keys.
    const { result } = renderHook(
      () =>
        useStreamState({
          filters: {
            streamKey: ['cortex', 'activations', { datasetId: 'dataset-b' }],
          },
          select: (stream) => datasetIdOf(stream.streamKey),
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current).toEqual(['dataset-b']);
  });

  it('applies the predicate escape hatch after the declarative filters', async () => {
    const streamA = openStream(ACTIVATIONS_A);
    openStream(ACTIVATIONS_B);

    // Multi-status ("anything unhealthy") — inexpressible declaratively.
    const { result } = renderHook(
      () =>
        useStreamState({
          filters: {
            streamKey: ['cortex', 'activations'],
            predicate: (stream) => stream.state.status !== 'connected',
          },
          select: (stream) => datasetIdOf(stream.streamKey),
        }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => {
      expect(result.current).toEqual([]);
    });

    const sourceA = streamA?.getEventSource() as unknown as MockEventSource;
    act(() => {
      sourceA.simulateError();
    });
    await waitFor(() => {
      expect(result.current).toEqual(['dataset-a']);
    });
  });

  it('supports exact key matching and status filters', async () => {
    openStream(ACTIVATIONS_A);
    openStream(ACTIVATIONS_B);

    const { result: exact } = renderHook(
      () =>
        useStreamState({
          filters: { exact: true, streamKey: ACTIVATIONS_A },
          select: (stream) => datasetIdOf(stream.streamKey),
        }),
      { wrapper: createWrapper() },
    );
    expect(exact.current).toEqual(['dataset-a']);

    const { result: connectedOnly } = renderHook(
      () =>
        useStreamState({
          filters: { status: 'connecting' },
          select: (stream) => datasetIdOf(stream.streamKey),
        }),
      { wrapper: createWrapper() },
    );
    // Both streams already opened (MockEventSource auto-connects).
    await waitFor(() => {
      expect(connectedOnly.current).toEqual([]);
    });
  });
});
