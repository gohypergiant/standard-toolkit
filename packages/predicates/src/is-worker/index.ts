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

/**
 * Determines if given value is a Worker.
 *
 * @param val - The value to check whether or not it is a worker.
 * @returns True if the value is a Worker instance, false otherwise.
 *
 * @example
 * ```typescript
 * import { isWorker } from '@accelint/predicates/is-worker';
 *
 * const worker = new Worker(new URL('./my-worker.ts', import.meta.url));
 * isWorker(worker);              // true
 * isWorker(new SharedWorker(new URL('./shared.ts', import.meta.url))); // false
 * isWorker({});                  // false
 * ```
 */
export function isWorker(val: unknown) {
  return val instanceof Worker;
}

/**
 * Determine if the given value is a SharedWorker.
 *
 * @param val - The value to check whether or not it is a shared worker.
 * @returns True if the value is a SharedWorker instance, false otherwise.
 *
 * @example
 * ```typescript
 * import { isSharedWorker } from '@accelint/predicates/is-worker';
 *
 * const sharedWorker = new SharedWorker(new URL('./shared.ts', import.meta.url));
 * isSharedWorker(sharedWorker);  // true
 * isSharedWorker(new Worker(new URL('./worker.ts', import.meta.url))); // false
 * isSharedWorker({});            // false
 * ```
 */
export function isSharedWorker(val: unknown) {
  return val instanceof SharedWorker;
}
