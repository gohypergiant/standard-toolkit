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

import { uuid } from '@accelint/core';
import { isCircleShape, isEllipseShape } from '../types';
import type { Geometry, Position } from 'geojson';
import type { GeoPosition, Shape } from '../types';

/**
 * Options for duplicating a shape.
 */
export type DuplicateShapeOptions = {
  /** Custom name for the clone. Defaults to "{original name} (copy)". */
  name?: string;
  /** Coordinate offset [longitude, latitude] applied to all geometry coordinates. No offset by default. */
  offset?: [number, number];
};

/**
 * Shift a single coordinate position by the given offset.
 *
 * Preserves elevation (third element) if present.
 *
 * @param position - The [lng, lat] or [lng, lat, elevation] coordinate.
 * @param offset - The [lng, lat] offset to apply.
 * @returns A new position array with the offset applied.
 */
function offsetPosition(
  position: Position,
  offset: [number, number],
): Position {
  // GeoJSON positions always have at least [lng, lat]; cast for safe indexing
  const [lng, lat, elevation] = position as GeoPosition;
  const shifted: Position = [lng + offset[0], lat + offset[1]];

  if (elevation != null) {
    shifted.push(elevation);
  }

  return shifted;
}

/**
 * Shift all coordinates in a GeoJSON geometry by the given offset.
 *
 * Handles all standard GeoJSON geometry types: Point, MultiPoint, LineString,
 * MultiLineString, Polygon, MultiPolygon, and GeometryCollection.
 *
 * @param geometry - The GeoJSON geometry to offset.
 * @param offset - The [longitude, latitude] offset to apply.
 * @returns A new geometry object with all coordinates shifted.
 */
function offsetGeometry(
  geometry: Geometry,
  offset: [number, number],
): Geometry {
  switch (geometry.type) {
    case 'Point':
      return {
        type: 'Point',
        coordinates: offsetPosition(geometry.coordinates, offset),
      };

    case 'MultiPoint':
    case 'LineString':
      return {
        type: geometry.type,
        coordinates: geometry.coordinates.map((pos) =>
          offsetPosition(pos, offset),
        ),
      };

    case 'MultiLineString':
    case 'Polygon':
      return {
        type: geometry.type,
        coordinates: geometry.coordinates.map((ring) =>
          ring.map((pos) => offsetPosition(pos, offset)),
        ),
      };

    case 'MultiPolygon':
      return {
        type: 'MultiPolygon',
        coordinates: geometry.coordinates.map((polygon) =>
          polygon.map((ring) => ring.map((pos) => offsetPosition(pos, offset))),
        ),
      };

    case 'GeometryCollection':
      return {
        type: 'GeometryCollection',
        geometries: geometry.geometries.map((g) => offsetGeometry(g, offset)),
      };
  }
}

/**
 * Duplicate a shape, producing a new Shape with a unique ID and optionally
 * offset coordinates.
 *
 * The clone preserves the original's geometry, style properties, and any
 * shape-specific properties (circle radius, ellipse axes). A new UUID is
 * generated for both the shape ID and the feature's `shapeId` property.
 *
 * @param shape - The source shape to clone.
 * @param options - Optional name override and coordinate offset.
 * @returns A new Shape with a unique ID.
 *
 * @example No offset (clone appears on top of original)
 * ```typescript
 * const clone = duplicateShape(selectedShape);
 * setShapes(prev => [...prev, clone]);
 * ```
 *
 * @example With offset (clone appears nearby)
 * ```typescript
 * const clone = duplicateShape(selectedShape, { offset: [0.05, 0.05] });
 * ```
 *
 * @example With custom name
 * ```typescript
 * const clone = duplicateShape(selectedShape, { name: 'Backup Zone' });
 * ```
 */
export function duplicateShape(
  shape: Shape,
  options?: DuplicateShapeOptions,
): Shape {
  const id = uuid();
  const name = options?.name ?? `${shape.name} (copy)`;
  const offset = options?.offset;

  const geometry = offset
    ? offsetGeometry(shape.feature.geometry, offset)
    : structuredClone(shape.feature.geometry);

  // Build properties, offsetting shape-specific centers when needed
  const properties = {
    ...structuredClone(shape.feature.properties),
    shapeId: id,
  };

  if (offset && isCircleShape(shape) && properties.circleProperties) {
    properties.circleProperties = {
      ...properties.circleProperties,
      center: offsetPosition(
        properties.circleProperties.center,
        offset,
      ) as GeoPosition,
    };
  }

  if (offset && isEllipseShape(shape) && properties.ellipseProperties) {
    properties.ellipseProperties = {
      ...properties.ellipseProperties,
      center: offsetPosition(
        properties.ellipseProperties.center,
        offset,
      ) as GeoPosition,
    };
  }

  return {
    id,
    name,
    shape: shape.shape,
    label: name,
    feature: {
      type: 'Feature',
      geometry,
      properties,
    },
    lastUpdated: Date.now(),
    locked: false,
  } as Shape;
}
