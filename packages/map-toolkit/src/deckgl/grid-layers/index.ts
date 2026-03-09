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
 * Grid Layers
 *
 * Coordinate grid visualization layers for deck.gl
 */

// Export layers
export { GarsLayer } from './gars';

// Export types
export type { GARSLayerProps } from './gars/types';
export type {
  GridDefinition,
  GridRenderer,
  GridZoomRange,
  GridStyleConfig,
  GridEvent,
  RenderContext,
  RenderResult,
  LineData,
  LabelData,
} from './core/types';

// Export definitions and constants
export {
  garsDefinition,
  GARS_GRID_TYPES,
  GARS_ZOOM_RANGES,
} from './gars/definition';
