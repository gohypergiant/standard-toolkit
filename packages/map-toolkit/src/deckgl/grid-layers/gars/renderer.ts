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

import type {
  CellBounds,
  Coordinate,
  GridRenderer,
  LabelData,
  LineData,
  PolygonData,
  RenderContext,
  RenderResult,
} from '../core/types';
import { Grids, GridType } from '@ngageoint/gars-js';
import { logger } from '../shared/utils';

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
      return undefined;
  }
}

/**
 * Creates a GARS grid renderer that converts GARS grid data into deck.gl-compatible
 * line and label geometry.
 *
 * Configures all three precision levels (30-minute, 15-minute, 5-minute) with appropriate
 * zoom ranges and enables labelers.
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

  /**
   * The library disables labels at a certain zoom by default, so this just resets them
   * for more flexibility on our end, using our own default configurations, with some
   * reasonable ranges to avoid a footgun
   */
  grids.setLabelMinZoom(GridType.THIRTY_MINUTE, 0);
  grids.setLabelMaxZoom(GridType.THIRTY_MINUTE, 20);
  grids.enableLabeler(GridType.THIRTY_MINUTE);

  grids.setLabelMinZoom(GridType.FIFTEEN_MINUTE, 0);
  grids.setLabelMaxZoom(GridType.FIFTEEN_MINUTE, 20);
  grids.enableLabeler(GridType.FIFTEEN_MINUTE);

  grids.setLabelMinZoom(GridType.FIVE_MINUTE, 5);
  grids.setLabelMaxZoom(GridType.FIVE_MINUTE, 20);
  grids.enableLabeler(GridType.FIVE_MINUTE);

  return {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: unavoidable here (for now)
    render: (context: RenderContext): RenderResult => {
      const { bounds, zoom, gridType } = context;

      const lineData: LineData[] = [];
      const labelData: LabelData[] = [];
      const polygonData: PolygonData[] = [];

      const garsGridType = mapToLibraryGridType(gridType);

      if (!garsGridType) {
        return { lines: lineData, labels: labelData, polygons: polygonData };
      }

      try {
        const grid = grids.getGrid(garsGridType);
        if (!grid) {
          return { lines: lineData, labels: labelData, polygons: polygonData };
        }

        // Get grid lines within bounds (GARS doesn't need zones)
        const lines = grid.getLines(zoom, bounds);

        if (lines) {
          for (const line of lines) {
            const point1 = line.getPoint1();
            const point2 = line.getPoint2();

            const path: LineData['path'] = [
              [point1.getLongitude(), point1.getLatitude()],
              [point2.getLongitude(), point2.getLatitude()],
            ];

            const cellId = `${point1.getLongitude()},${point1.getLatitude()}`;

            lineData.push({
              path,
              cellId,
            });
          }
        }

        // TODO: make these as static as possible so that we don't need to recalculate
        // Long term we could potentially just export array buffers
        const labels = grid.getLabels(zoom, bounds);
        if (labels) {
          for (const label of labels) {
            const center = label.getCenter();
            const name = label.getName();
            const cellBounds = label.getBounds();

            if (center && name && cellBounds) {
              // Convert bounds to polygon coordinates [sw, se, ne, nw, sw]
              const minLng = cellBounds.getMinLongitude();
              const minLat = cellBounds.getMinLatitude();
              const maxLng = cellBounds.getMaxLongitude();
              const maxLat = cellBounds.getMaxLatitude();

              const sw: Coordinate = [minLng, minLat];
              const se: Coordinate = [maxLng, minLat];
              const ne: Coordinate = [maxLng, maxLat];
              const nw: Coordinate = [minLng, maxLat];

              const polygon: PolygonData['polygon'] = [sw, se, ne, nw, sw];

              const bounds: CellBounds = {
                minLongitude: minLng,
                minLatitude: minLat,
                maxLongitude: maxLng,
                maxLatitude: maxLat,
                polygon,
              };

              const position: Coordinate = [
                center.getLongitude(),
                center.getLatitude(),
              ];

              labelData.push({
                text: name,
                position,
                cellId: name,
                bounds,
              });

              // Add polygon data for cell-wide interaction
              polygonData.push({
                polygon,
                cellId: name,
                bounds,
              });
            }
          }
        }

        return {
          lines: lineData,
          labels: labelData,
          polygons: polygonData,
        } as RenderResult;
      } catch (error) {
        logger.warn(
          `Failed to render grid type ${gridType}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        return { lines: lineData, labels: labelData, polygons: polygonData };
      }
    },
  };
}
