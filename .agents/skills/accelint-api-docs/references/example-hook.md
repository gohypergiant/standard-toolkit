# useBus

Convenience wrapper providing type-safe event bus hooks for emitting and listening to events across your application.

## Usage

```typescript
import { useBus, Payload } from '@accelint/bus';

type MyEvents =
  | Payload<'user:login', { userId: string }>
  | Payload<'user:logout'>;

function MyComponent() {
  const { useEmit, useOn } = useBus<MyEvents>();

  const emitLogin = useEmit('user:login');
  useOn('user:logout', (event) => {
    console.log('User logged out');
  });

  return (
    <button onClick={() => emitLogin({ userId: '123' })}>
      Login
    </button>
  );
}
```

## Reference

```typescript
function useBus<Events extends BasicPayload>(
  options?: EmitOptions | null
): {
  useEmit: <Type extends Events['type']>(
    type: Type,
    options?: EmitOptions | null
  ) => EmitFunction;
  useOn: <Type extends Events['type']>(
    type: Type,
    callback: (data: ExtractEvent<Events, Type>) => void
  ) => void;
  useOnce: <Type extends Events['type']>(
    type: Type,
    callback: (data: ExtractEvent<Events, Type>) => void
  ) => void;
}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `EmitOptions \| null` | Optional global emit options applied to all events. Can include `target` to scope delivery. |

### Returns

Returns an object containing three type-safe hooks:

#### `useEmit`

Returns a function to emit events of a specific type. The returned function accepts the payload matching the event type.

#### `useOn`

Subscribes to events of a specific type. The callback receives the full event object including payload. Automatically unsubscribes when the component unmounts.

#### `useOnce`

Like `useOn`, but the callback is only invoked for the first event received, then automatically unsubscribes.

### Type Parameters

- `Events` - Union type of all event payloads handled by this bus. Should be a union of `Payload<type, data>` types.

## Examples

### Example: Simple event communication

```typescript
import { useBus, Payload } from '@accelint/bus';

type AppEvents = Payload<'theme:changed', { theme: 'light' | 'dark' }>;

function ThemeToggle() {
  const { useEmit } = useBus<AppEvents>();
  const emitThemeChange = useEmit('theme:changed');

  return (
    <button onClick={() => emitThemeChange({ theme: 'dark' })}>
      Dark Mode
    </button>
  );
}

function ThemeListener() {
  const { useOn } = useBus<AppEvents>();

  useOn('theme:changed', (event) => {
    document.body.className = event.payload.theme;
  });

  return null;
}
```

### Example: Events without payload

```typescript
import { useBus, Payload } from '@accelint/bus';

type NavigationEvents = Payload<'nav:back'>;

function BackButton() {
  const { useEmit } = useBus<NavigationEvents>();
  const goBack = useEmit('nav:back');

  // No payload required for events without data
  return <button onClick={() => goBack()}>Back</button>;
}
```

### Example: Targeting specific instances

```typescript
import { useBus, Payload } from '@accelint/bus';

type NotificationEvents = Payload<'notify', { message: string }>;

function Notifier() {
  const { useEmit } = useBus<NotificationEvents>({
    target: 'others' // Don't emit to self
  });

  const notify = useEmit('notify');

  return (
    <button onClick={() => notify({ message: 'Hello other tabs!' })}>
      Notify Others
    </button>
  );
}
```

### Example: One-time event listener

```typescript
import { useBus, Payload } from '@accelint/bus';

type InitEvents = Payload<'app:ready'>;

function OnboardingTour() {
  const { useOnce } = useBus<InitEvents>();
  const [show, setShow] = React.useState(false);

  useOnce('app:ready', () => {
    setShow(true); // Only shows on first app:ready event
  });

  return show ? <div>Welcome!</div> : null;
}
```

> **Good to know:** All three hooks (`useEmit`, `useOn`, `useOnce`) returned by `useBus` share the same underlying `Broadcast` singleton instance, ensuring events are delivered across all components using the same event types.

### Example: Multiple event types

```typescript
import { useBus, Payload } from '@accelint/bus';

type AppEvents =
  | Payload<'user:login', { userId: string; username: string }>
  | Payload<'user:logout'>
  | Payload<'data:updated', { id: string }>;

function AppEventHandler() {
  const { useOn } = useBus<AppEvents>();

  useOn('user:login', (event) => {
    console.log(`Welcome ${event.payload.username}`);
  });

  useOn('user:logout', () => {
    console.log('Goodbye');
  });

  useOn('data:updated', (event) => {
    console.log(`Data ${event.payload.id} updated`);
  });

  return null;
}
```

## Related

- [Broadcast](../broadcast/index.md) - Underlying event bus class
- [useEmit](./use-emit.md) - Standalone emit hook
- [useOn](./use-on.md) - Standalone listener hook
- [Payload](../types.md#payload) - Type helper for defining events
