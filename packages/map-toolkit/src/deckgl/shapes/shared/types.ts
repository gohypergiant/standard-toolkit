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

import type { UniqueId } from '@accelint/core';
import type { Color } from '@deck.gl/core';
import type { Feature, LineString, Point, Polygon } from 'geojson';

/**
 * Supported shape types
 */
export const ShapeFeatureType = {
  Circle: 'Circle',
  Polygon: 'Polygon',
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
 * Stroke width options (in pixels)
 */
export type StrokeWidth = 1 | 2 | 4 | 8;

/**
 * Stroke pattern options
 */
export type StrokePattern = 'solid' | 'dashed' | 'dotted';

/**
 * Style properties for rendering shapes
 */
export interface StyleProperties {
  /** Fill color as RGBA array [r, g, b, a] where each value is 0-255 */
  fillColor: Color;
  /** Stroke color as RGBA array [r, g, b, a] where each value is 0-255 */
  strokeColor: Color;
  /** Stroke width in pixels */
  strokeWidth: StrokeWidth;
  /** Stroke pattern */
  strokePattern: StrokePattern;
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
    /** Units (hardcoded to kilometers for v1) */
    units: 'kilometers';
  };
}

/**
 * Custom geometry types supported
 */
export type CustomGeometry = Point | LineString | Polygon;

/**
 * GeoJSON Feature with style properties
 */
export interface StyledFeature extends Feature {
  properties: {
    /** Style properties for rendering */
    styleProperties: StyleProperties;
    /** Circle properties (only for Circle type shapes) */
    circleProperties?: CircleProperties;
    /** Shape ID for correlation */
    shapeId?: ShapeId;
  };
}

/**
 * Shape data structure for DisplayShapeLayer
 */
export interface DisplayShape {
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
  /** Shape type */
  shapeType: ShapeFeatureTypeValues;
  /** GeoJSON feature with geometry and style properties */
  feature: ShapeFeature;
  /** UTC timestamp (only set when saved) */
  lastUpdated?: number;
}

/**
 * Alias for backward compatibility
 * @deprecated Use DisplayShape instead
 */
export type EditableShape = DisplayShape;

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
