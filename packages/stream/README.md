<!-- Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License. -->

# @accelint/stream

**TanStack Query for live streams.** This library manages held-open stream
connections (SSE or WebSocket) the way TanStack Query manages fetched data:
consumers ask for a stream by `streamKey`, and everyone using the same key
**shares one live connection**. If you know TanStack Query you already know
this library — same classes, same lifecycle, one different resource at the
center: instead of caching a *response*, we cache an *open connection*.

Two entry points, one package (the `@accelint/bus` pattern):

- **`@accelint/stream`** — the framework-agnostic core.
- **`@accelint/stream/react`** — the React hooks.

React is an **optional peer**: core-only consumers install and bundle zero
React — the `react/` modules are separate subpath exports that are never
loaded unless imported.

## The cast (1:1 with TanStack Query)

| This library | TanStack Query | What it is |
| --- | --- | --- |
| `useSSEStream()` / `useWebSocketStream()` | `useQuery()` | The hooks a component calls — same semantics, different wire protocol |
| `streamKey` / `streamHash` | `queryKey` / `queryHash` | Identity: everyone on the same key shares one stream |
| `decodeFn` | `queryFn` | The injected protocol boundary — the library never assumes a wire format |
| `StreamObserver` | `QueryObserver` | One per consumer; derives the result (`data`, `status`, flags) and fires callbacks |
| `Stream` | `Query` | One per `streamKey`; owns state and the network resource |
| `StreamCache` | `QueryCache` | `Map<streamHash, Stream>`; get-or-create + lifecycle events |
| `StreamClient` | `QueryClient` | Entry point holding the cache |
| `StreamClientProvider` / `useStreamClient` | `QueryClientProvider` / `useQueryClient` | React context wiring |
| `useStreamState(filters, select)` | `useMutationState` | Aggregate observation over the whole cache |
| `useStreamCount(filters)` | `useIsFetching` | Count of streams matching filters |
| Transport (`EventSource`/`WebSocket`, held open) | `queryFn` fetch (runs, then done) | **The one difference** — see below |
| `gcTime` linger | `gcTime` linger | Unobserved entries survive briefly for instant re-attach |

## Lifecycle

- **Construction is side-effect free.** Building a `Stream` (or rendering a
  hook) opens nothing. The connection starts when the first observer
  subscribes (React commit) — the same lazy pattern as TanStack Query only
  fetching when a query gains an active observer. SSR renders never connect.
- **`gcTime` linger:** when the last observer detaches, the connection stays
  open for `gcTime` (default **30 seconds** in the browser — not TanStack's
  5 minutes, because a lingering stream holds an *open server connection*,
  not inert cached data). An observer returning within the window re-attaches
  to the same live socket — StrictMode double-mounts, Suspense blips, and
  quick route hops are free. `gcTime` ratchets up across observers (longest
  wins); `Infinity` disables gc; explicit removal is immediate.
- **Streams are event emitters, not state replicators.** `onMessage` fires
  for every frame, even payloads identical to the previous one. `data`, by
  contrast, uses structural sharing (`replaceEqualDeep`) so an identical
  payload keeps the same reference and doesn't re-render consumers.
- **No "stale data" concept.** A live connection is never stale, so
  `staleTime` has no analog. The connection either exists or it doesn't.

## Transports

