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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STREAM_STATUS } from '../constants';
import { StreamCache } from '../stream-cache';
import { StreamsObserver } from '../streams-observer';
import { MockEventSource } from '../test/utils';
import type { StreamObserverOptions } from '../stream-observer';
import type { StreamsObserverResults } from '../streams-observer';

const URI = 'http://localhost:3000/stream';

function connectedSource(cache: StreamCache, key: readonly unknown[]) {
  return cache.get(key)?.getEventSource() as unknown as MockEventSource;
}

function config<T = unknown, TData = T>(
  id: string,
  extra?: Partial<StreamObserverOptions<T, TData>>,
): StreamObserverOptions<T, TData> {
  return { streamKey: [id], uri: `${URI}/${id}`, ...extra };
}

describe('StreamsObserver', () => {
  let cache: StreamCache;

  beforeEach(() => {
    vi.stubGlobal('EventSource', MockEventSource);
    cache = new StreamCache();
  });

  afterEach(() => {
    cache.clear();
    vi.unstubAllGlobals();
  });

  it('exposes one result per config, index-aligned', () => {
    const observer = new StreamsObserver(cache, {
      streams: [config('a'), config('b')],
    });
    const unsubscribe = observer.subscribe(vi.fn());

    const results = observer.getCurrentResult();
    expect(results).toHaveLength(2);
    expect(results[0]?.status).toBe(STREAM_STATUS.CONNECTING);
    expect(results[1]?.status).toBe(STREAM_STATUS.CONNECTING);

    connectedSource(cache, ['a']).simulateMessage({ from: 'a' });

    expect(observer.getCurrentResult()[0]?.data).toEqual({ from: 'a' });
    expect(observer.getCurrentResult()[1]?.data).toBeNull();

    unsubscribe();
  });

  it('keeps unchanged entries by reference when one stream updates', () => {
    const observer = new StreamsObserver(cache, {
      streams: [config('a'), config('b')],
    });
    const unsubscribe = observer.subscribe(vi.fn());

    const before = observer.getCurrentResult();

    connectedSource(cache, ['a']).simulateMessage({ from: 'a' });

    const after = observer.getCurrentResult();
    expect(after).not.toBe(before);
    expect(after[0]).not.toBe(before[0]);
    expect(after[1]).toBe(before[1]);

    unsubscribe();
  });

  it('reconciles growth and shrink without orphaned subscriptions', () => {
    const observer = new StreamsObserver(cache, { streams: [config('a')] });
    const unsubscribe = observer.subscribe(vi.fn());

    expect(cache.get(['a'])?.getObserversCount()).toBe(1);

    observer.setOptions({ streams: [config('a'), config('b')] });

    expect(observer.getCurrentResult()).toHaveLength(2);
    expect(cache.get(['a'])?.getObserversCount()).toBe(1);
    expect(cache.get(['b'])?.getObserversCount()).toBe(1);

    observer.setOptions({ streams: [config('b')] });

    expect(observer.getCurrentResult()).toHaveLength(1);
    // released observer count drops; the stream lingers for gc, not removed
    expect(cache.get(['a'])?.getObserversCount()).toBe(0);
    expect(cache.get(['a'])).toBeDefined();
    expect(cache.get(['b'])?.getObserversCount()).toBe(1);

    unsubscribe();

    expect(cache.get(['b'])?.getObserversCount()).toBe(0);
  });

  it('preserves surviving results by identity when config[0] is removed', () => {
    const observer = new StreamsObserver(cache, {
      streams: [config('a'), config('b')],
    });
    const unsubscribe = observer.subscribe(vi.fn());

    connectedSource(cache, ['b']).simulateMessage({ from: 'b' });

    const survivor = observer.getCurrentResult()[1];

    observer.setOptions({ streams: [config('b')] });

    expect(observer.getCurrentResult()[0]).toBe(survivor);
    expect(observer.getCurrentResult()[0]?.data).toEqual({ from: 'b' });

    unsubscribe();
  });

  it('skips connecting configs that are disabled', () => {
    const observer = new StreamsObserver(cache, {
      streams: [config('a'), config('b', { enabled: false })],
    });
    const unsubscribe = observer.subscribe(vi.fn());

    expect(cache.get(['a'])).toBeDefined();
    expect(cache.get(['b'])).toBeUndefined();
    expect(observer.getCurrentResult()[1]?.isEnabled).toBe(false);

    unsubscribe();
  });

  it('gives duplicate streamKeys distinct observers with their own select', () => {
    type Frame = { a: number; b: number };
    const observer = new StreamsObserver<Frame, number>(cache, {
      streams: [
        config<Frame, number>('dup', { select: (frame) => frame.a }),
        config<Frame, number>('dup', { select: (frame) => frame.b }),
      ],
    });
    const unsubscribe = observer.subscribe(vi.fn());

    expect(cache.get(['dup'])?.getObserversCount()).toBe(2);

    connectedSource(cache, ['dup']).simulateMessage({ a: 1, b: 2 });

    expect(observer.getCurrentResult()[0]?.data).toBe(1);
    expect(observer.getCurrentResult()[1]?.data).toBe(2);

    unsubscribe();
  });

  it('reflects a new config array optimistically before it commits', () => {
    const observer = new StreamsObserver(cache, { streams: [config('a')] });

    const [optimistic] = observer.getOptimisticResult(
      [config('a'), config('b')],
      undefined,
    );

    expect(optimistic).toHaveLength(2);
    expect(observer.getCurrentResult()).toHaveLength(1);
  });

  it('shares the combined value structurally and skips unaffected notifications', () => {
    type Payload = { value: number };
    type Combined = { b: Payload | null };
    const combine = vi.fn(
      (results: StreamsObserverResults<Payload, Payload>): Combined => ({
        b: results[1]?.data ?? null,
      }),
    );
    const observer = new StreamsObserver<Payload, Payload, Combined>(cache, {
      streams: [config('a'), config('b')],
      combine,
    });
    const listener = vi.fn();
    const unsubscribe = observer.subscribe(listener);

    const readCombined = () =>
      observer.getOptimisticResult(observer.options.streams, combine)[1]();

    const first = readCombined();
    expect(first).toEqual({ b: null });

    // stream A updates — the derivation ignores it
    connectedSource(cache, ['a']).simulateMessage({ value: 99 });

    expect(listener).not.toHaveBeenCalled();
    expect(readCombined()).toBe(first);

    // stream B updates — the derivation changes
    connectedSource(cache, ['b']).simulateMessage({ value: 2 });

    expect(listener).toHaveBeenCalledTimes(1);
    const second = readCombined();
    expect(second).not.toBe(first);
    expect(second).toEqual({ b: { value: 2 } });

    unsubscribe();
  });
});
