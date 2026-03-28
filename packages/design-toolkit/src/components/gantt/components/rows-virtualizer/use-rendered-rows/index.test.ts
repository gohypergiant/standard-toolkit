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
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createGanttStoreProvider } from '@/components/gantt/__fixtures__/store-provider';
import { useGanttStoreApi } from '@/components/gantt/context/store';
import { deriveRenderedSlice } from '@/components/gantt/utils/layout';
import { useRenderedRows } from './';

vi.mock('@/components/gantt/hooks/use-scrollbar-height', () => ({
  useScrollbarHeight: vi.fn(() => 0),
}));

const mocks = vi.hoisted(() => ({
  rowHeightPx: 40,
}));

// Mock useGanttContext to return our test values
vi.mock('@/components/gantt/context', () => ({
  GanttContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
  useGanttContext: () => ({
    ganttContentElement: null,
    headerElement: null,
    rootElement: null,
    ganttPanelElement: null,
    timelineContainerElement: null,
    rowHeightPx: mocks.rowHeightPx,
    assignTimelineContainerElementRef: vi.fn(),
    assignHeaderElementRef: vi.fn(),
    assignRootElementRef: vi.fn(),
    assignGanttContentElementRef: vi.fn(),
    assignGanttPanelElementRef: vi.fn(),
  }),
}));

describe('useRenderedRows', () => {
  const children = Array.from(Array(10).keys()).map((i) =>
    React.createElement('div', { key: i }),
  );

  const wrapper = createGanttStoreProvider({ startTimeMs: 0 });
  const heightPx = 400;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns total height based on children count', () => {
    const { result } = renderHook(
      () => useRenderedRows({ children, heightPx }),
      { wrapper },
    );

    const expectedHeight = children.length * mocks.rowHeightPx;
    expect(result.current.height).toBe(expectedHeight);
  });

  it('renders slice of rows based on scroll position in store', () => {
    const { result, rerender } = renderHook(
      () => {
        const store = useGanttStoreApi();
        const hook = useRenderedRows({ children, heightPx });
        return { hook, store };
      },
      { wrapper },
    );

    // Set scroll position in store
    const scrollPx = mocks.rowHeightPx * 2; // 80px
    act(() => {
      result.current.store.setState({ currentRowScrollPx: scrollPx });
    });
    rerender();

    // Should render a subset of rows, not all children
    expect(result.current.hook.renderedRows?.length).toBeLessThan(
      children.length,
    );
    expect(result.current.hook.renderedRows?.length).toBeGreaterThan(0);
  });

  it('applies correct translateY to rendered rows based on slice start', () => {
    const { result, rerender } = renderHook(
      () => {
        const store = useGanttStoreApi();
        const hook = useRenderedRows({ children, heightPx });
        return { hook, store };
      },
      { wrapper },
    );

    // Set scroll to render rows starting at index 2
    const scrollPx = mocks.rowHeightPx * 2; // 80px
    act(() => {
      result.current.store.setState({ currentRowScrollPx: scrollPx });
    });
    rerender();

    const { start } = deriveRenderedSlice(
      scrollPx,
      mocks.rowHeightPx,
      heightPx,
    );

    result.current.hook.renderedRows?.forEach((row, index) => {
      const expectedTranslateY = mocks.rowHeightPx * (start + index);
      expect(row.props.style?.transform ?? '').toContain(
        `translateY(${expectedTranslateY}px)`,
      );
    });
  });

  it('sets virtualizedHeightPx in store', () => {
    const { result } = renderHook(
      () => {
        const store = useGanttStoreApi();
        const hook = useRenderedRows({ children, heightPx });
        return { hook, store };
      },
      { wrapper },
    );

    const expectedVirtualizedHeight = children.length * mocks.rowHeightPx;
    expect(result.current.store.getState().virtualizedHeightPx).toBe(
      expectedVirtualizedHeight,
    );
  });
});
