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

import '@vitest/web-worker';
import { describe, it, expect } from 'vitest';
import { isSharedWorker, isWorker } from './';

const nonWorkerPairs = [
  ['array', []],
  ['object', {}],
  [
    'function',
    () => {
      // noop
    },
  ],
] as const;

const workerUrl = new URL('./__fixtures__/worker.ts', import.meta.url);
const sharedWorker = new SharedWorker(workerUrl);
const worker = new Worker(workerUrl);

describe('worker validators', () => {
  expect(isSharedWorker(sharedWorker)).toBeTruthy();
  expect(isSharedWorker(worker)).toBeFalsy();
  expect(isWorker(worker)).toBeTruthy();
  expect(isWorker(sharedWorker)).toBeFalsy();

  for (const pair of nonWorkerPairs) {
    it(`isSharedWorker: ${pair[0]}`, () => {
      expect(isSharedWorker(pair[1])).toBeFalsy();
    });

    it(`isWorker: ${pair[0]}`, () => {
      expect(isWorker(pair[1])).toBeFalsy();
    });
  }
});
