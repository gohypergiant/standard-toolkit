# useEnterExitAnimation

A React hook that manages enter and exit animation states based on an open/closed state. This hook provides `data-entering` and `data-exiting` attributes that work similarly to React Aria's built-in overlay components (Tooltip, Popover, Dialog), enabling declarative CSS-based animations.

## Installation

```tsx
import { useEnterExitAnimation } from '@accelint/design-toolkit/hooks/use-enter-exit-animation';
```

## Why Use This Hook?

### Declarative Animation Pattern
Instead of managing animation state with imperative `useEffect` and `setTimeout` logic, this hook provides a clean, declarative API:

**Before (Imperative):**
```tsx
const [isEntering, setIsEntering] = useState(false);
const [isExiting, setIsExiting] = useState(false);

useEffect(() => {
  if (isOpen) {
    setIsEntering(true);
    const timer = setTimeout(() => setIsEntering(false), 200);
    return () => clearTimeout(timer);
  } else {
    setIsExiting(true);
    const timer = setTimeout(() => setIsExiting(false), 200);
    return () => clearTimeout(timer);
  }
}, [isOpen]);
```

**After (Declarative):**
```tsx
const { isEntering, isExiting } = useEnterExitAnimation(isOpen, {
  duration: 200,
});
```

### Scalable Across Components
Use the same pattern for any component that needs enter/exit animations:
- Drawer
- Sidenav
- Modal
- Panel
- Notification
- Custom overlays

## Basic Usage

```tsx
import { useEnterExitAnimation } from '@accelint/design-toolkit/hooks/use-enter-exit-animation';

function MyComponent({ isOpen }) {
  const { isEntering, isExiting } = useEnterExitAnimation(isOpen, {
    duration: 200, // matches CSS var --animation-duration-normal
  });

  return (
    <div
      className="my-component"
      data-open={isOpen || null}
      data-entering={isEntering || null}
      data-exiting={isExiting || null}
    >
      Content
    </div>
  );
}
```

## CSS Animation Pattern

```css
.my-component {
  /* Closed state */
  opacity: 0;
  transform: translateX(-100%);

  /* Smooth transitions */
  transition:
    opacity var(--animation-duration-normal) var(--animation-easing-standard),
    transform var(--animation-duration-normal) var(--animation-easing-standard);

  /* Open state (stable) */
  &[data-open] {
    opacity: 1;
    transform: translateX(0);
  }

  /* Entering animation */
  &[data-entering] {
    animation: slideIn var(--animation-duration-normal) var(--animation-easing-decelerate);
  }

  /* Exiting animation */
  &[data-exiting] {
    animation: slideOut var(--animation-duration-normal) var(--animation-easing-accelerate);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
}
```

## API Reference

### Parameters

```tsx
useEnterExitAnimation(
  isOpen: boolean,
  options?: UseEnterExitAnimationOptions
): UseEnterExitAnimationResult
```

#### `isOpen: boolean`
The current open/closed state. When this transitions from `false` to `true`, the entering animation triggers. When it transitions from `true` to `false`, the exiting animation triggers.

#### `options: UseEnterExitAnimationOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `200` | Animation duration in milliseconds. Should match your CSS animation duration. |
| `skipInitialMount` | `boolean` | `true` | Whether to skip animations on initial mount. If `true`, mounting with `isOpen={true}` won't trigger entering animation. |

### Return Value

```tsx
interface UseEnterExitAnimationResult {
  isEntering: boolean;  // True during enter animation
  isExiting: boolean;   // True during exit animation
}
```

## Real-World Examples

### Example 1: Drawer Component

```tsx
import { useEnterExitAnimation } from '@accelint/design-toolkit/hooks/use-enter-exit-animation';

export function Drawer({ isOpen, children, placement = 'left' }) {
  const { isEntering, isExiting } = useEnterExitAnimation(isOpen, {
    duration: 200,
  });

  return (
    <div
      className="drawer"
      data-open={isOpen || null}
      data-entering={isEntering || null}
      data-exiting={isExiting || null}
      data-placement={placement}
    >
      {children}
    </div>
  );
}
```

