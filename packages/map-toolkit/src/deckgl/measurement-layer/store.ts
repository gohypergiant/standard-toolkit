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

/**
 * Measurement Store
 *
 * Manages per-map-instance state for the bearing-range measurement tool.
 * Each map instance gets isolated state via `createMapStore`.
 *
 * @example
 * ```typescript
 * import { measurementStore } from '@accelint/map-toolkit/deckgl/measurement-layer';
 *
 * function MeasurementDisplay({ mapId }) {
 *   const { state, start, clear } = measurementStore.use(mapId);
 *
 *   return (
 *     <div>
 *       {state.isMeasuring
 *         ? <p>Measuring from {JSON.stringify(state.pointA)}</p>
 *         : <button onClick={() => start([0, 0])}>Start</button>}
 *     </div>
 *   );
 * }
 * ```
 */

import { createMapStore } from '@/shared/create-map-store';

/**
 * State shape for the measurement store.
 */
export type MeasurementState = {
  /** Origin coordinate `[longitude, latitude]`, or `null` when not measuring */
  pointA: [number, number] | null;
  /** Destination coordinate `[longitude, latitude]`, or `null` before drag begins */
  pointB: [number, number] | null;
  /** Whether a measurement drag is currently in progress */
  isMeasuring: boolean;
};

/**
 * Actions available on the measurement store.
 */
export type MeasurementActions = {
  /**
   * Begin a measurement from the given coordinate.
   *
   * @param pointA - The origin coordinate as `[longitude, latitude]`
   */
  start: (pointA: [number, number]) => void;
  /**
   * Update the destination coordinate during a drag.
   *
   * @param pointB - The current drag coordinate as `[longitude, latitude]`
   */
  updateEnd: (pointB: [number, number]) => void;
  /**
   * Mark the measurement as complete (drag released).
   * Preserves pointA/pointB for display; sets isMeasuring to false.
   */
  complete: () => void;
  /**
   * Reset all measurement state to defaults.
   */
  clear: () => void;
};

const DEFAULT_STATE: MeasurementState = {
  pointA: null,
  pointB: null,
  isMeasuring: false,
};

/**
 * Per-map-instance store for measurement state.
 *
 * Use `measurementStore.use(mapId)` inside React components, or
 * `measurementStore.get(mapId)` / `measurementStore.actions(mapId)` for
 * imperative access.
 */
export const measurementStore = createMapStore<
  MeasurementState,
  MeasurementActions
>({
  defaultState: DEFAULT_STATE,

  actions: (_mapId, { set }) => ({
    start: (pointA) => {
      set({ pointA, pointB: null, isMeasuring: true });
    },

    updateEnd: (pointB) => {
      set({ pointB });
    },

    complete: () => {
      set({ isMeasuring: false });
    },

    clear: () => {
      set({ pointA: null, pointB: null, isMeasuring: false });
    },
  }),
});
