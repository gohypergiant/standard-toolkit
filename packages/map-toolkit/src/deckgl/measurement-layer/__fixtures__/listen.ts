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

import { vi } from 'vitest';
import type { BasicPayload, Broadcast } from '@accelint/bus';
import type { Mock } from 'vitest';

/**
 * Subscribe a `vi.fn()` to a bus event and record its unsubscribe function in
 * `offListeners` so the test's `afterEach` can release it.
 *
 * @param bus - Broadcast instance to subscribe on
 * @param event - Event type to listen for
 * @param offListeners - Collector for unsubscribe functions
 * @returns The mock listener, for call assertions
 */
export function listen<Events extends BasicPayload>(
  bus: Broadcast<Events>,
  event: Events['type'],
  offListeners: (() => void)[],
): Mock {
  const listener = vi.fn();

  offListeners.push(bus.on(event, listener));

  return listener;
}
