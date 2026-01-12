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

'use client';

import type { UniqueId } from '@accelint/core';
import type { Color } from '@deck.gl/core';
import type { Feature, LineString, Point, Polygon } from 'geojson';
import type { DistanceUnit } from '@/shared/units';

/**
 * Supported shape types
 */
export const ShapeFeatureType = {
  Circle: 'Circle',
  Ellipse: 'Ellipse',
  Polygon: 'Polygon',
  Rectangle: 'Rectangle',
  LineString: 'LineString',
  Point: 'Point',
} as const;

export type ShapeFeatureType =
  (typeof ShapeFeatureType)[keyof typeof ShapeFeatureType];

/**
 * Shape ID type - uses UniqueId from core
 */
export type ShapeId = UniqueId;

/**
 * Border/outline width options (in pixels).
 * Controls the width of shape outlines.
 */
export type LineWidth = 1 | 2 | 4 | 8;

/**
 * Border/outline pattern options.
 * Controls how shape outlines are rendered.
 */
export type LinePattern = 'solid' | 'dashed' | 'dotted';

/**
 * Style properties for rendering shapes
 */
export interface StyleProperties {
  /** Fill color as RGBA array [r, g, b, a] where each value is 0-255 */
  fillColor: Color;
  /** Border/outline color as RGBA array [r, g, b, a] where each value is 0-255 */
  lineColor: Color;
  /** Border/outline width in pixels */
  lineWidth: LineWidth;
  /** Border/outline pattern (solid, dashed, or dotted) */
  linePattern: LinePattern;
  /** Optional icon properties for Point geometries */
  icon?: {
    /** Icon atlas URL or data */
    atlas?: string;
    /** Icon mapping (name to position in atlas) */
    mapping?: Record<
      string,
      { x: number; y: number; width: number; height: number; mask?: boolean }
    >;
    /** Icon name to use from mapping */
    name?: string;
    /** Icon size in pixels */
    size?: number;
  };
  /** Optional custom label pixel offset [x, y] */
  labelOffset?: [number, number];
  /** Optional custom label vertical anchor */
  labelVerticalAnchor?: 'top' | 'middle' | 'bottom';
  /** Optional custom label horizontal anchor */
  labelHorizontalAnchor?: 'left' | 'center' | 'right';
  /** Optional custom label coordinate anchor (position along geometry) */
  labelCoordinateAnchor?:
    | 'center'
    | 'start'
    | 'middle'
    | 'end'
    | 'top'
    | 'right'
    | 'bottom'
    | 'left';
}

/**
 * Circle-specific properties for precise rendering
 * Stored alongside the polygon approximation
 */
export interface CircleProperties {
  /** Center point as [longitude, latitude] */
  center: [number, number];
  /** Radius with value and units */
  radius: {
    /** Radius value */
    value: number;
    /** Units for the radius measurement */
    units: DistanceUnit;
  };
}

/**
 * Ellipse-specific properties for precise rendering
 * Stored alongside the polygon approximation
 */
export interface EllipseProperties {
  /** Center point as [longitude, latitude] */
  center: [number, number];
  /** X semi-axis (horizontal radius) with value and units */
  xSemiAxis: {
    /** X semi-axis value */
    value: number;
    /** Units for the measurement */
    units: DistanceUnit;
  };
  /** Y semi-axis (vertical radius) with value and units */
  ySemiAxis: {
    /** Y semi-axis value */
    value: number;
    /** Units for the measurement */
    units: DistanceUnit;
  };
  /** Rotation angle in degrees */
  angle: number;
}

/**
 * Custom geometry types supported
 */
export type CustomGeometry = Point | LineString | Polygon;

/**
 * Properties for styled features.
 *
 * Note: circleProperties and ellipseProperties are optional at the type level
 * but are guaranteed to be present for their respective shape types.
 * Use the type guards (isCircleShape, isEllipseShape) for type narrowing.
 */
export interface StyledFeatureProperties {
  /** Style properties for rendering */
  styleProperties: StyleProperties;
  /** Shape ID for correlation */
  shapeId?: ShapeId;
  /** Circle properties (present for Circle shapes) */
  circleProperties?: CircleProperties;
  /** Ellipse properties (present for Ellipse shapes) */
  ellipseProperties?: EllipseProperties;
}

/**
 * Feature properties for Circle shapes (circleProperties required).
 * Used by CircleShape for better type narrowing.
 */
export interface CircleFeatureProperties extends StyledFeatureProperties {
  /** Circle properties (required for Circle shapes) */
  circleProperties: CircleProperties;
}

/**
 * Feature properties for Ellipse shapes (ellipseProperties required).
 * Used by EllipseShape for better type narrowing.
 */
export interface EllipseFeatureProperties extends StyledFeatureProperties {
  /** Ellipse properties (required for Ellipse shapes) */
  ellipseProperties: EllipseProperties;
}

