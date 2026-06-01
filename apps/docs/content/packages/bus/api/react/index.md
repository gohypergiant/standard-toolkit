---
title: React Hooks
description: Type-safe React hooks for event bus communication across components
source: packages/bus/src/react/index.ts
source_sha: 6cf16682b1af2f7746e609f7cf851e728670dd9e
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# React Hooks

Type-safe React hooks for event bus communication across components.

## useBus

Convenience wrapper providing type-safe event bus hooks for emitting and listening to events across your application.

### Usage

```typescript
import { useBus, Payload } from '@accelint/bus/react';

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

### Reference

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

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `EmitOptions \| null` | Optional global emit options applied to all events. Can include `target` to scope delivery. |

#### Returns

Returns an object containing three type-safe hooks:

##### `useEmit`

Returns a function to emit events of a specific type. The returned function accepts the payload matching the event type.

##### `useOn`

Subscribes to events of a specific type. The callback receives the full event object including payload. Automatically unsubscribes when the component unmounts.

##### `useOnce`

Like `useOn`, but the callback is only invoked for the first event received, then automatically unsubscribes.

#### Type Parameters

- `Events` - Union type of all event payloads handled by this bus. Should be a union of `Payload<type, data>` types.

### Examples

#### Example: Simple event communication

```typescript
import { useBus, Payload } from '@accelint/bus/react';

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

#### Example: Events without payload

```typescript
import { useBus, Payload } from '@accelint/bus/react';

type NavigationEvents = Payload<'nav:back'>;

function BackButton() {
  const { useEmit } = useBus<NavigationEvents>();
  const goBack = useEmit('nav:back');

  // No payload required for events without data
  return <button onClick={() => goBack()}>Back</button>;
}
```

#### Example: Targeting specific instances

```typescript
import { useBus, Payload } from '@accelint/bus/react';

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

#### Example: One-time event listener

```typescript
import { useBus, Payload } from '@accelint/bus/react';

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

## useEmit

React hook to enable render-safe emitting of events with type-safe payloads.

### Usage

```typescript
import { useEmit, Payload } from '@accelint/bus/react';

type MyEvents = Payload<'user:login', { userId: string }>;

function LoginButton() {
  const emitLogin = useEmit<MyEvents, 'user:login'>('user:login');

  return (
    <button onClick={() => emitLogin({ userId: '123' })}>
      Login
    </button>
  );
}
```

### Reference

```typescript
function useEmit<
  Events extends BasicPayload,
  Type extends Events['type']
>(
  type: Type,
  options?: EmitOptions | null
): ExtractEvent<Events, Type> extends { payload: infer Data }
  ? (payload: Data, options?: EmitOptions) => void
  : (payload?: undefined, options?: EmitOptions) => void
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `Type extends Events['type']` | Event type to emit |
| `options` | `EmitOptions \| null` | Emit options applied to all emits of this event |

#### Returns

Callback function that accepts the corresponding payload for the event type. The callback can also accept per-call options that override event-level options.

#### Type Parameters

- `Events` - Union type of all event payloads
- `Type` - Specific event type to emit

## useOn

React hook to attach an event bus listener with type-safe callback.

### Usage

```typescript
import { useOn, Payload } from '@accelint/bus/react';

type MyEvents = Payload<'user:login', { userId: string }>;

function UserGreeting() {
  useOn<MyEvents, 'user:login'>('user:login', (event) => {
    console.log('User logged in:', event.payload.userId);
  });

  return null;
}
```

### Reference

```typescript
function useOn<
  Events extends BasicPayload,
  Type extends Events['type']
>(
  type: Type,
  callback: (data: ExtractEvent<Events, Type>) => void
): void
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `Type extends Events['type']` | Event type to listen for |
| `callback` | `(data: ExtractEvent<Events, Type>) => void` | Handler that receives the event with corresponding payload |

> **Good to know:** The listener automatically unsubscribes when the component unmounts. The callback is stable across renders using React's `useEffectEvent` pattern.

## useOnce

React hook to attach an event bus listener that fires only once, then automatically unsubscribes.

### Usage

```typescript
import { useOnce, Payload } from '@accelint/bus/react';

type InitEvents = Payload<'app:ready'>;

function WelcomeMessage() {
  const [show, setShow] = React.useState(false);

  useOnce<InitEvents, 'app:ready'>('app:ready', () => {
    setShow(true);
  });

  return show ? <div>Welcome!</div> : null;
}
```

### Reference

```typescript
function useOnce<
  Events extends BasicPayload,
  Type extends Events['type']
>(
  type: Type,
  callback: (data: ExtractEvent<Events, Type>) => void
): void
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `Type extends Events['type']` | Event type to listen for |
| `callback` | `(data: ExtractEvent<Events, Type>) => void` | Handler that receives the event with corresponding payload |

> **Good to know:** The callback fires only for the first event received. Subsequent events of the same type are ignored. The listener automatically cleans up when the component unmounts.

## Related

- [Broadcast](../broadcast/index.md) - Underlying event bus class
- [Payload](../types.md#payload) - Type helper for defining events
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) - Underlying browser API
