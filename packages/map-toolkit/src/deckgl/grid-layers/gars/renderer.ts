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

import type { GridRenderer, RenderContext, RenderResult } from '../core/types';
import { Grids, GridType } from '@ngageoint/gars-js';

/**
 * Map our grid type strings to the library's GridType enum
 */
function mapToLibraryGridType(gridType: string): GridType | undefined {
  switch (gridType) {
    case 'THIRTY_MINUTE':
      return GridType.THIRTY_MINUTE;
    case 'FIFTEEN_MINUTE':
      return GridType.FIFTEEN_MINUTE;
    case 'FIVE_MINUTE':
      return GridType.FIVE_MINUTE;
    default:
      // TODO: decide behavior for unknown grid types (throw vs silent skip)
      return undefined;
  }
}

/**
 * Creates a GARS grid renderer that converts GARS grid data into deck.gl-compatible
 * line and label geometry.
 *
 * @returns A `GridRenderer` instance for use in `garsDefinition`
 *
 * @example
 * ```typescript
 * const renderer = createGARSRenderer();
 * const { lines, labels } = renderer.render({ bounds, zoom: 7, gridType: 'THIRTY_MINUTE' });
 * ```
 */
export function createGARSRenderer(): GridRenderer {
  const grids = Grids.create();

  return {
    render: (context: RenderContext): RenderResult => {
      const { bounds, zoom, gridType } = context;

      const garsGridType = mapToLibraryGridType(gridType);
      if (!garsGridType) {
        return { lines: [], labels: [] };
      }

      try {
        const grid = grids.getGrid(garsGridType);
        if (!grid) {
          return { lines: [], labels: [] };
        }

        // Get grid lines within bounds (GARS doesn't need zones)
        const lines = grid.getLines(zoom, bounds);

        const lineData = [];
        const labelData = [];

        if (lines) {
          for (const line of lines) {
            const point1 = line.getPoint1();
            const point2 = line.getPoint2();

            const path: number[][] = [
              [point1.getLongitude(), point1.getLatitude()],
              [point2.getLongitude(), point2.getLatitude()],
            ];

            const cellId = `${point1.getLongitude().toFixed(4)},${point1.getLatitude().toFixed(4)}`;

            lineData.push({
              path,
              cellId,
            });
          }
        }

        const labels = grid.getLabels(zoom, bounds);
        if (labels) {
          for (const label of labels) {
            const center = label.getCenter();
            const name = label.getName();

            if (center && name) {
              labelData.push({
                text: name,
                position: [center.getLongitude(), center.getLatitude()] as [
                  number,
                  number,
                ],
                cellId: name,
              });
            }
          }
        }

        return {
          lines: lineData,
          labels: labelData,
        };
      } catch (error) {
        console.error('[GARS Renderer] Error rendering grid:', error);
        return { lines: [], labels: [] };
      }
    },
  };
}