/**
 * GeoJSON Feature with style properties
 */
export interface StyledFeature extends Feature {
  properties: StyledFeatureProperties;
}

/**
 * Base shape properties shared by all shapes
 */
interface BaseShape {
  /** Unique identifier */
  id: ShapeId;
  /** Full shape name used internally and in UI */
  name: string;
  /**
   * Optional short display label shown on the map
   * If not provided, the `name` property will be used instead
   * Useful for showing abbreviated text on the map (e.g., "NYC" vs "New York City Office")
   */
  label?: string;
  /** GeoJSON feature with geometry and style properties */
  feature: ShapeFeature;
  /** UTC timestamp (only set when saved) */
  lastUpdated?: number;
  /**
   * Whether the shape is locked for editing
   * Locked shapes cannot be modified due to data restrictions or user preference
   */
  locked?: boolean;
}

/**
 * Circle shape with required circleProperties
 */
export interface CircleShape extends BaseShape {
  shape: typeof ShapeFeatureType.Circle;
  feature: StyledFeature & { properties: CircleFeatureProperties };
}

/**
 * Ellipse shape with required ellipseProperties
 */
export interface EllipseShape extends BaseShape {
  shape: typeof ShapeFeatureType.Ellipse;
  feature: StyledFeature & { properties: EllipseFeatureProperties };
}

/**
 * Polygon shape
 */
export interface PolygonShape extends BaseShape {
  shape: typeof ShapeFeatureType.Polygon;
  feature: StyledFeature;
}

/**
 * Rectangle shape
 */
export interface RectangleShape extends BaseShape {
  shape: typeof ShapeFeatureType.Rectangle;
  feature: StyledFeature;
}

/**
 * LineString shape
 */
export interface LineStringShape extends BaseShape {
  shape: typeof ShapeFeatureType.LineString;
  feature: StyledFeature;
}

/**
 * Point shape
 */
export interface PointShape extends BaseShape {
  shape: typeof ShapeFeatureType.Point;
  feature: StyledFeature;
}

/**
 * Discriminated union of all shape types.
 *
 * Use this for type narrowing based on shape:
 * @example
 * ```ts
 * function handleShape(shape: Shape) {
 *   if (shape.shape === 'Circle') {
 *     // TypeScript knows shape.feature.properties.circleProperties exists
 *     const { center, radius } = shape.feature.properties.circleProperties;
 *   }
 * }
 * ```
 */
export type Shape =
  | CircleShape
  | EllipseShape
  | PolygonShape
  | RectangleShape
  | LineStringShape
  | PointShape;

/**
 * Alias for ShapeFeatureType values
 */
export type ShapeFeatureTypeValues = ShapeFeatureType;

/**
 * Alias for StyledFeature (shape feature)
 */
export type ShapeFeature = StyledFeature;

/**
 * Alias for StyledFeature properties
 */
export type ShapeFeatureProperties = StyledFeature['properties'];

/**
 * Circle radius type
 */
export type CircleRadius = CircleProperties['radius'];

/**
 * Coordinate as [longitude, latitude]
 */
export type Coordinate = [number, number];

/**
 * Function type for subscription (useSyncExternalStore pattern).
 * Used by draw-shape-layer and edit-shape-layer stores.
 */
export type Subscription = (onStoreChange: () => void) => () => void;

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Type guard for Circle shapes.
 *
 * @example
 * ```ts
 * if (isCircleShape(shape)) {
 *   // shape.feature.properties.circleProperties is available
 *   const { center, radius } = shape.feature.properties.circleProperties;
 * }
 * ```
 */
export function isCircleShape(shape: Shape): shape is CircleShape {
  return shape.shape === ShapeFeatureType.Circle;
}

/**
 * Type guard for Ellipse shapes.
 *
 * @example
 * ```ts
 * if (isEllipseShape(shape)) {
 *   // shape.feature.properties.ellipseProperties is available
 *   const { center, xSemiAxis, ySemiAxis } = shape.feature.properties.ellipseProperties;
 * }
 * ```
 */
export function isEllipseShape(shape: Shape): shape is EllipseShape {
  return shape.shape === ShapeFeatureType.Ellipse;
}

/**
 * Type guard for Polygon shapes.
 */
export function isPolygonShape(shape: Shape): shape is PolygonShape {
  return shape.shape === ShapeFeatureType.Polygon;
}

/**
 * Type guard for Rectangle shapes.
 */
export function isRectangleShape(shape: Shape): shape is RectangleShape {
  return shape.shape === ShapeFeatureType.Rectangle;
}

/**
 * Type guard for LineString shapes.
 */
export function isLineStringShape(shape: Shape): shape is LineStringShape {
  return shape.shape === ShapeFeatureType.LineString;
}

/**
 * Type guard for Point shapes.
 */
export function isPointShape(shape: Shape): shape is PointShape {
  return shape.shape === ShapeFeatureType.Point;
}
