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
 * Minimal shape required for pick filtering.
 * Satisfied by both deck.gl/core PickingInfo and editable-layers Pick types.
 */
type PickLike = {
  isGuide?: boolean;
  object?: {
    geometry?: {
      type?: string;
    };
  };
};

/**
 * Result of filtering picks for geometry-aware processing.
 * Generic to support both deck.gl/core PickingInfo and editable-layers Pick types.
 *
 * @template T - The pick type, must satisfy PickLike shape.
 */
export type FilteredPicksResult<T> = {
  /** The filtered picks array (only valid geometry picks). */
  filteredPicks: T[];
  /** Whether any picks were removed during filtering. */
  didFilter: boolean;
};

/**
 * Filters picks to only include valid geometry elements.
 *
 * This prevents TypeError from sublayer elements that don't have geometry
 * when modes try to access pick.object.geometry.type. Only picks that are
 * either guide features (pick.isGuide) or have valid geometry are included.
 *
 * On the common path where all picks are valid, returns the original array
 * with zero allocations.
 *
 * @template T - The pick type, constrained to PickLike.
 * @param picks - The picks array from a pointer event.
 * @returns Object containing filtered picks and whether filtering occurred.
 *
 * @example
 * ```typescript
 * const picks = props.lastPointerMoveEvent?.picks;
 * if (picks && picks.length > 0) {
 *   const { filteredPicks, didFilter } = filterGeometryAwarePicks(picks);
 *   if (didFilter) {
 *     // Use filteredPicks in modified props
 *   }
 * }
 * ```
 */
export function filterGeometryAwarePicks<T extends PickLike>(
  picks: T[],
): FilteredPicksResult<T> {
  const len = picks.length;

  for (let i = 0; i < len; i++) {
    const pick = picks[i];
    if (!pick?.isGuide && pick?.object?.geometry?.type === undefined) {
      // Found a pick that needs filtering — build filtered array from here
      const filteredPicks: T[] = picks.slice(0, i);
      for (let j = i + 1; j < len; j++) {
        const p = picks[j];
        if (p?.isGuide || p?.object?.geometry?.type !== undefined) {
          filteredPicks.push(p);
        }
      }
      return { filteredPicks, didFilter: true };
    }
  }

  return { filteredPicks: picks, didFilter: false };
}
