# Keycode

Common keycodes for keyboard events following the standard KeyboardEvent code values.

## Usage

```typescript
import { Keycode, registerHotkey } from '@accelint/hotkey-manager';

// Register a hotkey for Cmd+S
const saveHotkey = registerHotkey({
  key: {
    code: Keycode.KeyS,
    meta: true,
  },
  onKeyUp: () => console.log('Save triggered'),
});
```

## Reference

```typescript
const Keycode: {
  readonly KeyA: 'KeyA';
  readonly KeyB: 'KeyB';
  // ... all keys
  readonly Escape: 'Escape';
  readonly Enter: 'Enter';
  // ... (see Available Values)
}

type Keycode = SafeEnum<typeof Keycode>;
```

`Keycode` is a frozen object containing standard KeyboardEvent code values. The type `Keycode` represents any of the string literal values.

### Available Values

**Letter keys:** `KeyA` through `KeyZ`

**Number keys:** `Digit0` through `Digit9`

**Function keys:** `F1` through `F12`

**Arrow keys:** `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`

**Modifier keys:**
- `ShiftLeft`, `ShiftRight`
- `ControlLeft`, `ControlRight`
- `AltLeft`, `AltRight`
- `MetaLeft`, `MetaRight`

**Navigation keys:** `Home`, `End`, `PageUp`, `PageDown`, `Insert`, `Delete`

**Special keys:** `Enter`, `Escape`, `Tab`, `Space`, `Backspace`, `Backquote`, `CapsLock`

**Punctuation:** `Slash`, `IntlBackslash`, `Equal`, `Minus`, `BracketLeft`, `BracketRight`, `Quote`, `Semicolon`

**Numpad keys:**
- `Numpad0` through `Numpad9`
- `NumpadAdd`, `NumpadSubtract`, `NumpadMultiply`, `NumpadDivide`
- `NumpadDecimal`, `NumpadEnter`, `NumpadEqual`, `NumpadComma`
- `NumLock`

**Media keys:** `AudioVolumeUp`, `AudioVolumeDown`, `AudioVolumeMute`

**International:** `IntlYen`, `IntlRo`

> **Good to know:** These values match the standard [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values) specification. Use `code` rather than `key` for reliable cross-keyboard layout detection.

## Examples

### Example: Basic hotkey registration

```typescript
import { Keycode, registerHotkey } from '@accelint/hotkey-manager';

// Escape to cancel
const cancelHotkey = registerHotkey({
  key: {
    code: Keycode.Escape,
  },
  onKeyUp: () => closeModal(),
});
```

### Example: Modifier key combinations

```typescript
import { Keycode, registerHotkey } from '@accelint/hotkey-manager';

// Ctrl+Shift+P for command palette
const paletteHotkey = registerHotkey({
  key: {
    code: Keycode.KeyP,
    ctrl: true,
    shift: true,
  },
  onKeyUp: () => openCommandPalette(),
});
```

### Example: Arrow key navigation

```typescript
import { Keycode, registerHotkey } from '@accelint/hotkey-manager';

const navigation = [
  registerHotkey({
    key: { code: Keycode.ArrowUp },
    onKeyUp: () => moveFocusUp(),
  }),
  registerHotkey({
    key: { code: Keycode.ArrowDown },
    onKeyUp: () => moveFocusDown(),
  }),
  registerHotkey({
    key: { code: Keycode.ArrowLeft },
    onKeyUp: () => moveFocusLeft(),
  }),
  registerHotkey({
    key: { code: Keycode.ArrowRight },
    onKeyUp: () => moveFocusRight(),
  }),
];
```

### Example: Function key shortcuts

```typescript
import { Keycode, registerHotkey } from '@accelint/hotkey-manager';

// F2 to rename
const renameHotkey = registerHotkey({
  key: { code: Keycode.F2 },
  onKeyUp: () => startRename(),
});

// F5 to refresh
const refreshHotkey = registerHotkey({
  key: { code: Keycode.F5 },
  onKeyUp: () => refresh(),
});
```

### Example: Type-safe keycode usage

```typescript
import type { Keycode } from '@accelint/hotkey-manager';

// Use as a type for function parameters
function handleKeyPress(code: Keycode): void {
  console.log(`Key pressed: ${code}`);
}

// Type-safe keycode references
const key: Keycode = 'KeyA';  // ✓ Valid
const invalid: Keycode = 'InvalidKey';  // ✗ Type error
```

### Example: Numpad keys

```typescript
import { Keycode, registerHotkey } from '@accelint/hotkey-manager';

// Calculator shortcuts using numpad
const calcHotkeys = [
  registerHotkey({
    key: { code: Keycode.NumpadAdd },
    onKeyUp: () => add(),
  }),
  registerHotkey({
    key: { code: Keycode.NumpadSubtract },
    onKeyUp: () => subtract(),
  }),
  registerHotkey({
    key: { code: Keycode.NumpadEnter },
    onKeyUp: () => calculate(),
  }),
];
```

## Related

- [registerHotkey](../actions/register-hotkey/index.md) - Register keyboard shortcuts
- [KeyCombination](../types/key-combination/index.md) - Type defining key combinations with modifiers
- [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) - MDN documentation
