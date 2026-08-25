// __private-exports
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
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import { MockEventSource, MockWebSocket } from './utils';

expect.extend(matchers);

// jsdom ships neither EventSource nor WebSocket. Keep constructible mocks
// installed for the whole run so late React commits (e.g. a self-healing
// hook re-rendering after a test's afterEach restored the global) never hit
// `new undefined()`. Individual tests still install their own instances via
// beforeEach when they need to inspect them.
if (!('EventSource' in globalThis) || globalThis.EventSource === undefined) {
  // @ts-expect-error - test double
  globalThis.EventSource = MockEventSource;
}
if (!('WebSocket' in globalThis) || globalThis.WebSocket === undefined) {
  // @ts-expect-error - test double
  globalThis.WebSocket = MockWebSocket;
}

// Unmount everything at the end of each test's teardown. Registered here
// (before any test-file afterEach) so vitest's stack ordering runs it LAST:
// a hook left mounted through a test's own afterEach (e.g. client.clear())
// schedules a self-heal re-render, and this cleanup flushes + unmounts it
// inside the same test's teardown window instead of letting it leak into
// the next test.
afterEach(() => {
  cleanup();
});
