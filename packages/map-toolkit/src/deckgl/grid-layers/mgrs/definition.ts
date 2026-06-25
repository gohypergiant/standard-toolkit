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

import { createMGRSRenderer } from './renderer';
import type { GridDefinition, GridZoomRange } from '../core/types';
import { DEFAULT_STYLES } from '../shared/constants';

/**
 * MGRS grid types representing different precision levels.
 *
 * - `GZD`: Grid Zone Designator (6° longitude × 8° latitude zones)
 * - `GRID_100KM`: 100-kilometer squares within each GZD
 * - `GRID_10KM`: 10-kilometer squares
 * - `GRID_1KM`: 1-kilometer squares
 * - `GRID_1M`: 1-meter squares (not currently implemented)
 */
export const MGRS_GRID_TYPES = {
  GZD: 'GZD',
  GRID_100KM: 'GRID_100KM',
  GRID_10KM: 'GRID_10KM',
  GRID_1KM: 'GRID_1KM',
} as const;

/**
 * Default zoom ranges for MGRS grid types.
 *
 * Each range controls when grid lines and labels are visible.
 * Label restrictions are configured in the renderer using @ngageoint/mgrs-js API.
 */
export const MGRS_ZOOM_RANGES: GridZoomRange[] = [
  {
    type: MGRS_GRID_TYPES.GZD,
    key: 'gzd',
    minZoom: 3,
    maxZoom: 20,
    labelMinZoom: 3,
  },
  {
    type: MGRS_GRID_TYPES.GRID_100KM,
    key: '100km',
    minZoom: 5,
    maxZoom: 20,
    labelMinZoom: 5,
  },
  {
    type: MGRS_GRID_TYPES.GRID_10KM,
    key: '10km',
    minZoom: 8,
    maxZoom: 20,
    labelMinZoom: 8,
  },
  {
    type: MGRS_GRID_TYPES.GRID_1KM,
    key: '1km',
    minZoom: 11,
    maxZoom: 20,
    labelMinZoom: 11,
  },
];

/**
 * MGRS grid definition
 */
export const mgrsDefinition: GridDefinition = {
  id: 'mgrs',
  name: 'MGRS',
  zoomRanges: MGRS_ZOOM_RANGES,
  defaultStyles: {
    [MGRS_GRID_TYPES.GZD]: {
      ...DEFAULT_STYLES,
      lineWidth: 2,
      labelSize: 18,
    },
    [MGRS_GRID_TYPES.GRID_100KM]: {
      ...DEFAULT_STYLES,
      lineWidth: 1.2,
      labelSize: 12,
    },
    [MGRS_GRID_TYPES.GRID_10KM]: {
      ...DEFAULT_STYLES,
      lineWidth: 1,
      labelSize: 10,
    },
    [MGRS_GRID_TYPES.GRID_1KM]: {
      ...DEFAULT_STYLES,
      lineWidth: 0.8,
      labelSize: 8,
    },
  },
  renderer: createMGRSRenderer(),
  options: {
    wrapLongitude: true,
    requiresZones: true,
  },
};
