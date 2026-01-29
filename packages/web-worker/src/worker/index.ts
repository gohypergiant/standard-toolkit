/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import mitt from 'mitt';
import type { Emitter } from 'mitt';

let i = 0;

const uuid = (namespace: string) => `${namespace}_${++i}`;

// biome-ignore lint/suspicious/noExplicitAny: Figure out type hinting for "any" values
type Actions = Record<string, (...args: any[]) => any>;

// biome-ignore lint/suspicious/noExplicitAny: Figure out type hinting for "any" values
type MessageData<T> = { id: string; type: T; args: any[] };

// biome-ignore lint/suspicious/noExplicitAny: Figure out type hinting for "any" values
type MessageDataResult = { id: string; ok?: any; error?: any };

type Events = Record<string, MessageDataResult>;

/**
 * Represents an action result with optional transferable objects.
 *
 * This type is a tuple containing the return value and an array of transferable
 * objects (like ArrayBuffer, MessagePort) that can be efficiently transferred to
 * the main thread without copying.
 *
 * @example
 * ```typescript
 * // Return a simple value with no transferables
 * const result: Action<string> = ['hello', []];
 *
 * // Return an ArrayBuffer with transferable
 * const buffer = new ArrayBuffer(1024);
 * const result: Action<ArrayBuffer> = [buffer, [buffer]];
 * ```
 */
// TODO: allow for transferables to be nullable?
export type Action<T> = [T, Transferable[]];

function isSharedWorker(w: Worker | SharedWorker) {
  return w instanceof SharedWorker;
}

/**
 * Creates a type-safe interface for communicating with a Web Worker.
 *
 * This function wraps a Web Worker or SharedWorker instance with a simple API
 * that provides type-safe function calls, automatic message handling, and cleanup.
 * It uses an event emitter internally to match requests with responses.
 *
 * @param createFn - A factory function that creates and returns a Worker or SharedWorker instance.
 * @returns An object with three properties:
 *   - `run`: Function to execute worker actions with type-safe parameters and return values
 *   - `destroy`: Function to terminate the worker and clean up event listeners
 *   - `instance`: The underlying Worker or SharedWorker instance
 *
 * @example
 * ```typescript
 * import { create } from '@accelint/worker';
 *
 * // Define the worker's function signatures
 * type WorkerFunctions = {
 *   add: (a: number, b: number) => number;
 *   processData: (data: string[]) => string;
 * };
 *
 * // Create a worker interface
 * const worker = create<WorkerFunctions>(
 *   () => new Worker(new URL('./my-worker.ts', import.meta.url))
 * );
 *
 * // Call worker functions with type safety
 * const sum = await worker.run('add', 5, 3); // Returns: 8
 * const result = await worker.run('processData', ['a', 'b', 'c']);
 *
 * // Clean up when done
 * worker.destroy();
 * ```
 *
 * @example
 * ```typescript
 * // Using with SharedWorker
 * import { create } from '@accelint/worker';
 *
 * type SharedFunctions = {
 *   getState: () => Record<string, unknown>;
 *   setState: (key: string, value: unknown) => void;
 * };
 *
 * const sharedWorker = create<SharedFunctions>(
 *   () => new SharedWorker(new URL('./shared-worker.ts', import.meta.url))
 * );
 *
 * await sharedWorker.run('setState', 'count', 42);
 * const state = await sharedWorker.run('getState');
 * ```
 */
