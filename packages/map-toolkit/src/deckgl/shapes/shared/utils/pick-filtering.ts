/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
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

/**
 * Result of filtering picks for geometry-aware processing.
 * Generic to support both deck.gl/core PickingInfo and editable-layers Pick types.
 */
export interface FilteredPicksResult<T> {
  /** The filtered picks array (only valid geometry picks) */
  filteredPicks: T[];
  /** Whether any picks were removed during filtering */
  didFilter: boolean;
}

/**
 * Filters picks to only include valid geometry elements.
 *
 * This prevents TypeError from sublayer elements that don't have geometry
 * when modes try to access pick.object.geometry.type. Only picks that are
 * either guide features (pick.isGuide) or have valid geometry are included.
 *
 * Uses a single-pass algorithm for efficiency - filters and tracks changes
 * in one loop iteration.
 *
 * @param picks - The picks array from a pointer event
 * @returns Object containing filtered picks and whether filtering occurred
 *
 * @example
 * ```ts
 * const picks = props.lastPointerMoveEvent?.picks;
 * if (picks && picks.length > 0) {
 *   const { filteredPicks, didFilter } = filterGeometryAwarePicks(picks);
 *   if (didFilter) {
 *     // Use filteredPicks in modified props
 *   }
 * }
 * ```
 */
export function filterGeometryAwarePicks<T>(
  picks: T[],
): FilteredPicksResult<T> {
  const filteredPicks: T[] = [];
  let didFilter = false;

  for (const pick of picks) {
    // Keep picks that are guides or have valid geometry
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl picks have dynamic object structure
    const pickObj = pick as any;
    if (pickObj.isGuide || pickObj.object?.geometry?.type !== undefined) {
      filteredPicks.push(pick);
    } else {
      didFilter = true;
    }
  }

  return { filteredPicks, didFilter };
}
