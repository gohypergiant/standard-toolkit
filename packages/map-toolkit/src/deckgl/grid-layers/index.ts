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

export { GridCellEvents } from './core/types';
export { GarsLayer } from './gars';
export {
  GARS_GRID_TYPES,
  GARS_ZOOM_RANGES,
  garsDefinition,
} from './gars/definition';
export { MgrsLayer } from './mgrs';
export {
  MGRS_GRID_TYPES,
  MGRS_ZOOM_RANGES,
  mgrsDefinition,
} from './mgrs/definition';
export type {
  CellBounds,
  GridCellClickEvent,
  GridClickPayload,
  GridDefinition,
  GridCellEvent,
  GridCellHoverEvent,
  GridHoverPayload,
  GridRenderer,
  GridStyleConfig,
  GridZoomRange,
  LabelData,
  LineData,
  PolygonData,
  RenderContext,
  RenderResult,
} from './core/types';
// Export types
export type { GARSLayerProps } from './gars/types';
export type { MGRSLayerProps } from './mgrs/types';
