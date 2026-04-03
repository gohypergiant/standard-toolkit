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

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { TIMESCALE_MAPPING } from '@/components/gantt/constants';
import { useGanttContext } from '@/components/gantt/context';
import { useGanttStore } from '@/components/gantt/context/store';
import { useResizeIntersectionEffect } from '@/components/gantt/hooks/use-resize-intersection-effect';
import { selectors } from '@/components/gantt/store';
import { getMsPerPx } from '@/components/gantt/utils/conversions';
import { generateTimelineChunks } from '@/components/gantt/utils/generation';
import {
  getRenderedRegionBoundsMs,
  getViewableRegionWidth,
} from '@/components/gantt/utils/helpers';
import type {
  GanttMetThresholdData,
  GanttThreshold,
  GanttTimeBounds,
  GanttTimelineChunkObject,
  GanttTimescale,
} from '@/components/gantt/types';

export type TemporalDataContextValue = {
  msPerPx: number;
  renderedRegionBounds: GanttTimeBounds;
  timescale: GanttTimescale;
  totalBounds: GanttTimeBounds;
  timelineChunks: GanttTimelineChunkObject[];
  threshold?: GanttThreshold;
  currentTimeMs: number;
  onThresholdMet?: (metThresholds: GanttMetThresholdData[]) => void;
};

export const TemporalDataContext = createContext<
  TemporalDataContextValue | undefined
>(undefined);

export type TemporalDataProviderProps = {
  timescale: GanttTimescale;
  totalBounds: GanttTimeBounds;
  threshold?: GanttThreshold;
  currentTimeMs: number;
  onThresholdMet?: (metThresholds: GanttMetThresholdData[]) => void;
};

export function TemporalDataProvider({
  children,
  timescale,
  totalBounds,
  threshold,
  currentTimeMs,
  onThresholdMet,
}: PropsWithChildren<TemporalDataProviderProps>) {
  const { headerElement } = useGanttContext();
  const msPerPx = getMsPerPx(timescale);
  const selectedTimeIntervalMs = TIMESCALE_MAPPING[timescale];

  const selector = useMemo(
    () => selectors.roundedCurrentPositionMs(selectedTimeIntervalMs),
    [selectedTimeIntervalMs],
  );

  const roundedTimestampMs = useGanttStore(selector);

  const timelineChunks = generateTimelineChunks(
    roundedTimestampMs,
    getViewableRegionWidth(headerElement),
    selectedTimeIntervalMs,
    msPerPx,
  );

  const renderedRegionBounds = getRenderedRegionBoundsMs(
    timelineChunks,
    msPerPx,
  );

  useResizeIntersectionEffect({
    timelineContainerElement: headerElement,
    timelineChunks,
  });

  const value = useMemo(
    () => ({
      msPerPx,
      renderedRegionBounds,
      timescale,
      timelineChunks,
      totalBounds,
      threshold,
      currentTimeMs,
      onThresholdMet,
    }),
    [
      msPerPx,
      renderedRegionBounds,
      timescale,
      timelineChunks,
      totalBounds,
      threshold,
      currentTimeMs,
      onThresholdMet,
    ],
  );

  return (
    <TemporalDataContext.Provider value={value}>
      {children}
    </TemporalDataContext.Provider>
  );
}

export function useTemporalDataContext() {
  const ctx = useContext(TemporalDataContext);

  if (!ctx) {
    throw new Error(
      'useTemporalDataContext must be used within a TemporalDataProvider',
    );
  }

  return ctx;
}
