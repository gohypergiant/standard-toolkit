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

import { uuid } from '@accelint/core';
import { describe, expect, it } from 'vitest';
import { isActiveMap, setActiveMap } from './active-map-store';

// The store uses module-level state that persists across tests. Each test
// generates fresh uuids so assertions hold regardless of run order.
describe('active-map-store', () => {
  it('should mark a map as active after setActiveMap is called', () => {
    const id = uuid();

    setActiveMap(id);

    expect(isActiveMap(id)).toBe(true);
  });

  it('should not report unrelated ids as active', () => {
    const active = uuid();
    const other = uuid();

    setActiveMap(active);

    expect(isActiveMap(other)).toBe(false);
  });

  it('should report only the most recently set map as active', () => {
    const first = uuid();
    const second = uuid();

    setActiveMap(first);
    setActiveMap(second);

    expect(isActiveMap(first)).toBe(false);
    expect(isActiveMap(second)).toBe(true);
  });

  it('should be idempotent when setActiveMap is called with the current id', () => {
    const id = uuid();

    setActiveMap(id);
    setActiveMap(id);

    expect(isActiveMap(id)).toBe(true);
  });
});
