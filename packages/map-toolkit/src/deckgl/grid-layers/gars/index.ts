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
import { garsDefinition, GARS_GRID_TYPES } from './definition';
import type { GARSLayerProps } from './types';

/**
 * GARS (Global Area Reference System) grid layer
 *
 * Renders GARS grid cells at three precision levels:
 * - 30-minute cells (coarse)
 * - 15-minute cells (medium)
 * - 5-minute cells (fine)
 *
 * @example
 * ```typescript
 * import { GARSLayer } from '@accelint/map-toolkit/deckgl/grid-layers/gars-layer';
 *
 * new GARSLayer({
 *   id: 'gars',
 *   showLabels: true,
 *   thirtyMinuteStyle: {
 *     lineColor: [255, 0, 0, 255],
 *     lineWidth: 3,
 *   },
 * });
 * ```
 */
export class GarsLayer extends BaseGridLayer {
  static override layerName = 'GarsLayer';

  constructor(props: GARSLayerProps) {
    super({
      ...props,
      definition: garsDefinition,
      styleOverrides: {
        [GARS_GRID_TYPES.THIRTY_MINUTE]: props.thirtyMinuteStyle,
        [GARS_GRID_TYPES.FIFTEEN_MINUTE]: props.fifteenMinuteStyle,
        [GARS_GRID_TYPES.FIVE_MINUTE]: props.fiveMinuteStyle,
      },
    });
  }
}
