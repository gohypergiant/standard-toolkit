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

import type { StreamKey, StreamStatus, TransportKind } from '@accelint/stream';

/** One tracked stream, derived from public StreamCache events only. */
export type StreamDevtoolsStreamEntry = {
  streamKey: StreamKey;
  streamHash: string;
  status: StreamStatus;
  /** Drives the panel's SSE/WS tabs. */
  transport: TransportKind;
  /** Reference to the stream's latest parsed data — never a clone. */
  dataRef: unknown;
  dataUpdatedAt: number;
  observerCount: number;
  messageCount: number;
  /**
   * False until first observer (lazy connect) or after teardown — panel
   * disables simulate-error/inject-message on this.
   */
  hasTransport: boolean;
};

/** One timestamped entry in a stream's lifecycle timeline. */
export type StreamDevtoolsLifecycleEvent =
  | { type: 'added'; timestamp: number }
  | { type: 'recreated'; timestamp: number }
  | { type: 'removed'; timestamp: number }
  | { type: 'observerAdded'; timestamp: number }
  | { type: 'observerRemoved'; timestamp: number }
  | {
      type: 'statusChanged';
      timestamp: number;
      from: StreamStatus;
      to: StreamStatus;
    };

/** One ring-buffer message entry. `dataRef` is a reference — never a clone. */
export type StreamDevtoolsMessageEntry = {
  dataRef: unknown;
  dataUpdatedAt: number;
  /** `replaceEqualDeep` kept the previous entry's data ref (deep-equal payload). */
  duplicate: boolean;
  /**
   * 1-based position in the stream's full message history (the stream's
   * `dataUpdateCount` at dispatch); survives ring eviction. Stable render
   * key + visible entry number — indexes shift on eviction, `dataUpdatedAt`
   * collides same-ms.
   */
  sequence: number;
};

/** Read by the panel via `subscribe`/`getSnapshot`. */
export type StreamDevtoolsState = {
  streams: StreamDevtoolsStreamEntry[];
  /** Keyed by `streamHash` — the only identity stable across close/recreate. */
  timelines: Record<string, StreamDevtoolsLifecycleEvent[]>;
  /**
   * Projected at snapshot time from each live stream's message history
   * (the store ratchets `messageHistory` on every stream it sees). Lives
   * with the stream instance — close/recreate starts a fresh log.
   */
  messageLogs: Record<string, StreamDevtoolsMessageEntry[]>;
};

/**
 * Panel → app commands, direct in-process calls. Deliberately NOT on the
 * TanStack devtools event bus: the bus mirrors every event to all
 * same-origin tabs (BroadcastChannel, no opt-out) — two open tabs overwrote
 * each other's state and executed each other's commands. The panel calls
 * the store directly — React Query devtools architecture.
 */
export type StreamDevtoolsActions = {
  /** stream.retry() — close and reopen the underlying transport. */
  reconnect(streamHash: string): void;
  /** cache.remove(stream) — mounted observers self-heal on next render. */
  close(streamHash: string): void;
  /** client.clear() — removes every stream. */
  clearAll(): void;
  /** Drive the transport's real connection-failure path. */
  simulateError(streamHash: string): void;
  /** Feed panel-validated JSON through the real message path. */
  injectMessage(streamHash: string, jsonString: string): void;
};

/** The in-process store the panel subscribes to. */
export type StreamDevtoolsStore = {
  /**
   * Attaching flushes any pending snapshot — a fresh panel sees current
   * state; no bus, no replay problem.
   */
  subscribe(listener: () => void): () => void;
  /** Stable between notifications; a new object after each one. */
  getSnapshot(): StreamDevtoolsState;
  actions: StreamDevtoolsActions;
  /** Detach from the cache; further events and actions are ignored. */
  dispose(): void;
};
