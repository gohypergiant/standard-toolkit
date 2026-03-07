## ADDED Requirements

### Requirement: Query request emission
The Registry SHALL emit query requests to all connected registries with filters.

#### Scenario: Query all modules
- **WHEN** `query({}, callback)` is called
- **THEN** `registry:query:request` event is emitted to others with empty filters

#### Scenario: Query with filters
- **WHEN** `query({ registryType: "map", moduleType: "layer" }, callback)` is called
- **THEN** `registry:query:request` event includes specified filters

#### Scenario: Query generates unique ID
- **WHEN** query is initiated
- **THEN** a unique queryId is generated for tracking responses

### Requirement: Query request handling
The Registry SHALL respond to query requests if filters match local state.

#### Scenario: Matching modules found
- **WHEN** `registry:query:request` is received and filters match local modules
- **THEN** `registry:query:response` is emitted to requester with matching modules

#### Scenario: Registry type filter
- **WHEN** query filters include `registryType: "map"` and local type is "map"
- **THEN** response includes all local modules

#### Scenario: Registry type mismatch
- **WHEN** query filters include `registryType: "map"` and local type is "dashboard"
- **THEN** no response is sent

#### Scenario: Module type filter
- **WHEN** query filters include `moduleType: "layer"` and local modules include layers
- **THEN** response includes only matching layer modules

#### Scenario: Multiple filter combination
- **WHEN** query includes both registryType and moduleType filters
- **THEN** response is sent only if ALL filters match

#### Scenario: Module ID filter
- **WHEN** query filters include `moduleId: "abc"`
- **THEN** response includes only that specific module if it exists locally

#### Scenario: Registry ID filter
- **WHEN** query filters include `registryId` matching local registry
- **THEN** response is sent with matching modules

### Requirement: Query response debouncing
The Registry SHALL debounce query responses before invoking callback.

#### Scenario: Single response
- **WHEN** one response is received within 200ms
- **THEN** callback is invoked after 200ms with that response

#### Scenario: Multiple responses
- **WHEN** three responses arrive at 0ms, 50ms, and 100ms
- **THEN** callback is invoked once for each after 200ms from last response

#### Scenario: Debounce window reset
- **WHEN** response arrives and another arrives within 200ms
- **THEN** 200ms debounce window resets from latest response

### Requirement: Query absolute timeout
The Registry SHALL enforce 1s absolute timeout on query regardless of debounce.

#### Scenario: Timeout before debounce
- **WHEN** responses trickle in slowly over 1.2s
- **THEN** all accumulated responses are flushed at 1s mark

#### Scenario: Timeout with no responses
- **WHEN** no responses arrive within 1s
- **THEN** query completes with no callbacks invoked

### Requirement: Query callback invocation
The Registry SHALL invoke callback once per responding registry with full context.

#### Scenario: Callback includes metadata
- **WHEN** query response is received
- **THEN** callback is invoked with registryId, registryMetadata, and modules array

#### Scenario: Metadata lookup
- **WHEN** response arrives from registry not in cache
- **THEN** callback is not invoked for that response

### Requirement: Query cleanup
The Registry SHALL return cleanup function to cancel ongoing query.

#### Scenario: Manual cleanup
- **WHEN** cleanup function returned by query() is called
- **THEN** query buffer is removed and no further callbacks are invoked

#### Scenario: Automatic cleanup after timeout
- **WHEN** query timeout (1s) expires
- **THEN** query buffer is automatically cleaned up

### Requirement: Query configuration
The Registry SHALL support configurable timeout and debounce values.

#### Scenario: Custom query timeout
- **WHEN** Registry is created with `queryTimeout: 2000`
- **THEN** queries use 2s absolute timeout

#### Scenario: Custom debounce
- **WHEN** Registry is created with `queryDebounce: 100`
- **THEN** queries use 100ms debounce window

#### Scenario: Default values
- **WHEN** Registry is created without query config
- **THEN** queries use 1000ms timeout and 200ms debounce
