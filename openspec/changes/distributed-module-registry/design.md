## Context

The `@accelint/bus` package provides cross-tab communication via BroadcastChannel. Applications need a higher-level system for managing instanced modules (map layers, dashboard widgets, visualizations) that can be registered, queried, and migrated between tabs.

**Current State:**
- `@accelint/bus` handles low-level event pub/sub across tabs
- No concept of "registry" or "module instances"
- No cross-tab discovery or coordination mechanism

**Constraints:**
- Must use existing `@accelint/bus` infrastructure (no new communication channels)
- All data must be StructuredCloneable (BroadcastChannel limitation)
- Must work in browser contexts (tabs/windows) using BroadcastChannel API
- Should support TypeScript generics for type-safe module metadata

## Goals / Non-Goals

**Goals:**
- Enable cross-tab module registration with typed metadata
- Support querying for modules across all tabs with filtering
- Implement safe migration protocol for transferring modules between tabs
- Provide highlight coordination for cross-tab UI feedback
- Maintain registry metadata synchronization automatically
- Declarative constraints for migration validation

**Non-Goals:**
- Persistent storage (registries are in-memory only, cleared on tab close)
- Conflict resolution for simultaneous migrations (single-writer assumption)
- Module state serialization (app's responsibility)
- Authentication/authorization (trust boundary is same origin)
- Performance optimization for 100+ tabs (target: 2-10 tabs typical use case)

## Decisions

### D1: Singleton Registry Pattern

**Decision:** Registry uses singleton pattern, one instance per tab, matching Broadcast pattern.

**Rationale:**
- Simplifies app code (no need to pass registry instances)
- Aligns with existing `Broadcast.getInstance()` pattern
- Each tab has exactly one registry identity (maps to bus ID)
- Multi-instance support adds complexity without clear use case

**Alternative Considered:** Allow multiple Registry instances per tab for domain separation (e.g., separate map and dashboard registries). Rejected because:
- Increases coordination complexity
- Event namespace pollution
- Unclear which registry "owns" a tab's identity
- Can be added later if needed without breaking changes

### D2: Shared Event Bus

**Decision:** Registry uses the app's existing Broadcast bus instance, not a separate channel.

**Rationale:**
- Reduces number of BroadcastChannel connections
- Simplified connection tracking (leverage bus's existing `connected` Set)
- Single event stream for debugging
- App may want to observe registry events alongside application events

**Alternative Considered:** Separate BroadcastChannel with `channelName: 'registry'`. Rejected because:
- Adds overhead (another connection per tab)
- Duplicate connection lifecycle management
- Event namespace separation doesn't provide value (registry events are prefixed `registry:*`)

### D3: Event-Driven Architecture

**Decision:** All coordination is event-driven (push model), not RPC-style request/response.

**Rationale:**
- Aligns with Broadcast bus design
- Simpler mental model (no waiting for responses in most cases)
- Natural fit for one-to-many broadcasts
- Supports reactive updates (listeners get updates automatically)

**Mixed Approach:** Migration and query use promises despite being event-driven internally, providing ergonomic async/await API while maintaining event-driven implementation underneath.

### D4: Query with Debounce + Timeout

**Decision:** Query responses are debounced (200ms) and have absolute timeout (1s).

**Rationale:**
- **Debounce (200ms):** Reduces callback invocations when multiple tabs respond nearly simultaneously
- **Timeout (1s):** Ensures query completes even if some tabs are slow/frozen
- Local tabs respond in <10ms typically, so 1s is generous
- 200ms debounce window balances responsiveness with callback reduction

**Parameters:**
```typescript
queryDebounce: 200   // Window after last response
queryTimeout: 1000   // Absolute deadline
```

**Flow:**
1. Emit query request
2. Start 1s absolute timeout
3. Collect responses, restart 200ms debounce on each
4. Flush results after debounce completes OR timeout expires

**Alternative Considered:** No timeout, wait indefinitely. Rejected because frozen tabs would block forever.

### D5: Migration Two-Party Handshake

**Decision:** Migration involves only source and target registries, no intermediary.

**Rationale:**
- Simplest possible protocol (request → accept → transfer → complete)
- Direct communication reduces latency
- Initiator may be third party (e.g., UI in Tab C migrates module from A to B), but handshake is A↔B only

**Protocol:**
```
Source → Target: migration:request (moduleId, moduleType)
Target → Source: migration:accept OR migration:reject
Source → Target: migration:transfer (serialized module)
Source: unregister module locally
Target: register module locally
Target → Source: migration:complete
```

**Timeout:** 1s for entire handshake. If target doesn't respond, promise rejects.

**Alternative Considered:** Three-party with initiator coordination. Rejected because:
- Adds complexity without benefit
- Initiator can observe via events if needed
- Direct handshake is sufficient

### D6: Declarative Migration Constraints

**Decision:** Registries declare `accepts: string[]` in metadata to specify allowed module types.

**Rationale:**
- Query-time validation (know before attempting migration)
- Simple to reason about (whitelist model)
- Prevents invalid migrations before handshake starts
- No callback complexity

**Validation:**
- Source checks target's `accepts` array before initiating migration
- Target validates again on `migration:request` (double-check in case metadata stale)
- Rejection returns clear error reason

**Alternative Considered:** Callback-based validation `canAccept(module, targetRegistry)`. Rejected because:
- More complex API
- Can't query declaratively (need to ask each registry)
- Declarative metadata is sufficient for current use cases

### D7: Highlight with Auto-Clear

**Decision:** Highlight requests auto-clear after timeout (3s) AND support explicit clear.

**Rationale:**
- Auto-clear prevents "stuck" highlights if requester forgets to clear
- Explicit clear allows immediate cleanup (e.g., on blur/unhover)
- New highlight clears previous automatically (only one active at a time)

**Timeout:** 3s default, configurable via `highlightTimeout` option.

**Callback signature:**
```typescript
type HighlightCallback = (target: { registryId, moduleId? } | null) => void
// null signals "clear all highlights"
```

**Alternative Considered:** Only explicit clear. Rejected because:
- Easy to forget cleanup in UI code
- Stuck highlights are poor UX
- Auto-timeout is safety net

### D8: Type-Only Metadata Validation

**Decision:** No runtime validation that module metadata is StructuredCloneable.

**Rationale:**
- Consistent with `@accelint/bus` (no validation there either)
- TypeScript types enforce correctness at compile time
- Runtime validation is complex (need to serialize and check)
- Fails fast during migration if metadata isn't cloneable (bus will throw)

**Approach:** Trust TypeScript generics to constrain metadata to valid types.

**Alternative Considered:** Runtime validation with try/catch. Rejected because:
- Adds overhead on every registration
- Bus already fails on postMessage if not cloneable
- Doesn't add meaningful safety beyond types

### D9: Remote Registry Tracking

**Decision:** Track remote registries via bus connection events (`ping`, `echo`, `stop`).

**Rationale:**
- Leverage existing bus connection tracking
- Automatic cleanup when tabs close/hide
- No separate heartbeat protocol needed
- Bus already handles visibility changes

**Implementation:**
- Listen to `CONNECTION_EVENT_TYPES` from bus
- Request metadata when new connection detected
- Remove from `remoteMetadata` Map when connection drops

### D10: Observability Events

**Decision:** Registry emits local events for key lifecycle changes.

**Rationale:**
- Apps can build debugging UIs
- Analytics tracking
- Reactive UI updates

**Events:**
- `module:registered`, `module:unregistered`
- `migration:started`, `migration:completed`, `migration:failed`
- `highlight:triggered`
- `registry:connected`, `registry:disconnected`, `registry:updated`

**Not exposed:** Internal state changes (query buffers, timeouts, etc.)

## Risks / Trade-offs

**[Risk] Stale metadata** → If tab freezes without disconnecting, other registries cache stale metadata.
**Mitigation:** Bus already handles visibility changes (hidden tabs emit `stop`). Frozen tabs are indistinguishable from slow tabs in BroadcastChannel.

**[Risk] Migration race conditions** → Two tabs attempt to migrate same module simultaneously.
**Mitigation:** Not handled in v1. Assumption: UI prevents concurrent migrations. Can add locking later if needed.

**[Risk] Query never completes** → All tabs could be frozen during query.
**Mitigation:** 1s absolute timeout ensures query resolves. Caller gets whatever responses arrived in time.

**[Risk] Module metadata too large** → Large module metadata slows down migration.
**Mitigation:** Documentation recommends keeping metadata lightweight (<10KB). StructuredCloneable constraint naturally limits size.

**[Risk] Event namespace collision** → App might use `registry:*` event names.
**Mitigation:** Document reserved namespace. Unlikely in practice due to prefix specificity.

**[Trade-off] In-memory only** → Registries don't persist across page reloads.
**Justification:** Stateless design simplifies implementation. Apps can persist to localStorage separately if needed.

**[Trade-off] No version negotiation** → All tabs must use same Registry protocol version.
**Justification:** Same-origin constraint means app controls all tab code. Versioning adds complexity without clear benefit.

**[Trade-off] Single highlight at a time** → Can't highlight multiple modules simultaneously.
**Justification:** Simplifies callback contract. Can be relaxed later if use case emerges.

## Open Questions

_None. All decisions finalized during exploration phase._
