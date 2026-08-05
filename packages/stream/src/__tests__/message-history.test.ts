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

const URI = 'http://localhost:3000/stream';

function connectedSource(cache: StreamCache, key: readonly unknown[]) {
  return cache.get(key)?.getEventSource() as unknown as MockEventSource;
}

describe('message history', () => {
  let cache: StreamCache;

  beforeEach(() => {
    vi.stubGlobal('EventSource', MockEventSource);
    cache = new StreamCache();
  });

  afterEach(() => {
    cache.clear();
    vi.unstubAllGlobals();
  });

  it('retains nothing by default, with stable empty identity', () => {
    const observer = new StreamObserver(cache, {
      streamKey: ['off'],
      uri: URI,
    });
    const unsubscribe = observer.subscribe(vi.fn());

    const stream = cache.get(['off']);
    const before = stream?.getMessages();

    connectedSource(cache, ['off']).simulateMessage({ count: 1 });
    connectedSource(cache, ['off']).simulateMessage({ count: 2 });

    expect(stream?.getMessages()).toHaveLength(0);
    expect(stream?.getMessages()).toBe(before);
    expect(observer.getCurrentResult().messages).toHaveLength(0);

    unsubscribe();
  });

  it('caps the buffer, evicting oldest first, with sequence preserved', () => {
    const observer = new StreamObserver(cache, {
      streamKey: ['capped'],
      uri: URI,
      messageHistory: 3,
    });
    const unsubscribe = observer.subscribe(vi.fn());

    for (let i = 1; i <= 5; i++) {
      connectedSource(cache, ['capped']).simulateMessage({ count: i });
    }

    const messages = observer.getCurrentResult().messages;
    expect(messages).toHaveLength(3);
    expect(messages.map((m) => m.sequence)).toEqual([3, 4, 5]);
    expect(messages.map((m) => (m.data as { count: number }).count)).toEqual([
      3, 4, 5,
    ]);

    unsubscribe();
  });

  it('shares references for structurally equal consecutive payloads', () => {
    const observer = new StreamObserver(cache, {
      streamKey: ['dupes'],
      uri: URI,
      messageHistory: 5,
    });
    const unsubscribe = observer.subscribe(vi.fn());

    connectedSource(cache, ['dupes']).simulateMessage({ count: 1 });
    connectedSource(cache, ['dupes']).simulateMessage({ count: 1 });
    connectedSource(cache, ['dupes']).simulateMessage({ count: 2 });

    const [first, second, third] = observer.getCurrentResult().messages;
    // duplicate payload keeps the previous reference (replaceEqualDeep) —
    // still a distinct entry with its own sequence
    expect(second?.data).toBe(first?.data);
    expect(second?.sequence).toBe(2);
    expect(third?.data).not.toBe(second?.data);

    unsubscribe();
  });

  it('ratchets the cap up across observers, never down', () => {
    const small = new StreamObserver(cache, {
      streamKey: ['ratchet'],
      uri: URI,
      messageHistory: 2,
    });
    const unsubscribeSmall = small.subscribe(vi.fn());

    const large = new StreamObserver(cache, {
      streamKey: ['ratchet'],
      uri: URI,
      messageHistory: 4,
    });
    const unsubscribeLarge = large.subscribe(vi.fn());

    // a later, smaller request must not shrink the cap
    cache.build(['ratchet'], URI, { messageHistory: 1 });

    for (let i = 1; i <= 6; i++) {
      connectedSource(cache, ['ratchet']).simulateMessage({ count: i });
    }

    expect(cache.get(['ratchet'])?.getMessages()).toHaveLength(4);

    unsubscribeSmall();
    unsubscribeLarge();
  });
});
