## ADDED Requirements

### Requirement: Migration initiation
The Registry SHALL initiate migration by validating source module and target registry.

#### Scenario: Validate source module exists
- **WHEN** `migrate(moduleId, targetId)` is called for non-existent module
- **THEN** promise rejects with "Module not found" error

#### Scenario: Validate target registry exists
- **WHEN** `migrate(moduleId, targetId)` is called for unknown target
- **THEN** promise rejects with "Registry not found" error

#### Scenario: Validate target accepts module type
- **WHEN** target registry's `accepts` array excludes module type
- **THEN** promise rejects with "does not accept module type" error

#### Scenario: Emit migration started event
- **WHEN** migration validation passes
- **THEN** `migration:started` event is emitted locally with migrationId

### Requirement: Migration request
The Registry SHALL emit migration request to target registry with module details.

#### Scenario: Request emission
- **WHEN** migration is initiated
- **THEN** `registry:migration:request` is emitted to target with migrationId, moduleId, moduleType

### Requirement: Migration request handling
The Registry SHALL validate and respond to migration requests.

#### Scenario: Accept valid migration
- **WHEN** `registry:migration:request` is received and module type is in accepts array
- **THEN** `registry:migration:accept` is emitted to source

#### Scenario: Reject invalid module type
- **WHEN** `registry:migration:request` is received and module type not in accepts array
- **THEN** `registry:migration:reject` is emitted with reason "Cannot accept module type"

#### Scenario: Missing accepts array
- **WHEN** `registry:migration:request` is received and accepts array is undefined
- **THEN** `registry:migration:accept` is emitted (no constraints)

### Requirement: Migration transfer
The Registry SHALL transfer module data to target after receiving acceptance.

#### Scenario: Serialize and transfer
- **WHEN** `registry:migration:accept` is received
- **THEN** `registry:migration:transfer` is emitted to target with full module data

#### Scenario: Unregister after transfer
- **WHEN** migration:transfer is sent
- **THEN** module is unregistered from source registry

#### Scenario: Unregistered event emitted
- **WHEN** module is removed during migration
- **THEN** `module:unregistered` event is emitted locally at source

### Requirement: Migration completion
The Registry SHALL register received module and confirm completion.

#### Scenario: Register transferred module
- **WHEN** `registry:migration:transfer` is received
- **THEN** module is registered locally at target

#### Scenario: Registered event emitted
- **WHEN** module is added during migration
- **THEN** `module:registered` event is emitted locally at target

#### Scenario: Confirm completion
- **WHEN** module is registered at target
- **THEN** `registry:migration:complete` is emitted to source

#### Scenario: Resolve migration promise
- **WHEN** `registry:migration:complete` is received at source
- **THEN** migrate() promise resolves successfully

#### Scenario: Emit completed event
- **WHEN** migration completes successfully
- **THEN** `migration:completed` event is emitted locally with migrationId

### Requirement: Migration rejection
The Registry SHALL handle rejection and clean up failed migrations.

#### Scenario: Reject migration promise
- **WHEN** `registry:migration:reject` is received
- **THEN** migrate() promise rejects with rejection reason

#### Scenario: Emit failed event
- **WHEN** migration is rejected
- **THEN** `migration:failed` event is emitted locally with error

### Requirement: Migration timeout
The Registry SHALL enforce 1s timeout for migration handshake.

#### Scenario: Timeout without response
- **WHEN** target doesn't respond within 1s
- **THEN** migrate() promise rejects with "Migration timeout" error

#### Scenario: Timeout after request
- **WHEN** no accept/reject received within 1s after request
- **THEN** migration fails with timeout error

#### Scenario: Emit timeout failure
- **WHEN** migration times out
- **THEN** `migration:failed` event is emitted locally

### Requirement: Module copy operation
The Registry SHALL support copying modules without removing from source.

#### Scenario: Copy maintains source
- **WHEN** `copy(moduleId, targetId)` is called
- **THEN** module remains registered at source after transfer

#### Scenario: Copy uses same protocol
- **WHEN** copy is initiated
- **THEN** same request/accept/transfer/complete protocol is used

#### Scenario: Target receives full copy
- **WHEN** copy completes
- **THEN** target has identical module registration with same ID

### Requirement: Migration configuration
The Registry SHALL support configurable migration timeout.

#### Scenario: Custom timeout
- **WHEN** Registry is created with `migrationTimeout: 2000`
- **THEN** migrations use 2s timeout

#### Scenario: Default timeout
- **WHEN** Registry is created without migrationTimeout config
- **THEN** migrations use 1000ms timeout

### Requirement: Migration module validation
The Registry SHALL validate module still exists before each protocol step.

#### Scenario: Module deleted before accept
- **WHEN** module is deleted after request but before accept arrives
- **THEN** migration:reject is sent with "Module no longer exists"

#### Scenario: Source validation
- **WHEN** accept arrives and module exists
- **THEN** transfer proceeds normally
