---
title: Bus API
description: Event bus library for cross-context communication
source: packages/bus/src/index.ts
source_sha: 3a165d8f4fcefdb569e96058bba87c59250d0703
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# Bus API

Event bus library for cross-context communication using the BroadcastChannel API.

## Usage

```typescript
import { Broadcast, Payload } from '@accelint/bus';

type AppEvents = Payload<'user:login', { userId: string }>;

const bus = Broadcast.getInstance<AppEvents>();

bus.on('user:login', (event) => {
  console.log('User logged in:', event.payload.userId);
});

bus.emit('user:login', { userId: '123' });
```

## Exports

### Classes

- [Broadcast](./broadcast/index.md) - Main event bus class for emitting and listening to events across browser contexts

### React Hooks

Import from `@accelint/bus/react`:

- [useBus](./react/index.md#usebus) - Convenience wrapper providing type-safe event bus hooks
- [useEmit](./react/index.md#useemit) - React hook for emitting events
- [useOn](./react/index.md#useon) - React hook for listening to events
- [useOnce](./react/index.md#useonce) - React hook for one-time event listeners

### Types

- `BasicPayload` - Base type for event payloads
- `Payload<Type, Data>` - Type helper for defining events
- `BroadcastConfig` - Configuration options for Broadcast instances
- `EmitOptions` - Options for controlling event delivery
- `EmitTarget` - Target delivery scope (`'self'` | `'others'` | `UniqueId`)
- `ExtractEvent<Events, Type>` - Utility type for extracting specific event from union
- `Listener` - Event listener configuration
- `StructuredCloneableData` - Type constraint for serializable data

### Constants

- `CONNECTION_EVENT_TYPES` - Built-in event types for connection management (ping, echo, stop)
- `DEFAULT_CONFIG` - Default Broadcast configuration
- `DEFAULT_TARGET` - Default emit target

## Examples

### Example: Basic event bus

```typescript
import { Broadcast, Payload } from '@accelint/bus';

type Events = Payload<'message', { text: string }>;

const bus = Broadcast.getInstance<Events>();

const unsubscribe = bus.on('message', (event) => {
  console.log(event.payload.text);
});

bus.emit('message', { text: 'Hello!' });

// Later: cleanup
unsubscribe();
```

### Example: React component communication

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

### Example: Cross-tab communication

```typescript
import { Broadcast, Payload } from '@accelint/bus';

type TabEvents = Payload<'sync', { data: unknown }>;

const bus = Broadcast.getInstance<TabEvents>();

// Tab 1: Emit to all other tabs
bus.emit('sync', { data: { count: 5 } }, { target: 'others' });

// Tab 2: Listen for sync events
bus.on('sync', (event) => {
  console.log('Synced data:', event.payload.data);
});
```

> **Good to know:** Events are delivered using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). Only serializable data can be sent—functions, DOM nodes, and symbols are not supported.

## Related

- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) - Underlying browser API
- [@accelint/core](../../core/api/index.md) - Core utilities (UUID generation)
