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

import { uuid } from '@accelint/core';
import { getLogger } from '@accelint/logger';
import { centroid, distance } from '@turf/turf';
import { DEFAULT_DISTANCE_UNITS } from '@/shared/units';
import { DEFAULT_STYLE_PROPERTIES } from '../../shared/constants';
import {
  type CircleProperties,
  type EllipseProperties,
  type Shape,
  type ShapeFeature,
  type ShapeFeatureType,
  ShapeFeatureType as ShapeFeatureTypeEnum,
  type StyleProperties,
} from '../../shared/types';
import type { Feature, Polygon, Position } from 'geojson';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'warn',
  prefix: '[FeatureConversion]',
  pretty: true,
});

/**
 * Generate a default name for a shape based on its type.
 *
 * Creates a name in the format "New {ShapeType} (HH:MM:SS AM/PM)" using the
 * current time. This provides a default name for shapes created through the
 * drawing interface that includes a timestamp for uniqueness.
 *
 * @param shape - The shape type to generate a name for
 * @returns A formatted name string with timestamp
 *
 * @example
 * ```typescript
 * import { generateShapeName } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/utils/feature-conversion';
 * import { ShapeFeatureType } from '@accelint/map-toolkit/deckgl/shapes/shared/types';
 *
 * const name = generateShapeName(ShapeFeatureType.Polygon);
 * // Returns: "New Polygon (2:30:45 PM)"
 * ```
 */
function generateShapeName(shape: ShapeFeatureType): string {
  const timestamp = new Date().toLocaleTimeString();
  return `New ${shape} (${timestamp})`;
}

/**
 * Compute circle properties from a polygon geometry (circle approximation).
 *
 * The EditableGeoJsonLayer creates circles as polygon approximations with multiple
 * vertices arranged in a circular pattern. This function extracts the original circle's
 * center and radius from that polygon approximation.
 *
 * The center is calculated using Turf's centroid function, and the radius is computed
 * as the distance from the center to the first edge point.
 *
 * @param geometry - Polygon geometry representing a circle approximation
 * @returns Circle properties with center and radius, or undefined if computation fails
 *
 * @example
 * ```typescript
 * import { computeCircleProperties } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/utils/feature-conversion';
 * import type { Polygon } from 'geojson';
 *
 * const polygonGeometry: Polygon = {
 *   type: 'Polygon',
 *   coordinates: [[
 *     [-122.4, 37.8],
 *     [-122.39, 37.81],
 *     // ... more points forming a circle
 *     [-122.4, 37.8], // closing point
 *   ]],
 * };
 *
 * const circleProps = computeCircleProperties(polygonGeometry);
 * // Returns: { center: [-122.395, 37.805], radius: { value: 1.5, units: 'kilometers' } }
 * ```
 */
function computeCircleProperties(
  geometry: Polygon,
): CircleProperties | undefined {
  const coordinates = geometry.coordinates[0];
  if (!coordinates || coordinates.length < 3) {
    logger.warn(
      'Cannot compute circle properties: polygon has insufficient coordinates',
    );
    return undefined;
  }

  // Calculate center using turf centroid
  const centerFeature = centroid({
    type: 'Polygon',
    coordinates: geometry.coordinates,
  });
  const center = centerFeature.geometry.coordinates as [number, number];

  // Validate center coordinates are valid numbers
  const isCenterValid =
    Number.isFinite(center[0]) && Number.isFinite(center[1]);
  if (!isCenterValid) {
    logger.warn('Cannot compute circle properties: invalid center coordinates');
    return undefined;
  }

  // Calculate radius as distance from center to first point
  const firstPoint = coordinates[0] as Position;

  // Validate first point coordinates
  const isFirstPointValid =
    firstPoint &&
    Number.isFinite(firstPoint[0]) &&
    Number.isFinite(firstPoint[1]);
  if (!isFirstPointValid) {
    logger.warn(
      'Cannot compute circle properties: invalid edge point coordinates',
    );
    return undefined;
  }

  const radius = distance(center, firstPoint, {
    units: DEFAULT_DISTANCE_UNITS,
  });

  // Validate computed radius
  if (!Number.isFinite(radius) || radius <= 0) {
    logger.warn('Cannot compute circle properties: invalid radius computed');
    return undefined;
  }

  return {
    center,
    radius: {
      value: radius,
      units: DEFAULT_DISTANCE_UNITS,
    },
  };
}

/**
 * Edit properties attached by DrawEllipseUsingThreePointsMode.
 *
 * The DrawEllipseUsingThreePointsMode from @deck.gl-community/editable-layers
 * attaches ellipse metadata to the feature's properties.editProperties field.
 * This interface defines the structure of that metadata.
 *
 * @internal
 */
interface EllipseEditProperties {
  /** Shape discriminator - always 'Ellipse' */
  shape: 'Ellipse';
  /** X semi-axis (horizontal radius) with value and unit */
  xSemiAxis: { value: number; unit: string };
  /** Y semi-axis (vertical radius) with value and unit */
  ySemiAxis: { value: number; unit: string };
  /** Rotation angle in degrees */
  angle: number;
  /** Center point coordinates [longitude, latitude] */
  center: [number, number];
}

