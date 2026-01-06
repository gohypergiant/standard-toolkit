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

import { distance, point } from '@turf/turf';
import type { DistanceUnit } from '../../../../shared/units';

/**
 * Circle measurement result containing radius, diameter, and area.
 */
export interface CircleMeasurements {
  /** Radius in the specified units */
  radius: number;
  /** Diameter (radius * 2) in the specified units */
  diameter: number;
  /** Area (π * radius²) in the specified units squared */
  area: number;
}

/**
 * Ellipse measurement result containing semi-axes and area.
 */
export interface EllipseMeasurements {
  /** X semi-axis (horizontal radius) in the specified units */
  xSemiAxis: number;
  /** Y semi-axis (vertical radius) in the specified units */
  ySemiAxis: number;
  /** Major axis (full length of longer axis) in the specified units */
  majorAxis: number;
  /** Minor axis (full length of shorter axis) in the specified units */
  minorAxis: number;
  /** Area (π * xSemiAxis * ySemiAxis) in the specified units squared */
  area: number;
}

/**
 * Rectangle measurement result containing width, height, and area.
 */
export interface RectangleMeasurements {
  /** Width in the specified units */
  width: number;
  /** Height in the specified units */
  height: number;
  /** Area (width * height) in the specified units squared */
  area: number;
}

/**
 * Compute circle measurements from center and edge point.
 *
 * @param center - Center point as [longitude, latitude]
 * @param edgePoint - Point on the circle's edge as [longitude, latitude]
 * @param units - Distance units for the measurements
 * @returns Circle measurements including radius, diameter, and area
 *
 * @example
 * ```ts
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
 * Compute ellipse measurements from center and semi-axis lengths.
 *
 * @param xSemiAxis - X semi-axis (horizontal radius) in the specified units
 * @param ySemiAxis - Y semi-axis (vertical radius) in the specified units
 * @returns Ellipse measurements including axes and area
 *
 * @example
 * ```ts
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
 * @param corner0 - First corner as [longitude, latitude]
 * @param corner1 - Adjacent corner as [longitude, latitude]
 * @param corner2 - Corner adjacent to corner1 as [longitude, latitude]
 * @param units - Distance units for the measurements
 * @returns Rectangle measurements including width, height, and area
 *
 * @example
 * ```ts
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
  const width = distance(point(corner0), point(corner1), { units });
  const height = distance(point(corner1), point(corner2), { units });
  const area = width * height;

  return { width, height, area };
}

/**
 * Compute ellipse measurements from polygon coordinates.
 *
 * For an ellipse approximated as a polygon, calculates the major and minor axes
 * by measuring distances between opposite points on the perimeter.
 *
 * @param coordinates - Polygon ring coordinates as [[lon, lat], ...]
 * @param units - Distance units for the measurements
 * @returns Ellipse measurements including axes and area
 *
 * @example
 * ```ts
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
): { majorAxis: number; minorAxis: number; area: number } {
  // Remove the closing point if it duplicates the first
  const points =
    coordinates[0]?.[0] === coordinates[coordinates.length - 1]?.[0] &&
    coordinates[0]?.[1] === coordinates[coordinates.length - 1]?.[1]
      ? coordinates.slice(0, -1)
      : coordinates;

  if (points.length < 4) {
    return { majorAxis: 0, minorAxis: 0, area: 0 };
  }

  // For an ellipse polygon, opposite points are at index i and i + n/2
  const halfLen = Math.floor(points.length / 2);
  let maxDist = 0;
  let minDist = Number.POSITIVE_INFINITY;

  // Sample several diameter measurements
  for (let i = 0; i < halfLen; i++) {
    const p1 = points[i];
    const p2 = points[i + halfLen];
    if (!(p1 && p2)) {
      continue;
    }

    const dist = distance(
      [p1[0] as number, p1[1] as number],
      [p2[0] as number, p2[1] as number],
      { units },
    );

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
  const ellipseArea = Math.PI * semiMajor * semiMinor;

  return { majorAxis, minorAxis, area: ellipseArea };
}