export function create<Functions extends Actions>(
  createFn: () => Worker | SharedWorker,
) {
  const emitter: Emitter<Events> = mitt<Events>();

  // Re-assigning type since we set to undefined during terminate call
  let worker: Worker | SharedWorker | undefined = createFn();

  const isShared = isSharedWorker(worker);

  if (isShared) {
    (worker as SharedWorker).port.start();
  }

  function handleMessage(e: MessageEvent<MessageDataResult>) {
    const { data } = e;
    const { id, ok, error } = data;

    // TODO: verify if this is a valid edge case
    if (!data) {
      return;
    }

    emitter.emit(id, { id, ok, error });
  }

  function run<
    FunctionName extends keyof Functions,
    FunctionCall extends Functions[FunctionName],
  >(
    functionName: FunctionName,
    ...args: Parameters<FunctionCall>
  ): Promise<ReturnType<FunctionCall>> {
    if (!worker) {
      return Promise.reject('Worker terminated');
    }

    const id = uuid(functionName as string);

    const result = new Promise<ReturnType<FunctionCall>>((resolve, reject) => {
      emitter.on(id, ({ ok, error }) => {
        emitter.off(id);

        // NOTE: only reject on error to handle falsey values being passed to "ok"
        error ? reject(error) : resolve(ok);
      });

      const message = { type: functionName, args, id };

      if (isShared) {
        (worker as SharedWorker).port.postMessage(message);
      } else {
        (worker as Worker).postMessage(message);
      }
    });

    return result;
  }

  function destroy() {
    if (worker) {
      // @ts-expect-error FIXME:
      worker.removeEventListener('message', handleMessage);

      // NOTE: SharedWorker cannot be explicitly terminated
      if (!isShared) {
        (worker as Worker).terminate();
      }
    }

    worker = undefined;
  }

  if (worker instanceof SharedWorker) {
    worker.port.addEventListener('message', handleMessage);
  } else {
    worker.addEventListener('message', handleMessage);
  }

  return { run, destroy, instance: worker };
}

/**
 * Exposes a set of functions to be called from the main thread.
 *
 * This function should be called inside a Web Worker script to register functions
 * that can be invoked from the main thread via the `run` method of a worker interface
 * created with `create()`. It automatically handles message routing, error handling,
 * and supports both regular Workers and SharedWorkers.
 *
 * @param actions - An object mapping function names to their implementations.
 *   Each function can return either a direct value or an Action tuple [value, transferables].
 * @param shared - Whether this is a SharedWorker. Defaults to false.
 *
 * @example
 * ```typescript
 * // my-worker.ts - Regular Worker
 * import { expose } from '@accelint/worker/worker';
 * import type { Action } from '@accelint/worker';
 *
 * expose({
 *   add: async (a: number, b: number): Promise<Action<number>> => {
 *     return [a + b, []];
 *   },
 *   multiply: async (a: number, b: number): Promise<Action<number>> => {
 *     return [a * b, []];
 *   },
 *   processBuffer: async (buffer: ArrayBuffer): Promise<Action<ArrayBuffer>> => {
 *     // Process the buffer
 *     const result = new ArrayBuffer(buffer.byteLength);
 *     // ... processing logic ...
 *     // Return with transferable to avoid copying
 *     return [result, [result]];
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // shared-worker.ts - SharedWorker
 * import { expose } from '@accelint/worker/worker';
 * import type { Action } from '@accelint/worker';
 *
 * const state: Record<string, unknown> = {};
 *
 * expose({
 *   getState: async (): Promise<Action<Record<string, unknown>>> => {
 *     return [state, []];
 *   },
 *   setState: async (key: string, value: unknown): Promise<Action<void>> => {
 *     state[key] = value;
 *     // Void actions don't need to return anything
 *     return [undefined, []];
 *   }
 * }, true); // Note: second parameter is true for SharedWorker
 * ```
 */
export function expose(actions: Actions, shared = false) {
  let endpoint: (Window & typeof globalThis) | MessagePort = self;

  function onConnect(e: MessageEvent) {
    if (e.ports.length > 0) {
      // @ts-expect-error FIXME:
      endpoint = e.ports[0];

      // NOTE: weirdly it seems you cannot do .addEventListner on the MessagePort object?
      endpoint.onmessage = onMessage;
    }
  }

  async function onMessage(e: MessageEvent<MessageData<keyof Actions>>) {
    const { type, args, id } = e.data;
    const action = actions[type];

    if (action) {
      try {
        const result = await action(...args);

        // If we have a void based action, ignore postMessage back to main thread entirely
        if (result) {
          const [value, transferables] = result;

          endpoint.postMessage({ id, ok: value }, transferables ?? []);
        }
      } catch (error) {
        endpoint.postMessage({ id, error });
      }
    }
  }

  // IDEA: update isSharedWorker() function to check against the type of "self"
  // which when called inside the worker (via expose()) in theory should give
  // us the same effect as checking against the instance of the worker
  if (shared) {
    // @ts-expect-error FIXME: connect event is not recognized?
    endpoint.addEventListener('connect', onConnect);
  } else {
    endpoint.addEventListener('message', onMessage);
  }
}
