// __private-exports

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

import { throttle } from 'radashi';
import type {
  Stream,
  StreamCache,
  StreamCacheNotifyEvent,
  StreamClient,
  StreamMessage,
  StreamStatus,
  StreamTransport,
  StreamUpdateAction,
} from '@accelint/stream';
import type {
  StreamDevtoolsLifecycleEvent,
  StreamDevtoolsMessageEntry,
  StreamDevtoolsState,
  StreamDevtoolsStore,
  StreamDevtoolsStreamEntry,
} from './types';

/** Leading+trailing throttle (~10/s): first change immediate, rest coalesce. */
const NOTIFY_THROTTLE_MS = 100;

/**
 * Per-stream message cap. The store ratchets `messageHistory` on every
 * stream it sees, so the panel has a log even when the app never opted in.
 */
const RING_BUFFER_SIZE = 50;

/** Timeline cap — append-mostly bookkeeping; unbounded would grow (and clone) forever. */
const TIMELINE_SIZE = 100;

/**
 * Pure projection at snapshot time, never maintained — a superseded
 * instance's late dispatches can't corrupt entries; only HISTORY writes
 * need liveness guards.
 */
function buildEntry(stream: Stream): StreamDevtoolsStreamEntry {
  return {
    streamKey: stream.streamKey,
    streamHash: stream.streamHash,
    status: stream.state.status,
    transport: stream.transport,
    dataRef: stream.state.data,
    dataUpdatedAt: stream.state.dataUpdatedAt,
    observerCount: stream.getObserversCount(),
    messageCount: stream.state.dataUpdateCount,
    hasTransport: stream.getTransport() !== undefined,
  };
}

/** Snapshot-time projection of a stream's retained messages. */
function projectMessages(
  messages: readonly StreamMessage[],
): StreamDevtoolsMessageEntry[] {
  return messages.map((message, index) => ({
    dataRef: message.data,
    dataUpdatedAt: message.dataUpdatedAt,
    duplicate: index > 0 && messages[index - 1]?.data === message.data,
    sequence: message.sequence,
  }));
}

/**
 * Stale hash (stream removed between panel render and click) → warn +
 * undefined; actions never throw into the app.
 */
function resolveStream(
  cache: StreamCache,
  streamHash: string,
  action: string,
): Stream | undefined {
  const stream = cache
    .getAll()
    .find((candidate) => candidate.streamHash === streamHash);

  if (!stream) {
    console.warn(
      `[StreamDevtools] ${action}: no stream for streamHash ${streamHash} — ignoring`,
    );
  }

  return stream;
}

/** Transport is undefined until first observer (lazy connect) or after teardown — warn, don't throw. */
function resolveTransport(
  cache: StreamCache,
  streamHash: string,
  action: string,
): StreamTransport | undefined {
  const stream = resolveStream(cache, streamHash, action);
  if (!stream) {
    return undefined;
  }

  const transport = stream.getTransport();
  if (!transport) {
    console.warn(
      `[StreamDevtools] ${action}: stream ${streamHash} has no live transport (lazy connect — no observer yet, or torn down) — ignoring`,
    );
  }

  return transport;
}

/**
 * In-process devtools store over an injected StreamClient (React Query
 * devtools architecture): panel reads via subscribe/getSnapshot, actions are
 * direct method calls. Deliberately NO devtools event bus (see
 * StreamDevtoolsActions in types.ts).
 *
 * All state derives from public StreamCache.subscribe() events plus the
 * streams' own message history (`messageHistory` ratcheted to
 * RING_BUFFER_SIZE on every stream). Never throws into the app — event
 * processing, snapshot builds, and action bodies are try/caught,
 * console-only.
 *
 * Snapshot contract: getSnapshot() returns the SAME object until a publish.
 * Publishes are throttled; a listener attaching mid-window gets pending
 * state flushed, so a fresh panel renders current state synchronously.
 *
 * @param client - injected at creation; this lib never resolves one itself.
 */
