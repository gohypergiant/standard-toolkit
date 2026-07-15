## 1. Project Setup

- [ ] 1.1 Update package.json with peerDependencies on @accelint/bus and @accelint/core
- [ ] 1.2 Create src/registry directory structure
- [ ] 1.3 Set up exports in package.json for Registry class

## 2. Core Types

- [ ] 2.1 Create src/registry/types.ts with RegistryConfig type
- [ ] 2.2 Define RegistryMetadata type
- [ ] 2.3 Define ModuleRegistration<M> generic type
- [ ] 2.4 Define QueryRequest and QueryResponse types
- [ ] 2.5 Define migration protocol types (MigrationRequest, Accept, Transfer, Complete, Reject)
- [ ] 2.6 Define highlight types (HighlightRequest, HighlightClear, HighlightCallback)
- [ ] 2.7 Define observability event types
- [ ] 2.8 Create RegistryEvents<M> union type for all registry bus events

## 3. Constants

- [ ] 3.1 Create src/registry/constants.ts with default values (query timeout, debounce, migration timeout, highlight timeout)
- [ ] 3.2 Define registry event type constants (registry:metadata:broadcast, etc.)

## 4. Registry Class Foundation

- [ ] 4.1 Create src/registry/index.ts with Registry class skeleton
- [ ] 4.2 Implement singleton pattern with getInstance<M>() static method
- [ ] 4.3 Add constructor with RegistryConfig parameter validation
- [ ] 4.4 Initialize instance properties (bus, metadata, modules Map, remoteMetadata Map)
- [ ] 4.5 Add readonly id property using uuid()
- [ ] 4.6 Implement destroy() method with cleanup logic

## 5. Registry Metadata Management

- [ ] 5.1 Implement getMetadata() to return local metadata
- [ ] 5.2 Implement updateMetadata() to merge partial updates
- [ ] 5.3 Implement broadcastMetadata() to emit registry:metadata:broadcast
- [ ] 5.4 Add metadata update broadcasting in updateMetadata()
- [ ] 5.5 Implement handleMetadataBroadcast() to cache remote metadata
- [ ] 5.6 Implement handleMetadataUpdate() to merge remote metadata updates
- [ ] 5.7 Implement getRemoteMetadata(registryId) to query cache
- [ ] 5.8 Implement getAllRemoteMetadata() to return readonly Map

## 6. Connection Lifecycle Tracking

- [ ] 6.1 Listen to bus CONNECTION_EVENT_TYPES.ping for new connections
- [ ] 6.2 Listen to bus CONNECTION_EVENT_TYPES.echo for new connections
- [ ] 6.3 Listen to bus CONNECTION_EVENT_TYPES.stop for disconnections
- [ ] 6.4 Remove remote metadata when connection drops
- [ ] 6.5 Emit local registry:connected event for new remote registries
- [ ] 6.6 Emit local registry:disconnected event when registries drop
- [ ] 6.7 Emit local registry:updated event when remote metadata changes

## 7. Module Registration

- [ ] 7.1 Implement register() method accepting module without id
- [ ] 7.2 Generate UUID for module if id not provided
- [ ] 7.3 Store module in modules Map
- [ ] 7.4 Return module id from register()
- [ ] 7.5 Emit local module:registered event
- [ ] 7.6 Implement unregister(moduleId) method
- [ ] 7.7 Remove module from Map and return boolean
- [ ] 7.8 Emit local module:unregistered event
- [ ] 7.9 Implement getModule(moduleId) returning module or undefined
- [ ] 7.10 Implement getModules() returning readonly Map

## 8. Query System - Emission

- [ ] 8.1 Implement query(filters, callback) method
- [ ] 8.2 Generate unique queryId using uuid()
- [ ] 8.3 Create query buffer with callback, results array, and timeouts
- [ ] 8.4 Store buffer in queryBuffers Map
- [ ] 8.5 Emit registry:query:request to others with queryId and filters
- [ ] 8.6 Start absolute timeout (1s default) for query
- [ ] 8.7 Return cleanup function to cancel query

