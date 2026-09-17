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
import {
  bearing as geoBearing,
  distance as geoDistance,
} from '@accelint/geo/geodesy';
import { useContext, useEffect } from 'react';
import { MapContext } from '@/deckgl/base-map/provider';
import { isLonLatTuple } from '@/shared/coordinates';
import { measurementStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { RequiresModifier } from './types';

/**
 * Return value of `useMeasurement`.
 */
export type UseMeasurementReturn = {
  /** Whether a measurement drag is currently in progress */
  isMeasuring: boolean;
  /** Origin coordinate `[longitude, latitude]`, or `null` when not measuring */
  pointA: [number, number] | null;
  /** Destination coordinate `[longitude, latitude]`, or `null` before the first drag move */
  pointB: [number, number] | null;
  /** Great-circle distance in meters, or `0` until both points are finite. Format with `formatDistance` from `@accelint/formatters/bearing`. */
  distanceMeters: number;
  /** Initial bearing from pointA to pointB in degrees (0–360), or `0` until both points are finite */
  bearingDeg: number;
  /**
   * Imperatively start (or restart) a measurement from a coordinate.
   * Useful for programmatic activation (e.g., context menu "Measure from here").
   * Behaves like a drag start: emits `measurement:start` and suppresses map pan.
   *
   * @param pointA - The origin coordinate as `[longitude, latitude]`
   */
  start: (pointA: [number, number]) => void;
  /** Clear the current measurement and reset to idle state */
  clear: () => void;
};

/** Derives distance and bearing; zeros until both points are finite tuples. */
function deriveMeasurement(
  pointA: [number, number] | null,
  pointB: [number, number] | null,
): { distanceMeters: number; bearingDeg: number } {
  if (!(isLonLatTuple(pointA) && isLonLatTuple(pointB))) {
    return { distanceMeters: 0, bearingDeg: 0 };
  }

  return {
    distanceMeters: geoDistance(pointA, pointB),
    bearingDeg: geoBearing(pointA, pointB),
  };
}

/**
 * Hook that exposes per-map bearing-range measurement state and actions.
 *
 * The drag subscription lives in `measurementStore`, once per map: the first
 * hook to mount starts it and the last to unmount tears it down (finishing an
 * in-flight measurement so pan is restored). Lifecycle events therefore fire
 * once per map no matter how many hooks are mounted.
 *
 * An optional `requiresModifier` restricts measurement to drags holding that
 * key, so plain drag keeps panning. It is per-map state: the most recently
 * mounted hook's value wins. Releasing the modifier mid-drag completes the
 * measurement at the last captured coordinate. Prefer `'alt'`; see
 * {@link RequiresModifier} for why `'shift'` and `'ctrl'` conflict with
 * BaseMap's own gestures.
 *
 * Uses per-mapId store isolation so multiple map instances can measure independently.
 *
 * @param mapId - Optional map instance ID. Falls back to `MapContext` when omitted.
 *   Required when used outside of a `MapProvider` (i.e., outside BaseMap children).
 * @param requiresModifier - If set, measurement only activates when this modifier key is
 *   held during the drag. Per map; the most recently mounted hook's value wins.
 * @returns Measurement state (`distanceMeters` / `bearingDeg` are `0` until both points are finite) and imperative actions. `start(pointA)` behaves like a drag
 *   start: it emits `measurement:start` and suppresses pan until `complete` or `clear`.
 * @throws Error if no `mapId` is provided and hook is used outside of a `MapProvider`
 *
 * @example
 * ```tsx
 * // Inside BaseMap (uses MapContext automatically)
 * function MeasurementOverlay() {
 *   const { isMeasuring, pointA, pointB, distanceMeters, bearingDeg } =
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
 * // Modifier key required — Alt+drag to measure, plain drag to pan
 * function MeasurementTool({ mapId }: { mapId: string }) {
 *   const { isMeasuring } = useMeasurement(mapId, 'alt');
 *   return isMeasuring ? <ActiveIndicator /> : null;
 * }
 * ```
 */
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

  const { state, start, clear, setRequiresModifier } =
    measurementStore.use(actualId);

  useEffect(() => {
    setRequiresModifier(requiresModifier);
  }, [requiresModifier, setRequiresModifier]);

  const { pointA, pointB, isMeasuring } = state;

  return {
    isMeasuring,
    pointA,
    pointB,
    ...deriveMeasurement(pointA, pointB),
    start,
    clear,
  };
}
