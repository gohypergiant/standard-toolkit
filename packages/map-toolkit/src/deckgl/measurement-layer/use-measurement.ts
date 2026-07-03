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

'use client';

import 'client-only';
import { useEmit, useOn } from '@accelint/bus/react';
import {
  bearing as geoBearing,
  distance as geoDistance,
} from '@accelint/geo/geodesy';
import { useCallback, useContext } from 'react';
import { MapContext } from '@/deckgl/base-map/provider';
import { MapEvents } from '@/deckgl/base-map/events';
import { MeasurementEvents } from './events';
import { measurementStore } from './store';
import type { UniqueId } from '@accelint/core';
import type {
  MapDisablePanEvent,
  MapDragEndEvent,
  MapDragEvent,
  MapDragStartEvent,
  MapEnablePanEvent,
} from '@/deckgl/base-map/types';
import type {
  MeasurementClearEvent,
  MeasurementCompleteEvent,
  MeasurementStartEvent,
  MeasurementUpdateEvent,
} from './events';

/** Meters per nautical mile (exact, per IUPAC definition) */
const METERS_PER_NM = 1852;

/** Meters per kilometer */
const METERS_PER_KM = 1000;

/**
 * Modifier keys that can be required to activate measurement.
 */
export type RequiresModifier = 'shift' | 'ctrl' | 'alt';

/**
 * Return value of `useMeasurement`.
 */
export type UseMeasurementReturn = {
  /** Whether a measurement drag is currently in progress */
  isMeasuring: boolean;
  /** Origin coordinate `[longitude, latitude]`, or `null` when not measuring */
  pointA: [number, number] | null;
  /** Destination coordinate `[longitude, latitude]`, or `null` before first drag move */
  pointB: [number, number] | null;
  /** Great-circle distance in kilometers, or `0` when points are unavailable */
  distanceKm: number;
  /** Great-circle distance in nautical miles, or `0` when points are unavailable */
  distanceNM: number;
  /** Initial bearing from pointA to pointB in degrees (0–360), or `0` when points are unavailable */
  bearingDeg: number;
  /**
   * Imperatively start a measurement from a coordinate.
   * Useful for programmatic activation (e.g., context menu "Measure from here").
   *
   * @param pointA - The origin coordinate as `[longitude, latitude]`
   */
  start: (pointA: [number, number]) => void;
  /** Clear the current measurement and reset to idle state */
  clear: () => void;
};

/**
 * Hook that subscribes to BaseMap drag events and manages bearing-range measurement state.
 *
 * Listens to `map:dragStart`, `map:drag`, and `map:dragEnd` events on the event bus.
 * On drag start, begins a measurement from the drag origin. On drag move, updates the
 * destination coordinate. On drag end, marks the measurement complete and re-enables pan.
 *
 * An optional `requiresModifier` parameter restricts measurement activation to drags
 * where the specified modifier key (Shift, Ctrl, or Alt) is held, allowing plain drag
 * to continue panning the map.
 *
 * Uses per-mapId store isolation so multiple map instances can measure independently.
 *
 * @param mapId - Optional map instance ID. Falls back to `MapContext` when omitted.
 *   Required when used outside of a `MapProvider` (i.e., outside BaseMap children).
 * @param requiresModifier - If set, measurement only activates when this modifier key is
 *   held during the drag. When not set, all drag events trigger measurement.
 * @returns Measurement state and imperative actions
 * @throws Error if no `mapId` is provided and hook is used outside of a `MapProvider`
 *
 * @example
 * ```tsx
 * // Inside BaseMap (uses MapContext automatically)
 * function MeasurementOverlay() {
 *   const { isMeasuring, pointA, pointB, distanceKm, distanceNM, bearingDeg } =
 *     useMeasurement();
 *
 *   return isMeasuring && pointA && pointB
 *     ? <MeasurementLayer pointA={pointA} pointB={pointB} />
 *     : null;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Outside BaseMap — pass mapId explicitly
 * function MeasurementPanel({ mapId }: { mapId: string }) {
 *   const { distanceKm, bearingDeg, clear } = useMeasurement(mapId);
 *
 *   return (
 *     <div>
 *       <p>{distanceKm.toFixed(1)} km / {bearingDeg}°</p>
 *       <button onClick={clear}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Modifier key required — Shift+drag to measure, plain drag to pan
 * function MeasurementTool({ mapId }: { mapId: string }) {
 *   const { isMeasuring } = useMeasurement(mapId, 'shift');
 *   return isMeasuring ? <ActiveIndicator /> : null;
 * }
 * ```
 */