/**
 * Compute ellipse properties from a feature's editProperties.
 *
 * The DrawEllipseUsingThreePointsMode attaches ellipse metadata to the feature's
 * properties.editProperties field. This function extracts and normalizes that data
 * into the standard EllipseProperties format used by Shape objects.
 *
 * The function validates that editProperties exists and has the correct shape
 * discriminator before extracting the ellipse parameters.
 *
 * @param feature - GeoJSON feature with editProperties attached by the draw mode
 * @returns Normalized ellipse properties, or undefined if extraction fails
 *
 * @example
 * ```typescript
 * import { computeEllipseProperties } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/utils/feature-conversion';
 * import type { Feature } from 'geojson';
 *
 * const feature: Feature = {
 *   type: 'Feature',
 *   geometry: { type: 'Polygon', coordinates: [[...]] },
 *   properties: {
 *     editProperties: {
 *       shape: 'Ellipse',
 *       center: [-122.4, 37.8],
 *       xSemiAxis: { value: 2.5, unit: 'kilometers' },
 *       ySemiAxis: { value: 1.5, unit: 'kilometers' },
 *       angle: 45,
 *     },
 *   },
 * };
 *
 * const ellipseProps = computeEllipseProperties(feature);
 * // Returns normalized ellipse properties with standard distance units
 * ```
 */
function computeEllipseProperties(
  feature: Feature,
): EllipseProperties | undefined {
  const editProps = (
    feature.properties as { editProperties?: EllipseEditProperties } | null
  )?.editProperties;

  if (!editProps || editProps.shape !== 'Ellipse') {
    logger.warn(
      'Cannot compute ellipse properties: feature missing editProperties or not an ellipse',
    );
    return undefined;
  }

  return {
    center: editProps.center,
    xSemiAxis: {
      value: editProps.xSemiAxis.value,
      units: DEFAULT_DISTANCE_UNITS,
    },
    ySemiAxis: {
      value: editProps.ySemiAxis.value,
      units: DEFAULT_DISTANCE_UNITS,
    },
    angle: editProps.angle,
  };
}

/**
 * Convert a raw GeoJSON Feature from EditableGeoJsonLayer to a Shape.
 *
 * This function transforms the raw GeoJSON features produced by deck.gl's
 * EditableGeoJsonLayer into the Shape format used throughout the map-toolkit.
 * It handles geometry normalization, style property merging, and special handling
 * for Circle and Ellipse shapes which are stored as polygon approximations.
 *
 * ## The returned Shape includes:
 * - **Auto-generated UUID**: Unique identifier for the shape
 * - **Auto-generated name**: Format "New {ShapeType} (HH:MM:SS AM/PM)"
 * - **Merged style properties**: Defaults + optional custom overrides
 * - **Circle/ellipse properties**: Computed from geometry if applicable
 * - **lastUpdated timestamp**: UTC timestamp when created
 * - **locked: false**: Newly created shapes are always unlocked
 *
 * ## Special Handling
 * - **Circles**: Extracts center and radius from polygon approximation
 * - **Ellipses**: Extracts center, semi-axes, and angle from editProperties
 *
 * @param feature - The raw GeoJSON feature from the editable layer
 * @param shape - The type of shape being created
 * @param styleDefaults - Optional style property overrides (colors, line width, etc.)
 * @returns A complete Shape object ready for use in DisplayShapeLayer
 *
 * @example Basic usage with polygon
 * ```typescript
 * import { convertFeatureToShape } from '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/utils/feature-conversion';
 * import { ShapeFeatureType } from '@accelint/map-toolkit/deckgl/shapes/shared/types';
 * import type { Feature } from 'geojson';
 *
 * const feature: Feature = {
 *   type: 'Feature',
 *   geometry: {
 *     type: 'Polygon',
 *     coordinates: [[
 *       [-122.4, 37.8],
 *       [-122.3, 37.8],
 *       [-122.3, 37.9],
 *       [-122.4, 37.9],
 *       [-122.4, 37.8],
 *     ]],
 *   },
 *   properties: {},
 * };
 *
 * const shape = convertFeatureToShape(feature, ShapeFeatureType.Polygon);
 * // Returns: { id: 'uuid...', name: 'New Polygon (2:30:45 PM)', shape: 'Polygon', ... }
 * ```
 *
 * @example With custom style defaults
 * ```typescript
 * const shape = convertFeatureToShape(
 *   feature,
 *   ShapeFeatureType.Circle,
 *   {
 *     fillColor: [255, 100, 100, 180],   // RGBA: red fill
 *     lineColor: [200, 0, 0, 255],        // RGBA: dark red line
 *     lineWidth: 4,
 *     linePattern: 'solid',
 *   }
 * );
 * // Returns a shape with custom colors applied
 * ```
 */
export function convertFeatureToShape(
  feature: Feature,
  shape: ShapeFeatureType,
  styleDefaults?: Partial<StyleProperties> | null,
): Shape {
  const id = uuid();
  const name = generateShapeName(shape);

  // Merge default styles with any provided defaults
  const styleProperties: StyleProperties = {
    ...DEFAULT_STYLE_PROPERTIES,
    ...(styleDefaults ?? {}),
  };

  // Compute circle properties if this is a circle
  let circleProperties: CircleProperties | undefined;
  if (
    shape === ShapeFeatureTypeEnum.Circle &&
    feature.geometry.type === 'Polygon'
  ) {
    circleProperties = computeCircleProperties(feature.geometry);
  }

  // Compute ellipse properties if this is an ellipse
  let ellipseProperties: EllipseProperties | undefined;
  if (
    shape === ShapeFeatureTypeEnum.Ellipse &&
    feature.geometry.type === 'Polygon'
  ) {
    ellipseProperties = computeEllipseProperties(feature);
  }

  // Create the styled feature
  const styledFeature: ShapeFeature = {
    type: 'Feature',
    geometry: feature.geometry,
    properties: {
      styleProperties,
      circleProperties,
      ellipseProperties,
      shapeId: id,
    },
  };

  // Type assertion needed because TypeScript can't narrow the return type
  // based on the runtime shape value. The constructed object satisfies
  // the Shape union at runtime based on which shape was passed in.
  return {
    id,
    name,
    shape,
    feature: styledFeature,
    lastUpdated: Date.now(),
    locked: false,
  } as Shape;
}
