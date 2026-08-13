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
import { DEFAULT_STYLES } from '../shared/constants';

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
    minZoom: 4,
    maxZoom: 20,
    labelMinZoom: 6,
    labelMaxZoom: 8,
  },
  {
    type: GARS_GRID_TYPES.FIFTEEN_MINUTE,
    key: '15min',
    minZoom: 8,
    maxZoom: 18,
    labelMinZoom: 8,
    labelMaxZoom: 11,
  },
  {
    type: GARS_GRID_TYPES.FIVE_MINUTE,
    key: '5min',
    minZoom: 11,
    maxZoom: 20,
    labelMinZoom: 11,
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
      ...DEFAULT_STYLES,
      lineWidth: 1.2,
      labelSize: 14,
    },
    [GARS_GRID_TYPES.FIFTEEN_MINUTE]: {
      ...DEFAULT_STYLES,
      lineWidth: 0.8,
      labelSize: 12,
    },
    [GARS_GRID_TYPES.FIVE_MINUTE]: {
      ...DEFAULT_STYLES,
      lineWidth: 0.8,
      labelSize: 10,
    },
  },
  renderer: createGARSRenderer(),
  options: {
    wrapLongitude: false,
  },
};
