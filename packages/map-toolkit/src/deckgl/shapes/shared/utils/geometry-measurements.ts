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

import { center as turfCenter, distance } from '@turf/turf';
import { DEFAULT_DISTANCE_UNITS } from '@/shared/units';
import type { DistanceUnit } from '@accelint/constants/units';
import type { MultiPolygon, Polygon } from 'geojson';
import type { CircleProperties } from '../types';

/**
 * Circle measurement result containing radius, diameter, and area.
 */
export type CircleMeasurements = {
  /** Radius in the specified units. */
  radius: number;
  /** Diameter (radius * 2) in the specified units. */
  diameter: number;
  /** Area (π * radius²) in the specified units squared. */
  area: number;
};

/**
 * Ellipse measurement result containing semi-axes and area.
 */
export type EllipseMeasurements = {
  /** X semi-axis (horizontal radius) in the specified units. */
  xSemiAxis: number;
  /** Y semi-axis (vertical radius) in the specified units. */
  ySemiAxis: number;
  /** Major axis (full length of longer axis) in the specified units. */
  majorAxis: number;
  /** Minor axis (full length of shorter axis) in the specified units. */
  minorAxis: number;
  /** Area (π * xSemiAxis * ySemiAxis) in the specified units squared. */
  area: number;
};

/**
 * Rectangle measurement result containing width, height, and area.
 */
export type RectangleMeasurements = {
  /** Width in the specified units. */
  width: number;
  /** Height in the specified units. */
  height: number;
  /** Area (width * height) in the specified units squared. */
  area: number;
};

/**
 * Compute circle measurements from center and edge point.
 *
 * @param center - Center point as [longitude, latitude].
 * @param edgePoint - Point on the circle's edge as [longitude, latitude].
 * @param units - Distance units for the measurements.
 * @returns Circle measurements including radius, diameter, and area.
 *
 * @example
 * ```typescript
 * const { radius, diameter, area } = computeCircleMeasurements(
 *   [-122.4, 37.8],
 *   [-122.3, 37.8],
 *   'kilometers'
 * );
 * ```
 */
export function computeCircleMeasurements(
  center: [number, number],
  edgePoint: [number, number],
  units: DistanceUnit,
): CircleMeasurements {
  const radius = distance(center, edgePoint, { units });
  const diameter = radius * 2;
  const area = Math.PI * radius ** 2;

  return { radius, diameter, area };
}

/**
 * Compute ellipse measurements from semi-axis lengths.
 *
 * @param xSemiAxis - X semi-axis (horizontal radius) in the specified units.
 * @param ySemiAxis - Y semi-axis (vertical radius) in the specified units.
 * @returns Ellipse measurements including axes and area.
 *
 * @example
 * ```typescript
 * const { majorAxis, minorAxis, area } = computeEllipseMeasurementsFromAxes(100, 50);
 * ```
 */
export function computeEllipseMeasurementsFromAxes(
  xSemiAxis: number,
  ySemiAxis: number,
): EllipseMeasurements {
  const majorAxis = Math.max(xSemiAxis, ySemiAxis) * 2;
  const minorAxis = Math.min(xSemiAxis, ySemiAxis) * 2;
  const area = Math.PI * xSemiAxis * ySemiAxis;

  return { xSemiAxis, ySemiAxis, majorAxis, minorAxis, area };
}

/**
 * Compute rectangle measurements from adjacent corner points.
 *
 * Uses geodesic distance calculations for accurate measurements on Earth's surface.
 * Corners should be provided in order: corner0 -> corner1 -> corner2 where:
 * - corner0 to corner1 defines one edge (width)
 * - corner1 to corner2 defines the adjacent edge (height)
 *
 * @param corner0 - First corner as [longitude, latitude].
 * @param corner1 - Adjacent corner as [longitude, latitude].
 * @param corner2 - Corner adjacent to corner1 as [longitude, latitude].
 * @param units - Distance units for the measurements.
 * @returns Rectangle measurements including width, height, and area.
 *
 * @example
 * ```typescript
 * const coords = polygon.geometry.coordinates[0];
 * const { width, height, area } = computeRectangleMeasurementsFromCorners(
 *   coords[0] as [number, number],
 *   coords[1] as [number, number],
 *   coords[2] as [number, number],
 *   'kilometers'
 * );
 * ```
 */
export function computeRectangleMeasurementsFromCorners(
  corner0: [number, number],
  corner1: [number, number],
  corner2: [number, number],
  units: DistanceUnit,
): RectangleMeasurements {
  const options = { units };
  const width = distance(corner0, corner1, options);
  const height = distance(corner1, corner2, options);
  const area = width * height;

  return { width, height, area };
}

/**
 * Compute ellipse measurements from polygon coordinates.
 *
 * For an ellipse approximated as a polygon, calculates the major and minor axes
 * by measuring distances between opposite points on the perimeter.
 *
 * @param coordinates - Polygon ring coordinates as [[lon, lat], ...].
 * @param units - Distance units for the measurements.
 * @returns Ellipse measurements including axes and area.
 *
 * @example
 * ```typescript
 * const coords = polygon.geometry.coordinates[0];
 * const { majorAxis, minorAxis, area } = computeEllipseMeasurementsFromPolygon(
 *   coords as [number, number][],
 *   'kilometers'
 * );
 * ```
 */
