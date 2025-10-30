# `@accelint/hotkey-manager`

A React-focused global hotkey system that prevents conflicts and manages keyboard shortcuts efficiently.

## Features

- **Singleton Management:** Each hotkey is bound only once, regardless of how many components use it
- **Automatic Cleanup:** Hotkeys are automatically removed when components unmount
- **Conflict Prevention:** Ensures each keyboard shortcut triggers only one action
- **Cross-Platform Support:** Adapts to both Windows and macOS keyboard conventions
- **Input Field Safety:** Disables hotkeys when typing in forms and text fields
- **SSR Compatible:** Works with Server-Side Rendering and React Server Components
- **OS Hotkey Detection:** Identifies conflicts with system shortcuts *(Coming Soon)*

## Quick Start

The hotkey manager works with React's component lifecycle. Hotkeys are bound when components mount and only unbound when all components using that hotkey unmount. This reference-counting approach means a hotkey remains active as long as at least one component needs it:

```typescript
// 1. Enable the hotkey bindings
// src/apps/layout.tsx
import { globalBind } from '@accelint/hotkey-manager';

globalBind();
```

```typescript
// 2. Register your hotkey and define what it does
// src/hooks/use-toggle-grid.ts
import { registerHotkey, Keycode } from '@accelint/hotkey-manager';
import { gridStore } from '../stores/grid';

export const useToggleGrid = registerHotkey({
  id: 'toggle-grid',
  key: {
    code: Keycode.KeyG
  },
  // Using onKeyUp is recommended for most simple actions
  onKeyUp: () => gridStore().toggleVisibility(),
});
```

```tsx
// 3. Then use the hook in your component
// src/layers/grid-layer.tsx
import { useToggleGrid } from '../hooks/use-toggle-grid';

export function GridLayer() {
  // This activates the hotkey when the component mounts
  // and deactivates it when unmounted
  useToggleGrid();

  // Rest of component code...
}
```

## How to Use

### Key Concept: Shared Hotkey Instances

An important feature of this library is that it maintains a single instance of each hotkey, even when multiple components use it. For example:

- If `ComponentA` and `ComponentB` both use the same hotkey (like `useToggleGrid`)
- The hotkey is bound when the first component mounts
- It remains active even if one component unmounts
- It's only fully unbound when all components using it unmount

This reference-counting system ensures efficient hotkey management and prevents duplicate listeners.

### Step 1: Register Your Hotkey

Use `registerHotkey` to create a reusable hook for your hotkey:

```typescript
import { registerHotkey, Keycode } from '@accelint/hotkey-manager';

export const useToggleTags = registerHotkey({
  id: 'toggle-tags',  // An identifier for this hotkey
  key: {
    code: Keycode.KeyT,  // The 'T' key
    alt: true           // Must press Alt+T
  },
  onKeyUp: () => someAction()  // Function to run when key is released
});
```

### Step 2: Use the Hook in Components

The hook automatically handles binding and unbinding:

```tsx
function TextLabelLayer() {
  // This activates the Alt+T hotkey
  useToggleTags();
  
  return (
    // DeckGL Layer...
  );
}
```

### Manual Control

For more control, use the hook's methods:

```tsx
function ConditionalHotkeyComponent() {
  const toggleTags = useToggleTags();
  const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    if (isEnabled) {
      toggleTags.forceBind();
    } else {
      toggleTags.forceUnbind();
    }
  }, [isEnabled]);
  
  return (
    <div>
      <button onClick={() => setIsEnabled(!isEnabled)}>
        {isEnabled ? 'Disable' : 'Enable'} Hotkey
      </button>
    </div>
  );
}
```

## Key Combinations

### Basic Keys

The `key` property defines what keyboard input triggers your hotkey. The `code` field is required and uses standard keyboard event codes (available in the `Keycode` enum).

```typescript
// Define a simple 'T' key hotkey
key: {
  code: Keycode.KeyT
}
```

Using `code` instead of character values ensures consistency across keyboard layouts and languages.

