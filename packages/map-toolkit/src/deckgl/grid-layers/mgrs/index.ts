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

import { BaseGridLayer } from '../core/base-grid-layer';
import { MGRS_GRID_TYPES, mgrsDefinition } from './definition';
import type { MGRSLayerProps } from './types';

/**
 * MGRS (Military Grid Reference System) grid layer
 *
 * Renders MGRS grid cells at four precision levels:
 * - GZD (Grid Zone Designator)
 * - 100km grid cells
 * - 10km grid cells
 * - 1km grid cells
 *
 * @example
 * ```typescript
 * import { MGRSLayer } from '@accelint/map-toolkit/deckgl/grid-layers/mgrs-layer';
 *
 * new MGRSLayer({
 *   id: 'mgrs',
 *   showLabels: true,
 *   gzdStyle: {
 *     lineColor: [255, 0, 0, 255],
 *     lineWidth: 3,
 *   },
 * });
 * ```
 */
export class MgrsLayer extends BaseGridLayer {
  static override layerName = 'MGRSLayer';

  constructor(props: MGRSLayerProps) {
    super({
      ...props,
      definition: mgrsDefinition,
      styleOverrides: {
        [MGRS_GRID_TYPES.GZD]: props.gzdStyle,
        [MGRS_GRID_TYPES.GRID_100KM]: props.grid100kmStyle,
        [MGRS_GRID_TYPES.GRID_10KM]: props.grid10kmStyle,
        [MGRS_GRID_TYPES.GRID_1KM]: props.grid1kmStyle,
      },
    });
  }
}
