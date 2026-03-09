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

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createGanttStoreProvider } from '@/components/gantt/__fixtures__/store-provider';
import * as GanttContext from '@/components/gantt/context';
import { useGanttStoreApi } from '@/components/gantt/context/store';
import { useScrollSync } from './';
import type { GanttContextValue } from '@/components/gantt/context';

// Mock the useGanttContext hook
vi.mock('@/components/gantt/context', () => ({
  useGanttContext: vi.fn(),
}));

// Base context with only the properties used by the hook
const baseContextValue = {
  totalBounds: { startMs: 0, endMs: 1000 },
  msPerPx: 2,
} as GanttContextValue;

describe('useScrollSync', () => {
  const scrollToMock = vi.fn();
  // Only implementing the scrollTo method that's used in the hook
  const fakeElement = { scrollTo: scrollToMock } as unknown as HTMLDivElement;
  const wrapper = createGanttStoreProvider({ startTimeMs: 0 });

  beforeEach(() => {
    scrollToMock.mockClear();

    // Set up the default mock for useGanttContext
    vi.mocked(GanttContext.useGanttContext).mockReturnValue(baseContextValue);
  });

  it('should do nothing when scrollContainerElement is null', () => {
    renderHook(() => useScrollSync({ scrollContainerElement: null }), {
      wrapper,
    });

    // No scrollTo calls should happen with null element
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it('should reset scroll position when timestamp is outside data range', () => {
    // Initial render — store starts at currentPositionMs: 0, within bounds [0, 1000]
    const { rerender } = renderHook(
      () => {
        useScrollSync({
          scrollContainerElement: fakeElement,
        });
      },
      { wrapper },
    );

    // Initial render scrolls to a position — clear to isolate the reset call
    scrollToMock.mockClear();

    const updatedTotalBounds = { startMs: 100, endMs: 1000 };

    // Change bounds so that currentPositionMs: 0 is now outside the range
    vi.mocked(GanttContext.useGanttContext).mockReturnValue({
      ...baseContextValue,
      totalBounds: updatedTotalBounds,
    });

    rerender();

    // Should reset both axes
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      left: 0,
    });
  });

  it('should set horizontal scroll position based on currentPositionMs', () => {
    const { result } = renderHook(
      () => {
        const store = useGanttStoreApi();
        const hookResult = useScrollSync({
          scrollContainerElement: fakeElement,
        });
        return { hookResult, store };
      },
      { wrapper },
    );

    // Set current position in store to a value within bounds
    const currentPositionMs = 500;
    result.current.store?.setState({ currentPositionMs });

    // Should call scrollTo with a calculated position. Just verifying it
    // was called with a numeric value.
    expect(scrollToMock).toHaveBeenCalledWith({
      left: expect.any(Number),
    });
  });

  it('should react to changes in totalBounds', () => {
    // Initial render
    const { rerender } = renderHook(
      () => useScrollSync({ scrollContainerElement: fakeElement }),
      { wrapper },
    );

    expect(scrollToMock).toHaveBeenCalled();
    scrollToMock.mockClear();

    // Update the context mock with new bounds
    vi.mocked(GanttContext.useGanttContext).mockReturnValue({
      ...baseContextValue,
      totalBounds: { startMs: 100, endMs: 2000 },
    });

    // Re-render with same props to trigger effect due to context change
    rerender({ scrollContainerElement: fakeElement });

    // Should call scrollTo again with the new context values
    expect(scrollToMock).toHaveBeenCalled();
  });

  it('should react to changes in msPerPx', () => {
    // Initial render
    const { rerender } = renderHook(
      () => useScrollSync({ scrollContainerElement: fakeElement }),
      { wrapper },
    );

    expect(scrollToMock).toHaveBeenCalled();
    scrollToMock.mockClear();

    // Update the context mock with new msPerPx
    vi.mocked(GanttContext.useGanttContext).mockReturnValue({
      ...baseContextValue,
      msPerPx: 4,
    });

    // Re-render with same props to trigger effect due to context change
    rerender({ scrollContainerElement: fakeElement });

    // Should call scrollTo again with the new context values
    expect(scrollToMock).toHaveBeenCalled();
  });

  it('should react to changes in scrollContainerElement', () => {
    let element: HTMLDivElement | null = null;

    // Initial render with null element
    const { rerender } = renderHook(
      () => useScrollSync({ scrollContainerElement: element }),
      { wrapper },
    );

    expect(scrollToMock).not.toHaveBeenCalled();

    // Re-render with non-null element
    element = fakeElement;
    rerender();

    // Should call scrollTo now that we have an element
    expect(scrollToMock).toHaveBeenCalled();
  });
});