### Modifier Keys

Add modifiers to create key combinations:

```typescript
// Define Shift+T
key: {
  code: Keycode.KeyT,
  shift: true
}

// Define Alt+T
key: {
  code: Keycode.KeyT,
  alt: true
}

// Define Shift+Alt+T
key: {
  code: Keycode.KeyT,
  alt: true,
  shift: true
}
```

Available modifiers:
- `shift`: The Shift key
- `alt`: The Alt key (Option on macOS)
- `ctrl`: The Control key
- `meta`: The Windows key or Command (⌘) key on macOS

### Multiple Key Bindings

Bind the same action to multiple keys by using an array:

```typescript
key: [
  { code: Keycode.KeyS, ctrl: true },  // Ctrl+S
  { code: Keycode.F12 }                // F12
]
```

Your action receives information about which key triggered it:

```typescript
onKeyDown: (event, key) => {
  if (key.code === Keycode.KeyS) {
    // Ctrl+S was pressed
  } else if (key.code === Keycode.F12) {
    // F12 was pressed
  }
}
```

### OS and Browser Conflicts

Be cautious when using `ctrl` and `meta` key combinations, as many of these are reserved by operating systems and browsers. The hotkey manager will still attempt to handle these combinations, but the OS or browser may intercept them before your application receives the event. When possible, prefer combinations with `alt` or custom keys that don't conflict with system shortcuts.

### Platform Adaptation

#### Automatic macOS Conversion

By default, the library automatically converts Windows-style shortcuts to macOS conventions:
- `ctrl+s` becomes `cmd+s` on macOS
- `meta+s` becomes `ctrl+s` on macOS

To disable this behavior for a specific hotkey:

```typescript
key: {
  code: Keycode.KeyS,
  ctrl: true,
  autoMacStyle: false  // Keep as Ctrl+S on all platforms
}
```

#### Custom Platform Shortcuts

For more control over platform differences:

```typescript
import { registerHotkey, Keycode, isMac } from '@accelint/hotkey-manager';

export const usePlatformHotkey = registerHotkey({
  key: isMac
    ? { code: Keycode.KeyS, meta: true, autoMacStyle: false }  // Cmd+S on macOS
    : { code: Keycode.KeyS, ctrl: true, autoMacStyle: false }, // Ctrl+S on other platforms
  onKeyUp: () => someAction()
});
```

## Actions

You can define up to three types of actions for each hotkey:

1. `onKeyDown`: Triggered immediately when the key is pressed
2. `onKeyHeld`: Triggered when the key is held down for a certain time
3. `onKeyUp`: Triggered when the key is released

> **Important Behavior:** By default, if both `onKeyHeld` and `onKeyUp` are defined for a hotkey and the held action is triggered, the `onKeyUp` action will not fire when the key is released. You can override this with the `alwaysTriggerKeyUp: true` option.

> **Best Practice:** Use `onKeyUp` rather than `onKeyDown` for simple actions. This maintains UX consistency with `onKeyHeld` behavior, as most actions should happen either on long press or release, not on initial press.

### Example with All Actions

```typescript
registerHotkey({
  id: 'zoom',
  key: { code: Keycode.KeyZ },
  
  // Triggered on initial press
  onKeyDown: () => startZoom(),
  
  // Triggered after holding for 1 second (default)
  onKeyHeld: () => activateContinuousZoom(),
  
  // Triggered on release (unless onKeyHeld fired)
  onKeyUp: () => finishZoom(),
  
  // Configure hold detection time (in milliseconds)
  heldThresholdMs: 500,
  
  // Also trigger onKeyUp even if onKeyHeld was triggered
  alwaysTriggerKeyUp: true
})
```

## Using in Libraries

When including this package in a library:

1. List `@accelint/hotkey-manager` as a peer dependency
2. Allow users to customize your hotkey bindings
3. Avoid hardcoding hotkeys that might conflict with common OS shortcuts

This ensures only one hotkey manager instance exists in the application, preventing conflicts between different libraries.
