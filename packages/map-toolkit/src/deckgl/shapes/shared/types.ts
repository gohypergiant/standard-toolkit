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
import type { Feature, LineString, Point, Polygon } from 'geojson';

/**
 * Supported shape types in v1 (NGC2 implemented only)
 * Future: Rectangle, MultiLineString, MultiPolygon, MultiPoint
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
  /** Fill color as hex string (e.g., "#62a6ff") */
  fillColor: string;
  /** Stroke color as hex string (e.g., "#62a6ff") */
  strokeColor: string;
  /** Stroke width in pixels */
  strokeWidth: StrokeWidth;
  /** Fill opacity percentage (0-100) */
  fillOpacity: number;
  /** Stroke opacity percentage (0-100) */
  strokeOpacity: number;
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
}

/**
 * Circle-specific edit properties
 * Stored alongside the polygon approximation for precise editing
 */
export interface CircleEditProperties {
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
 * Custom geometry types supported in v1
 */
export type CustomGeometry = Point | LineString | Polygon;

/**
 * GeoJSON Feature with style properties
 */
export interface StyledFeature extends Feature {
  properties: {
    /** Style properties for rendering */
    styleProperties: StyleProperties;
    /** Circle edit properties (only for Circle type shapes) */
    editProperties?: CircleEditProperties;
    /** Shape ID for correlation */
    shapeId?: ShapeId;
  };
}

/**
 * Editable shape data structure
 */
export interface EditableShape {
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
  /** Whether shape is locked from editing */
  locked: boolean;
  /** UTC timestamp (only set when saved) */
  lastUpdated?: number;
}

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
export type CircleRadius = CircleEditProperties['radius'];

/**
 * Coordinate as [longitude, latitude]
 */
export type Coordinate = [number, number];

/**
 * Edit modes for shapes
 */
export type EditMode =
  | 'ViewMode'
  | 'DrawCircleFromCenterMode'
  | 'DrawLineStringMode'
  | 'DrawPolygonMode'
  | 'DrawPointMode'
  | 'ModifyMode'
  | 'TranslateMode';

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
