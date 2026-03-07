## Why

Applications with multiple browser tabs need to coordinate instanced modules (layers, widgets, visualizations) across contexts. Currently, there's no system for discovering, querying, or migrating these modules between tabs. This creates a fragmented user experience where work is isolated per-tab.

## What Changes

- Create `@accelint/instance` package with a `Registry` class for cross-tab module coordination
- Implement registry metadata synchronization using `@accelint/bus` BroadcastChannel
- Support typed module registration with app-defined metadata
- Enable cross-tab querying with filtering by registry type, module type, and IDs
- Implement module migration protocol for moving modules between tabs
- Add highlight coordination system for cross-tab UI feedback
- Provide declarative "accepts" constraints for migration validation

## Capabilities

### New Capabilities

- `registry-metadata`: Registry lifecycle, metadata management, and cross-tab synchronization
- `module-registration`: Module registration, unregistration, and local storage with type safety
- `cross-tab-query`: Debounced querying system for discovering modules across registries
- `module-migration`: Two-party handshake protocol for transferring module ownership between tabs
- `highlight-coordination`: Request/clear highlight callbacks with auto-timeout for cross-tab UI feedback

### Modified Capabilities

<!-- No existing capabilities are being modified -->

## Impact

- **New package**: `@accelint/instance` added to monorepo
- **Dependencies**: Peer dependency on `@accelint/bus` and `@accelint/core`
- **API surface**: New public `Registry` class with singleton pattern
- **Event bus**: Adds 11 new event types to shared Broadcast channel (`registry:*` namespace)
- **Type system**: Generic support for app-defined module metadata types
