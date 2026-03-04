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

import { describe, expect, it } from 'vitest';
import { TIMESCALE_MAPPING } from '../constants';
import {
  deriveRenderedRegion,
  deriveRowIndexThresholds,
  deriveTemporalThresholds,
  deriveTotalDataRegion,
  examineThresholds,
  shouldExamineThresholds,
} from './thresholds';
import type { GanttRegion, Threshold } from '../types';

describe('deriveTotalDataRegion', () => {
  it('should derive total data region correctly', () => {
    const totalRowsCount = 10;
    const totalBounds = { startMs: 1000, endMs: 2000 };

    const result = deriveTotalDataRegion(totalRowsCount, totalBounds);

    expect(result).toEqual({
      startMs: 1000,
      endMs: 2000,
      startRowIndex: 0,
      endRowIndex: 9,
    });
  });
});

describe('deriveRenderedRegion', () => {
  it('should derive rendered region correctly', () => {
    const renderedSlice = { start: 2, end: 7 };
    const renderedRegionBounds = { startMs: 1200, endMs: 1800 };

    const result = deriveRenderedRegion(renderedSlice, renderedRegionBounds);

    expect(result).toEqual({
      startMs: 1200,
      endMs: 1800,
      startRowIndex: 2,
      endRowIndex: 6, // end - 1 since end is exclusive
    });
  });
});

describe('deriveTemporalThresholds', () => {
  it('should derive temporal thresholds correctly', () => {
    const threshold: Threshold = {
      timescaleMultipleDistance: 2,
      rowIndexBoundaryDistance: 1,
    };
    const totalDataRegion: GanttRegion = {
      startMs: 1000000000,
      endMs: 1100000000,
      startRowIndex: 0,
      endRowIndex: 9,
    };
    const timescale = '1h';
    const timescaleMs = TIMESCALE_MAPPING[timescale];

    const result = deriveTemporalThresholds(
      threshold,
      totalDataRegion,
      timescale,
    );

    expect(result).toEqual({
      start: 1000000000 + 2 * timescaleMs,
      end: 1100000000 - 2 * timescaleMs,
    });
  });

  it('should return null if timescaleMultipleDistance is negative', () => {
    const threshold: Threshold = {
      timescaleMultipleDistance: -1,
      rowIndexBoundaryDistance: 1,
    };
    const totalDataRegion: GanttRegion = {
      startMs: 1000,
      endMs: 10000,
      startRowIndex: 0,
      endRowIndex: 9,
    };
    const timescale = '1h';

    const result = deriveTemporalThresholds(
      threshold,
      totalDataRegion,
      timescale,
    );

    expect(result).toBeNull();
  });

  it('should return null if derived thresholds are invalid', () => {
    const threshold: Threshold = {
      timescaleMultipleDistance: 10, // Very large value to create invalid thresholds
      rowIndexBoundaryDistance: 1,
    };
    const totalDataRegion: GanttRegion = {
      startMs: 1000,
      endMs: 10000,
      startRowIndex: 0,
      endRowIndex: 9,
    };
    const timescale = '1h';

    const result = deriveTemporalThresholds(
      threshold,
      totalDataRegion,
      timescale,
    );

    expect(result).toBeNull();
  });
});

describe('deriveRowIndexThresholds', () => {
  it('should derive row index thresholds correctly', () => {
    const threshold: Threshold = {
      timescaleMultipleDistance: 2,
      rowIndexBoundaryDistance: 2,
    };
    const totalDataRegion: GanttRegion = {
      startMs: 1000,
      endMs: 10000,
      startRowIndex: 0,
      endRowIndex: 9,
    };

    const result = deriveRowIndexThresholds(threshold, totalDataRegion);

    expect(result).toEqual({
      start: 2, // startRowIndex + rowIndexBoundaryDistance
      end: 7, // endRowIndex - rowIndexBoundaryDistance
    });
  });

  it('should return null if rowIndexBoundaryDistance is negative', () => {
    const threshold: Threshold = {
      timescaleMultipleDistance: 2,
      rowIndexBoundaryDistance: -1,
    };
    const totalDataRegion: GanttRegion = {
      startMs: 1000,
      endMs: 10000,
      startRowIndex: 0,
      endRowIndex: 9,
    };

    const result = deriveRowIndexThresholds(threshold, totalDataRegion);

    expect(result).toBeNull();
  });

  it('should return null if derived thresholds are invalid', () => {
    const threshold: Threshold = {
      timescaleMultipleDistance: 2,
      rowIndexBoundaryDistance: 10, // Too large for the given data region
    };
    const totalDataRegion: GanttRegion = {
      startMs: 1000,
      endMs: 10000,
      startRowIndex: 0,
      endRowIndex: 9,
    };

    const result = deriveRowIndexThresholds(threshold, totalDataRegion);

    expect(result).toBeNull();
  });
});

