/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * You may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { act, renderHook } from '@testing-library/react';
import React, { type UIEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createGanttStoreProvider } from '@/components/gantt/__fixtures__/store-provider';
import { GANTT_ROW_HEIGHT_PX } from '@/components/gantt/constants';
import { useGanttStoreApi } from '@/components/gantt/context/store';
import { deriveRenderedSlice } from '@/components/gantt/utils/layout';
import { useRenderedRows } from './';

const mocks = vi.hoisted(() => {
  return {
    msPerPx: 2,
  };
});

vi.mock('@/components/gantt/context', () => {
  const mock = {
    totalBounds: { startMs: 0, endMs: 1000 },
    msPerPx: mocks.msPerPx,
  } as const;

  return {
    useGanttContext: () => mock,
  };
});

describe('useRenderedRows', () => {
  const children = Array.from(Array(10).keys()).map((i) =>
    React.createElement('div', { key: i }),
  );

  const wrapper = createGanttStoreProvider({ startTimeMs: 0 });
  const horizontalScrolledPixels = 50;
  const verticalScrolledPixels = 100;
  const fakeEvent = {
    currentTarget: {
      scrollLeft: horizontalScrolledPixels,
      scrollTop: verticalScrolledPixels,
    },
  } as unknown as UIEvent<HTMLDivElement>;
  const totalBounds = { startMs: 0, endMs: 1000 };

  it('computes dimensions from context and children count', () => {
    const { result } = renderHook(
      () => useRenderedRows({ children, scrollContainerElement: null }),
      { wrapper },
    );

    const expectedHeight = children.length * GANTT_ROW_HEIGHT_PX;
    const expectedWidth =
      (totalBounds.endMs - totalBounds.startMs) / mocks.msPerPx;

    expect(result.current.dimensions.height).toBe(expectedHeight);
    expect(result.current.dimensions.width).toBe(expectedWidth);
  });

  it('updates store with position and row scroll px when onScroll is called', () => {
    const { result } = renderHook(
      () => {
        const hookResult = useRenderedRows({
          children,
          scrollContainerElement: null,
        });
        const store = useGanttStoreApi();
        return { hook: hookResult, store };
      },
      { wrapper },
    );

    act(() => {
      result.current.hook.onScroll(fakeEvent);
    });

    const state = result.current.store?.getState();
    expect(state?.currentPositionMs).toBe(
      totalBounds.startMs + horizontalScrolledPixels * mocks.msPerPx,
    );
    expect(state?.currentRowScrollPx).toBe(verticalScrolledPixels);
  });

  it('should apply correct translateY to rendered rows based on vertical scroll', () => {
    const { result } = renderHook(
      () => useRenderedRows({ children, scrollContainerElement: null }),
      { wrapper },
    );

    act(() => {
      result.current.onScroll({
        ...fakeEvent,
        currentTarget: {
          ...fakeEvent.currentTarget,
          scrollTop: 0,
        },
      });
    });

    // The translateY for each row should be based on its index and the row height
    result.current.renderedRows?.forEach((row, index) => {
      expect(row.props.style?.transform ?? '').toContain(
        `translateY(${GANTT_ROW_HEIGHT_PX * index}px)`,
      );
    });
  });

  it('should render with expected values when scrollContainerElement is provided', () => {
    const elementHeight = 200;

    const fakeElement = {
      clientHeight: elementHeight,
    } as unknown as HTMLDivElement;

    const { result } = renderHook(
      () => useRenderedRows({ children, scrollContainerElement: fakeElement }),
      { wrapper },
    );

    act(() => {
      result.current.onScroll({
        currentTarget: {
          scrollLeft: 0,
          scrollTop: verticalScrolledPixels,
        },
      } as unknown as UIEvent<HTMLDivElement>);
    });

    const expectedSlice = deriveRenderedSlice(
      verticalScrolledPixels,
      elementHeight,
    );

    expect(result.current.renderedRows).toHaveLength(
      expectedSlice.end - expectedSlice.start,
    );
    expect(result.current.dimensions.height).toBe(
      children.length * GANTT_ROW_HEIGHT_PX,
    );
    expect(result.current.dimensions.width).toBe(
      (totalBounds.endMs - totalBounds.startMs) / mocks.msPerPx,
    );
  });
});
