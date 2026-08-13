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
import { describe, expect, it, vi } from 'vitest';
import { createGanttStoreProvider } from '../../__fixtures__/store-provider';
import { useGanttStoreApi } from '../../context/store';
import type { GanttState } from '../../store';
import { useLayoutSubscription } from '.';

describe('useLayoutSubscription', () => {
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
    const wrapper = createGanttStoreProvider({ startTimeMs: 0 });

    const { result } = renderHook(
      () => {
        const store = useGanttStoreApi();
        const hookResult = useLayoutSubscription({
          callback,
          selector: (state) => state.currentPositionMs,
        });
        return { hookResult, store };
      },
      { wrapper },
    );

    act(() => {
      result.current.store?.setState({ currentPositionMs: 500 });
    });

    // One call for initial mount, one for the store update
    expect(rafSpy).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(500);
  });

  it('re-subscribes when callback changes', () => {
    createRafSpy();
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const wrapper = createGanttStoreProvider({ startTimeMs: 100 });

    const { rerender, result } = renderHook(
      ({ cb }: { cb: (value: number) => void }) => {
        const store = useGanttStoreApi();
        useLayoutSubscription({
          callback: cb,
          selector: (state) => state.currentPositionMs,
        });
        return store;
      },
      { wrapper, initialProps: { cb: callback1 } },
    );

    expect(callback1).toHaveBeenCalledWith(100);
    expect(callback2).not.toHaveBeenCalled();

    // Change callback and update store
    rerender({ cb: callback2 });
    act(() => {
      result.current?.setState({ currentPositionMs: 200 });
    });

    expect(callback2).toHaveBeenCalledWith(200);
  });

  it('re-subscribes when selector changes', () => {
    createRafSpy();
    const callback = vi.fn();
    const selector1 = (state: GanttState) => state.currentPositionMs;
    const selector2 = (state: GanttState) => state.currentRowScrollPx;
    const wrapper = createGanttStoreProvider({ startTimeMs: 100 });

    const { rerender, result } = renderHook(
      ({ sel }: { sel: (state: GanttState) => number }) => {
        const store = useGanttStoreApi();
        useLayoutSubscription({
          callback,
          selector: sel,
        });
        return store;
      },
      { wrapper, initialProps: { sel: selector1 } },
    );

    expect(callback).toHaveBeenCalledWith(100);

    // Change selector and update store
    callback.mockClear();
    rerender({ sel: selector2 });
    act(() => {
      result.current?.setState({ currentRowScrollPx: 50 });
    });

    expect(callback).toHaveBeenCalledWith(50);
  });

  it('cancels pending animation frames on cleanup', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    const cancelRafSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const callback = vi.fn();
    const wrapper = createGanttStoreProvider({ startTimeMs: 0 });

    const { unmount } = renderHook(
      () => {
        useLayoutSubscription({
          callback,
          selector: (state) => state.currentPositionMs,
        });
      },
      { wrapper },
    );

    expect(rafSpy).toHaveBeenCalled();

    unmount();

    expect(cancelRafSpy).toHaveBeenCalled();
  });
});
