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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MS_PER_HOUR } from './constants';
import { selectors, useGanttStore } from './store';

describe('gantt store', () => {
  beforeEach(() => {
    useGanttStore.setState({ currentPositionMs: 0 });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initial state is 0 and setCurrentPositionMs updates it', () => {
    expect(selectors.currentPositionMs(useGanttStore.getState())).toBe(0);

    const newMs = 5000;
    useGanttStore.getState().setCurrentPositionMs(newMs);

    expect(selectors.currentPositionMs(useGanttStore.getState())).toBe(newMs);
  });

  it('roundedCurrentPositionMs returns interval-rounded time', () => {
    const value = 1738531200000;
    useGanttStore.setState({ currentPositionMs: value });

    const interval = MS_PER_HOUR;
    const result = selectors.roundedCurrentPositionMs(interval)(
      useGanttStore.getState(),
    );

    expect(result).toBe(1738530000000);
  });
});
