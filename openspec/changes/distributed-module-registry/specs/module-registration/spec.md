## ADDED Requirements

### Requirement: Module registration
The Registry SHALL support registering modules with ID, type, and optional metadata.

#### Scenario: Register module with auto-generated ID
- **WHEN** `register({ type: "layer", metadata: {...} })` is called without ID
- **THEN** a unique UUID is generated and module is stored

#### Scenario: Register module with provided ID
- **WHEN** `register({ id: "custom-id", type: "layer", metadata: {...} })` is called
- **THEN** module is stored with the provided ID

#### Scenario: Return module ID
- **WHEN** module is registered
- **THEN** register() returns the module ID (generated or provided)

#### Scenario: Emit registered event
- **WHEN** module is registered
- **THEN** `module:registered` event is emitted locally with module data

### Requirement: Module unregistration
The Registry SHALL support unregistering modules by ID.

#### Scenario: Unregister existing module
- **WHEN** `unregister(moduleId)` is called for existing module
- **THEN** module is removed from storage and returns true

#### Scenario: Unregister non-existent module
- **WHEN** `unregister(moduleId)` is called for non-existent module
- **THEN** returns false without error

#### Scenario: Emit unregistered event
- **WHEN** module is unregistered successfully
- **THEN** `module:unregistered` event is emitted locally with module ID

### Requirement: Module retrieval
The Registry SHALL support retrieving registered modules.

#### Scenario: Get module by ID
- **WHEN** `getModule(moduleId)` is called for existing module
- **THEN** module registration object is returned

#### Scenario: Get non-existent module
- **WHEN** `getModule(moduleId)` is called for non-existent module
- **THEN** undefined is returned

#### Scenario: Get all modules
- **WHEN** `getModules()` is called
- **THEN** readonly Map of all registered modules is returned

### Requirement: Type safety for module metadata
The Registry SHALL support generic typing for module metadata.

#### Scenario: Type-safe registration
- **WHEN** Registry is typed as `Registry<MyMetadata>`
- **THEN** `register()` accepts only metadata matching MyMetadata type

#### Scenario: Type-safe retrieval
- **WHEN** modules are retrieved from `Registry<MyMetadata>`
- **THEN** returned metadata is typed as MyMetadata

### Requirement: Module storage is local
The Registry SHALL store modules only in the local registry, not broadcast to others.

#### Scenario: Registration is local
- **WHEN** module is registered
- **THEN** no bus events are emitted about the module

#### Scenario: Modules not auto-synced
- **WHEN** Tab A registers a module
- **THEN** Tab B does not automatically receive that module data
