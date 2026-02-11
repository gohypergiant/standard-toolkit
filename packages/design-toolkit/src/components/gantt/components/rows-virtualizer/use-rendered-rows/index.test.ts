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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GANTT_ROW_HEIGHT_PX } from '../../../constants';
import { useGanttStore } from '../../../store';
import { deriveRenderedSlice } from '../../../utils/layout';
import { useRenderedRows } from './';

const mocks = vi.hoisted(() => {
  return {
    msPerPx: 2,
  };
});

vi.mock('../../../context', () => {
  const mock = {
    totalBounds: { startMs: 0, endMs: 1000 },
    msPerPx: mocks.msPerPx,
  } as const;

  return {
    useGanttContext: () => mock,
  };
});

describe('useRenderedRows', () => {
  beforeEach(() => {
    useGanttStore.setState(useGanttStore.getInitialState());
  });

  const children = Array.from(Array(10).keys()).map((i) =>
    React.createElement('div', { key: i }),
  );
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
    const { result } = renderHook(() => useRenderedRows({ children }));

    const expectedHeight = children.length * GANTT_ROW_HEIGHT_PX;
    const expectedWidth =
      (totalBounds.endMs - totalBounds.startMs) / mocks.msPerPx;

    expect(result.current.dimensions.height).toBe(expectedHeight);
    expect(result.current.dimensions.width).toBe(expectedWidth);
  });

  it('updates store with position and row scroll px when onScroll is called', () => {
    const { result } = renderHook(() => useRenderedRows({ children }));

    act(() => {
      result.current.onScroll(fakeEvent);
    });

    const { currentPositionMs, currentRowScrollPx } = useGanttStore.getState();

    expect(currentPositionMs).toBe(
      totalBounds.startMs + horizontalScrolledPixels * mocks.msPerPx,
    );
    expect(currentRowScrollPx).toBe(verticalScrolledPixels);
  });

  it('should rerender with expected values when element ref is assigned', () => {
    const elementHeight = 200;

    const { result } = renderHook(() => useRenderedRows({ children }));

    const fakeElement = {
      clientHeight: elementHeight,
    } as unknown as HTMLDivElement;

    act(() => {
      result.current.assignContainerRef(fakeElement);
    });

    const expectedSlice = deriveRenderedSlice(
      verticalScrolledPixels,
      elementHeight,
    );

    expect(result.current.renderedRows).toHaveLength(
      expectedSlice.end - expectedSlice.start,
    );

    // ensure the expected translateY values are applied to the rendered rows
    result.current.renderedRows?.forEach((row, index) => {
      expect(row.props.style?.transform ?? '').toContain(
        `translateY(${GANTT_ROW_HEIGHT_PX * index}px)`,
      );
    });
  });
});
