# Broadcast

Event bus for emitting and listening to events across browser contexts using the BroadcastChannel API.

## Usage

```typescript
import { Broadcast, Payload } from '@accelint/bus';

type AppEvents = Payload<'user:login', { userId: string }>;

const bus = Broadcast.getInstance<AppEvents>();

// Listen for events
bus.on('user:login', (event) => {
  console.log('User logged in:', event.payload.userId);
});

// Emit events
bus.emit('user:login', { userId: '123' });
```

## Reference

### Type Parameters

- `Events` - Union type of all event payloads. Should be a union of `Payload<type, data>` types.

### Constructor

```typescript
constructor(config?: BroadcastConfig)
```

Creates a new Broadcast instance. For most cases, use `getInstance()` instead to access the singleton.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `BroadcastConfig` | Optional configuration object |
| `config.channelName` | `string` | Name of the BroadcastChannel (default: `'@accelint/bus'`) |

### Static Methods

#### `getInstance`

```typescript
static getInstance<T extends BasicPayload>(config?: BroadcastConfig): Broadcast<T>
```

Returns the singleton Broadcast instance. Creates the instance on first call.

> **Good to know:** Broadcast uses a singleton pattern. Multiple calls to `getInstance()` return the same instance, ensuring events are shared across your entire application.

### Event Methods

#### `on`

```typescript
on<Type extends Events['type']>(
  type: Type,
  callback: (data: ExtractEvent<Events, Type>) => void
): () => void
```

Registers a callback for the specified event type. Returns an unsubscribe function.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `Type extends Events['type']` | The event type to listen for |
| `callback` | `(data: ExtractEvent<Events, Type>) => void` | Function called when event is received |

**Returns:** Unsubscribe function to remove the listener

#### `once`

```typescript
once<Type extends Events['type']>(
  type: Type,
  callback: (data: ExtractEvent<Events, Type>) => void
): () => void
```

Like `on`, but the callback is automatically removed after being invoked once.

#### `off`

```typescript
off<Type extends Events['type']>(
  type: Type,
  callback: (data: ExtractEvent<Events, Type>) => void
): void
```

Unregisters a specific callback for an event type.

#### `emit`

```typescript
emit<Type extends Events['type']>(
  type: Type,
  payload: Data,
  options?: EmitOptions
): void
```

Emits an event to all listening contexts.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `Type extends Events['type']` | The event type |
| `payload` | `Data` | Event payload (must be serializable via structured clone algorithm) |
| `options` | `EmitOptions` | Optional delivery options |
| `options.target` | `'self' \| 'others' \| UniqueId` | Target delivery scope (default: broadcasts to all) |

### Configuration Methods

#### `setEventEmitOptions`

Sets default emit options for a specific event type. These options are merged with global and local options (global < event < local precedence).

#### `setGlobalEmitOptions`

Sets default emit options for all events. Lowest precedence in the merge hierarchy.

### Management Methods

#### `deleteEvent`

Removes all listeners and configuration for a specific event type.

#### `destroy`

Closes the BroadcastChannel and cleans up all listeners. After calling this, the instance is no longer usable.

#### `ping`

Sends a ping to discover other Broadcast instances. Updates the `connected` property with responding instance IDs.

### Properties

#### `id`

```typescript
readonly id: UniqueId
```

Read-only unique identifier for this Broadcast instance.

#### `connected`

```typescript
readonly connected: ReadonlySet<UniqueId>
```

Read-only set of IDs for other Broadcast instances currently communicating with this one. Updated when instances ping/echo or disconnect.

## Examples

### Example: Basic pub/sub

```typescript
import { Broadcast, Payload } from '@accelint/bus';

type Events = Payload<'message', { text: string }>;

const bus = Broadcast.getInstance<Events>();

// Subscribe
const unsubscribe = bus.on('message', (event) => {
  console.log(event.payload.text);
});

// Publish
bus.emit('message', { text: 'Hello!' });

// Later: cleanup
unsubscribe();
```

### Example: One-time listener

```typescript
import { Broadcast, Payload } from '@accelint/bus';

type Events = Payload<'init:complete'>;

const bus = Broadcast.getInstance<Events>();

bus.once('init:complete', () => {
  console.log('App initialized'); // Only fires once
});

bus.emit('init:complete');
bus.emit('init:complete'); // Callback not called
```

### Example: Targeting specific instances

```typescript
import { Broadcast, Payload } from '@accelint/bus';

type Events = Payload<'sync', { data: unknown }>;

const bus = Broadcast.getInstance<Events>();

// Emit only to self
bus.emit('sync', { data: {} }, { target: 'self' });

// Emit to all others (not self)
bus.emit('sync', { data: {} }, { target: 'others' });

// Emit to specific instance by ID
const targetId = '...'; // Another bus instance ID
bus.emit('sync', { data: {} }, { target: targetId });
```

### Example: Discovering connected instances

```typescript
import { Broadcast } from '@accelint/bus';

const bus = Broadcast.getInstance();

// Request discovery
bus.ping();

// Check connected instances (after async responses arrive)
setTimeout(() => {
  console.log(`Connected instances: ${bus.connected.size}`);
  for (const id of bus.connected) {
    console.log(`- ${id}`);
  }
}, 100);
```

### Example: Event-specific options

```typescript
import { Broadcast, Payload } from '@accelint/bus';

type Events =
  | Payload<'local', { data: string }>
  | Payload<'broadcast', { data: string }>;

const bus = Broadcast.getInstance<Events>();

// Configure 'local' to only emit to self
bus.setEventEmitOptions('local', { target: 'self' });

// Now all 'local' emits stay local
bus.emit('local', { data: 'private' }); // Only this instance receives

// 'broadcast' uses default (all instances)
bus.emit('broadcast', { data: 'public' }); // All instances receive
```

### Example: Cleanup on destroy

```typescript
import { Broadcast } from '@accelint/bus';

const bus = Broadcast.getInstance();

bus.on('some-event', () => {
  // Handler logic
});

// Later: clean up completely
bus.destroy();

// After destroy, bus is unusable
// Calling getInstance() will create a new instance
```

> **Good to know:** Events emitted via Broadcast are delivered using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). This means payloads must be serializable—functions, DOM nodes, and symbols cannot be sent.

## Related

- [useBus](../react/use-bus.md) - React hook wrapper for Broadcast
- [useEmit](../react/use-emit.md) - React hook for emitting events
- [useOn](../react/use-on.md) - React hook for listening to events
- [Payload](../types.md#payload) - Type helper for defining events
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) - Underlying browser API
