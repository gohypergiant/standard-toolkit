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

import { create } from 'zustand';
import { roundDateToInterval } from './utils';

type GanttState = {
  currentPositionMs: number;
};

type GanttActions = {
  setCurrentPositionMs: (ms: number) => void;
};

type GanttStore = GanttState & GanttActions;

export const selectors = {
  currentPositionMs: (state: GanttState) => state.currentPositionMs,
  roundedCurrentPositionMs:
    (selectedTimeIntervalMs: number) => (state: GanttState) => {
      const workerDate = new Date(state.currentPositionMs);

      roundDateToInterval(workerDate, selectedTimeIntervalMs);

      return workerDate.getTime();
    },
};

export const useGanttStore = create<GanttStore>()((set) => ({
  currentPositionMs: 0,
  setCurrentPositionMs: (ms: number) => {
    set({ currentPositionMs: ms });
  },
}));