- **SSE (`useSSEStream`)** — `EventSource`; the browser reconnects natively
  (tuned by the server's `retry:` field).
- **WebSocket (`useWebSocketStream`)** — the browser never reconnects on its
  own, so the transport retries with doubling backoff (1s → 15s cap, reset
  on a successful open). `uri` accepts http(s):// (auto-converted to
  ws(s)://) or explicit ws(s)://. There is no client-side liveness watchdog
  (browsers cannot send WS pings) — WS endpoints must heartbeat like the
  SSE ones.

**A streamKey identifies one stream on one transport.** Requesting the same
key on a different transport (or a different uri) logs an error and keeps
serving the original stream.

## Setup (React)

```tsx
import { StreamClient } from '@accelint/stream';
import { StreamClientProvider } from '@accelint/stream/react';

const streamClient = new StreamClient();

function App({ children }) {
  return (
    <StreamClientProvider client={streamClient}>
      {children}
    </StreamClientProvider>
  );
}
```

## Usage

```tsx
import { useSSEStream } from '@accelint/stream/react';

function ComponentA() {
  const { data, status, isConnected, retry, pause, resume } = useSSEStream({
    streamKey: ['health', apiUri],
    uri: `${apiUri}/stream/health`,
    onMessage: (data) => console.log('A received:', data),
  });

  return <div>Status: {status}</div>;
}

// Shares the same connection (same streamKey)
function ComponentB() {
  const { data } = useSSEStream({
    streamKey: ['health', apiUri],
    uri: `${apiUri}/stream/health`,
  });

  return <div>Data: {JSON.stringify(data)}</div>;
}
```

### Options

- `streamKey` (required): stream identity. **Must include everything the
  `uri` derives from** (e.g. the host) — the `uri` is only read when the
  stream is first created.
- `uri` (required): the stream endpoint.
- `decodeFn`: turns one raw wire frame into
  `{ kind: 'data', data } | { kind: 'error', error } | { kind: 'ignore' }` —
  this library's `queryFn`. Defaults to JSON-as-data. Backend protocols
  (envelopes, keepalive filtering, server-declared errors) live in app-owned
  decoders, never in the library. Fixed when the stream is first created
  (first consumer wins, like `uri`).
- `enabled`: set `false` to not connect (default `true`).
- `gcTime`: unobserved linger (connection open) before gc. 30s browser
  default; ratchets up; `Infinity` disables.
- `select`: derive this observer's slice from stream data — QueryObserver
  semantics: memoized on (data identity, select identity), structurally
  shared so a deep-equal slice keeps its reference. `onMessage` stays raw —
  select shapes state, not events.
- `messageHistory`: retained-message cap for `messages` in the result.
  Default 0 (off — no retention cost); ratchets up across observers like
  `gcTime`. Entries stay raw even when `select` narrows `data`.
- `onOpen(status)` / `onError(status)`: fired on status transitions.
- `onMessage(data)`: fired for **every** message, including duplicates.
- `client`: override the context `StreamClient`.

### Result

`data`, `dataUpdatedAt`, `status` (`connecting | connected | error |
disconnected`), the derived booleans (`isConnecting`, `isConnected`,
`isError`, `isDisconnected`, `isEnabled`), `messages` (retained raw
messages, oldest first — empty until `messageHistory` is set; entries are
`{ data, dataUpdatedAt, sequence }` with consecutive duplicate payloads
sharing one `data` reference — ideal for a read-only chat/feed UI), and
three methods:

- `retry()`: close and reopen the underlying connection on either transport.
  Use after a fatal error — `EventSource` stops auto-reconnecting once the
  server rejects the connection, and the WebSocket backoff caps out.
  Re-resolves the stream from the cache first, so it also recovers a stream
  that was externally removed (e.g. devtools Close).
- `pause()` / `resume()`: detach/reacquire the stream for this observer.
  Resuming within the `gcTime` window re-attaches to the same live
  connection.

### Observing many streams at once

`useStreamState` is a `useSyncExternalStore` read over the cache itself, for
aggregate UI like a connection indicator — every way a stream can change or
end flows through the cache and lands here.

```tsx
const activationStreams = useStreamState({
  filters: { streamKey: ['activations'] }, // prefix match
  select: (stream) => ({
    id: (stream.streamKey[1] as { id: string }).id,
    status: stream.state.status,
  }),
});
```

Filters: `streamKey` (prefix-matched via TanStack's `partialMatchKey`;
`exact: true` for whole-key), `status`, `transport`, and `predicate` — the
arbitrary escape hatch. Pass `select` to narrow what triggers re-renders:
the result array is referentially stable (`replaceEqualDeep`) until the
selected data actually changes.

`useStreamCount(filters?)` is the `useIsFetching` analog — a
membership-stable count that re-renders only when it changes:

```tsx
const erroredCount = useStreamCount({ status: 'error' });
```

### Imperative access (core, no React)

```ts
import { StreamClient } from '@accelint/stream';

const client = new StreamClient();
client.getStreamState(['health', uri]);
client.getStreams({ status: 'error' });
client.getStreamCount({ transport: 'websocket' });
client.clear();
```

`StreamCache.subscribe()` observes every lifecycle event — this is how
`@accelint/stream-devtools` watches from the outside without this library
knowing it exists.

## Message history

Opt-in per stream via `messageHistory`: the stream keeps its last N raw
messages, readable via `stream.getMessages()` and surfaced by observers as
`messages`. `sequence` is the stream's `dataUpdateCount` at dispatch
(stable across ring-buffer eviction). History lives on the stream instance
and dies with it.

## DevTools

`@accelint/stream-devtools` adds a Streams tab to TanStack Devtools showing
every stream's status, observer count, message log, and lifecycle timeline,
with Reconnect / Close / Clear All / Simulate-Error / Inject-Message
actions.
