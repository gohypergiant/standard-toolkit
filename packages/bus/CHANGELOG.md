# @accelint/bus

## 3.0.0
### Major Changes

- 874edd5: ## Breaking Change: Structured Clone Constraint
  
  The event bus payload is now constrained to values that are serializable by the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). This constraint aligns the TypeScript types with the actual runtime behavior of the `BroadcastChannel` API.
  
  ### What this means
  
  You can no longer pass the following types in event payloads:
  
  - Functions
  - Symbols
  - DOM nodes
  - Prototype chains (class instances lose their methods)
  - Properties with `undefined` values (they're omitted)
  
  ### How to migrate
  
  **❌ Before:**
  
  ```typescript
  bus.emit('user-action', {
    callback: () => console.log('done'), // ❌ Function
    userData: userClass, // ❌ Class instance with methods
    element: document.getElementById('foo'), // ❌ DOM node
  });
  ```
  
  **✅ After:**
  
  ```typescript
  // Option 1: Send only data, handle logic separately
  bus.emit('user-action', {
    actionType: 'complete', // ✅ Primitive
    userData: { id: userClass.id, name: userClass.name }, // ✅ Plain object
    elementId: 'foo', // ✅ Reference by ID
  });
  
  // Option 2: Use event types to trigger behavior
  bus.on('user-action-complete', () => {
    console.log('done'); // Handle callback logic in listener
  });
  ```
  
  ### Supported types
  
  - Primitives (string, number, boolean, null, BigInt)
  - Plain objects and arrays
  - Date, RegExp, Map, Set
  - Typed arrays (Uint8Array, etc.)
  - ArrayBuffer, Blob, File
  
  ### Finding issues
  
  TypeScript will now catch most violations at compile time. Runtime errors from `BroadcastChannel.postMessage()` indicate non-serializable values that slipped through.

### Patch Changes

- e8535c4: Adds ViewportSize component that shows the width and height of the viewport and updates with changes.
  Adds useViewportState for more fine-grained control of viewport data (lat/lon/zoom/bounds). Exports `useEffectEvent` ponyfill from `@accelint/bus/react`.

## 2.0.0

### Patch Changes

- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.
- Updated dependencies [0d697fa]
- Updated dependencies [f99f294]
- Updated dependencies [935b8e5]
- Updated dependencies [525a5a6]
  - @accelint/core@0.5.0

## 1.4.0

### Minor Changes

- ccb2d05: Added a source property to the event payload to help identify where an event originated from

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling
- Updated dependencies [64280a7]
  - @accelint/core@0.4.2

## 1.3.0

### Minor Changes

- 6374c68: Update event bus to target audiences such as 'all', 'others', 'self'. As well as individual contexts via a uuid.

### Patch Changes

- b11870c: - **Fixed** Updated documentation to correctly reference React hooks from the `@accelint/bus/react` module.

## 1.2.0

### Minor Changes

- 55718af: made event payload optional

## 1.1.0

### Minor Changes

- e767f7c: Create React hooks for events with type safety and render safety

## 1.0.0

### Major Changes

- 0457dc6: enabled strict typing for Broadcast class and getInstance method

## 0.1.2

### Patch Changes

- 83104ea: Refactored ViewStack to be event driven, allowing for triggers anywhere in the app

## 0.1.1

### Patch Changes

- ca3922a: added subpath exports for packages

## 0.1.0

### Minor Changes

- b022126: Initial release.
