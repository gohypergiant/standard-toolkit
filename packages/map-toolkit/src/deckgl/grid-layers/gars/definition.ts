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

import type { GridDefinition, GridZoomRange } from '../core/types';
import { createGARSRenderer } from './renderer';

/** Grid type identifiers for the three GARS precision levels */
export const GARS_GRID_TYPES = {
  THIRTY_MINUTE: 'THIRTY_MINUTE',
  FIFTEEN_MINUTE: 'FIFTEEN_MINUTE',
  FIVE_MINUTE: 'FIVE_MINUTE',
} as const;

/**
 * Default zoom ranges for GARS grid types
 */
export const GARS_ZOOM_RANGES: GridZoomRange[] = [
  {
    type: GARS_GRID_TYPES.THIRTY_MINUTE,
    key: '30min',
    minZoom: 6,
    maxZoom: 8,
    labelMinZoom: 6,
  },
  {
    type: GARS_GRID_TYPES.FIFTEEN_MINUTE,
    key: '15min',
    minZoom: 8,
    maxZoom: 12,
    labelMinZoom: 8,
  },
  {
    type: GARS_GRID_TYPES.FIVE_MINUTE,
    key: '5min',
    minZoom: 12,
    maxZoom: 20,
    labelMinZoom: 12,
  },
];

/**
 * GARS grid definition
 */
export const garsDefinition: GridDefinition = {
  id: 'gars',
  name: 'GARS',
  zoomRanges: GARS_ZOOM_RANGES,
  defaultStyles: {
    [GARS_GRID_TYPES.THIRTY_MINUTE]: {
      lineColor: [255, 100, 100, 200],
      lineWidth: 2.5,
      labelColor: [255, 255, 255, 255],
      labelSize: 14,
      fontFamily: 'Monaco, monospace',
      fontWeight: 'bold',
      textAnchor: 'middle',
      alignmentBaseline: 'center',
      backgroundColor: [40, 40, 40, 200],
      backgroundPadding: 6,
    },
    [GARS_GRID_TYPES.FIFTEEN_MINUTE]: {
      lineColor: [255, 180, 100, 180],
      lineWidth: 2,
      labelColor: [255, 255, 255, 255],
      labelSize: 12,
      fontFamily: 'Monaco, monospace',
      fontWeight: 'normal',
      textAnchor: 'middle',
      alignmentBaseline: 'center',
      backgroundColor: [40, 40, 40, 180],
      backgroundPadding: 5,
    },
    [GARS_GRID_TYPES.FIVE_MINUTE]: {
      lineColor: [255, 255, 120, 160],
      lineWidth: 1.5,
      labelColor: [255, 255, 255, 255],
      labelSize: 10,
      fontFamily: 'Monaco, monospace',
      fontWeight: 'normal',
      textAnchor: 'middle',
      alignmentBaseline: 'center',
      backgroundColor: [40, 40, 40, 160],
      backgroundPadding: 4,
    },
  },
  renderer: createGARSRenderer(),
  options: {
    wrapLongitude: false,
  },
};
