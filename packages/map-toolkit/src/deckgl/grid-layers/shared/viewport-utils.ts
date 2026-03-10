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

import type { Viewport } from '@deck.gl/core';
import { Bounds, Unit } from '@ngageoint/grid-js';

/**
 * Calculates geographic bounds for a given deck.gl viewport.
 *
 * Handles antimeridian crossing and wide viewports that span the full globe.
 * Latitude is clamped to the valid MGRS range (-80 to 84 degrees).
 *
 * @param viewport - The deck.gl viewport to compute bounds for
 * @returns Geographic bounds in degrees, or `undefined` if bounds cannot be computed
 *   (viewport too small, unproject failed, or exception thrown)
 *
 * @example
 * ```typescript
 * const bounds = getViewportBounds(deck.getViewports()[0]);
 * if (bounds) {
 *   renderer.render({ bounds, zoom, gridType });
 * }
 * ```
 */
export function getViewportBounds(viewport: Viewport): Bounds | undefined {
  try {
    // When the viewport is wide enough to show the entire globe,
    // unproject() only returns a partial longitude range. Detect this by
    // comparing the viewport pixel width to the Web Mercator world width
    // (512 × 2^zoom). This works regardless of zoom level or window size.
    const worldPixelWidth = 512 * 2 ** viewport.zoom;
    if (viewport.width >= worldPixelWidth) {
      return Bounds.bounds(-180, -80, 180, 84, Unit.DEGREE);
    }

    // Get viewport corner coordinates
    const nw = viewport.unproject([0, 0]);
    const se = viewport.unproject([viewport.width, viewport.height]);

    if (!(nw && se)) {
      return undefined;
    }

    const nwLon = nw[0] as number | undefined;
    const nwLat = nw[1] as number | undefined;
    const seLon = se[0] as number | undefined;
    const seLat = se[1] as number | undefined;

    if (nwLon == null || nwLat == null || seLon == null || seLat == null) {
      return undefined;
    }

    let minLon: number;
    let maxLon: number;

    // Detect antimeridian crossing: west longitude > east longitude
    // Example: nw=170, se=-170 means we're crossing the date line
    if (nwLon > seLon) {
      // Crossing detected: normalize by allowing longitude > 180
      // Example: 170 to -170 becomes 170 to 190
      minLon = nwLon;
      maxLon = seLon + 360;
    } else {
      // Normal case: west < east
      minLon = Math.min(nwLon, seLon);
      maxLon = Math.max(nwLon, seLon);
    }

    // If the viewport wraps past the antimeridian (bounds outside ±180)
    // or spans the full globe, use the full longitude range so the grid
    // covers the entire visible area instead of clipping at the edges.
    if (minLon < -180 || maxLon > 180 || maxLon - minLon >= 360) {
      minLon = -180;
      maxLon = 180;
    }

    // Clamp latitude to valid MGRS ranges
    const minLat = Math.max(-80, Math.min(nwLat, seLat));
    const maxLat = Math.min(84, Math.max(nwLat, seLat));

    return Bounds.bounds(minLon, minLat, maxLon, maxLat, Unit.DEGREE);
  } catch {
    return undefined;
  }
}
