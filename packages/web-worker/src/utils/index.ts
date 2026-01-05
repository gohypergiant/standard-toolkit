/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// TODO: grab from @accelint/core
export function uuid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

// TODO: move to @accelint/predicates
export function isBrowserContext(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// TODO: move to @accelint/predicates
export function isWorkerContext(): boolean {
  return (
    typeof self !== 'undefined' &&
    typeof Window === 'undefined' &&
    typeof self.postMessage === 'function'
  );
}

type Resolvers<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

// Polyfill for https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
export function withResolvers<T>(): Resolvers<T> {
  let resolve!: Resolvers<T>['resolve'];
  let reject!: Resolvers<T>['reject'];

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