### Example 2: Sidenav Component

```tsx
import { useEnterExitAnimation } from '@accelint/design-toolkit/hooks/use-enter-exit-animation';

export function Sidenav({ isOpen, children }) {
  const { isEntering, isExiting } = useEnterExitAnimation(isOpen, {
    duration: 200,
  });

  return (
    <nav
      className="sidenav"
      data-open={isOpen || null}
      data-entering={isEntering || null}
      data-exiting={isExiting || null}
    >
      {children}
    </nav>
  );
}
```

### Example 3: Modal with Backdrop

```tsx
import { useEnterExitAnimation } from '@accelint/design-toolkit/hooks/use-enter-exit-animation';

export function Modal({ isOpen, children, onClose }) {
  const { isEntering, isExiting } = useEnterExitAnimation(isOpen, {
    duration: 200,
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        data-open={isOpen || null}
        data-entering={isEntering || null}
        data-exiting={isExiting || null}
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="modal-content"
        data-open={isOpen || null}
        data-entering={isEntering || null}
        data-exiting={isExiting || null}
      >
        {children}
      </div>
    </>
  );
}
```

## Animation Duration Guidelines

Use these durations from `@accelint/design-foundation`:

| Duration | Value | Use Case | Example |
|----------|-------|----------|---------|
| `instant` | `0ms` | Reduced motion | User preference override |
| `fast` | `80ms` | Micro-interactions | Hover states, tooltips |
| `normal` | `160ms` | Most transitions | Drawers, panels, modals |
| `slow` | `320ms` | Complex layouts | Page transitions, large panels |

```tsx
// Match your hook duration to CSS
const { isEntering, isExiting } = useEnterExitAnimation(isOpen, {
  duration: 200, // matches --animation-duration-normal
});
```

## Accessibility

**CRITICAL:** Always respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .my-component {
    animation-duration: var(--animation-duration-instant) !important;
    transition-duration: var(--animation-duration-instant) !important;
  }
}
```

This ensures animations are disabled for users who have requested reduced motion in their system preferences.

## Performance Best Practices

1. **Use GPU-accelerated properties:**
   - ✅ `transform`, `opacity`
   - ❌ `width`, `height`, `left`, `top`

2. **Use `will-change` sparingly:**
   ```css
   &[data-entering],
   &[data-exiting] {
     will-change: transform, opacity;
   }
   ```

3. **Avoid layout thrashing:**
   - Don't animate properties that trigger layout recalculation
   - Batch DOM reads and writes

4. **Clean up animations:**
   - The hook automatically cleans up timers on unmount
   - No manual cleanup required

## Comparison to React Aria Components

React Aria overlay components (Tooltip, Popover, Dialog) automatically provide `data-entering` and `data-exiting` attributes because they use React Aria's internal overlay system.

For custom components that don't use React Aria's overlay system (like Drawer and Sidenav), this hook provides the same pattern:

| Component Type | Built-in Support | Use Hook |
|----------------|------------------|----------|
| Tooltip | ✅ Automatic | ❌ Not needed |
| Popover | ✅ Automatic | ❌ Not needed |
| Dialog | ✅ Automatic | ❌ Not needed |
| Drawer | ❌ Manual | ✅ Use hook |
| Sidenav | ❌ Manual | ✅ Use hook |
| Custom overlays | ❌ Manual | ✅ Use hook |

## Testing

The hook includes comprehensive tests. Run them with:

```bash
pnpm test src/hooks/use-enter-exit-animation
```

Key test scenarios:
- ✅ Initial mount (no animation by default)
- ✅ Opening transition (isEntering → false after duration)
- ✅ Closing transition (isExiting → false after duration)
- ✅ Custom duration handling
- ✅ Skip initial mount configuration
- ✅ Rapid open/close transitions
- ✅ Cleanup on unmount

## See Also

- [MOTION_IMPLEMENTATION_GUIDE.md](../../../MOTION_IMPLEMENTATION_GUIDE.md) - Comprehensive animation guide
- [example-animations.css](./example-animations.css) - CSS pattern examples
- [@accelint/design-foundation](../../../design-foundation) - Design tokens
