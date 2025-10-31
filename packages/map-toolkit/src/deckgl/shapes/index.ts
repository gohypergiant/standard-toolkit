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

'use client';

// Display Shape Layer exports
export { DisplayShapeLayer } from './display-shape-layer/index';
// Hook exports
export {
  useCircleState,
  useShapeEdits,
  useStyleProperties,
} from './editable-shape-layer/hooks';
// Editable Shape Layer exports
export { EditableShapeLayer } from './editable-shape-layer/index';
// Store exports
export {
  createShapeStore,
  useHoveredShape,
  useSelectedShape,
  useShape,
  useShapeStore,
  useShapesByType,
} from './editable-shape-layer/store';
// Utility exports
export {
  computeCirclePolygon,
  computeCircleSteps,
  formatCoordinate,
} from './editable-shape-layer/utils/geometry';
export {
  getShapeTypeForMode,
  isDrawingMode,
  isEditingMode,
  isViewMode,
} from './editable-shape-layer/utils/mode-helpers';
export { createTemporaryShape } from './editable-shape-layer/utils/shape-creation';
export {
  validateCoordinates,
  validateGeometry,
  validateShape,
} from './editable-shape-layer/utils/validation';
// Constant exports
export {
  DASH_ARRAYS,
  DEFAULT_COLORS,
  DEFAULT_STYLE_PROPERTIES,
  ERROR_MESSAGES,
  SHAPE_LAYER_IDS,
  STROKE_PATTERNS,
  STROKE_WIDTHS,
} from './shared/constants';
// Event exports
// Note: emitShapeEvent, onShapeEvent, offShapeEvent are deprecated.
// Use useEmit and useOn from '@accelint/bus/react' directly instead.
export {
  SHAPE_EVENTS,
  SHAPE_MODES,
  ShapeEvents,
  ShapeModes,
} from './shared/events';
export { ShapeFeatureType } from './shared/types';
export type {
  DisplayShapeLayerProps,
  StyledFeature,
  StyledFeatureProperties,
} from './display-shape-layer/types';
export type {
  CircleState,
  UseShapeEditsOptions,
  UseStylePropertiesOptions,
} from './editable-shape-layer/hooks';
export type { EditableShapeLayerProps } from './editable-shape-layer/index';
export type {
  ShapeStore,
  ShapeStoreActions,
  ShapeStoreState,
} from './editable-shape-layer/store';
export type { ShapeValidationResult } from './editable-shape-layer/utils/validation';
export type {
  EditShapeMode,
  ShapeEventHandler,
  ShapeEventPayload,
  ShapeEventType,
} from './shared/events';
// Shared type exports
export type {
  CircleEditProperties,
  CircleRadius,
  EditableShape,
  ShapeFeature,
  ShapeFeatureProperties,
  ShapeFeatureTypeValues,
  ShapeId,
  StyleProperties,
} from './shared/types';
