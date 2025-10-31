# @accelint/map-toolkit

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
