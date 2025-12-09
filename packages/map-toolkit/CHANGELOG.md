# @accelint/map-toolkit

## 0.3.1
- Updated dependencies
  - @accelint/geo@0.4.0

## 0.3.0
### Minor Changes

- 7131cc0: Add `useCursorCoordinates`, a hook to retrieve the current coordinates for the mouse hovered position
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
- e8535c4: Adds ViewportSize component that shows the width and height of the viewport and updates with changes.
  Adds useViewportState for more fine-grained control of viewport data (lat/lon/zoom/bounds). Exports `useEffectEvent` ponyfill from `@accelint/bus/react`.

### Patch Changes

- 9ab8d72: Convert TextLayer README to Storybook doc and add JSDocs
- 99f6cd5: Add map-mode/store getCurrentModeOwner method to access the current map mode owner.
- 80db585: BREAKING CHANGES:
  Design Toolkit no longer exports `tv`, this is now available from Design Foundation
  
  Created new package @accelint/design-foundation that houses all of the Tailwind tokens, variants, base styles and utilities for easier reuse without having a dependency on the larger Design Toolkit
  
  Updated Map Toolkit Storybook and NextJS demo app styles to import the new Design Foundation
- f157e42: update picking info to remove more unserializable properties in map-toolkit
- 7539bbb: update vite config in map-toolkit to re-enable base-map render in storybook preview
- 86a95cf: refactor map mode to use module useSyncExternalStore pattern instead of class.

## 0.2.0

### Minor Changes

- b4d1b9b: Add map mode system with authorization flow for managing interaction modes.

  **New Features:**
  - `MapProvider` component for managing map mode state with instance isolation
  - `useMapMode()` hook for accessing and requesting mode changes
  - Authorization flow for resolving ownership conflicts when switching modes
  - Event bus integration for decoupled mode change communication
  - Support for multiple independent map instances with isolated state

  **API:**
  - `MapProvider` component (internal to `BaseMap`)
  - `useMapMode(id)` hook for UI components
  - `BaseMap` now requires `id` prop for instance identification
  - Observable store pattern using React's `useSyncExternalStore`

- 998dee6: add deckgl-layer-text for default text styling

### Patch Changes

- 303b61f: Pins the dependency version of Deck.gl to 9.1.14. We are not yet able to support 9.2.
- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- a8b8de2: Update README content in map-toolkit
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.

## 0.1.0

### Minor Changes

- 24e2def: Open-source the deckgl-layer-symbol package. Adds support for rendering MIL-STD-2525 symbologies as a Deck.gl layer.
- 5f45f43: Adds base-map component and DeckGL onClick and onHover event emitters. The example story shows how to use the @accelint/bus/react useOn hook to subscribe to the emitted events.
- 405d875: Introduced basic implementation for storybook for map-toolkit, including a decorator for deckGL for new stories.

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling

## 0.0.2

### Patch Changes

- 56d5af8: Initialization of Map Toolkit (MapTK) library
