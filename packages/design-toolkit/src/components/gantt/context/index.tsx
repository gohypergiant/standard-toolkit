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
import { selectors, useGanttStore } from '../store';
import { getMsPerPx } from '../utils/conversions';
import { generateTimelineChunks } from '../utils/generation';
import { getViewableRegionWidth } from '../utils/helpers';
import type { TimelineChunkObject, Timescale } from '../types';

export type GanttContextValue = {
  msPerPx: number;
  timescale: Timescale;
  timelineChunks: TimelineChunkObject[];
  assignTimelineContainerElementRef: (node: HTMLDivElement) => void;
};

export const GanttContext = createContext<GanttContextValue | undefined>(
  undefined,
);

export type GanttProviderProps = {
  timescale: Timescale;
};

export function GanttProvider({
  children,
  timescale,
}: PropsWithChildren<GanttProviderProps>) {
  const [timelineContainerElementRef, setTimelineContainerElementRef] =
    useState<HTMLDivElement | null>(null);

  const msPerPx = getMsPerPx(timescale);
  const selectedTimeIntervalMs = TIMESCALE_MAPPING[timescale];

  const roundedTimestampMs = useGanttStore(
    selectors.roundedCurrentPositionMs(selectedTimeIntervalMs),
  );

  const timelineChunks = generateTimelineChunks(
    roundedTimestampMs,
    getViewableRegionWidth(timelineContainerElementRef),
    selectedTimeIntervalMs,
    msPerPx,
  );

  const assignTimelineContainerElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (!node) {
        return;
      }

      setTimelineContainerElementRef(node);
    },
    [],
  );

  const value = useMemo(
    () => ({
      assignTimelineContainerElementRef,
      msPerPx,
      timescale,
      timelineChunks,
    }),
    [assignTimelineContainerElementRef, msPerPx, timescale, timelineChunks],
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