## 9. Query System - Response Handling

- [ ] 9.1 Implement handleQueryRequest() to process incoming queries
- [ ] 9.2 Filter local modules by registryId if provided in filters
- [ ] 9.3 Filter local modules by registryType if provided
- [ ] 9.4 Filter local modules by moduleId if provided
- [ ] 9.5 Filter local modules by moduleType if provided
- [ ] 9.6 Emit registry:query:response with matching modules if any filters match
- [ ] 9.7 Implement handleQueryResponse() to collect responses
- [ ] 9.8 Add response to buffer results array
- [ ] 9.9 Reset debounce timeout (200ms default) on each response
- [ ] 9.10 Implement flushQueryBuffer() to invoke callbacks
- [ ] 9.11 Lookup remote metadata for each response
- [ ] 9.12 Invoke callback with registryId, registryMetadata, and modules
- [ ] 9.13 Clean up query buffer after flush

## 10. Migration Protocol - Initiation

- [ ] 10.1 Implement migrate(moduleId, targetRegistryId) method
- [ ] 10.2 Implement copy(moduleId, targetRegistryId) method
- [ ] 10.3 Create shared performMigration(moduleId, targetId, isCopy) internal method
- [ ] 10.4 Validate source module exists, reject if not found
- [ ] 10.5 Validate target registry metadata exists, reject if not found
- [ ] 10.6 Validate target accepts array includes module type
- [ ] 10.7 Generate unique migrationId
- [ ] 10.8 Emit local migration:started event
- [ ] 10.9 Create migration promise with timeout (1s default)
- [ ] 10.10 Store promise resolver/rejector in migrationPromises Map
- [ ] 10.11 Emit registry:migration:request to target with migrationId, moduleId, moduleType

## 11. Migration Protocol - Request Handling

- [ ] 11.1 Implement handleMigrationRequest() to validate incoming requests
- [ ] 11.2 Check if accepts array exists and includes moduleType
- [ ] 11.3 Emit registry:migration:accept if validation passes
- [ ] 11.4 Emit registry:migration:reject with reason if validation fails

## 12. Migration Protocol - Transfer

- [ ] 12.1 Implement handleMigrationAccept() to process acceptance
- [ ] 12.2 Re-validate module still exists, reject if missing
- [ ] 12.3 Retrieve module data from modules Map
- [ ] 12.4 Emit registry:migration:transfer with migrationId and full module
- [ ] 12.5 Unregister module locally if isCopy is false
- [ ] 12.6 Emit local module:unregistered if module removed

## 13. Migration Protocol - Completion

- [ ] 13.1 Implement handleMigrationTransfer() to receive module
- [ ] 13.2 Register transferred module in local modules Map
- [ ] 13.3 Emit local module:registered event
- [ ] 13.4 Emit registry:migration:complete to source
- [ ] 13.5 Implement handleMigrationComplete() to resolve promise
- [ ] 13.6 Retrieve promise from migrationPromises Map
- [ ] 13.7 Resolve migration promise
- [ ] 13.8 Emit local migration:completed event
- [ ] 13.9 Clean up migration promise from Map

## 14. Migration Protocol - Rejection

- [ ] 14.1 Implement handleMigrationReject() to handle failures
- [ ] 14.2 Retrieve promise from migrationPromises Map
- [ ] 14.3 Reject migration promise with reason
- [ ] 14.4 Emit local migration:failed event with error
- [ ] 14.5 Clean up migration promise from Map

## 15. Highlight Coordination

