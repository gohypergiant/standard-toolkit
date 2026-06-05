## ADDED Requirements

### Requirement: Registry initialization
The Registry SHALL initialize as a singleton instance with a unique ID and connect to the shared Broadcast bus.

#### Scenario: First getInstance call
- **WHEN** `Registry.getInstance()` is called for the first time
- **THEN** a new Registry instance is created with a unique UUID

#### Scenario: Subsequent getInstance calls
- **WHEN** `Registry.getInstance()` is called after initialization
- **THEN** the same Registry instance is returned

#### Scenario: Bus connection
- **WHEN** Registry initializes
- **THEN** it connects to the provided Broadcast bus instance

### Requirement: Registry metadata structure
The Registry SHALL maintain metadata including ID, label, URL, type, accepts array, and custom fields.

#### Scenario: Default metadata
- **WHEN** Registry is created without configuration
- **THEN** metadata includes unique ID and label "Untitled"

#### Scenario: Custom metadata
- **WHEN** Registry is created with config `{ label: "Map View", type: "map", accepts: ["layer"] }`
- **THEN** metadata reflects all provided values

### Requirement: Metadata broadcast on initialization
The Registry SHALL broadcast its metadata to all connected registries when initialized.

#### Scenario: Initial broadcast
- **WHEN** Registry initializes
- **THEN** `registry:metadata:broadcast` event is emitted to others

### Requirement: Metadata updates
The Registry SHALL support updating its metadata and broadcasting changes to connected registries.

#### Scenario: Update metadata locally
- **WHEN** `updateMetadata({ label: "New Label" })` is called
- **THEN** local metadata is updated with new values

#### Scenario: Broadcast metadata updates
- **WHEN** metadata is updated
- **THEN** `registry:metadata:update` event is emitted to others with changed fields

### Requirement: Remote metadata tracking
The Registry SHALL track metadata from all connected registries.

#### Scenario: Receive metadata broadcast
- **WHEN** `registry:metadata:broadcast` event is received from another registry
- **THEN** remote metadata is stored in Map keyed by registry ID

#### Scenario: Receive metadata update
- **WHEN** `registry:metadata:update` event is received
- **THEN** cached metadata for that registry is updated with new values

#### Scenario: Query remote metadata
- **WHEN** `getRemoteMetadata(registryId)` is called
- **THEN** cached metadata for that registry is returned

#### Scenario: Query all remote metadata
- **WHEN** `getAllRemoteMetadata()` is called
- **THEN** readonly Map of all cached registry metadata is returned

### Requirement: Connection lifecycle tracking
The Registry SHALL track connection and disconnection of remote registries via bus events.

#### Scenario: New registry connects
- **WHEN** bus `ping` or `echo` event indicates new connection
- **THEN** Registry requests metadata from new connection

#### Scenario: Registry disconnects
- **WHEN** bus `stop` event indicates disconnection
- **THEN** Registry removes that registry's metadata from cache

#### Scenario: Emit connection event
- **WHEN** new remote metadata is received for first time
- **THEN** `registry:connected` event is emitted locally

#### Scenario: Emit disconnection event
- **WHEN** registry is removed from remote metadata cache
- **THEN** `registry:disconnected` event is emitted locally

#### Scenario: Emit update event
- **WHEN** existing remote metadata is updated
- **THEN** `registry:updated` event is emitted locally

### Requirement: Registry cleanup
The Registry SHALL clean up resources and notify others when destroyed.

#### Scenario: Destroy registry
- **WHEN** `destroy()` is called
- **THEN** all event listeners are removed and singleton instance is reset

#### Scenario: Cleanup on destroy
- **WHEN** Registry is destroyed
- **THEN** local and remote metadata maps are cleared
