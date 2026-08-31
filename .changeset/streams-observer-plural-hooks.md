---
'@accelint/stream': minor
---

Add `StreamsObserver` and the plural `useStreams`/`useSSEStreams`/
`useWebSocketStreams` hooks, the `QueriesObserver`/`useQueries` analog. One hook call (one
`useSyncExternalStore` subscription) observes a dynamic-length array of
stream configs, where mapping the singular hook would break the Rules of
Hooks. `setOptions` reconciles children by `streamKey` hash: new configs
connect, removed configs release their streams into the normal gc linger,
and survivors keep observer state and result identity. An optional
`combine` derives one value from the per-stream results, with structural
sharing so the derived value keeps its reference (and skips the re-render)
when no input it reads has changed.
