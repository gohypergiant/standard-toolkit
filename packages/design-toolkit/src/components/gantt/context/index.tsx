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
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { TIMESCALE_MAPPING } from '../constants';
import { useResizeIntersectionEffect } from '../hooks/use-resize-intersection-effect';
import { selectors } from '../store';
import { getMsPerPx } from '../utils/conversions';
import { generateTimelineChunks } from '../utils/generation';
import {
  getRenderedRegionBoundsMs,
  getViewableRegionWidth,
} from '../utils/helpers';
import { useGanttStore } from './store';
import type {
  MetThresholdData,
  Threshold,
  TimeBounds,
  TimelineChunkObject,
  Timescale,
} from '../types';

export type GanttContextValue = {
  msPerPx: number;
  renderedRegionBounds: TimeBounds;
  timescale: Timescale;
  totalBounds: TimeBounds;
  timelineChunks: TimelineChunkObject[];
  threshold?: Threshold;
  onThresholdMet?: (metThresholds: MetThresholdData[]) => void;
  assignTimelineContainerElementRef: (node: HTMLDivElement) => void;
  assignScrollContainerElementRef: (node: HTMLDivElement) => void;
  scrollContainerElement: HTMLDivElement | null;
  timelineContainerElement: HTMLDivElement | null;
};

export const GanttContext = createContext<GanttContextValue | undefined>(
  undefined,
);

export type GanttProviderProps = {
  timescale: Timescale;
  totalBounds: TimeBounds;
  threshold?: Threshold;
  onThresholdMet?: (metThresholds: MetThresholdData[]) => void;
};

export function GanttProvider({
  children,
  timescale,
  totalBounds,
  threshold,
  onThresholdMet,
}: PropsWithChildren<GanttProviderProps>) {
  const [timelineContainerElement, setTimelineContainerElement] =
    useState<HTMLDivElement | null>(null);
  const [scrollContainerElement, setScrollContainerElement] =
    useState<HTMLDivElement | null>(null);

  const msPerPx = getMsPerPx(timescale);
  const selectedTimeIntervalMs = TIMESCALE_MAPPING[timescale];

  const selector = useMemo(
    () => selectors.roundedCurrentPositionMs(selectedTimeIntervalMs),
    [selectedTimeIntervalMs],
  );

  const roundedTimestampMs = useGanttStore(selector);

  const timelineChunks = generateTimelineChunks(
    roundedTimestampMs,
    getViewableRegionWidth(timelineContainerElement),
    selectedTimeIntervalMs,
    msPerPx,
  );

  const renderedRegionBounds = getRenderedRegionBoundsMs(
    timelineChunks,
    msPerPx,
  );

  useResizeIntersectionEffect({
    timelineContainerElement,
    timelineChunks,
  });

  const assignTimelineContainerElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        return;
      }

      setTimelineContainerElement(node);
    },
    [],
  );

  const assignScrollContainerElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        return;
      }

      setScrollContainerElement(node);
    },
    [],
  );

  const value = useMemo(
    () => ({
      assignTimelineContainerElementRef,
      assignScrollContainerElementRef,
      msPerPx,
      renderedRegionBounds,
      timescale,
      timelineChunks,
      totalBounds,
      threshold,
      onThresholdMet,
      scrollContainerElement,
      timelineContainerElement,
    }),
    [
      assignTimelineContainerElementRef,
      assignScrollContainerElementRef,
      msPerPx,
      renderedRegionBounds,
      timescale,
      timelineChunks,
      totalBounds,
      threshold,
      onThresholdMet,
      scrollContainerElement,
      timelineContainerElement,
    ],
  );

  return (
    <GanttContext.Provider value={value}>{children}</GanttContext.Provider>
  );
}

export function useGanttContext() {
  const ctx = useContext(GanttContext);

  if (!ctx) {
    throw new Error('useGanttContext must be used within a GanttProvider');
  }

  return ctx;
}
