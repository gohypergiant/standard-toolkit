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
import { describe, expect, it } from 'vitest';
import { isSharedWorker, isWorker } from './';

const workerUrl = new URL('./__fixtures__/worker.ts', import.meta.url);

describe('worker validators', () => {
  it.each`
    label             | value                          | isShared | isWorker
    ${'array'}        | ${[]}                          | ${false} | ${false}
    ${'object'}       | ${{}}                          | ${false} | ${false}
    ${'function'}     | ${() => void 0}                | ${false} | ${false}
    ${'SharedWorker'} | ${new SharedWorker(workerUrl)} | ${true}  | ${false}
    ${'Worker'}       | ${new Worker(workerUrl)}       | ${false} | ${true}
  `('$label', ({ value, ...expected }) => {
    expect(isSharedWorker(value)).toBe(expected.isShared);
    expect(isWorker(value)).toBe(expected.isWorker);
  });
});
