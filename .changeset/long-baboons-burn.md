---
"@accelint/bus": major
"@accelint/design-toolkit": patch
"@accelint/map-toolkit": minor
---

## Breaking Change: Structured Clone Constraint

The event bus payload is now constrained to values that are serializable by the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). This constraint aligns the TypeScript types with the actual runtime behavior of the `BroadcastChannel` API.

### What this means

You can no longer pass the following types in event payloads:

- Functions
- Symbols
- DOM nodes
- Prototype chains (class instances lose their methods)
- Properties with `undefined` values (they're omitted)

### How to migrate

**❌ Before:**

```typescript
bus.emit('user-action', {
  callback: () => console.log('done'), // ❌ Function
  userData: userClass, // ❌ Class instance with methods
  element: document.getElementById('foo'), // ❌ DOM node
});
```

**✅ After:**

```typescript
// Option 1: Send only data, handle logic separately
bus.emit('user-action', {
  actionType: 'complete', // ✅ Primitive
  userData: { id: userClass.id, name: userClass.name }, // ✅ Plain object
  elementId: 'foo', // ✅ Reference by ID
});

// Option 2: Use event types to trigger behavior
bus.on('user-action-complete', () => {
  console.log('done'); // Handle callback logic in listener
});
```

### Supported types

- Primitives (string, number, boolean, null, BigInt)
- Plain objects and arrays
- Date, RegExp, Map, Set
- Typed arrays (Uint8Array, etc.)
- ArrayBuffer, Blob, File

### Finding issues

TypeScript will now catch most violations at compile time. Runtime errors from `BroadcastChannel.postMessage()` indicate non-serializable values that slipped through.