export function createStreamDevtoolsStore(
  client: StreamClient,
): StreamDevtoolsStore {
  const cache = client.getStreamCache();
  // store owns ONLY lifecycle history — current state and message logs
  // derive from the cache at snapshot time. Keyed by streamHash (stable
  // across close/recreate), deliberately outlives streams.
  // lastStatuses = the 'from' side of statusChanged.
  const timelines = new Map<string, StreamDevtoolsLifecycleEvent[]>();
  const lastStatuses = new Map<string, StreamStatus>();

  const listeners = new Set<() => void>();
  let disposed = false;
  // tracking maps advanced past the published snapshot; cleared by publish()
  let dirty = false;

  const appendTimeline = (
    streamHash: string,
    lifecycleEvent: StreamDevtoolsLifecycleEvent,
  ) => {
    const timeline = timelines.get(streamHash);
    if (timeline) {
      timeline.push(lifecycleEvent);
      if (timeline.length > TIMELINE_SIZE) {
        timeline.shift();
      }
    } else {
      timelines.set(streamHash, [lifecycleEvent]);
    }
  };

  // seed history for streams that predate the store
  for (const stream of cache.getAll()) {
    stream.setMessageHistory(RING_BUFFER_SIZE);
    appendTimeline(stream.streamHash, { type: 'added', timestamp: Date.now() });
    lastStatuses.set(stream.streamHash, stream.state.status);
  }

  // every published snapshot is a fresh copy — history arrays keep mutating
  // here. dataRef stays a live reference by design (see types.ts).
  const buildSnapshot = (): StreamDevtoolsState => {
    const streams = cache.getAll();
    return {
      streams: streams.map(buildEntry),
      timelines: Object.fromEntries(
        Array.from(timelines, ([streamHash, timeline]) => [
          streamHash,
          timeline.slice(),
        ]),
      ),
      messageLogs: Object.fromEntries(
        streams.map((stream) => [
          stream.streamHash,
          projectMessages(stream.getMessages()),
        ]),
      ),
    };
  };

  let snapshot = buildSnapshot();

  const publish = () => {
    // disposed also covers the throttle's trailing edge: a publish
    // scheduled pre-dispose must not fire after a store swap
    if (disposed || !dirty) {
      return;
    }
    try {
      snapshot = buildSnapshot();
      dirty = false;
    } catch (error) {
      console.error('[StreamDevtools] Failed to publish snapshot', error);
      return;
    }
    for (const listener of Array.from(listeners)) {
      // one throwing subscriber must not starve the rest
      try {
        listener();
      } catch (error) {
        console.error('[StreamDevtools] Snapshot listener failed', error);
      }
    }
  };

  const schedulePublish = throttle(
    { interval: NOTIFY_THROTTLE_MS, trailing: true },
    publish,
  );

  const trackAdded = (stream: Stream) => {
    const { streamHash } = stream;
    // the panel's log works even when the app never opted into history
    stream.setMessageHistory(RING_BUFFER_SIZE);
    // 'added' for a hash with a timeline = self-heal rebuild — append, never reset
    appendTimeline(streamHash, {
      type: timelines.has(streamHash) ? 'recreated' : 'added',
      timestamp: Date.now(),
    });
    lastStatuses.set(streamHash, stream.state.status);
  };

  const trackRemoved = (stream: Stream) => {
    // a superseded instance's removal can arrive after a rebuild under the
    // same hash — only track when the hash truly left the cache
    if (cache.get(stream.streamKey) !== undefined) {
      return;
    }
    appendTimeline(stream.streamHash, {
      type: 'removed',
      timestamp: Date.now(),
    });
    lastStatuses.delete(stream.streamHash);
  };

  const trackUpdated = (stream: Stream, action: StreamUpdateAction) => {
    // only the instance the cache resolves may write HISTORY — superseded
    // and detached instances still dispatch. Entries need no guard (derived
    // at snapshot time).
    if (cache.get(stream.streamKey) !== stream) {
      return;
    }

    if (action === 'data') {
      // message log + counts derive from the stream at snapshot time;
      // defensive: if a future dispatch carried data+status, 'data' wins the
      // tag — refreshing here keeps later 'from' sides correct
      lastStatuses.set(stream.streamHash, stream.state.status);
      return;
    }

    const previousStatus = lastStatuses.get(stream.streamHash);
    if (
      previousStatus !== undefined &&
      stream.state.status !== previousStatus
    ) {
      appendTimeline(stream.streamHash, {
        type: 'statusChanged',
        timestamp: Date.now(),
        from: previousStatus,
        to: stream.state.status,
      });
    }
    lastStatuses.set(stream.streamHash, stream.state.status);
  };

  const trackObserverChange = (
    stream: Stream,
    type: 'observerAdded' | 'observerRemoved',
  ) => {
    // same liveness guard as trackUpdated: e.g. unmount after a devtools
    // Close emits observerRemoved from the removed instance — would append
    // AFTER 'removed'
    if (cache.get(stream.streamKey) !== stream) {
      return;
    }
    appendTimeline(stream.streamHash, { type, timestamp: Date.now() });
  };

  const handleEvent = (event: StreamCacheNotifyEvent) => {
    switch (event.type) {
      case 'added':
        trackAdded(event.stream);
        break;
      case 'removed':
        trackRemoved(event.stream);
        break;
      case 'updated':
        trackUpdated(event.stream, event.action);
        break;
      case 'observerAdded':
      case 'observerRemoved':
        trackObserverChange(event.stream, event.type);
        break;
      default:
        // observerResultsUpdated: nothing tracked
        return;
    }

    dirty = true;
    // no panel = nothing to notify; subscribe()'s flush catches a later mount up
    if (listeners.size > 0) {
      schedulePublish();
    }
  };

  const unsubscribeCache = cache.subscribe((event) => {
    if (disposed) {
      return;
    }
    try {
      handleEvent(event);
    } catch (error) {
      console.error('[StreamDevtools] Failed to process cache event', error);
    }
  });

  // action bodies never throw into the app: stale hash/transport warn +
  // no-op, anything unexpected is a console-only error
  const runAction = (action: string, execute: () => void) => {
    if (disposed) {
      return;
    }
    try {
      execute();
    } catch (error) {
      console.error(`[StreamDevtools] Failed to execute ${action}`, error);
    }
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      // flush state tracked while unmounted — the shell can remount the
      // panel empty on every open/close/tab-switch, and idle streams emit
      // no further cache events to piggyback on
      if (dirty && !disposed) {
        snapshot = buildSnapshot();
        dirty = false;
      }
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      return snapshot;
    },
    actions: {
      reconnect(streamHash) {
        runAction('reconnect', () => {
          resolveStream(cache, streamHash, 'reconnect')?.retry();
        });
      },
      close(streamHash) {
        runAction('close', () => {
          const stream = resolveStream(cache, streamHash, 'close');
          if (stream) {
            cache.remove(stream);
          }
        });
      },
      clearAll() {
        runAction('clear-all', () => {
          client.clear();
        });
      },
      simulateError(streamHash) {
        runAction('simulate-error', () => {
          // same handler path as a genuine connection failure
          resolveTransport(cache, streamHash, 'simulate-error')?.injectError();
        });
      },
      injectMessage(streamHash, jsonString) {
        runAction('inject-message', () => {
          // real parse → dispatch → observer path — indistinguishable from
          // a server message
          resolveTransport(cache, streamHash, 'inject-message')?.injectMessage(
            jsonString,
          );
        });
      },
    },
    dispose() {
      disposed = true;
      unsubscribeCache();
      listeners.clear();
    },
  };
}
