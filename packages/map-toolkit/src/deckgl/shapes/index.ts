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
// Draw Shape Layer exports
export { DrawShapeEvents } from './draw-shape-layer/events';
export { DrawShapeLayer } from './draw-shape-layer/index';
export { useDrawShape } from './draw-shape-layer/use-draw-shape';
// Edit Shape Layer exports
export { EditShapeEvents } from './edit-shape-layer/events';
export { EditShapeLayer } from './edit-shape-layer/index';
export { useEditShape } from './edit-shape-layer/use-edit-shape';
// Constant exports (public API only)
export {
  BASE_FILL_OPACITY,
  DASH_ARRAYS,
  DEFAULT_COLORS,
  DEFAULT_EDIT_HANDLE_COLOR,
  DEFAULT_EDIT_HANDLE_OUTLINE_COLOR,
  DEFAULT_STYLE_PROPERTIES,
  LINE_PATTERNS,
  LINE_WIDTHS,
  SHAPE_LAYER_IDS,
} from './shared/constants';
// Event exports
export { ShapeEvents } from './shared/events';
export {
  isCircleShape,
  isEllipseShape,
  isLineStringShape,
  isPointShape,
  isPolygonShape,
  isRectangleShape,
  ShapeFeatureType,
} from './shared/types';
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
  DrawShapeEvent,
  DrawShapeEventType,
  ShapeDrawCanceledEvent,
  ShapeDrawingEvent,
  ShapeDrawnEvent,
} from './draw-shape-layer/events';
export type {
  DrawingState,
  DrawShapeLayerProps,
  DrawShapeOptions,
  UseDrawShapeOptions,
  UseDrawShapeReturn,
} from './draw-shape-layer/types';
export type {
  EditShapeEvent,
  EditShapeEventType,
  ShapeEditCanceledEvent,
  ShapeEditingEvent,
  ShapeUpdatedEvent,
} from './edit-shape-layer/events';
export type {
  EditingState,
  EditMode,
  EditShapeLayerProps,
  EditShapeOptions,
  UseEditShapeOptions,
  UseEditShapeReturn,
} from './edit-shape-layer/types';
export type { ShapeEventType } from './shared/events';
// Shared type exports
export type {
  CircleFeatureProperties,
  CircleProperties,
  CircleRadius,
  CircleShape,
  EllipseFeatureProperties,
  EllipseProperties,
  EllipseShape,
  LineStringShape,
  PointShape,
  PolygonShape,
  RectangleShape,
  Shape,
  ShapeFeature,
  ShapeFeatureProperties,
  ShapeFeatureTypeValues,
  ShapeId,
  StyleProperties,
  Subscription,
} from './shared/types';
