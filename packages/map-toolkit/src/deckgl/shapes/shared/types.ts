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

import type { DistanceUnit } from '@accelint/constants/units';
import type { UniqueId } from '@accelint/core';
import type { Color } from '@deck.gl/core';
import type {
  Feature,
  Geometry,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';

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

/** Union of all supported shape feature type string literals. */
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
export type StyleProperties = {
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
};

/**
 * Circle-specific properties for precise rendering
 * Stored alongside the polygon approximation
 */
export type CircleProperties = {
  /** Center point as [longitude, latitude] or [longitude, latitude, elevation] */
  center: [number, number, number?];
  /** Radius with value and units */
  radius: {
    /** Radius value */
    value: number;
    /** Units for the radius measurement */
    units: DistanceUnit;
  };
};

/**
 * Ellipse-specific properties for precise rendering
 * Stored alongside the polygon approximation
 */
export type EllipseProperties = {
  /** Center point as [longitude, latitude] or [longitude, latitude, elevation] */
  center: [number, number, number?];
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
};

/**
 * Properties for styled features.
 *
 * Note: circleProperties and ellipseProperties are optional at the type level
 * but are guaranteed to be present for their respective shape types.
 * Use the type guards (isCircleShape, isEllipseShape) for type narrowing.
 */
export type StyledFeatureProperties = {
  /** Style properties for rendering */
  styleProperties: StyleProperties;
  /** Shape ID for correlation */
  shapeId?: ShapeId;
  /** Circle properties (present for Circle shapes) */
  circleProperties?: CircleProperties;
  /** Ellipse properties (present for Ellipse shapes) */
  ellipseProperties?: EllipseProperties;
  /** Minimum elevation in meters (optional) */
  minElevation?: number;
  /** Maximum elevation in meters (optional) */
  maxElevation?: number;
};

/**
 * Feature properties for Circle shapes (circleProperties required).
 * Used by CircleShape for better type narrowing.
 */
export type CircleFeatureProperties = StyledFeatureProperties & {
  /** Circle properties (required for Circle shapes) */
  circleProperties: CircleProperties;
};

/**
 * Feature properties for Ellipse shapes (ellipseProperties required).
 * Used by EllipseShape for better type narrowing.
 */
export type EllipseFeatureProperties = StyledFeatureProperties & {
  /** Ellipse properties (required for Ellipse shapes) */
  ellipseProperties: EllipseProperties;
};

/**
 * GeoJSON Feature with style properties
 */
export type StyledFeature = Feature & {
  properties: StyledFeatureProperties;
};

/**
 * Base shape properties shared by all shapes.
 */
type BaseShape = {
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
};

/**
 * Circle shape with required circleProperties
 */
export type CircleShape = BaseShape & {
  shape: typeof ShapeFeatureType.Circle;
  feature: StyledFeature & { properties: CircleFeatureProperties };
};

/**
 * Ellipse shape with required ellipseProperties
 */
export type EllipseShape = BaseShape & {
  shape: typeof ShapeFeatureType.Ellipse;
  feature: StyledFeature & { properties: EllipseFeatureProperties };
};

/**
 * Polygon shape
 */
export type PolygonShape = BaseShape & {
  shape: typeof ShapeFeatureType.Polygon;
  feature: StyledFeature;
};

/**
 * Rectangle shape
 */
export type RectangleShape = BaseShape & {
  shape: typeof ShapeFeatureType.Rectangle;
  feature: StyledFeature;
};

/**
 * LineString shape
 */
export type LineStringShape = BaseShape & {
  shape: typeof ShapeFeatureType.LineString;
  feature: StyledFeature;
};

/**
 * Point shape
 */
export type PointShape = BaseShape & {
  shape: typeof ShapeFeatureType.Point;
  feature: StyledFeature;
};

/**
 * Discriminated union of all shape types.
 *
 * Use this for type narrowing based on shape:
 * @example
 * ```typescript
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

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Type guard for Circle shapes.
 *
 * @param shape - The shape to test.
 * @returns True if shape is a CircleShape.
 *
 * @example
 * ```typescript
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
 * @param shape - The shape to test.
 * @returns True if shape is an EllipseShape.
 *
 * @example
 * ```typescript
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
 *
 * @param shape - The shape to test
 * @returns True if shape is a PolygonShape
 * @example
 * ```typescript
 * if (isPolygonShape(shape)) {
 *   // TypeScript narrows shape to PolygonShape
 * }
 * ```
 */
export function isPolygonShape(shape: Shape): shape is PolygonShape {
  return shape.shape === ShapeFeatureType.Polygon;
}

/**
 * Type guard for Rectangle shapes.
 *
 * @param shape - The shape to test
 * @returns True if shape is a RectangleShape
 * @example
 * ```typescript
 * if (isRectangleShape(shape)) {
 *   // TypeScript narrows shape to RectangleShape
 * }
 * ```
 */
export function isRectangleShape(shape: Shape): shape is RectangleShape {
  return shape.shape === ShapeFeatureType.Rectangle;
}

/**
 * Type guard for LineString shapes.
 *
 * @param shape - The shape to test
 * @returns True if shape is a LineStringShape
 * @example
 * ```typescript
 * if (isLineStringShape(shape)) {
 *   // TypeScript narrows shape to LineStringShape
 * }
 * ```
 */
export function isLineStringShape(shape: Shape): shape is LineStringShape {
  return shape.shape === ShapeFeatureType.LineString;
}

/**
 * Type guard for Point shapes.
 *
 * @param shape - The shape to test
 * @returns True if shape is a PointShape
 * @example
 * ```typescript
 * if (isPointShape(shape)) {
 *   // TypeScript narrows shape to PointShape
 * }
 * ```
 */
export function isPointShape(shape: Shape): shape is PointShape {
  return shape.shape === ShapeFeatureType.Point;
}

// =============================================================================
// Geometry Type Predicates
// =============================================================================
// These narrow GeoJSON Geometry unions (e.g. Polygon, MultiPolygon),
// distinct from the Shape type guards above which check shape.shape ('Circle', etc.).

// --- Granular geometry predicates (single GeoJSON type) ---

/**
 * Narrow a GeoJSON geometry to the Point type.
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a Point.
 */
export function isPointType(geometry: Geometry): geometry is Point {
  return geometry.type === 'Point';
}

/**
 * Narrow a GeoJSON geometry to the MultiPoint type.
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a MultiPoint.
 */
export function isMultiPointType(geometry: Geometry): geometry is MultiPoint {
  return geometry.type === 'MultiPoint';
}

/**
 * Narrow a GeoJSON geometry to the LineString type.
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a LineString.
 */
export function isLineStringType(geometry: Geometry): geometry is LineString {
  return geometry.type === 'LineString';
}

/**
 * Narrow a GeoJSON geometry to the MultiLineString type.
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a MultiLineString.
 */
export function isMultiLineStringType(
  geometry: Geometry,
): geometry is MultiLineString {
  return geometry.type === 'MultiLineString';
}

/**
 * Narrow a GeoJSON geometry to the Polygon type.
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a Polygon.
 */
export function isPolygonType(geometry: Geometry): geometry is Polygon {
  return geometry.type === 'Polygon';
}

/**
 * Narrow a GeoJSON geometry to the MultiPolygon type.
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a MultiPolygon.
 */
export function isMultiPolygonType(
  geometry: Geometry,
): geometry is MultiPolygon {
  return geometry.type === 'MultiPolygon';
}

/**
 * Narrow a GeoJSON geometry to the GeometryCollection type.
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a GeometryCollection.
 */
export function isGeometryCollectionType(
  geometry: Geometry,
): geometry is GeometryCollection {
  return geometry.type === 'GeometryCollection';
}

// --- Composite geometry predicates (multiple GeoJSON types) ---

/**
 * Narrow a GeoJSON geometry to polygon-like types (Polygon or MultiPolygon).
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a Polygon or MultiPolygon.
 *
 * @example
 * ```typescript
 * if (isPolygonGeometry(feature.geometry)) {
 *   // geometry narrowed to Polygon | MultiPolygon
 * }
 * ```
 */
export function isPolygonGeometry(
  geometry: Geometry,
): geometry is Polygon | MultiPolygon {
  return geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
}

/**
 * Narrow a GeoJSON geometry to line-like types (LineString or MultiLineString).
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a LineString or MultiLineString.
 *
 * @example
 * ```typescript
 * if (isLineGeometry(feature.geometry)) {
 *   // geometry narrowed to LineString | MultiLineString
 * }
 * ```
 */
export function isLineGeometry(
  geometry: Geometry,
): geometry is LineString | MultiLineString {
  return geometry.type === 'LineString' || geometry.type === 'MultiLineString';
}

/**
 * Narrow a GeoJSON geometry to point-like types (Point or MultiPoint).
 *
 * @param geometry - The GeoJSON geometry to test.
 * @returns True if the geometry is a Point or MultiPoint.
 *
 * @example
 * ```typescript
 * if (isPointGeometry(feature.geometry)) {
 *   // geometry narrowed to Point | MultiPoint
 * }
 * ```
 */
export function isPointGeometry(
  geometry: Geometry,
): geometry is Point | MultiPoint {
  return geometry.type === 'Point' || geometry.type === 'MultiPoint';
}
