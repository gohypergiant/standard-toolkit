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
import * as GanttContext from '@/components/gantt/context';
import { useGanttStore } from '@/components/gantt/store';
import * as layoutUtils from '@/components/gantt/utils/layout';
import * as thresholdUtils from '@/components/gantt/utils/thresholds';
import { useTotalDataRegionThresholds } from './index';
import type { GanttContextValue } from '@/components/gantt/context';
import type { MetThresholdData } from '@/components/gantt/types';

vi.mock('@/components/gantt/context', () => ({
  useGanttContext: vi.fn(),
}));
vi.mock('@/components/gantt/store');
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
  const mockRoundedCurrentRowScrollPx = 100;
  const mockMetThresholds: MetThresholdData[] = [
    {
      axis: 'horizontal',
      direction: 'start',
      value: 3000,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(GanttContext.useGanttContext).mockReturnValue(baseContextValue);

    vi.mocked(useGanttStore).mockReturnValue(mockRoundedCurrentRowScrollPx);

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

    renderHook(() =>
      useTotalDataRegionThresholds({
        totalRowsCount: 10,
        scrollContainerElement: mockScrollContainerElement,
      }),
    );

    expect(mockOnThresholdMet).not.toHaveBeenCalled();
  });

  it('should not call onThresholdMet when shouldExamineThresholds returns false', () => {
    vi.mocked(thresholdUtils.shouldExamineThresholds).mockReturnValue(false);

    renderHook(() =>
      useTotalDataRegionThresholds({
        totalRowsCount: 10,
        scrollContainerElement: mockScrollContainerElement,
      }),
    );

    expect(mockOnThresholdMet).not.toHaveBeenCalled();
  });

  it('should call onThresholdMet when thresholds are met', () => {
    vi.mocked(thresholdUtils.examineThresholds).mockReturnValue(
      mockMetThresholds,
    );

    renderHook(() =>
      useTotalDataRegionThresholds({
        totalRowsCount: 10,
        scrollContainerElement: mockScrollContainerElement,
      }),
    );

    expect(mockOnThresholdMet).toHaveBeenCalledWith(mockMetThresholds);
  });

  it('should not call onThresholdMet when no thresholds are met', () => {
    renderHook(() =>
      useTotalDataRegionThresholds({
        totalRowsCount: 10,
        scrollContainerElement: mockScrollContainerElement,
      }),
    );

    expect(mockOnThresholdMet).not.toHaveBeenCalled();
  });

  it('should re-run effect when props change', () => {
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
      },
    );

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(1);

    rerender({
      totalRowsCount: 20,
      scrollContainerElement: mockScrollContainerElement,
    });

    expect(mockOnThresholdMet).toHaveBeenCalledTimes(2);
  });
});
