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
import { StreamCache } from '../stream-cache';
import { StreamObserver } from '../stream-observer';
import { MockEventSource } from '../test/utils';

describe('StreamCache', () => {
  let cache: StreamCache;

  beforeEach(() => {
    vi.stubGlobal('EventSource', MockEventSource);
    cache = new StreamCache();
  });

  afterEach(() => {
    cache.clear();
    vi.unstubAllGlobals();
  });

  it('should not open a connection until an observer subscribes', () => {
    const uri = 'http://localhost:3000/stream';
    const stream = cache.build(['lazy'], uri);

    // Building the stream (happens during render/SSR) must not connect
    expect(stream.getEventSource()).toBeUndefined();

    // Constructing an observer must not connect either
    const observer = new StreamObserver(cache, { streamKey: ['lazy'], uri });
    expect(stream.getEventSource()).toBeUndefined();

    // Subscribing (post-commit) opens the connection
    const unsubscribe = observer.subscribe(vi.fn());
    expect(stream.getEventSource()).toBeDefined();

    unsubscribe();
  });

  it('should linger for gcTime after the last observer unsubscribes, then close and remove', () => {
    vi.useFakeTimers();
    try {
      const uri = 'http://localhost:3000/stream';
      const observer = new StreamObserver(cache, {
        streamKey: ['cleanup'],
        uri,
        gcTime: 1_000,
      });
      const unsubscribe = observer.subscribe(vi.fn());

      const stream = cache.get(['cleanup']);
      const eventSource =
        stream?.getEventSource() as unknown as MockEventSource;
      expect(eventSource).toBeDefined();

      unsubscribe();

      // Linger window: still cached, EventSource still open.
      expect(cache.get(['cleanup'])).toBeDefined();
      expect(eventSource.readyState).not.toBe(MockEventSource.CLOSED);

      // gc fires → closed and removed.
      vi.advanceTimersByTime(1_000);
      expect(cache.get(['cleanup'])).toBeUndefined();
      expect(eventSource.readyState).toBe(MockEventSource.CLOSED);
    } finally {
      vi.useRealTimers();
    }
  });

  it('should cancel gc when an observer re-subscribes within the linger window', () => {
    vi.useFakeTimers();
    try {
      const uri = 'http://localhost:3000/stream';
      const observer = new StreamObserver(cache, {
        streamKey: ['cleanup'],
        uri,
        gcTime: 1_000,
      });
      const unsubscribe = observer.subscribe(vi.fn());
      const eventSource = cache
        .get(['cleanup'])
        ?.getEventSource() as unknown as MockEventSource;

      unsubscribe();
      vi.advanceTimersByTime(500);

      // Re-attach mid-linger: same stream, same EventSource, gc cancelled.
      const resubscribe = observer.subscribe(vi.fn());
      vi.advanceTimersByTime(5_000);

      expect(cache.get(['cleanup'])).toBeDefined();
      expect(cache.get(['cleanup'])?.getEventSource()).toBe(eventSource);
      expect(eventSource.readyState).not.toBe(MockEventSource.CLOSED);

      resubscribe();
    } finally {
      vi.useRealTimers();
    }
  });

  it('should log an error when build() sees the same key with a different uri', () => {
    const errorSpy = vi.spyOn(console, 'error');

    const first = cache.build(['same-key'], 'http://localhost:3000/stream-a');
    const second = cache.build(['same-key'], 'http://localhost:3000/stream-b');

    // The original stream (and uri) wins
    expect(second).toBe(first);
    expect(first.uri).toBe('http://localhost:3000/stream-a');
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('http://localhost:3000/stream-b'),
    );
  });

  it('should not log when build() is called again with the same uri', () => {
    const errorSpy = vi.spyOn(console, 'error');

    cache.build(['same-key'], 'http://localhost:3000/stream-a');
    cache.build(['same-key'], 'http://localhost:3000/stream-a');

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('should increment dataUpdateCount for every data frame, including two in the same millisecond', () => {
    vi.useFakeTimers();
    try {
      const uri = 'http://localhost:3000/stream';
      const stream = cache.build(['same-ms'], uri);
      const observer = new StreamObserver(cache, {
        streamKey: ['same-ms'],
        uri,
      });
      const unsubscribe = observer.subscribe(vi.fn());
      const eventSource = stream.getEventSource() as unknown as MockEventSource;

      // Fake timers freeze Date.now(), so both frames land in one
      // millisecond — dataUpdatedAt cannot tell them apart, the counter must.
      eventSource.simulateMessage({ sequence: 1 });
      const timestampAfterFirst = stream.state.dataUpdatedAt;
      eventSource.simulateMessage({ sequence: 2 });

      expect(stream.state.dataUpdatedAt).toBe(timestampAfterFirst);
      expect(stream.state.dataUpdateCount).toBe(2);
      expect(stream.state.data).toEqual({ sequence: 2 });

      unsubscribe();
    } finally {
      vi.useRealTimers();
    }
  });

  it('should tag updated cache events with the dispatch action', () => {
    vi.useFakeTimers();
    try {
      const uri = 'http://localhost:3000/stream';
      const actions: string[] = [];
      const unsubscribeCache = cache.subscribe((event) => {
        if (event.type === 'updated') {
          actions.push(event.action);
        }
      });

      const observer = new StreamObserver(cache, {
        streamKey: ['action-tag'],
        uri,
      });
      const unsubscribe = observer.subscribe(vi.fn());
      const stream = cache.get(['action-tag']);
      const eventSource =
        stream?.getEventSource() as unknown as MockEventSource;

      vi.advanceTimersByTime(200); // auto-open → status dispatch
      eventSource.simulateMessage({ sequence: 1 });
      eventSource.simulateMessage({ sequence: 2 }); // same ms — still 2 events

      // Consumers can tell messages from status flaps without counters.
      expect(actions).toEqual(['status', 'data', 'data']);

      unsubscribe();
      unsubscribeCache();
    } finally {
      vi.useRealTimers();
    }
  });

  it('should not increment dataUpdateCount on status-only dispatches', () => {
    const uri = 'http://localhost:3000/stream';
    const stream = cache.build(['status-only'], uri);
    const observer = new StreamObserver(cache, {
      streamKey: ['status-only'],
      uri,
    });
    const unsubscribe = observer.subscribe(vi.fn());
    const eventSource = stream.getEventSource() as unknown as MockEventSource;

    eventSource.simulateOpen();
    eventSource.simulateError();
    stream.retry();

    expect(stream.state.dataUpdateCount).toBe(0);

    unsubscribe();
  });

  it('should dispatch disconnected status to observers when clear() closes their stream', () => {
    const uri = 'http://localhost:3000/stream';
    const observer = new StreamObserver(cache, {
      streamKey: ['clearing'],
      uri,
    });
    const unsubscribe = observer.subscribe(vi.fn());

    cache.clear();

    expect(observer.getCurrentResult().isDisconnected).toBe(true);

    unsubscribe();
  });
});
