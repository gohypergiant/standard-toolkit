# @accelint/stream

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
