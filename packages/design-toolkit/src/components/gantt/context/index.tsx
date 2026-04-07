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
  useState,
} from 'react';
import { RootContainer } from '../components/containers/internal';
import { GANTT_ROW_HEIGHT_PX } from '../constants';
import { GanttStoreProvider } from './store';
import { TemporalDataProvider } from './temporal-data';
import type {
  GanttThresholdProps,
  GanttTimescale,
} from '@/components/gantt/types';

export type GanttContextValue = {
  timelineContainerElement: HTMLDivElement | null;
  headerElement: HTMLDivElement | null;
  rootElement: HTMLDivElement | null;
  ganttContentElement: HTMLDivElement | null;
  ganttPanelElement: HTMLDivElement | null;
  rowHeightPx: number;
  assignTimelineContainerElementRef: (node: HTMLDivElement | null) => void;
  assignHeaderElementRef: (node: HTMLDivElement | null) => void;
  assignRootElementRef: (node: HTMLDivElement | null) => void;
  assignGanttContentElementRef: (node: HTMLDivElement | null) => void;
  assignGanttPanelElementRef: (node: HTMLDivElement | null) => void;
};

export const GanttContext = createContext<GanttContextValue | undefined>(
  undefined,
);

export type GanttProviderProps = {
  startTimeMs: number;
  endTimeMs: number;
  timescale: GanttTimescale;
  currentTimeMs: number;
  thresholdProps?: GanttThresholdProps;
  rowHeightPx?: number;
};

export function GanttProvider({
  children,
  startTimeMs,
  endTimeMs,
  timescale,
  thresholdProps,
  currentTimeMs,
  rowHeightPx = GANTT_ROW_HEIGHT_PX,
}: PropsWithChildren<GanttProviderProps>) {
  const [timelineContainerElement, setTimelineContainerElement] =
    useState<HTMLDivElement | null>(null);
  const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const [ganttContentElement, setGanttContentElement] =
    useState<HTMLDivElement | null>(null);
  const [ganttPanelElement, setGanttPanelElement] =
    useState<HTMLDivElement | null>(null);

  const [midpointMs] = useState(
    () => startTimeMs + (endTimeMs - startTimeMs) / 2,
  );

  const totalBounds = useMemo(
    () => ({
      startMs: startTimeMs,
      endMs: endTimeMs,
    }),
    [startTimeMs, endTimeMs],
  );

  const value = useMemo(
    () => ({
      assignTimelineContainerElementRef: setTimelineContainerElement,
      assignHeaderElementRef: setHeaderElement,
      assignRootElementRef: setRootElement,
      assignGanttContentElementRef: setGanttContentElement,
      assignGanttPanelElementRef: setGanttPanelElement,
      timelineContainerElement,
      headerElement,
      rootElement,
      ganttContentElement,
      ganttPanelElement,
      rowHeightPx,
    }),
    [
      timelineContainerElement,
      headerElement,
      rootElement,
      ganttContentElement,
      ganttPanelElement,
      rowHeightPx,
    ],
  );

  return (
    <GanttContext.Provider value={value}>
      <GanttStoreProvider startTimeMs={midpointMs}>
        <TemporalDataProvider
          timescale={timescale}
          totalBounds={totalBounds}
          threshold={thresholdProps?.threshold}
          currentTimeMs={currentTimeMs}
          onThresholdMet={thresholdProps?.onThresholdMet}
        >
          <RootContainer>{children}</RootContainer>
        </TemporalDataProvider>
      </GanttStoreProvider>
    </GanttContext.Provider>
  );
}

export function useGanttContext() {
  const ctx = useContext(GanttContext);

  if (!ctx) {
    throw new Error('useGanttContext must be used within a GanttProvider');
  }

  return ctx;
}