function checkModifier(
  requiresModifier: RequiresModifier | undefined,
  shiftKey: boolean,
  ctrlKey: boolean,
  altKey: boolean,
): boolean {
  if (!requiresModifier) {
    return true;
  }
  return (
    (requiresModifier === 'shift' && shiftKey) ||
    (requiresModifier === 'ctrl' && ctrlKey) ||
    (requiresModifier === 'alt' && altKey)
  );
}

export function useMeasurement(
  mapId?: UniqueId,
  requiresModifier?: RequiresModifier,
): UseMeasurementReturn {
  const contextId = useContext(MapContext);
  const actualId = mapId ?? contextId;

  if (!actualId) {
    throw new Error(
      'useMeasurement requires either a mapId parameter or to be used within a MapProvider',
    );
  }

  const { state, start, updateEnd, complete, clear } =
    measurementStore.use(actualId);

  const emitMeasurementStart = useEmit<MeasurementStartEvent>(
    MeasurementEvents.start,
  );
  const emitMeasurementUpdate = useEmit<MeasurementUpdateEvent>(
    MeasurementEvents.update,
  );
  const emitMeasurementComplete = useEmit<MeasurementCompleteEvent>(
    MeasurementEvents.complete,
  );
  const emitMeasurementClear = useEmit<MeasurementClearEvent>(
    MeasurementEvents.clear,
  );
  const emitDisablePan = useEmit<MapDisablePanEvent>(MapEvents.disablePan);
  const emitEnablePan = useEmit<MapEnablePanEvent>(MapEvents.enablePan);

  useOn<MapDragStartEvent>(MapEvents.dragStart, (event) => {
    const { id, coordinate, shiftKey, ctrlKey, altKey } = event.payload;

    if (id !== actualId) {
      return;
    }
    if (!checkModifier(requiresModifier, shiftKey, ctrlKey, altKey)) {
      return;
    }

    start(coordinate);
    emitMeasurementStart({ mapId: actualId, pointA: coordinate, pointB: null });
    emitDisablePan({ id: actualId });
  });

  useOn<MapDragEvent>(MapEvents.drag, (event) => {
    const { id, coordinate, shiftKey, ctrlKey, altKey } = event.payload;

    if (id !== actualId) {
      return;
    }
    if (!measurementStore.get(actualId).isMeasuring) {
      return;
    }
    if (!checkModifier(requiresModifier, shiftKey, ctrlKey, altKey)) {
      return;
    }

    updateEnd(coordinate);

    const currentState = measurementStore.get(actualId);
    emitMeasurementUpdate({
      mapId: actualId,
      pointA: currentState.pointA ?? coordinate,
      pointB: coordinate,
    });
  });

  useOn<MapDragEndEvent>(MapEvents.dragEnd, (event) => {
    const { id } = event.payload;

    if (id !== actualId) {
      return;
    }
    if (!measurementStore.get(actualId).isMeasuring) {
      return;
    }

    complete();

    const currentState = measurementStore.get(actualId);
    emitMeasurementComplete({
      mapId: actualId,
      pointA: currentState.pointA ?? event.payload.coordinate,
      pointB: currentState.pointB,
    });
    emitEnablePan({ id: actualId });
  });

  // Calculate derived geodesic values during render
  const { pointA, pointB, isMeasuring } = state;

  let distanceKm = 0;
  let distanceNM = 0;
  let bearingDeg = 0;

  if (pointA && pointB) {
    const meters = geoDistance(pointA, pointB);
    distanceKm = meters / METERS_PER_KM;
    distanceNM = meters / METERS_PER_NM;
    bearingDeg = geoBearing(pointA, pointB);
  }

  const clearMeasurement = useCallback(() => {
    emitMeasurementClear({ mapId: actualId });
    clear();
  }, [emitMeasurementClear, actualId, clear]);

  return {
    isMeasuring,
    pointA,
    pointB,
    distanceKm,
    distanceNM,
    bearingDeg,
    start,
    clear: clearMeasurement,
  };
}
