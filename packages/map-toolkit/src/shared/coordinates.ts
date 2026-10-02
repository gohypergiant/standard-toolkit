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
 * Type guard for a `[longitude, latitude]` tuple: an array of exactly two
 * finite numbers. deck.gl's `PickingInfo.coordinate` is typed `number[]` and
 * can be empty, three-element, or non-finite, so callers narrow with this
 * before treating it as a coordinate.
 *
 * @param value - Value to validate as a coordinate
 * @returns True if value is a `[longitude, latitude]` tuple of finite numbers
 *
 * @example
 * ```typescript
 * // `info.coordinate` is `number[] | undefined`; narrow before storing it.
 * function onHover(info: PickingInfo) {
 *   if (isLonLatTuple(info.coordinate)) {
 *     setCoordinate(info.coordinate);
 *   }
 * }
 * ```
 */
export function isLonLatTuple(
  value?: number[] | null,
): value is [number, number] {
  // Runs on every hover and drag: two direct checks, no callback allocation.
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}
