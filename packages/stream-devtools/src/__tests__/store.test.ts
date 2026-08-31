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

import { StreamClient, StreamObserver } from '@accelint/stream';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStreamDevtoolsStore } from '../store';

/** Minimal constructible EventSource: opens immediately, exposes handlers. */
class InstantEventSource {
  static CLOSED = 2;
  onopen: ((event: unknown) => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  readyState = 0;
  url: string;

  constructor(url: string) {
    this.url = url;
    queueMicrotask(() => {
      this.readyState = 1;
      this.onopen?.({});
    });
  }

  close() {
    this.readyState = InstantEventSource.CLOSED;
  }
}

const URI = 'http://localhost:3000/stream';

describe('createStreamDevtoolsStore', () => {
  let originalEventSource: typeof EventSource;
  let client: StreamClient;

  beforeEach(() => {
    originalEventSource = globalThis.EventSource;
    // @ts-expect-error - test double
    globalThis.EventSource = InstantEventSource;
    client = new StreamClient();
  });

  afterEach(() => {
    client.clear();
    globalThis.EventSource = originalEventSource;
  });

  it('ratchets messageHistory so the log fills without app opt-in', () => {
    const store = createStreamDevtoolsStore(client);

    const observer = new StreamObserver(client.getStreamCache(), {
      streamKey: ['devtools'],
      uri: URI,
    });
    const unsubscribe = observer.subscribe(vi.fn());

    const stream = client.getStreamCache().get(['devtools']);
    stream?.getTransport()?.injectMessage('{"count":1}');
    stream?.getTransport()?.injectMessage('{"count":2}');

    // flush-on-subscribe picks up the pending events without waiting out
    // the publish throttle
    store.subscribe(vi.fn());
    const snapshot = store.getSnapshot();

    const entry = snapshot.streams.find(
      (s) => s.streamHash === stream?.streamHash,
    );
    expect(entry?.messageCount).toBe(2);
    expect(snapshot.messageLogs[stream?.streamHash ?? '']).toHaveLength(2);
    expect(
      snapshot.messageLogs[stream?.streamHash ?? '']?.map((m) => m.sequence),
    ).toEqual([1, 2]);

    unsubscribe();
    store.dispose();
  });

  it('records lifecycle timeline and close action removes the stream', () => {
    const store = createStreamDevtoolsStore(client);

    const observer = new StreamObserver(client.getStreamCache(), {
      streamKey: ['lifecycle'],
      uri: URI,
    });
    const unsubscribe = observer.subscribe(vi.fn());

    const stream = client.getStreamCache().get(['lifecycle']);
    const streamHash = stream?.streamHash ?? '';

    store.subscribe(vi.fn());
    const before = store.getSnapshot();
    expect(before.timelines[streamHash]?.[0]?.type).toBe('added');
    expect(before.streams).toHaveLength(1);

    unsubscribe();
    store.actions.close(streamHash);

    store.subscribe(vi.fn());
    const after = store.getSnapshot();
    expect(after.streams).toHaveLength(0);
    expect(
      after.timelines[streamHash]?.some((event) => event.type === 'removed'),
    ).toBe(true);

    store.dispose();
  });
});
