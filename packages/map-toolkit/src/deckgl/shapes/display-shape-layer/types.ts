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
import type { Rgba255Tuple } from '@accelint/predicates';
import type { CompositeLayerProps } from '@deck.gl/core';
import type { Shape, ShapeId } from '../shared/types';
import type { LabelPositionOptions } from './utils/labels';

// internal
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
    fillColor: Rgba255Tuple;
    lineColor: Rgba255Tuple;
    shapeId?: ShapeId;
  };
};

/** A vertical line segment from ground to an elevated position. */
export type LineSegment = {
  source: [number, number, number];
  target: [number, number, number];
  color: Rgba255Tuple;
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
 * State type for DisplayShapeLayer
 */
export type DisplayShapeLayerState = {
  /** Index of currently hovered shape, undefined when not hovering */
  hoverIndex?: number;
  /** ID of the last hovered shape for event deduplication */
  lastHoveredId?: ShapeId;
  /** Allow additional properties from base layer state */
  [key: string]: unknown;
};

/**
 * Cache for transformed features to avoid recreating objects on every render.
 */
export type FeaturesCache = {
  /** Reference to the original data array for identity comparison */
  data: Shape[];
  /** Transformed features with shapeId added to properties */
  features: Shape['feature'][];
  /** Map of shapeId to feature index for O(1) lookup */
  shapeIdToIndex: Map<ShapeId, number>;
  /** Pre-normalized line colors parallel to features, for O(1) accessor lookup */
  normalizedLineColors: Rgba255Tuple[];
};

/**
 * Cache for elevation-derived data (feature classification + curtain features).
 * Keyed on features identity and applyBaseOpacity to avoid per-frame recomputation.
 * deck.gl calls renderLayers() every frame during map interaction; without this cache,
 * curtain polygon arrays are recreated every frame, forcing deck.gl GPU buffer rebuilds.
 */
export type ElevationCache = {
  features: Shape['feature'][];
  applyBaseOpacity: boolean | undefined;
  classification: ElevatedFeatureClassification;
  curtainFeatures: CurtainFeature[];
};

/**
 * Cache for elevation indicator line segments.
 * Keyed on features, selectedShapeId, and hoverIndex since all three affect output.
 */
export type IndicatorCache = {
  features: Shape['feature'][];
  selectedShapeId: ShapeId | undefined;
  hoverIndex: number | undefined;
  lineData: LineSegment[];
};

// external
/**
 * Label display mode for shapes
 * - `'always'`: Show labels for all shapes
 * - `'hover'`: Show label only for the currently hovered shape
 * - `'never'`: Never show labels
 */
export type ShowLabelsMode = 'always' | 'hover' | 'never';

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
   * Currently selected shape ID.
   * When set, renders a brightness overlay for polygon shapes.
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
   * Called with no argument when hover ends
   * @param shape - The hovered shape, or undefined when hover ends
   */
  onShapeHover?: (shape?: Shape) => void;

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
   * Whether to show the highlight layer around selected shapes
   * When false, no highlight effect is rendered even when a shape is selected
   * @default false
   */
  showHighlight?: boolean;

  /**
   * Custom highlight color for selected shapes [r, g, b, a]
   * Each channel is 0-255
   * @default [40, 245, 190, 100] - Turquoise at ~39% opacity
   * @example Custom red highlight
   * ```tsx
   * highlightColor={[255, 0, 0, 128]} // Red at 50% opacity
   * ```
   */
  highlightColor?: Rgba255Tuple;

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
