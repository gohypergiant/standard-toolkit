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

import { act, renderHook } from '@testing-library/react';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGanttStore } from '../../store';
import { useLayoutSubscription } from './index';

describe('useLayoutSubscription', () => {
  beforeEach(() => {
    useGanttStore.setState({ currentPositionMs: 0 });
  });

  afterAll(() => vi.restoreAllMocks());

  const createRafSpy = () => {
    return vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        cb(0);
        return 1;
      });
  };

  it('calls callback within effect (on render + store update)', () => {
    const rafSpy = createRafSpy();
    const callback = vi.fn();

    renderHook(() =>
      useLayoutSubscription({
        callback,
        selector: (state) => state.currentPositionMs,
      }),
    );

    act(() => {
      useGanttStore.setState({ currentPositionMs: 500 });
    });

    // One call for initial mount, one for the store update
    expect(rafSpy).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(500);
  });
});