export function computeEllipseMeasurementsFromPolygon(
  coordinates: [number, number][],
  units: DistanceUnit,
): EllipseMeasurements {
  // Determine effective point count without allocating a new array
  const len = coordinates.length;
  const isClosed =
    len > 0 &&
    coordinates[0]?.[0] === coordinates[len - 1]?.[0] &&
    coordinates[0]?.[1] === coordinates[len - 1]?.[1];
  const pointCount = isClosed ? len - 1 : len;

  if (pointCount < 4) {
    return { xSemiAxis: 0, ySemiAxis: 0, majorAxis: 0, minorAxis: 0, area: 0 };
  }

  // For an ellipse polygon, opposite points are at index i and i + n/2
  const halfLen = Math.floor(pointCount / 2);
  const options = { units };
  let maxDist = 0;
  let minDist = Number.POSITIVE_INFINITY;

  // Sample several diameter measurements
  for (let i = 0; i < halfLen; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[i + halfLen];
    if (!(p1 && p2)) {
      continue;
    }

    const dist = distance(p1, p2, options);

    if (dist > maxDist) {
      maxDist = dist;
    }
    if (dist < minDist) {
      minDist = dist;
    }
  }

  const majorAxis = maxDist;
  const minorAxis = minDist === Number.POSITIVE_INFINITY ? maxDist : minDist;

  // Ellipse area = π × a × b (where a and b are semi-axes)
  const semiMajor = majorAxis / 2;
  const semiMinor = minorAxis / 2;
  const area = Math.PI * semiMajor * semiMinor;

  return {
    xSemiAxis: semiMajor,
    ySemiAxis: semiMinor,
    majorAxis,
    minorAxis,
    area,
  };
}

/**
 * Compute circle properties (center and radius) from a polygon geometry.
 *
 * Calculates the centroid of the polygon as the center, then measures the
 * geodesic distance from center to the first vertex as the radius.
 * Returns `undefined` if the geometry has insufficient coordinates or
 * produces invalid measurements.
 *
 * @param geometry - Polygon geometry representing a circle.
 * @returns Circle properties with center and radius, or `undefined` if invalid.
 *
 * @example
 * ```typescript
 * const props = computeCirclePropertiesFromGeometry(feature.geometry);
 * if (props) {
 *   console.log(props.center, props.radius.value, props.radius.units);
 * }
 * ```
 */
export function computeCirclePropertiesFromGeometry(
  geometry: Polygon,
  units: DistanceUnit = DEFAULT_DISTANCE_UNITS,
): CircleProperties | undefined {
  const coordinates = geometry.coordinates[0];
  if (!coordinates || coordinates.length < 3) {
    return undefined;
  }

  // Use turfCenter (bbox center) to match ResizeCircleMode's center computation.
  // This ensures the center stays stable during resize operations.
  const centerFeature = turfCenter({
    type: 'Polygon',
    coordinates: geometry.coordinates,
  });
  const center = centerFeature.geometry.coordinates as [number, number];

  if (!(Number.isFinite(center[0]) && Number.isFinite(center[1]))) {
    return undefined;
  }

  const firstPoint = coordinates[0] as [number, number];
  if (!(Number.isFinite(firstPoint[0]) && Number.isFinite(firstPoint[1]))) {
    return undefined;
  }

  const radius = distance(center, firstPoint, {
    units,
  });

  if (!Number.isFinite(radius) || radius <= 0) {
    return undefined;
  }

  return {
    center,
    radius: {
      value: radius,
      units,
    },
  };
}

/**
 * Find the maximum geodesic distance from a center point to any outer-ring
 * vertex across all polygons in a MultiPolygon.
 */
function findMaxRadius(
  center: [number, number],
  coordinates: MultiPolygon['coordinates'],
  units: DistanceUnit,
): number {
  let maxRadius = 0;
  for (const polygon of coordinates) {
    const ring = polygon[0];
    if (!ring) {
      continue;
    }
    for (const coord of ring) {
      const point = coord as [number, number];
      if (!(Number.isFinite(point[0]) && Number.isFinite(point[1]))) {
        continue;
      }
      const d = distance(center, point, { units });
      if (d > maxRadius) {
        maxRadius = d;
      }
    }
  }
  return maxRadius;
}

/**
 * Compute circle properties (center and radius) from a MultiPolygon geometry.
 *
 * Uses the bounding box center as the center point and the maximum geodesic
 * distance from center to any outer-ring vertex as the radius. Designed for
 * wagon wheel shapes where the MultiPolygon represents segmented circular geometry.
 *
 * @param geometry - MultiPolygon geometry representing a circular shape.
 * @param units - Distance units for the radius measurement.
 * @returns Circle properties with center and radius, or `undefined` if invalid.
 */
export function computeCirclePropertiesFromMultiPolygon(
  geometry: MultiPolygon,
  units: DistanceUnit = DEFAULT_DISTANCE_UNITS,
): CircleProperties | undefined {
  if (geometry.coordinates.length === 0) {
    return undefined;
  }

  // Use turfCenter (bbox center) for consistency with the Polygon version
  const centerFeature = turfCenter({
    type: 'MultiPolygon',
    coordinates: geometry.coordinates,
  });
  const center = centerFeature.geometry.coordinates as [number, number];

  if (!(Number.isFinite(center[0]) && Number.isFinite(center[1]))) {
    return undefined;
  }

  const maxRadius = findMaxRadius(center, geometry.coordinates, units);

  if (!Number.isFinite(maxRadius) || maxRadius <= 0) {
    return undefined;
  }

  return {
    center,
    radius: { value: maxRadius, units },
  };
}
