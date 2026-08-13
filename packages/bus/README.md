# @accelint/bus

An open-source event bus library for type-safe event-driven communication across your application, with built-in React hooks support.

This event bus is built on the [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API#browser_compatibility), making it compatible with Node.js (v18+) and modern browsers.

**Key difference from standard BroadcastChannel:** By default, this bus emits events only within the current instance (self-targeting). Standard BroadcastChannel emits to all connected instances. You can opt into cross-instance communication through configuration either globally, per event, or per emit.

## Installation

```sh
npm install @accelint/bus
```

## Configuration

### Event Targeting

By default, events only emit within the current instance (`'self'`). You can configure event targeting at three levels with increasing precedence: **global** → **per event** → **per emit**.

#### Target Options

- `'self'` (default) - Emit only to listeners in the current instance
- `'all'` - Emit to all instances (current + all other tabs/contexts)
- `'others'` - Emit to all other instances (excluding current)
- `UniqueId` - Emit to a specific instance by its ID

#### Global Configuration

Set default options for all events:

```ts
const bus = Broadcast.getInstance<MyEvents>();

// All events will now emit to all instances by default
bus.setGlobalEmitOptions({ target: 'all' });

// Reset to default (self-targeting only)
bus.setGlobalEmitOptions(null);
```

#### Per Event Configuration

Override global options for specific event types:

```ts
const bus = Broadcast.getInstance<MyEvents>();

// 'foo' events always emit to all instances
bus.setEventEmitOptions('foo', { target: 'all' });

// 'bar' events only emit to other instances
bus.setEventEmitOptions('bar', { target: 'others' });

// Reset 'foo' to use global/default behavior
bus.setEventEmitOptions('foo', null);

// Configure multiple events at once
bus.setEventsEmitOptions(
  new Map([
    ['foo', { target: 'all' }],
    ['bar', { target: 'others' }],
  ])
);
```

#### Per Emit Configuration

Override all other options for a single emit call:

```ts
const bus = Broadcast.getInstance<MyEvents>();

// This single emit goes to all instances, regardless of global/event config
bus.emit('foo', { isCool: true }, { target: 'all' });

// This emit only goes to other instances
bus.emit('bar', { position: [0, 0] }, { target: 'others' });

// Target a specific instance by ID
const targetId = '...'; // UUID from another instance
bus.emit('foo', { isCool: false }, { target: targetId });
```

#### Configuration Precedence

Options merge with increasing precedence:

```ts
const bus = Broadcast.getInstance<MyEvents>();

bus.setGlobalEmitOptions({ target: 'all' }); // Lowest precedence
bus.setEventEmitOptions('foo', { target: 'others' }); // Medium precedence

// This emits to 'others' (event config overrides global)
bus.emit('foo', { isCool: true });

// This emits to 'self' (per-emit overrides event config)
bus.emit('foo', { isCool: true }, { target: 'self' });

// This emits to 'all' (uses global config)
bus.emit('bar', { position: [0, 0] });
```

## Usage

```ts
type MyEvent = Payload<'some-event', {some: string}>;

// can also be a union of multiple events
type FooEvent = Payload<'foo', { isCool: boolean }>;
type BarEvent = Payload<'bar', { position: [number, number] }>;

// gets passed in as the generic in place of MyEvent in examples below
type MyEvents = MyEvent | FooEvent | BarEvent;
```

### Vanilla

```ts
import { Broadcast } from '@accelint/bus';

const bus = Broadcast.getInstance<MyEvent>();

const off = bus.on('some-event', (payload) => {
  console.log(payload);
});

bus.emit('some-event', {
  some: 'payload',
});

off(); // unsubscribe from event
```

### React

```tsx
import { useEmit, useOn } from '@accelint/bus/react';

function MyComponent(props) {
  const { foo } = props;
  const [thing, setMyThing] = useState(false);

  const emit = useEmit<MyEvent>('some-event');

  useOn<MyEvent>('some-event', (payload) => {
    // this callback is stable and you can access props / state without
    // the values becoming stale. Event is automatically cleaned up.

    console.log(foo);
    console.log(thing);
    console.log(payload);
  });

  function onClick() {
    emit({ some: 'payload' })
  }

  return (
    <button onClick={onClick}>Fire Event</button>
  )
}
```

```tsx
import { useBus } from '@accelint/bus/react';

function MyComponent(props) {
  const { foo } = props;
  const [thing, setMyThing] = useState(false);

  const { useOn, useEmit } = useBus<MyEvent>();

  const emit = useEmit('some-event');

  useOn('some-event', (payload) => {
    // this callback is stable and you can access props / state without
    // the values becoming stale. Event is automatically cleaned up.

    console.log(foo);
    console.log(thing);
    console.log(payload);
  });

  function onClick() {
    emit({ some: 'payload' })
  }

  return (
    <button onClick={onClick}>Fire Event</button>
  )
}
```

## Instance Tracking

### Instance ID

Each bus instance has a unique identifier:

```ts
import { Broadcast } from '@accelint/bus';

const bus = Broadcast.getInstance<MyEvents>();

console.log(bus.id); // UUID of current instance
```

### Connected Instances

Access the set of currently connected instance IDs:

```ts
import { Broadcast } from '@accelint/bus';

const bus = Broadcast.getInstance<MyEvents>();

// ReadonlySet of connected instance UUIDs
console.log(bus.connected);
```

The bus automatically discovers connected instances on initialization and when tabs become visible. To manually refresh the connection list:

```ts
bus.ping();
```

**Note:** `ping()` is not synchronous. The `connected` set updates asynchronously as other instances respond.

### Listening to Connection Events

Monitor connection changes in real-time:

```ts
import { Broadcast, CONNECTION_EVENT_TYPES } from '@accelint/bus';

const bus = Broadcast.getInstance<MyEvents>();

bus.on(CONNECTION_EVENT_TYPES.ping, ({ source }) => {
  console.log('Instance sent ping:', source);
});

bus.on(CONNECTION_EVENT_TYPES.echo, ({ source }) => {
  console.log('Instance connected:', source);
  // bus.connected is now updated
});

bus.on(CONNECTION_EVENT_TYPES.stop, ({ source }) => {
  console.log('Instance disconnected:', source);
  // bus.connected is now updated
});
```

### Example: Display Connected Count

```tsx
import { CONNECTION_EVENT_TYPES } from '@accelint/bus';
import { useBus, useOn } from '@accelint/bus/react';
import { useState } from 'react';

function ConnectedCounter() {
  const { bus } = useBus<MyEvents>();
  const [count, setCount] = useState(bus.connected.size);

  const updateCount = () => setCount(bus.connected.size);

  useOn(CONNECTION_EVENT_TYPES.ping, updateCount);
  useOn(CONNECTION_EVENT_TYPES.echo, updateCount);
  useOn(CONNECTION_EVENT_TYPES.stop, updateCount);

  return <div>Connected instances: {count}</div>;
}
```
