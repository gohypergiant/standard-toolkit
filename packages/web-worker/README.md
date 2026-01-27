# @accelint/worker

A lightweight JavaScript library that simplifies working with Web Workers. It provides intuitive functions for creating, managing, and communicating with Web Workers, allowing you to offload heavy computations and maintain a responsive UI.

## Installation

```sh
npm install @accelint/worker
```

## Features

- **Type-Safe Communication**: Full TypeScript support with typed worker function signatures
- **Simple API**: Clean, promise-based interface for worker communication
- **SharedWorker Support**: Works with both regular Workers and SharedWorkers
- **Automatic Cleanup**: Built-in worker lifecycle management
- **Transferable Objects**: Efficient data transfer with zero-copy semantics
- **Error Handling**: Automatic error propagation from worker to main thread

## Basic Usage

### Creating a Worker Interface

Create a type-safe interface to communicate with your worker:

```typescript
import { create } from '@accelint/worker';

// Define the worker's function signatures
type WorkerFunctions = {
  add: (a: number, b: number) => number;
  processData: (data: string[]) => string;
};

// Create a worker interface
const worker = create<WorkerFunctions>(
  () => new Worker(new URL('./my-worker.ts', import.meta.url))
);

// Call worker functions with type safety
const sum = await worker.run('add', 5, 3); // Returns: 8
const result = await worker.run('processData', ['a', 'b', 'c']);

// Clean up when done
worker.destroy();
```

### Exposing Functions in a Worker

Inside your worker script, expose functions that can be called from the main thread:

```typescript
// my-worker.ts
import { expose } from '@accelint/worker/worker';
import type { Action } from '@accelint/worker';

expose({
  add: async (a: number, b: number): Promise<Action<number>> => {
    return [a + b, []];
  },
  processData: async (data: string[]): Promise<Action<string>> => {
    const result = data.join('-').toUpperCase();
    return [result, []];
  }
});
```

## API Reference

### `create<Functions>(createFn: () => Worker | SharedWorker)`

Creates a type-safe interface for communicating with a Web Worker.

**Type Parameters:**

- `Functions` - An object type mapping function names to their signatures

**Parameters:**

- `createFn` - A factory function that creates and returns a Worker or SharedWorker instance

**Returns:** An object with:

- `run(functionName, ...args)` - Execute a worker function with type-safe parameters
- `destroy()` - Terminate the worker and clean up event listeners
- `instance` - The underlying Worker or SharedWorker instance

### `expose(actions: Actions, shared?: boolean)`

Exposes a set of functions to be called from the main thread.

**Parameters:**

- `actions` - An object mapping function names to their implementations
- `shared` - Whether this is a SharedWorker (defaults to false)

### `Action<T>`

A type representing an action result with optional transferable objects.

```typescript
type Action<T> = [T, Transferable[]];
```

The first element is the return value, and the second is an array of transferable objects.

## Advanced Usage

### Using Transferable Objects

For efficient transfer of large data structures like ArrayBuffers:

```typescript
// In the main thread
type WorkerFunctions = {
  processBuffer: (buffer: ArrayBuffer) => ArrayBuffer;
};

const worker = create<WorkerFunctions>(
  () => new Worker(new URL('./buffer-worker.ts', import.meta.url))
);

const buffer = new ArrayBuffer(1024 * 1024); // 1MB
const result = await worker.run('processBuffer', buffer);
```

```typescript
// buffer-worker.ts
import { expose } from '@accelint/worker/worker';
import type { Action } from '@accelint/worker';

expose({
  processBuffer: async (buffer: ArrayBuffer): Promise<Action<ArrayBuffer>> => {
    // Process the buffer
    const result = new ArrayBuffer(buffer.byteLength);
    const view = new Uint8Array(result);
    const sourceView = new Uint8Array(buffer);

    for (let i = 0; i < sourceView.length; i++) {
      view[i] = sourceView[i] * 2;
    }

    // Return with transferable to avoid copying
    return [result, [result]];
  }
});
```

### Using SharedWorker

SharedWorkers can be shared across multiple browser contexts (tabs, iframes):

```typescript
// Main thread
import { create } from '@accelint/worker';

type SharedFunctions = {
  getState: () => Record<string, unknown>;
  setState: (key: string, value: unknown) => void;
};

const sharedWorker = create<SharedFunctions>(
  () => new SharedWorker(new URL('./shared-worker.ts', import.meta.url))
);

await sharedWorker.run('setState', 'count', 42);
const state = await sharedWorker.run('getState');
```

```typescript
// shared-worker.ts
import { expose } from '@accelint/worker/worker';
import type { Action } from '@accelint/worker';

const state: Record<string, unknown> = {};

expose({
  getState: async (): Promise<Action<Record<string, unknown>>> => {
    return [state, []];
  },
  setState: async (key: string, value: unknown): Promise<Action<void>> => {
    state[key] = value;
    return [undefined, []];
  }
}, true); // Note: second parameter is true for SharedWorker
```

### Void Actions

For functions that don't need to return a value:

```typescript
// worker.ts
expose({
  log: async (message: string): Promise<Action<void>> => {
    console.log(message);
    return [undefined, []];
  }
});
```

## Use Cases

### Heavy Computation

Offload CPU-intensive tasks to keep the UI responsive:

```typescript
// Main thread
const worker = create<{ fibonacci: (n: number) => number }>(
  () => new Worker(new URL('./compute-worker.ts', import.meta.url))
);

const result = await worker.run('fibonacci', 40);
```

### Data Processing

Process large datasets without blocking the main thread:

```typescript
type DataWorker = {
  processCSV: (csv: string) => Record<string, unknown>[];
  filterData: (data: unknown[], predicate: string) => unknown[];
};

const dataWorker = create<DataWorker>(
  () => new Worker(new URL('./data-worker.ts', import.meta.url))
);

const parsed = await dataWorker.run('processCSV', csvContent);
const filtered = await dataWorker.run('filterData', parsed, 'active === true');
```

### Image Processing

Manipulate images using transferable ArrayBuffers:

```typescript
type ImageWorker = {
  applyFilter: (imageData: ImageData) => ImageData;
};

const imageWorker = create<ImageWorker>(
  () => new Worker(new URL('./image-worker.ts', import.meta.url))
);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const filtered = await imageWorker.run('applyFilter', imageData);
ctx.putImageData(filtered, 0, 0);
```

## TypeScript Support

All functions are fully typed and written in TypeScript. Type definitions are included in the package.

## License

Apache-2.0
