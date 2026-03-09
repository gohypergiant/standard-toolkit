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

import { afterEach, describe, expect, it, vi } from 'vitest';
import { GANTT_ROW_HEIGHT_PX, MS_PER_HOUR } from './constants';
import { createGanttStore, selectors } from './store';

describe('gantt store', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initial state is 0 and setCurrentPositionMs updates it', () => {
    const store = createGanttStore({ startTimeMs: 0 });

    expect(selectors.currentPositionMs(store.getState())).toBe(0);

    const newMs = 5000;
    store.getState().setCurrentPositionMs(newMs);

    expect(selectors.currentPositionMs(store.getState())).toBe(newMs);
  });

  it('roundedCurrentPositionMs returns interval-rounded time', () => {
    const store = createGanttStore({ startTimeMs: 0 });
    const value = 1738531200000;
    store.setState({ currentPositionMs: value });

    const interval = MS_PER_HOUR;
    const result = selectors.roundedCurrentPositionMs(interval)(
      store.getState(),
    );

    expect(result).toBe(1738530000000);
  });

  it('currentRowScrollPx initial state is 0 and setter updates it', () => {
    const store = createGanttStore({ startTimeMs: 0 });

    expect(store.getState().currentRowScrollPx).toBe(0);

    store.getState().setCurrentRowScrollPx(123);

    expect(store.getState().currentRowScrollPx).toBe(123);
  });

  it('roundedCurrentRowScrollPx returns value rounded down to row height', () => {
    const store = createGanttStore({ startTimeMs: 0 });
    const scrollPx = GANTT_ROW_HEIGHT_PX * 3 + 5;
    store.setState({ currentRowScrollPx: scrollPx });

    const rounded = selectors.roundedCurrentRowScrollPx(store.getState());

    expect(rounded).toBe(GANTT_ROW_HEIGHT_PX * 3);
  });
});
