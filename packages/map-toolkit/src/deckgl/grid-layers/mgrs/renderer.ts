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

import { Grids, GridType, GridZones } from '@ngageoint/mgrs-js';
import type {
  Coordinate,
  GridRenderer,
  LabelData,
  LineData,
  PolygonData,
  RenderContext,
  RenderResult,
} from '../core/types';
import { logger } from '../shared/utils';

/**
 * Maps internal grid type strings to @ngageoint/mgrs-js GridType enum values.
 *
 * @param gridType - Internal grid type identifier (e.g., 'GZD', 'GRID_100KM')
 * @returns Corresponding GridType enum value, or null if not recognized
 */
function mapToLibraryGridType(gridType: string): GridType | undefined {
  switch (gridType) {
    case 'GZD':
      return GridType.GZD;
    case 'GRID_100KM':
      return GridType.HUNDRED_KILOMETER;
    case 'GRID_10KM':
      return GridType.TEN_KILOMETER;
    case 'GRID_1KM':
      return GridType.KILOMETER;
    default:
      return undefined;
  }
}

/**
 * Creates an MGRS grid renderer using @ngageoint/mgrs-js library.
 *
 * Configures all four precision levels (GZD, 100km, 10km, 1km) with appropriate
 * zoom ranges and enables labelers that are disabled by default in the library.
 *
 * @returns GridRenderer instance with configured render function
 */
export function createMGRSRenderer(): GridRenderer {
  const grids = Grids.create();

  /**
   * The library disables labels at a certain zoom by default, so this just resets them
   * for more flexibility on our end, using our own default configurations, with some
   * reasonable ranges to avoid a footgun
   */
  grids.setLabelMinZoom(GridType.GZD, 0);
  grids.setLabelMinZoom(GridType.HUNDRED_KILOMETER, 0);
  grids.setLabelMinZoom(GridType.TEN_KILOMETER, 8);
  grids.setLabelMaxZoom(GridType.TEN_KILOMETER, 20);
  grids.setLabelMinZoom(GridType.KILOMETER, 10);
  grids.setLabelMaxZoom(GridType.KILOMETER, 20);

  grids.enableLabeler(GridType.TEN_KILOMETER);
  grids.enableLabeler(GridType.KILOMETER);

  return {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Zone-based rendering requires complex logic
    render: (context: RenderContext): RenderResult => {
      const { bounds, zoom, gridType } = context;

      const lineData: LineData[] = [];
      const labelData: LabelData[] = [];
      const polygonData: PolygonData[] = [];

      // Map our grid type to library grid type
      const mgrsGridType = mapToLibraryGridType(gridType);

      if (mgrsGridType === undefined) {
        return { lines: lineData, labels: labelData, polygons: polygonData };
      }

      try {
        // Get the grid for this type
        const grid = grids.getGrid(mgrsGridType);

        if (!grid) {
          return { lines: lineData, labels: labelData, polygons: polygonData };
        }

        // Get zones that intersect the viewport
        const zones = GridZones.getZones(bounds);

        // Process each zone
        for (const zone of zones) {
          // Get grid lines for this zone within bounds
          const zoneBounds = zone.getBounds();
          const minLon = zoneBounds.getMinLongitude();
          const maxLon = zoneBounds.getMaxLongitude();
          const lines = grid.getLines(zoom, zone, bounds);

          if (!lines) {
            continue;
          }

          // Epsilon for floating-point precision issues at zone boundaries
          const epsilon = 0.000001;

          // Process each grid line
          for (const line of lines) {
            const point1 = line.getPoint1();
            const point2 = line.getPoint2();

            // Extract coordinates
            let lon1 = point1.getLongitude();
            let lat1 = point1.getLatitude();
            let lon2 = point2.getLongitude();
            let lat2 = point2.getLatitude();

            /**
             * The following is a workaround for a known bug in the library
             * https://github.com/ngageoint/mgrs-js/issues/6
             */
            if (
              (lon1 < minLon - epsilon && lon2 < minLon - epsilon) ||
              (lon1 > maxLon + epsilon && lon2 > maxLon + epsilon)
            ) {
              continue;
            }

            // Clip Point 1 to zone bounds using linear interpolation
            if (lon1 < minLon) {
              lat1 = lat1 + ((lat2 - lat1) * (minLon - lon1)) / (lon2 - lon1);
              lon1 = minLon;
            } else if (lon1 > maxLon) {
              lat1 = lat1 + ((lat2 - lat1) * (maxLon - lon1)) / (lon2 - lon1);
              lon1 = maxLon;
            }

            // Clip Point 2 to zone bounds using linear interpolation
            if (lon2 < minLon) {
              lat2 = lat2 + ((lat1 - lat2) * (minLon - lon2)) / (lon1 - lon2);
              lon2 = minLon;
            } else if (lon2 > maxLon) {
              lat2 = lat2 + ((lat1 - lat2) * (maxLon - lon2)) / (lon1 - lon2);
              lon2 = maxLon;
            }

            // Convert line geometry to DeckGL path format
            const path: LineData['path'] = [
              [lon1, lat1],
              [lon2, lat2],
            ];

            // Generate unique cell ID from original (unclipped) coordinates.
            // Used for hover/click events and deduplication.
            const cellId = `${point1.getLongitude()},${point1.getLatitude()}`;

            lineData.push({
              path,
              cellId,
            });
          }

          // Get labels for this zone.
          // Note: MGRSLabeler requires bounds parameter to calculate visible labels.
          const labels = grid.getLabels(zoom, zone, bounds);

          if (!labels) {
            continue;
          }

          // Process each label
          for (const label of labels) {
            const center = label.getCenter();
            const name = label.getName();
            const cellBounds = label.getBounds();

            if (center && name && cellBounds) {
              const minLng = cellBounds.getMinLongitude();
              const minLat = cellBounds.getMinLatitude();
              const maxLng = cellBounds.getMaxLongitude();
              const maxLat = cellBounds.getMaxLatitude();

              const sw: Coordinate = [minLng, minLat];
              const se: Coordinate = [maxLng, minLat];
              const ne: Coordinate = [maxLng, maxLat];
              const nw: Coordinate = [minLng, maxLat];

              const polygon: PolygonData['polygon'] = [sw, se, ne, nw, sw];

              const bounds = {
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
