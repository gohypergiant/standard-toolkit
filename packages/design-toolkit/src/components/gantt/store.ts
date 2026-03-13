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

import { createStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GANTT_ROW_HEIGHT_PX } from './constants';
import { roundDateToInterval } from './utils/dates';

export type GanttState = {
  currentPositionMs: number;
  currentRowScrollPx: number;
};

type GanttActions = {
  setCurrentPositionMs: (ms: number) => void;
  setCurrentRowScrollPx: (px: number) => void;
};

export const selectors = {
  currentPositionMs: (state: GanttState) => state.currentPositionMs,
  roundedCurrentPositionMs:
    (selectedTimeIntervalMs: number) => (state: GanttState) => {
      const workerDate = new Date(state.currentPositionMs);

      roundDateToInterval(workerDate, selectedTimeIntervalMs);

      return workerDate.getTime();
    },
  roundedCurrentRowScrollPx: (state: GanttState) => {
    const scrollPxValue = state.currentRowScrollPx;

    return scrollPxValue - (scrollPxValue % GANTT_ROW_HEIGHT_PX);
  },
};

export type GanttStoreProps = {
  startTimeMs: number;
};

export const createGanttStore = ({ startTimeMs }: GanttStoreProps) => {
  return createStore<GanttState & GanttActions>()(
    subscribeWithSelector((set) => ({
      currentPositionMs: startTimeMs,
      currentRowScrollPx: 0,
      setCurrentPositionMs: (ms: number) => set({ currentPositionMs: ms }),
      setCurrentRowScrollPx: (px: number) => set({ currentRowScrollPx: px }),
    })),
  );
};

export type GanttStore = ReturnType<typeof createGanttStore>;
