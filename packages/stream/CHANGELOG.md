# @accelint/stream

## 0.3.0

### Minor Changes

- 1b679d3: Add `StreamsObserver` and the plural `useStreams`/`useSSEStreams`/
  `useWebSocketStreams` hooks, the `QueriesObserver`/`useQueries` analog. One hook call (one
  `useSyncExternalStore` subscription) observes a dynamic-length array of
  stream configs, where mapping the singular hook would break the Rules of
  Hooks. `setOptions` reconciles children by `streamKey` hash: new configs
  connect, removed configs release their streams into the normal gc linger,
  and survivors keep observer state and result identity. An optional
  `combine` derives one value from the per-stream results, with structural
  sharing so the derived value keeps its reference (and skips the re-render)
  when no input it reads has changed.

## 0.2.0

### Minor Changes

- 9e99902: Initial release: TanStack-Query-style caching for held-open stream
  connections (SSE and WebSocket). The root export is the framework-agnostic
  core (Stream/StreamCache/StreamClient/StreamObserver, both transports,
  gcTime linger, injected decodeFn, opt-in per-stream message history);
  `@accelint/stream/react` adds the hooks (useSSEStream, useWebSocketStream,
  useStreamState, useStreamCount, StreamClientProvider). React is an optional
  peer — core-only consumers install and bundle zero React.

  `@accelint/stream-devtools` adds a Streams tab for TanStack Devtools (a
  SolidJS panel built on @tanstack/devtools-ui, Solid fully bundled): stream
  list per transport, status/observer/message counts, message log with
  duplicate detection, lifecycle timeline, and reconnect / close / clear /
  simulate-error / inject-message actions. Also exports a standalone
  `mountStreamDevtools(el, { client })` for hosts without the shell.