- [ ] 15.1 Implement setHighlightCallback(callback) to register callback
- [ ] 15.2 Store callback in instance property
- [ ] 15.3 Implement requestHighlight({ registryId, moduleId? }) method
- [ ] 15.4 Emit registry:highlight:request to target registry
- [ ] 15.5 Implement clearHighlight({ registryId, moduleId? }) method
- [ ] 15.6 Emit registry:highlight:clear to target registry
- [ ] 15.7 Implement handleHighlightRequest() to invoke callback
- [ ] 15.8 Clear existing highlight timeout if present
- [ ] 15.9 Invoke callback with target object { registryId, moduleId? }
- [ ] 15.10 Emit local highlight:triggered event
- [ ] 15.11 Start auto-clear timeout (3s default)
- [ ] 15.12 Invoke callback with null when timeout expires
- [ ] 15.13 Implement handleHighlightClear() for explicit clearing
- [ ] 15.14 Clear timeout and invoke callback with null

## 16. Observability Events

- [ ] 16.1 Create observers Map<string, Set<Function>> for local events
- [ ] 16.2 Implement on(event, callback) method with type overloads
- [ ] 16.3 Add callback to observers Set for event type
- [ ] 16.4 Return unsubscribe function
- [ ] 16.5 Create emit(event, data) internal method to invoke observers
- [ ] 16.6 Add emit calls for all observability events in relevant methods

## 17. Initialization

- [ ] 17.1 Create init() method called from constructor
- [ ] 17.2 Call broadcastMetadata() on init
- [ ] 17.3 Set up all bus event listeners in init()
- [ ] 17.4 Register handleMetadataBroadcast listener
- [ ] 17.5 Register handleMetadataUpdate listener
- [ ] 17.6 Register handleQueryRequest listener
- [ ] 17.7 Register handleQueryResponse listener
- [ ] 17.8 Register handleMigrationRequest listener
- [ ] 17.9 Register handleMigrationAccept listener
- [ ] 17.10 Register handleMigrationTransfer listener
- [ ] 17.11 Register handleMigrationComplete listener
- [ ] 17.12 Register handleMigrationReject listener
- [ ] 17.13 Register handleHighlightRequest listener
- [ ] 17.14 Register handleHighlightClear listener
- [ ] 17.15 Register connection lifecycle listeners (ping, echo, stop)

## 18. Testing - Registry Metadata

- [ ] 18.1 Create src/registry/registry.test.ts
- [ ] 18.2 Test singleton pattern returns same instance
- [ ] 18.3 Test getInstance creates instance with unique ID
- [ ] 18.4 Test metadata initialization with default values
- [ ] 18.5 Test metadata initialization with custom config
- [ ] 18.6 Test updateMetadata merges partial updates
- [ ] 18.7 Test metadata broadcast on initialization
- [ ] 18.8 Test metadata update emission when changed
- [ ] 18.9 Test remote metadata caching from broadcasts
- [ ] 18.10 Test getRemoteMetadata returns cached data
- [ ] 18.11 Test getAllRemoteMetadata returns readonly Map

## 19. Testing - Module Registration

- [ ] 19.1 Test register generates UUID when id not provided
- [ ] 19.2 Test register uses provided id when supplied
- [ ] 19.3 Test register returns module id
- [ ] 19.4 Test register emits module:registered event
- [ ] 19.5 Test unregister removes module and returns true
- [ ] 19.6 Test unregister returns false for non-existent module
- [ ] 19.7 Test unregister emits module:unregistered event
- [ ] 19.8 Test getModule returns module data
- [ ] 19.9 Test getModule returns undefined for non-existent module
- [ ] 19.10 Test getModules returns readonly Map

## 20. Testing - Cross-Tab Query

- [ ] 20.1 Test query emits request with queryId and filters
- [ ] 20.2 Test handleQueryRequest filters by registryType
- [ ] 20.3 Test handleQueryRequest filters by moduleType
- [ ] 20.4 Test handleQueryRequest filters by moduleId
- [ ] 20.5 Test handleQueryRequest filters by registryId
- [ ] 20.6 Test handleQueryRequest combines multiple filters
- [ ] 20.7 Test query response debouncing with 200ms window
- [ ] 20.8 Test query absolute timeout at 1s
- [ ] 20.9 Test query callback receives registryId, metadata, and modules
- [ ] 20.10 Test query cleanup function cancels pending query
- [ ] 20.11 Test custom queryTimeout config
- [ ] 20.12 Test custom queryDebounce config

