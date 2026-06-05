## ADDED Requirements

### Requirement: Highlight callback registration
The Registry SHALL support registering a highlight callback to handle highlight requests.

#### Scenario: Set highlight callback
- **WHEN** `setHighlightCallback(callback)` is called
- **THEN** callback is stored for future highlight requests

#### Scenario: Clear highlight callback
- **WHEN** `setHighlightCallback(null)` is called
- **THEN** highlight callback is removed and no longer invoked

#### Scenario: Replace callback
- **WHEN** `setHighlightCallback(callback2)` is called after callback1 was set
- **THEN** callback1 is replaced with callback2

### Requirement: Highlight request emission
The Registry SHALL emit highlight requests to target registries.

#### Scenario: Highlight specific module
- **WHEN** `requestHighlight({ registryId: "abc", moduleId: "xyz" })` is called
- **THEN** `registry:highlight:request` is emitted to registryId with both IDs

#### Scenario: Highlight entire registry
- **WHEN** `requestHighlight({ registryId: "abc" })` is called without moduleId
- **THEN** `registry:highlight:request` is emitted with only registryId

### Requirement: Highlight request handling
The Registry SHALL invoke callback when highlight request is received.

#### Scenario: Invoke callback for module highlight
- **WHEN** `registry:highlight:request` is received with registryId and moduleId
- **THEN** highlight callback is invoked with `{ registryId, moduleId }`

#### Scenario: Invoke callback for registry highlight
- **WHEN** `registry:highlight:request` is received with only registryId
- **THEN** highlight callback is invoked with `{ registryId, moduleId: undefined }`

#### Scenario: Emit local event
- **WHEN** highlight callback is invoked
- **THEN** `highlight:triggered` event is emitted locally with target details

#### Scenario: No callback registered
- **WHEN** highlight request is received but no callback is set
- **THEN** no error occurs, request is ignored

### Requirement: Auto-clear highlight timeout
The Registry SHALL automatically clear highlights after configured timeout.

#### Scenario: Auto-clear after timeout
- **WHEN** highlight request is handled
- **THEN** callback is invoked with `null` after highlightTimeout milliseconds

#### Scenario: Clear previous timeout
- **WHEN** new highlight request arrives before timeout
- **THEN** previous timeout is cancelled before starting new one

#### Scenario: Single active highlight
- **WHEN** second highlight arrives 1s after first (timeout=3s)
- **THEN** first highlight is cleared immediately and second starts new 3s timer

### Requirement: Explicit highlight clear
The Registry SHALL support explicit clearing of highlights.

#### Scenario: Clear specific module
- **WHEN** `clearHighlight({ registryId: "abc", moduleId: "xyz" })` is called
- **THEN** `registry:highlight:clear` is emitted to target registry

#### Scenario: Clear entire registry
- **WHEN** `clearHighlight({ registryId: "abc" })` is called
- **THEN** `registry:highlight:clear` is emitted without moduleId

### Requirement: Clear request handling
The Registry SHALL invoke callback with null when clear request is received.

#### Scenario: Handle clear request
- **WHEN** `registry:highlight:clear` is received
- **THEN** highlight callback is invoked with `null`

#### Scenario: Cancel auto-clear timeout
- **WHEN** explicit clear is received
- **THEN** auto-clear timeout is cancelled

### Requirement: Highlight callback signature
The Registry SHALL invoke callback with target object or null for clear.

#### Scenario: Callback receives target
- **WHEN** highlight is requested
- **THEN** callback receives `{ registryId, moduleId? }`

#### Scenario: Callback receives null
- **WHEN** highlight is cleared (auto or explicit)
- **THEN** callback receives `null`

### Requirement: Highlight timeout configuration
The Registry SHALL support configurable auto-clear timeout.

#### Scenario: Custom timeout
- **WHEN** Registry is created with `highlightTimeout: 5000`
- **THEN** highlights auto-clear after 5s

#### Scenario: Default timeout
- **WHEN** Registry is created without highlightTimeout config
- **THEN** highlights auto-clear after 3000ms
