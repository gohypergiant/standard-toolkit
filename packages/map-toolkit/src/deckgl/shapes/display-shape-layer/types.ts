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

import type { UniqueId } from '@accelint/core';
import type { CompositeLayerProps } from '@deck.gl/core';
import type {
  Shape,
  ShapeId,
  StyledFeature as SharedStyledFeature,
} from '../shared/types';
import type { LabelPositionOptions } from './utils/labels';

/**
 * A vertical curtain polygon feature for elevation visualization.
 * Used to render filled vertical surfaces from ground to elevation for LineStrings.
 */
export type CurtainFeature = {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    fillColor: [number, number, number, number];
    lineColor: [number, number, number, number];
    shapeId?: ShapeId;
  };
};

/** A vertical line segment from ground to an elevated position. */
export type LineSegment = {
  source: [number, number, number];
  target: [number, number, number];
  color: [number, number, number, number];
};

/**
 * Result of classifying features by geometry type and elevation.
 */
export type ElevatedFeatureClassification = {
  lines: Shape['feature'][];
  polygons: Shape['feature'][];
  nonPolygons: Shape['feature'][];
};

/**
 * Label display mode for shapes
 * - `'always'`: Show labels for all shapes
 * - `'hover'`: Show label only for the currently hovered shape
 * - `'never'`: Never show labels
 */
export type ShowLabelsMode = 'always' | 'hover' | 'never';

/**
 * Re-export StyledFeature from shared types
 */
export type StyledFeature = SharedStyledFeature;

/**
 * Re-export StyledFeatureProperties from shared types
 */
export type StyledFeatureProperties = SharedStyledFeature['properties'];

/**
 * Props for DisplayShapeLayer
 *
 * @example Basic usage
 * ```tsx
 * const props: DisplayShapeLayerProps = {
 *   id: 'my-shapes',
 *   data: myShapes,
 *   pickable: true,
 *   showLabels: true,
 * };
 * ```
 */
export type DisplayShapeLayerProps = CompositeLayerProps & {
  /** Unique layer ID - required for deck.gl layer management */
  id: string;

  /**
   * Map instance ID for event bus isolation in multi-map scenarios.
   * Shape events will include this ID in their payload,
   * allowing listeners to filter events by map instance.
   */
  mapId: UniqueId;

  /**
   * Array of shapes to display
   * Each shape must have a GeoJSON feature with styleProperties
   */
  data: Shape[];

  /**
   * Currently selected shape ID (for highlighting)
   * When set, renders a highlight layer around the selected shape
   */
  selectedShapeId?: ShapeId;

  /**
   * Callback when a shape is clicked
   * Also triggers a shapes:selected event on the event bus
   * @param shape - The clicked shape with full properties
   */
  onShapeClick?: (shape: Shape) => void;

  /**
   * Callback when a shape is hovered
   * Called with null when hover ends
   * @param shape - The hovered shape, or null when hover ends
   */
  onShapeHover?: (shape: Shape | null) => void;

  /**
   * Label display mode for shapes
   * - `'always'`: Show labels for all shapes
   * - `'hover'`: Show label only for the currently hovered shape (requires `pickable={true}`, the default)
   * - `'never'`: Never show labels
   *
   * Labels use the shape's `label` property, or `name` if label is not set
   * @default 'always'
   */
  showLabels?: ShowLabelsMode;

  /**
   * Global label positioning options
   * Can be overridden per-shape via styleProperties
   * Priority: per-shape properties > labelOptions > defaults
   * @see LabelPositionOptions for available options
   */
  labelOptions?: LabelPositionOptions;

  /**
   * When true (default), multiplies fill color alpha by 0.2 (reducing to 20% of original opacity)
   * for a standard semi-transparent look.
   * When false, colors are rendered exactly as specified in styleProperties.
   * @default true
   * @example Standard semi-transparent fills
   * ```tsx
   * <DisplayShapeLayer data={shapes} applyBaseOpacity />
   * // Shape with fillColor [98, 166, 255, 255] renders at alpha 51 (255 × 0.2)
   * ```
   */
  applyBaseOpacity?: boolean;

  /**
   * Enable 3D elevation rendering features (extrusion, curtains, vertical indicators).
   * When false, shapes render as flat 2D with standard styling.
   * When true, enables:
   * - Polygon extrusion based on elevation coordinates
   * - Filled curtains for elevated LineStrings
   * - Vertical indicator lines from ground to elevated points
   *
   * Typically controlled by camera view: enable in 2.5D/3D, disable in 2D.
   * @default false
   * @example Enable elevation in 2.5D/3D views
   * ```tsx
   * const { cameraState } = useMapCamera(mapId);
   * <DisplayShapeLayer
   *   data={shapes}
   *   enableElevation={cameraState.view !== '2D'}
   * />
   * ```
   */
  enableElevation?: boolean;
};
