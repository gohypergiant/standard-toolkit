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

/** Type guard that also narrows `number | undefined` from indexed access. */
function isFiniteNumber(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Normalizes a picked coordinate to a fresh `[longitude, latitude]` tuple.
 * deck.gl's `PickingInfo.coordinate` is typed `number[]` and can be empty,
 * non-finite, or three-element (`[longitude, latitude, z]` when any layer is
 * `pickable: '3d'`), so callers pass it through here before treating it as a
 * coordinate. A trailing z is dropped.
 *
 * @param value - Picked coordinate to normalize
 * @returns A new `[longitude, latitude]` tuple when the first two entries are
 *   finite numbers, otherwise `null`
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * // `info.coordinate` is `number[] | undefined`; normalize before storing it.
 * function onHover(info: PickingInfo) {
 *   const coordinate = toLonLat(info.coordinate);
 *
 *   if (coordinate) {
 *     setCoordinate(coordinate);
 *   }
 * }
 * ```
 */
export function toLonLat(value?: number[] | null): [number, number] | null {
  // Runs on every hover and drag: two direct checks, no callback allocation.
  const [longitude, latitude] = value ?? [];

  if (!(isFiniteNumber(longitude) && isFiniteNumber(latitude))) {
    return null;
  }

  return [longitude, latitude];
}
