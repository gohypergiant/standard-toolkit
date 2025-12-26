/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// Display Shape Layer exports
export { DisplayShapeLayer } from './display-shape-layer/index';
export { useShapeSelection } from './display-shape-layer/use-shape-selection';
export { DrawShapeEvents } from './draw-shape-layer/events';
// Draw Shape Layer exports
export { DrawShapeLayer } from './draw-shape-layer/index';
export { useDrawShapes } from './draw-shape-layer/use-draw-shapes';
// Constant exports
export {
  BASE_FILL_OPACITY,
  DASH_ARRAYS,
  DEFAULT_COLORS,
  DEFAULT_STYLE_PROPERTIES,
  SHAPE_LAYER_IDS,
  STROKE_PATTERNS,
  STROKE_WIDTHS,
} from './shared/constants';
// Event exports
export { SHAPE_EVENTS, ShapeEvents } from './shared/events';
export { ShapeFeatureType } from './shared/types';
export type {
  DisplayShapeLayerProps,
  StyledFeature,
  StyledFeatureProperties,
} from './display-shape-layer/types';
export type { UseShapeSelectionReturn } from './display-shape-layer/use-shape-selection';
export type {
  CardinalLabelCoordinateAnchor,
  LabelHorizontalPosition,
  LabelPosition2d,
  LabelPositionOptions,
  LabelVerticalPosition,
} from './display-shape-layer/utils/labels';
export type {
  ShapeEventHandler,
  ShapeEventPayload,
  ShapeEventType,
} from './shared/events';
// Shared type exports
export type {
  CircleProperties,
  CircleRadius,
  DisplayShape,
  EditableShape,
  ShapeFeature,
  ShapeFeatureProperties,
  ShapeFeatureTypeValues,
  ShapeId,
  StyleProperties,
} from './shared/types';
