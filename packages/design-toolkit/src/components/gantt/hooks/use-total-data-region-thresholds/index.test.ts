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
import * as layoutUtils from '@/components/gantt/utils/layout';
import * as thresholdUtils from '@/components/gantt/utils/thresholds';
import { useTotalDataRegionThresholds } from './index';
import type { GanttContextValue } from '@/components/gantt/context';
import type { MetThresholdData } from '@/components/gantt/types';

vi.mock('@/components/gantt/context', () => ({
  useGanttContext: vi.fn(),
}));
vi.mock('@/components/gantt/utils/layout');
vi.mock('@/components/gantt/utils/thresholds', async () => {
  const actual = await vi.importActual('@/components/gantt/utils/thresholds');
  return {
    ...actual,
    shouldExamineThresholds: vi.fn(),
    deriveTotalDataRegion: vi.fn(),
    deriveRenderedRegion: vi.fn(),
    deriveTemporalThresholds: vi.fn(),
    deriveRowIndexThresholds: vi.fn(),
    examineThresholds: vi.fn(),
  };
});

describe('useTotalDataRegionThresholds', () => {
  const mockTotalBounds = { startMs: 1000, endMs: 10000 };
  const mockRenderedRegionBounds = { startMs: 2000, endMs: 8000 };
  const mockTimescale = '1h';
  const mockThreshold = {
    timescaleMultipleDistance: 2,
    rowIndexBoundaryDistance: 2,
  };
  const mockOnThresholdMet = vi.fn();

  const baseContextValue = {
    totalBounds: mockTotalBounds,
    renderedRegionBounds: mockRenderedRegionBounds,
    threshold: mockThreshold,
    onThresholdMet: mockOnThresholdMet,
    timescale: mockTimescale,
  } as unknown as GanttContextValue;

  const mockScrollContainerElement = {
    clientHeight: 500,
  } as HTMLDivElement;
  const mockRenderedSlice = { start: 2, end: 7 };
  const mockMetThresholds: MetThresholdData[] = [
    {
      axis: 'horizontal',
      direction: 'start',
      value: 3000,
    },
  ];

  const wrapper = createGanttStoreProvider({ startTimeMs: 0 });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(GanttContext.useGanttContext).mockReturnValue(baseContextValue);

    vi.mocked(layoutUtils.deriveRenderedSlice).mockReturnValue(
      mockRenderedSlice,
    );

    vi.mocked(thresholdUtils.shouldExamineThresholds).mockReturnValue(true);
    vi.mocked(thresholdUtils.deriveTotalDataRegion).mockReturnValue({
      startMs: mockTotalBounds.startMs,
      endMs: mockTotalBounds.endMs,
      startRowIndex: 0,
      endRowIndex: 9,
    });
    vi.mocked(thresholdUtils.deriveRenderedRegion).mockReturnValue({
      startMs: mockRenderedRegionBounds.startMs,
      endMs: mockRenderedRegionBounds.endMs,
      startRowIndex: mockRenderedSlice.start,
      endRowIndex: mockRenderedSlice.end - 1,
    });
    vi.mocked(thresholdUtils.deriveTemporalThresholds).mockReturnValue({
      start: 3000,
      end: 8000,
    });
    vi.mocked(thresholdUtils.deriveRowIndexThresholds).mockReturnValue({
      start: 2,
      end: 7,
    });
    vi.mocked(thresholdUtils.examineThresholds).mockReturnValue([]);
  });

  it('should not call onThresholdMet when threshold is not specified', () => {
    vi.mocked(GanttContext.useGanttContext).mockReturnValue({
      ...baseContextValue,
      threshold: undefined,
      onThresholdMet: undefined,
    });

    renderHook(
      () =>
        useTotalDataRegionThresholds({
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        }),
      { wrapper },
    );

    expect(mockOnThresholdMet).not.toHaveBeenCalled();
  });

  it('should not call onThresholdMet when shouldExamineThresholds returns false', () => {
    vi.mocked(thresholdUtils.shouldExamineThresholds).mockReturnValue(false);

    renderHook(
      () =>
        useTotalDataRegionThresholds({
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        }),
      { wrapper },
    );

    expect(mockOnThresholdMet).not.toHaveBeenCalled();
  });

  it('should call onThresholdMet when thresholds are met', () => {
    vi.mocked(thresholdUtils.examineThresholds).mockReturnValue(
      mockMetThresholds,
    );

    renderHook(
      () =>
        useTotalDataRegionThresholds({
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        }),
      { wrapper },
    );

    expect(mockOnThresholdMet).toHaveBeenCalledWith(mockMetThresholds);
  });

  it('should not call onThresholdMet when no thresholds are met', () => {
    renderHook(
      () =>
        useTotalDataRegionThresholds({
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        }),
      { wrapper },
    );

    expect(mockOnThresholdMet).not.toHaveBeenCalled();
  });

  it('should re-run effect when props change and thresholds are newly entered', () => {
    vi.mocked(thresholdUtils.examineThresholds)
      .mockReturnValueOnce([])
      .mockReturnValueOnce(mockMetThresholds);

    const { rerender } = renderHook(
      (props) => useTotalDataRegionThresholds(props),
      {
        initialProps: {
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        },
        wrapper,
      },
    );

    expect(mockOnThresholdMet).not.toHaveBeenCalled();

    rerender({
      totalRowsCount: 20,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);
    expect(mockOnThresholdMet).toHaveBeenCalledWith(mockMetThresholds);
  });

  it('should not call onThresholdMet again when same threshold remains met across re-renders', () => {
    vi.mocked(thresholdUtils.examineThresholds).mockReturnValue(
      mockMetThresholds,
    );

    const { rerender } = renderHook(
      (props) => useTotalDataRegionThresholds(props),
      {
        initialProps: {
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        },
        wrapper,
      },
    );

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);

    rerender({
      totalRowsCount: 20,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);
  });

  it('should call onThresholdMet again after threshold is left and re-entered', () => {
    vi.mocked(thresholdUtils.examineThresholds)
      .mockReturnValueOnce(mockMetThresholds) // enter
      .mockReturnValueOnce([]) // leave
      .mockReturnValueOnce(mockMetThresholds); // re-enter

    const { rerender } = renderHook(
      (props) => useTotalDataRegionThresholds(props),
      {
        initialProps: {
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        },
        wrapper,
      },
    );

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);

    rerender({
      totalRowsCount: 20,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);

    rerender({
      totalRowsCount: 30,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(2);
  });

  it('should only call onThresholdMet for newly entered thresholds', () => {
    const alreadyMet: MetThresholdData[] = [
      { axis: 'horizontal', direction: 'start', value: 3000 },
    ];
    const newlyMet: MetThresholdData[] = [
      { axis: 'vertical', direction: 'end', value: 7 },
    ];

    vi.mocked(thresholdUtils.examineThresholds)
      .mockReturnValueOnce(alreadyMet)
      .mockReturnValueOnce([...alreadyMet, ...newlyMet]);

    const { rerender } = renderHook(
      (props) => useTotalDataRegionThresholds(props),
      {
        initialProps: {
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        },
        wrapper,
      },
    );

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);
    expect(mockOnThresholdMet).toHaveBeenCalledWith(alreadyMet);

    rerender({
      totalRowsCount: 20,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(2);
    expect(mockOnThresholdMet).toHaveBeenLastCalledWith(newlyMet);
  });

  it('should call onThresholdMet again when the same axis/direction threshold is met with a new value', () => {
    const firstMet: MetThresholdData[] = [
      { axis: 'horizontal', direction: 'start', value: 3000 },
    ];
    const changedValue: MetThresholdData[] = [
      { axis: 'horizontal', direction: 'start', value: 4000 },
    ];

    vi.mocked(thresholdUtils.examineThresholds)
      .mockReturnValueOnce(firstMet)
      .mockReturnValueOnce(changedValue);

    const { rerender } = renderHook(
      (props) => useTotalDataRegionThresholds(props),
      {
        initialProps: {
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        },
        wrapper,
      },
    );

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);

    rerender({
      totalRowsCount: 20,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(2);
    expect(mockOnThresholdMet).toHaveBeenLastCalledWith(changedValue);
  });

  it('should call onThresholdMet again after projection is reset by an early return', () => {
    vi.mocked(thresholdUtils.examineThresholds)
      .mockReturnValueOnce(mockMetThresholds)
      .mockReturnValueOnce(mockMetThresholds);

    const { rerender } = renderHook(
      (props) => useTotalDataRegionThresholds(props),
      {
        initialProps: {
          totalRowsCount: 10,
          scrollContainerElement: mockScrollContainerElement,
        },
        wrapper,
      },
    );

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);

    // Trigger early return — projection should be reset
    vi.mocked(thresholdUtils.shouldExamineThresholds).mockReturnValueOnce(
      false,
    );
    rerender({
      totalRowsCount: 0,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);

    // Examination resumes — same thresholds should fire again
    rerender({
      totalRowsCount: 10,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(2);
    expect(mockOnThresholdMet).toHaveBeenLastCalledWith(mockMetThresholds);
  });
});
