/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

type IteratorCallback<T> = () => IteratorResult<T>;

/**
 * Creates an iterable Iterator object with the given callback as the `next` method.
 * @param iterCb The `next` callback for an Iterator.
 */
export function createIterable<T>(
  iterCb: IteratorCallback<T>,
): IterableIterator<T> {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: iterCb,
  };
}
