# @accelint/bus

## Installation

```sh
npm install @accelint/bus
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
