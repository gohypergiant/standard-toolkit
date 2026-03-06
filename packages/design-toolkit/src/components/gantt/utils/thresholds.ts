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

import { TIMESCALE_MAPPING } from '../constants';
import type {
  GanttRegion,
  MetThresholdData,
  Threshold,
  TimeBounds,
  Timescale,
} from '../types';

/**
 * Derives the total data region from the total row count and bounds.
 */
export function deriveTotalDataRegion(
  totalRowsCount: number,
  totalBounds: TimeBounds,
): GanttRegion {
  return {
    startMs: totalBounds.startMs,
    endMs: totalBounds.endMs,
    startRowIndex: 0,
    endRowIndex: totalRowsCount - 1,
  };
}

/**
 * Derives the rendered region from the rendered slice and bounds.
 */
export function deriveRenderedRegion(
  renderedSlice: { start: number; end: number },
  renderedRegionBounds: TimeBounds,
): GanttRegion {
  return {
    startMs: renderedRegionBounds.startMs,
    endMs: renderedRegionBounds.endMs,
    startRowIndex: renderedSlice.start,
    endRowIndex: renderedSlice.end - 1, // End index is exclusive in slice
  };
}

/**
 * Derives temporal threshold values from the threshold object and total data region.
 * Returns null if the threshold values are invalid.
 */
export function deriveTemporalThresholds(
  threshold: Threshold,
  totalDataRegion: GanttRegion,
  timescale: Timescale,
): { start: number; end: number } | null {
  if (threshold.timescaleMultipleDistance < 0) {
    return null;
  }

  const timescaleMs = TIMESCALE_MAPPING[timescale];
  const relativeValue = threshold.timescaleMultipleDistance * timescaleMs;

  const startThreshold = totalDataRegion.startMs + relativeValue;
  const endThreshold = totalDataRegion.endMs - relativeValue;

  // Validate thresholds
  if (startThreshold > endThreshold) {
    return null;
  }

  return {
    start: startThreshold,
    end: endThreshold,
  };
}

/**
 * Derives row index threshold values from the threshold object and total data region.
 * Returns null if the threshold values are invalid.
 */
export function deriveRowIndexThresholds(
  threshold: Threshold,
  totalDataRegion: GanttRegion,
): { start: number; end: number } | null {
  if (threshold.rowIndexBoundaryDistance < 0) {
    return null;
  }

  const startThreshold =
    totalDataRegion.startRowIndex + threshold.rowIndexBoundaryDistance;
  const endThreshold =
    totalDataRegion.endRowIndex - threshold.rowIndexBoundaryDistance;

  // Validate thresholds
  if (startThreshold > endThreshold) {
    return null;
  }

  return {
    start: startThreshold,
    end: endThreshold,
  };
}

/**
 * Examines if any thresholds have been met by comparing the rendered region
 * against the derived threshold values.
 * Returns an array of MetThresholdData objects for thresholds that have been met.
 */
export function examineThresholds(
  renderedRegion: GanttRegion,
  temporalThresholds: { start: number; end: number } | null,
  rowIndexThresholds: { start: number; end: number } | null,
): MetThresholdData[] {
  const metThresholds: MetThresholdData[] = [];

  // Check temporal thresholds if they are valid
  if (temporalThresholds) {
    if (renderedRegion.startMs <= temporalThresholds.start) {
      metThresholds.push({
        axis: 'horizontal',
        direction: 'start',
        value: temporalThresholds.start,
      });
    }

    if (renderedRegion.endMs >= temporalThresholds.end) {
      metThresholds.push({
        axis: 'horizontal',
        direction: 'end',
        value: temporalThresholds.end,
      });
    }
  }

  // Check row index thresholds if they are valid
  if (rowIndexThresholds) {
    if (renderedRegion.startRowIndex <= rowIndexThresholds.start) {
      metThresholds.push({
        axis: 'vertical',
        direction: 'start',
        value: rowIndexThresholds.start,
      });
    }

    if (renderedRegion.endRowIndex >= rowIndexThresholds.end) {
      metThresholds.push({
        axis: 'vertical',
        direction: 'end',
        value: rowIndexThresholds.end,
      });
    }
  }

  return metThresholds;
}

/**
 * Validates if the threshold examination should proceed based on input parameters.
 * Returns true if examination should proceed, false otherwise.
 */
export function shouldExamineThresholds(
  totalRowsCount: number,
  scrollContainerElement: { clientHeight: number } | null,
  threshold: Threshold | undefined,
): boolean {
  if (!threshold) {
    return false;
  }

  if (totalRowsCount <= 0) {
    return false;
  }

  if (!scrollContainerElement || scrollContainerElement.clientHeight <= 0) {
    return false;
  }

  if (
    threshold.timescaleMultipleDistance < 0 ||
    threshold.rowIndexBoundaryDistance < 0
  ) {
    return false;
  }

  return true;
}
