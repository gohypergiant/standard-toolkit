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

import { area } from '@turf/area';
import { centroid } from '@turf/centroid';
import { circle } from '@turf/circle';
import { distance } from '@turf/distance';
import { lineString, point, polygon } from '@turf/helpers';
import { length } from '@turf/length';
import {
  CIRCLE_MAX_STEPS,
  CIRCLE_MIN_STEPS,
  CIRCLE_RADIUS_THRESHOLD_LARGE,
  CIRCLE_RADIUS_THRESHOLD_SMALL,
  COORDINATE_DECIMAL_PLACES,
} from '../../shared/constants';
import type { Position } from 'geojson';
import type { CircleEditProperties, Coordinate } from '../../shared/types';

/**
 * Compute circle properties (center and radius) from polygon coordinates
 * Used to extract original circle parameters from the polygon approximation
 */
export function computeCircleProperties(
  coordinates: Position[][],
): CircleEditProperties | null {
  try {
    if (!coordinates?.[0] || coordinates[0].length < 4) {
      return null;
    }

    const ring = coordinates[0];

    // Calculate center as the centroid of the polygon
    const polygonFeature = polygon(coordinates);
    const centroidFeature = centroid(polygonFeature);
    const center = centroidFeature.geometry.coordinates as [number, number];

    // Calculate radius as average distance from center to all points
    let totalDistance = 0;
    let pointCount = 0;
    const firstPoint = ring[0];

    for (const point of ring) {
      if (
        firstPoint &&
        point[0] === firstPoint[0] &&
        point[1] === firstPoint[1] &&
        pointCount > 0
      ) {
        // Skip duplicate closing point
        continue;
      }

      const dist = distance(center, point as [number, number], {
        units: 'kilometers',
      });
      totalDistance += dist;
      pointCount++;
    }

    const radius = totalDistance / pointCount;

    return {
      center,
      radius: {
        value: radius,
        units: 'kilometers',
      },
    };
  } catch (error) {
    console.error('Error computing circle properties:', error);
    return null;
  }
}

/**
 * Format coordinates to a consistent decimal place (6 decimals)
 * @param lat Latitude
 * @param lon Longitude
 * @returns Formatted string "lat, lon"
 */
export function formatCoordinates(lat: number, lon: number): string {
  return `${lat.toFixed(COORDINATE_DECIMAL_PLACES)}, ${lon.toFixed(COORDINATE_DECIMAL_PLACES)}`;
}

/**
 * Get adaptive number of steps for circle approximation based on radius
 * Small circles: fewer steps (performance)
 * Large circles: more steps (smoothness)
 *
 * @param radiusKm Circle radius in kilometers
 * @returns Number of steps (12-120)
 */
export function getAdaptiveCircleSteps(radiusKm: number): number {
  if (radiusKm <= CIRCLE_RADIUS_THRESHOLD_SMALL) {
    return CIRCLE_MIN_STEPS;
  }

  if (radiusKm >= CIRCLE_RADIUS_THRESHOLD_LARGE) {
    return CIRCLE_MAX_STEPS;
  }

  // Logarithmic scaling between thresholds
  const logMin = Math.log(CIRCLE_RADIUS_THRESHOLD_SMALL);
  const logMax = Math.log(CIRCLE_RADIUS_THRESHOLD_LARGE);
  const logRadius = Math.log(radiusKm);

  const ratio = (logRadius - logMin) / (logMax - logMin);
  const steps = Math.round(
    CIRCLE_MIN_STEPS + ratio * (CIRCLE_MAX_STEPS - CIRCLE_MIN_STEPS),
  );

  return Math.max(CIRCLE_MIN_STEPS, Math.min(CIRCLE_MAX_STEPS, steps));
}

/**
 * Create a circle geometry as a polygon approximation
 * @param center Center coordinates [longitude, latitude]
 * @param radiusKm Radius in kilometers
 * @returns Polygon coordinates
 */
export function createCircleGeometry(
  center: Coordinate,
  radiusKm: number,
): Position[][] {
  const steps = getAdaptiveCircleSteps(radiusKm);
  const circleFeature = circle(center, radiusKm, {
    steps,
    units: 'kilometers',
  });

  return circleFeature.geometry.coordinates;
}

/**
 * Compute circle polygon from center and radius
 * Alias for compatibility with draw-circle-mode
 */
export function computeCirclePolygon(
  center: Coordinate,
  radius: { value: number; units: 'kilometers' },
): { type: 'Polygon'; coordinates: Position[][] } {
  const coordinates = createCircleGeometry(center, radius.value);
  return {
    type: 'Polygon',
    coordinates,
  };
}

/**
 * Alias for getAdaptiveCircleSteps
 */
export const computeCircleSteps = getAdaptiveCircleSteps;

/**
 * Alias for formatCoordinates
 */
export const formatCoordinate = formatCoordinates;

/**
 * Parse a coordinate string in "lat, lon" format
 * @param str Coordinate string (e.g., "40.7128, -74.0060")
 * @returns Parsed coordinate or null if invalid
 */
export function parseCoordinateString(
  str: string,
): { latitude: number; longitude: number } | null {
  try {
    const cleaned = str.trim();
    const parts = cleaned.split(',').map((p) => p.trim());

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return null;
    }

    const latitude = Number.parseFloat(parts[0]);
    const longitude = Number.parseFloat(parts[1]);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return null;
    }

    return { latitude, longitude };
  } catch {
    return null;
  }
}

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate the area of a polygon in square kilometers
 */
export function calculatePolygonArea(coordinates: Position[][]): number {
  try {
    const polygonFeature = polygon(coordinates);
    return area(polygonFeature) / 1_000_000; // Convert m² to km²
  } catch {
    return 0;
  }
}

/**
 * Calculate the length of a line in kilometers
 */
export function calculateLineLength(coordinates: Position[]): number {
  try {
    const line = lineString(coordinates);
    return length(line, { units: 'kilometers' });
  } catch {
    return 0;
  }
}

/**
 * Calculate the perimeter of a polygon in kilometers
 */
export function calculatePolygonPerimeter(coordinates: Position[][]): number {
  try {
    // Calculate perimeter by summing the length of all edges in the outer ring
    const ring = coordinates[0];
    if (!ring || ring.length < 2) {
      return 0;
    }

    let perimeter = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const fromPos = ring[i];
      const toPos = ring[i + 1];
      if (fromPos && toPos) {
        const from = point(fromPos);
        const to = point(toPos);
        perimeter += distance(from, to, { units: 'kilometers' });
      }
    }

    return perimeter;
  } catch {
    return 0;
  }
}
