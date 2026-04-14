// __private-exports
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

/** Shorthand strings representing hour-based timeline interval durations. */
export type GanttHoursTimescale = '1h' | '2h' | '6h' | '12h' | '24h';

/** Shorthand strings representing minute-based timeline interval durations. */
export type GanttMinutesTimescale = '1m' | '5m' | '10m' | '30m';

/**
 * Timeline interval duration controlling the spacing between tick marks.
 * Determines the granularity of the timeline display.
 */
export type GanttTimescale = GanttHoursTimescale | GanttMinutesTimescale;

export type GanttTimelineChunkObject = {
  /** Epoch milliseconds for this timeline chunk's position. */
  timestampMs: number;
};

export type GanttTimeBounds = {
  /** Start of the time range in epoch milliseconds. */
  startMs: number;
  /** End of the time range in epoch milliseconds. */
  endMs: number;
};

/**
 * Visual color variant for row elements (blocks, markers, spacers, brackets).
 * Maps to design token color scales.
 */
export type GanttRowElementColorProp = 'serious' | 'accent' | 'critical';

/**
 * Configuration for threshold-based data loading notifications.
 * When the rendered region approaches the edges of the total data region,
 * the Gantt fires `onThresholdMet` so consumers can load additional data.
 */
export type GanttThreshold = {
  /** Number of timescale intervals from the timeline boundary that triggers a threshold event. */
  timescaleMultipleDistance: number;
  /** Number of rows from the visible row boundary that triggers a threshold event. */
  rowIndexBoundaryDistance: number;
};

export type GanttDerivedThresholdValue = {
  /** Derived threshold boundary at the start of the axis. */
  start: number;
  /** Derived threshold boundary at the end of the axis. */
  end: number;
};

/** Data describing a threshold that was met during rendering. */
export type GanttMetThresholdData = {
  /** Which axis the threshold was met on (time or rows). */
  axis: 'horizontal' | 'vertical';
  /** Whether the threshold was met at the beginning or end of the axis. */
  direction: 'start' | 'end';
  /** The timestamp (horizontal) or row index (vertical) at which the threshold was met. */
  value: number;
};

export type GanttRegion = {
  startMs: number;
  endMs: number;
  startRowIndex: number;
  endRowIndex: number;
};

/** Props for configuring threshold-based data loading on the Gantt component. */
export type GanttThresholdProps = {
  /** Threshold distances that define when edge-of-data notifications fire. */
  threshold: GanttThreshold;
  /** Callback invoked when the rendered region enters a threshold zone. */
  onThresholdMet: (metThresholds: GanttMetThresholdData[]) => void;
};