describe('examineThresholds', () => {
  const renderedRegion: GanttRegion = {
    startMs: 1500,
    endMs: 8500,
    startRowIndex: 1,
    endRowIndex: 6,
  };

  it('should return empty array if no thresholds are met', () => {
    const temporalThresholds = { start: 1000, end: 9000 };
    const rowIndexThresholds = { start: 0, end: 8 };

    const result = examineThresholds(
      renderedRegion,
      temporalThresholds,
      rowIndexThresholds,
    );

    expect(result).toEqual([]);
  });

  it('should detect when start temporal threshold is met', () => {
    const temporalThresholds = { start: 1600, end: 9000 };
    const rowIndexThresholds = { start: 0, end: 8 };

    const result = examineThresholds(
      renderedRegion,
      temporalThresholds,
      rowIndexThresholds,
    );

    expect(result).toContainEqual({
      axis: 'horizontal',
      direction: 'start',
      value: 1600,
    });
  });

  it('should detect when end temporal threshold is met', () => {
    const temporalThresholds = { start: 1000, end: 8000 };
    const rowIndexThresholds = { start: 0, end: 8 };

    const result = examineThresholds(
      renderedRegion,
      temporalThresholds,
      rowIndexThresholds,
    );

    expect(result).toContainEqual({
      axis: 'horizontal',
      direction: 'end',
      value: 8000,
    });
  });

  it('should detect when start row index threshold is met', () => {
    const temporalThresholds = { start: 1000, end: 9000 };
    const rowIndexThresholds = { start: 2, end: 8 };

    const result = examineThresholds(
      renderedRegion,
      temporalThresholds,
      rowIndexThresholds,
    );

    expect(result).toContainEqual({
      axis: 'vertical',
      direction: 'start',
      value: 2,
    });
  });

  it('should detect when end row index threshold is met', () => {
    const temporalThresholds = { start: 1000, end: 9000 };
    const rowIndexThresholds = { start: 0, end: 6 };

    const result = examineThresholds(
      renderedRegion,
      temporalThresholds,
      rowIndexThresholds,
    );

    expect(result).toContainEqual({
      axis: 'vertical',
      direction: 'end',
      value: 6,
    });
  });

  it('should handle null threshold values', () => {
    const result = examineThresholds(renderedRegion, null, null);
    expect(result).toEqual([]);
  });

  it('should detect multiple thresholds met simultaneously', () => {
    const temporalThresholds = { start: 1600, end: 8000 };
    const rowIndexThresholds = { start: 2, end: 6 };
    const result = examineThresholds(
      renderedRegion,
      temporalThresholds,
      rowIndexThresholds,
    );
    expect(result).toEqual([
      { axis: 'horizontal', direction: 'start', value: 1600 },
      { axis: 'horizontal', direction: 'end', value: 8000 },
      { axis: 'vertical', direction: 'start', value: 2 },
      { axis: 'vertical', direction: 'end', value: 6 },
    ]);
  });
});

describe('shouldExamineThresholds', () => {
  const validThreshold: Threshold = {
    timescaleMultipleDistance: 2,
    rowIndexBoundaryDistance: 1,
  };
  const scrollContainerElement = {
    clientHeight: 500,
  };

  it('should return true when all parameters are valid', () => {
    const result = shouldExamineThresholds(
      10,
      scrollContainerElement,
      validThreshold,
    );
    expect(result).toBe(true);
  });

  it('should return false when threshold is undefined', () => {
    const result = shouldExamineThresholds(
      10,
      scrollContainerElement,
      undefined,
    );
    expect(result).toBe(false);
  });

  it('should return false when totalRowsCount is 0', () => {
    const result = shouldExamineThresholds(
      0,
      scrollContainerElement,
      validThreshold,
    );
    expect(result).toBe(false);
  });

  it('should return false when scrollContainerElement is null', () => {
    const result = shouldExamineThresholds(10, null, validThreshold);
    expect(result).toBe(false);
  });

  it('should return false when scrollContainerElement.clientHeight is 0', () => {
    const element = { clientHeight: 0 };
    const result = shouldExamineThresholds(10, element, validThreshold);
    expect(result).toBe(false);
  });

  it('should return false when threshold values are negative', () => {
    const negativeThreshold: Threshold = {
      timescaleMultipleDistance: -1,
      rowIndexBoundaryDistance: 1,
    };
    const result = shouldExamineThresholds(
      10,
      scrollContainerElement,
      negativeThreshold,
    );
    expect(result).toBe(false);

    const negativeThreshold2: Threshold = {
      timescaleMultipleDistance: 1,
      rowIndexBoundaryDistance: -1,
    };
    const result2 = shouldExamineThresholds(
      10,
      scrollContainerElement,
      negativeThreshold2,
    );
    expect(result2).toBe(false);
  });
});
