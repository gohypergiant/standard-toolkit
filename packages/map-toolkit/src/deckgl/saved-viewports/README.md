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

## Default Keyboard Shortcuts

By default, the following keys are bound:
- `0-9`: Quick restore viewport from slot
- `Hold 0-9`: Save current viewport to slot

The hold threshold is configurable via the `threshold` option (default: 1000ms).

## Example Implementation

The `ViewportsToolbar` component in the Storybook stories demonstrates
a reference implementation. This is NOT a production-ready component,
but rather an example showing how you might build UI around the
saved-viewports hook.

See `viewports-toolbar.tsx` for implementation details.

> **Note:** The `globalBind` method must be called in the same client file as your custom hook to ensure the hotkeys are registered and work correctly.

## Implementation Notes
- All view states are stored in a single local storage object with key: `deckgl-saved-viewports` by default.
- The local storage object uses the number keys `[0-9]` as property accessors
- Saving to an existing ID will overwrite previous value.
- Retrieval of a non-existent ID will return `undefined` and may log a warning in the console.

## API
- `createSavedViewport(options)`: Registers hotkeys for saving/recalling viewports. See example above for options.

## Troubleshooting

**Keys not working?**
- Ensure `globalBind()` is called before using the hook
- Check browser console for hotkey conflicts

**Viewports not persisting?**
- Verify localStorage is enabled in the browser
- Check for storage quota issues

---

© 2025 Accelint. Internal use only.