## 21. Testing - Module Migration

- [ ] 21.1 Test migrate validates source module exists
- [ ] 21.2 Test migrate validates target registry exists
- [ ] 21.3 Test migrate validates target accepts module type
- [ ] 21.4 Test migration:request emission to target
- [ ] 21.5 Test handleMigrationRequest accepts valid types
- [ ] 21.6 Test handleMigrationRequest rejects invalid types
- [ ] 21.7 Test migration:transfer includes full module data
- [ ] 21.8 Test source unregisters module after transfer
- [ ] 21.9 Test target registers module on transfer
- [ ] 21.10 Test migration:complete resolves promise
- [ ] 21.11 Test migration:reject rejects promise
- [ ] 21.12 Test migration timeout at 1s
- [ ] 21.13 Test copy maintains module at source
- [ ] 21.14 Test migration emits started/completed events
- [ ] 21.15 Test custom migrationTimeout config

## 22. Testing - Highlight Coordination

- [ ] 22.1 Test setHighlightCallback stores callback
- [ ] 22.2 Test requestHighlight emits request to target
- [ ] 22.3 Test handleHighlightRequest invokes callback
- [ ] 22.4 Test highlight callback receives registryId and moduleId
- [ ] 22.5 Test highlight callback receives only registryId for registry highlight
- [ ] 22.6 Test auto-clear timeout invokes callback with null
- [ ] 22.7 Test new highlight clears previous timeout
- [ ] 22.8 Test clearHighlight emits clear event
- [ ] 22.9 Test handleHighlightClear invokes callback with null
- [ ] 22.10 Test custom highlightTimeout config
- [ ] 22.11 Test highlight:triggered event emission

## 23. Testing - Connection Lifecycle

- [ ] 23.1 Test ping event adds remote metadata
- [ ] 23.2 Test echo event adds remote metadata
- [ ] 23.3 Test stop event removes remote metadata
- [ ] 23.4 Test registry:connected event emission
- [ ] 23.5 Test registry:disconnected event emission
- [ ] 23.6 Test registry:updated event emission

## 24. Testing - Observability

- [ ] 24.1 Test on() registers listener and returns unsubscribe
- [ ] 24.2 Test unsubscribe removes listener
- [ ] 24.3 Test multiple listeners for same event
- [ ] 24.4 Test all observability events emit correctly

## 25. Testing - Type Safety

- [ ] 25.1 Create test with typed Registry<LayerMetadata>
- [ ] 25.2 Verify register accepts only matching metadata type
- [ ] 25.3 Verify getModule returns typed metadata
- [ ] 25.4 Verify query callback receives typed modules

## 26. Testing - Edge Cases

- [ ] 26.1 Test query with no responses times out gracefully
- [ ] 26.2 Test migration when source module deleted mid-flight
- [ ] 26.3 Test multiple simultaneous queries
- [ ] 26.4 Test destroy cleans up all resources
- [ ] 26.5 Test no callback registered for highlight request
- [ ] 26.6 Test query cleanup before timeout expires

## 27. Documentation

- [ ] 27.1 Add JSDoc comments to Registry class
- [ ] 27.2 Add JSDoc for all public methods with examples
- [ ] 27.3 Add JSDoc for all types in types.ts
- [ ] 27.4 Create README.md with usage examples
- [ ] 27.5 Document event types and payloads
- [ ] 27.6 Document configuration options and defaults
- [ ] 27.7 Add migration guide examples

## 28. Build and Integration

- [ ] 28.1 Run pnpm build to verify TypeScript compilation
- [ ] 28.2 Run pnpm test to verify all tests pass
- [ ] 28.3 Run pnpm lint to verify code style
- [ ] 28.4 Run pnpm format to format code
- [ ] 28.5 Update package exports in package.json
- [ ] 28.6 Run pnpm index to generate main entry exports
- [ ] 28.7 Create changeset with pnpm changeset
