# `@accelint/map-toolkit/deckgl/saved-viewports`

A utility package for managing and persisting Deck.gl viewport states in React applications. This package is designed for internal use and is implemented on top of the `hotkey-manager` package to enable users to store and recall saved viewports using key bindings.

## Intentions
- **Persistence**: Internally manages saving and retrieving viewports using browser local storage.
- **Integration**: Designed to be used with key bindings from `hotkey-manager` for a seamless user experience.
- **Simplicity**: All storage logic is abstracted away; users interact with viewports through hotkey actions, not direct API calls.

## Installation

```sh
pnpm add @accelint/map-toolkit @accelint/hotkey-manager
```

## Usage

Provide an options object to `createSavedViewport`, which wires up hotkey bindings and storage logic. Optional parameters are used to provide interfaces to custom persistence locations.

### Example: Defining custom hook using `createSavedViewport`

```ts
import { createSavedViewport } from '@accelint/map-toolkit/deckgl/saved-viewports';

const getCurrentViewport = () => {
  // Gets viewport from locally managed store
}

const setCurrentViewport = (viewport) => {
  // Locally stores viewport
};

export const useSavedViewports = createSavedViewport({
  threshold: 500, // Optional: ms to trigger save on key hold
  getCurrentViewport,
  setCurrentViewport,
  // Optionally, provide custom persistence methods for external store:
  // getSavedViewport: (id) => { ... },
  // setSavedViewport: (id, viewport) => { ... },
});
```

### Example: Using custom hook

```tsx
import React from 'react';
import { useSavedViewports } from './your-custom-hook-file';
import { globalBind } from '@accelint/hotkey-manager';

globalBind();

export function MapComponent() {
  // This will register the hotkeys for saving/recalling viewports
  useSavedViewports();

  // ...render your Deck.gl map here...
  return <div>Map goes here</div>;
}
```

> **Note:** The `globalBind` method must be called in the same client file as your custom hook to ensure the hotkeys are registered and work correctly.

## Implementation Notes
- All view states are stored in a single local storage object with key: `deckgl-saved-viewports` by default.
- The local storage object uses the number keys `[0-9]` as property accessors
- Saving to an existing ID will overwrite previous value.
- Retrieval of a non-existent ID will return `undefined` and may log a warning in the console.

## API
- `createSavedViewport(options)`: Registers hotkeys for saving/recalling viewports. See example above for options.

---

© 2025 Accelint. Internal use only.
