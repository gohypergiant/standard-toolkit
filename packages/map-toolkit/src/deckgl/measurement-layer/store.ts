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

import { Broadcast } from '@accelint/bus';
import { MapEvents } from '@/deckgl/base-map/events';
import { createMapStore } from '@/shared/create-map-store';
import { MeasurementEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type {
  MapDragEndEvent,
  MapDragEvent,
  MapDragPayload,
  MapDragStartEvent,
  MapEventType,
} from '@/deckgl/base-map/types';
import type { StoreHelpers } from '@/shared/create-map-store';
import type { MeasurementEventType } from './events';
import type { RequiresModifier } from './types';

const measurementBus = Broadcast.getInstance<MeasurementEventType>();
const mapBus = Broadcast.getInstance<MapEventType>();

/**
 * Per-map measurement state held by {@link measurementStore}.
 */
export type MeasurementState = {
  /** Origin coordinate `[longitude, latitude]`, or `null` when not measuring */
  pointA: [number, number] | null;
  /** Destination coordinate `[longitude, latitude]`, or `null` before the first drag move */
  pointB: [number, number] | null;
  /** Whether a measurement drag is currently in progress */
  isMeasuring: boolean;
  /**
   * Modifier key a drag must hold to count as a measurement, or `undefined`
   * to measure on every drag. Per map: written by the `useMeasurement` hook
   * that is given a value and cleared when that hook unmounts; hooks that omit
   * it inherit this value.
   */
  requiresModifier: RequiresModifier | undefined;
};

/**
 * Per-map actions returned by {@link measurementStore}; each emits the matching
 * measurement lifecycle event and toggles map pan as needed.
 */
export type MeasurementActions = {
  /**
   * Begin (or restart) a measurement from the given coordinate. Resets
   * `pointB`, emits `measurement:start`, and suppresses map pan.
   *
   * @param pointA - The origin coordinate as `[longitude, latitude]`
   */
  start: (pointA: [number, number]) => void;
  /**
   * Update the destination coordinate during a drag and emit
   * `measurement:update`. No-op when not measuring.
   *
   * @param pointB - The current drag coordinate as `[longitude, latitude]`
   */
  updateEnd: (pointB: [number, number]) => void;
  /**
   * Mark the measurement as complete (drag ended or modifier released):
   * emits `measurement:complete` and restores pan. A measurement with no
   * destination yet is cleared instead. No-op when not measuring.
   */
  complete: () => void;
  /**
   * Reset all measurement state, emit `measurement:clear`, and restore pan if
   * a drag was in progress.
   */
  clear: () => void;
  /**
   * Set the per-map modifier requirement checked against incoming drags.
   *
   * @param value - The required modifier, or `undefined` to measure on every drag
   */
  setRequiresModifier: (value: RequiresModifier | undefined) => void;
};

const DEFAULT_STATE: MeasurementState = {
  pointA: null,
  pointB: null,
  isMeasuring: false,
  requiresModifier: undefined,
};

/** Whether the drag's modifier flags satisfy `requiresModifier` (always true when unset). */
function hasRequiredModifier(
  requiresModifier: RequiresModifier | undefined,
  keys: Pick<MapDragPayload, 'shiftKey' | 'altKey'>,
): boolean {
  return !requiresModifier || keys[`${requiresModifier}Key`];
}

/** Sets `pointA` with no `pointB` and `isMeasuring`, then emits `measurement:start` and `map:disablePan`. */
function startMeasurement(
  mapId: UniqueId,
  { set }: StoreHelpers<MeasurementState>,
  pointA: [number, number],
): void {
  set({ pointA, pointB: null, isMeasuring: true });
  measurementBus.emit(MeasurementEvents.start, { mapId, pointA, pointB: null });
  mapBus.emit(MapEvents.disablePan, { id: mapId });
}

/** Sets `pointB` and emits `measurement:update`; no-op unless measuring with a `pointA`. */
function updateMeasurement(
  mapId: UniqueId,
  { get, set }: StoreHelpers<MeasurementState>,
  pointB: [number, number],
): void {
  const { isMeasuring, pointA } = get();

  if (!(isMeasuring && pointA)) {
    return;
  }

  set({ pointB });
  measurementBus.emit(MeasurementEvents.update, { mapId, pointA, pointB });
}

/** Resets both points and `isMeasuring`, emits `measurement:clear`, and emits `map:enablePan` if a drag was in progress. */
function clearMeasurement(
  mapId: UniqueId,
  { get, set }: StoreHelpers<MeasurementState>,
): void {
  const wasMeasuring = get().isMeasuring;

  set({ pointA: null, pointB: null, isMeasuring: false });
  measurementBus.emit(MeasurementEvents.clear, { mapId });

  if (wasMeasuring) {
    mapBus.emit(MapEvents.enablePan, { id: mapId });
  }
}

/** Clears `isMeasuring`, emits `measurement:complete` and `map:enablePan`; clears instead when there is no `pointB`, and no-ops when not measuring. */
function completeMeasurement(
  mapId: UniqueId,
  helpers: StoreHelpers<MeasurementState>,
): void {
  const { get, set } = helpers;
  const { isMeasuring, pointA, pointB } = get();

  if (!isMeasuring) {
    return;
  }

  // No destination means nothing was measured: clear instead of completing.
  if (!(pointA && pointB)) {
    clearMeasurement(mapId, helpers);

    return;
  }

  set({ isMeasuring: false });
  measurementBus.emit(MeasurementEvents.complete, { mapId, pointA, pointB });
  mapBus.emit(MapEvents.enablePan, { id: mapId });
}

/**
 * Per-map measurement store.
 *
 * Owns the `map:dragStart` / `map:drag` / `map:dragEnd` subscription for each
 * map (one subscription per map, started by the first subscriber and torn down
 * by the last), so lifecycle events and pan toggles fire once no matter how
 * many `useMeasurement` instances are mounted. When the last subscriber leaves
 * mid-drag, the measurement is finished so map pan is restored.
 */
export const measurementStore = createMapStore<
  MeasurementState,
  MeasurementActions
>({
  defaultState: DEFAULT_STATE,

  actions: (mapId, helpers) => ({
    start: (pointA) => {
      startMeasurement(mapId, helpers, pointA);
    },

    updateEnd: (pointB) => {
      updateMeasurement(mapId, helpers, pointB);
    },

    complete: () => {
      completeMeasurement(mapId, helpers);
    },

    clear: () => {
      clearMeasurement(mapId, helpers);
    },

    setRequiresModifier: (value) => {
      helpers.set({ requiresModifier: value });
    },
  }),

  bus: (mapId, helpers) => {
    const { get } = helpers;
    const offDragStart = mapBus.on(
      MapEvents.dragStart,
      (event: MapDragStartEvent) => {
        const { id, coordinate } = event.payload;

        if (id !== mapId) {
          return;
        }

        if (!hasRequiredModifier(get().requiresModifier, event.payload)) {
          return;
        }

        startMeasurement(mapId, helpers, coordinate);
      },
    );

    const offDrag = mapBus.on(MapEvents.drag, (event: MapDragEvent) => {
      const { id, coordinate } = event.payload;

      if (id !== mapId || !get().isMeasuring) {
        return;
      }

      // Releasing the modifier mid-drag ends the measurement at the last point.
      if (!hasRequiredModifier(get().requiresModifier, event.payload)) {
        completeMeasurement(mapId, helpers);

        return;
      }

      updateMeasurement(mapId, helpers, coordinate);
    });

    const offDragEnd = mapBus.on(
      MapEvents.dragEnd,
      (event: MapDragEndEvent) => {
        if (event.payload.id !== mapId) {
          return;
        }

        completeMeasurement(mapId, helpers);
      },
    );

    return () => {
      offDragStart();
      offDrag();
      offDragEnd();
      // Finish an in-flight measurement so pan is not left disabled.
      completeMeasurement(mapId, helpers);
    };
  },
});
