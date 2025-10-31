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

export { BaseMap, type BaseMapProps } from './base-map';
export { BASE_MAP_STYLE, PARAMETERS } from './base-map/constants';
export { MapEvents, MapEventsNamespace } from './base-map/events';
// Shape layer exports
export {
  computeCirclePolygon,
  computeCircleSteps,
  createShapeStore,
  createTemporaryShape,
  DASH_ARRAYS,
  DEFAULT_COLORS,
  DEFAULT_STYLE_PROPERTIES,
  DisplayShapeLayer,
  EditableShapeLayer,
  ERROR_MESSAGES,
  emitShapeEvent,
  formatCoordinate,
  getShapeTypeForMode,
  isDrawingMode,
  isEditingMode,
  isViewMode,
  offShapeEvent,
  onShapeEvent,
  SHAPE_EVENTS,
  SHAPE_LAYER_IDS,
  SHAPE_MODES,
  ShapeFeatureType,
  STROKE_PATTERNS,
  STROKE_WIDTHS,
  useCircleState,
  useHoveredShape,
  useSelectedShape,
  useShape,
  useShapeEdits,
  useShapeStore,
  useShapesByType,
  useStyleProperties,
  validateCoordinates,
  validateGeometry,
  validateShape,
} from './shapes';
export { SymbolLayer, type SymbolLayerProps } from './symbol-layer';
export type {
  MapClickEvent,
  MapClickPayload,
  MapEventType,
  MapHoverEvent,
  MapHoverPayload,
} from './base-map/types';
export type {
  CircleEditProperties,
  CircleRadius,
  CircleState,
  DisplayShapeLayerProps,
  EditableShape,
  EditableShapeLayerProps,
  EditShapeMode,
  ShapeEventHandler,
  ShapeEventPayload,
  ShapeEventType,
  ShapeFeature,
  ShapeFeatureProperties,
  ShapeFeatureTypeValues,
  ShapeId,
  ShapeStore,
  ShapeStoreActions,
  ShapeStoreState,
  ShapeValidationResult,
  StyledFeature,
  StyledFeatureProperties,
  StyleProperties,
  UseShapeEditsOptions,
  UseStylePropertiesOptions,
} from './shapes';
