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

import {
  ERROR_MESSAGES,
  MAX_COORDINATE_VALUE,
  MAX_LATITUDE,
  MIN_COORDINATE_VALUE,
  MIN_LATITUDE,
  MIN_LINE_POINTS,
  MIN_RING_POINTS,
} from '../../shared/constants';
import { parseCoordinateString } from './geometry';
import type { Position } from 'geojson';
import type {
  CustomGeometry,
  EditableShape,
  ShapeFeatureType,
  ValidationResult,
} from '../../shared/types';

/**
 * Type alias for validation result export
 */
export type ShapeValidationResult = ValidationResult;

/**
 * Validate a complete shape
 */
export function validateShape(shape: EditableShape): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate basic fields
  if (!shape.id) {
    errors.push(ERROR_MESSAGES.INVALID_SHAPE_ID);
  }

  if (!shape.name || shape.name.trim() === '') {
    errors.push(ERROR_MESSAGES.INVALID_SHAPE_NAME);
  }

  // Validate geometry
  if (shape.feature?.geometry) {
    const geometryResult = validateGeometry(
      shape.feature.geometry as CustomGeometry,
      shape.shapeType,
    );
    errors.push(...geometryResult.errors);
    if (geometryResult.warnings) {
      warnings.push(...geometryResult.warnings);
    }
  } else {
    errors.push(ERROR_MESSAGES.INVALID_GEOMETRY);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate geometry based on shape type
 */
export function validateGeometry(
  geometry: CustomGeometry,
  shapeType: ShapeFeatureType,
): ValidationResult {
  const errors: string[] = [];
  const _warnings: string[] = [];
  _warnings;
  if (!geometry) {
    errors.push(ERROR_MESSAGES.INVALID_GEOMETRY);
    return { isValid: false, errors };
  }

  switch (geometry.type) {
    case 'Point':
      return validatePoint(geometry.coordinates);

    case 'LineString':
      return validateLineString(geometry.coordinates);

    case 'Polygon':
      return validatePolygon(geometry.coordinates, shapeType);

    default:
      errors.push(ERROR_MESSAGES.INVALID_GEOMETRY);
      return { isValid: false, errors };
  }
}

/**
 * Validate a Point geometry
 */
export function validatePoint(coordinates: Position): ValidationResult {
  const errors: string[] = [];

  if (!coordinates || coordinates.length < 2) {
    errors.push(ERROR_MESSAGES.INVALID_COORDINATES);
    return { isValid: false, errors };
  }

  const [lon, lat] = coordinates;

  if (typeof lon !== 'number' || typeof lat !== 'number') {
    errors.push(ERROR_MESSAGES.INVALID_COORDINATES);
  }

  if (lon !== undefined && lat !== undefined) {
    if (Number.isNaN(lon) || Number.isNaN(lat)) {
      errors.push(ERROR_MESSAGES.INVALID_COORDINATES);
    }

    if (lon < MIN_COORDINATE_VALUE || lon > MAX_COORDINATE_VALUE) {
      errors.push(ERROR_MESSAGES.OUT_OF_RANGE_LONGITUDE);
    }

    if (lat < MIN_LATITUDE || lat > MAX_LATITUDE) {
      errors.push(ERROR_MESSAGES.OUT_OF_RANGE_LATITUDE);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a LineString geometry
 */
export function validateLineString(coordinates: Position[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!coordinates || coordinates.length < MIN_LINE_POINTS) {
    errors.push(ERROR_MESSAGES.INSUFFICIENT_POINTS_LINE);
    return { isValid: false, errors };
  }

  // Validate each point
  for (let i = 0; i < coordinates.length; i++) {
    const point = coordinates[i];
    if (!point) {
      continue;
    }
    const pointResult = validatePoint(point);
    if (!pointResult.isValid) {
      errors.push(`Point ${i + 1}: ${pointResult.errors.join(', ')}`);
    }
  }

  // Check for duplicate consecutive points
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    if (prev && curr && prev[0] === curr[0] && prev[1] === curr[1]) {
      warnings.push(ERROR_MESSAGES.DUPLICATE_POINTS);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate polygon outer ring
 */
function validateOuterRing(outerRing: Position[]): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const ringResult = validateLinearRing(outerRing);
  if (!ringResult.isValid) {
    errors.push(...ringResult.errors.map((e) => `Outer ring: ${e}`));
  }
  if (ringResult.warnings) {
    warnings.push(...ringResult.warnings.map((w) => `Outer ring: ${w}`));
  }

  return { errors, warnings };
}

/**
 * Validate polygon inner rings (holes)
 */
function validateInnerRings(coordinates: Position[][]): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (let i = 1; i < coordinates.length; i++) {
    const innerRing = coordinates[i];
    if (!innerRing) {
      continue;
    }
    const innerRingResult = validateLinearRing(innerRing);
    if (!innerRingResult.isValid) {
      errors.push(
        ...innerRingResult.errors.map((e) => `Inner ring ${i}: ${e}`),
      );
    }
    if (innerRingResult.warnings) {
      warnings.push(
        ...innerRingResult.warnings.map((w) => `Inner ring ${i}: ${w}`),
      );
    }
  }

  return { errors, warnings };
}

/**
 * Validate a Polygon geometry
 */
export function validatePolygon(
  coordinates: Position[][],
  shapeType: ShapeFeatureType,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!coordinates || coordinates.length === 0) {
    errors.push(ERROR_MESSAGES.INVALID_GEOMETRY);
    return { isValid: false, errors };
  }

  // Validate outer ring
  const outerRing = coordinates[0];
  if (!outerRing) {
    errors.push(ERROR_MESSAGES.INVALID_GEOMETRY);
    return { isValid: false, errors };
  }

  const outerRingResult = validateOuterRing(outerRing);
  errors.push(...outerRingResult.errors);
  warnings.push(...outerRingResult.warnings);

  // Validate inner rings (holes)
  const innerRingsResult = validateInnerRings(coordinates);
  errors.push(...innerRingsResult.errors);
  warnings.push(...innerRingsResult.warnings);

  // Check for self-intersections (only for regular polygons, not circles)
  if (shapeType !== 'Circle' && errors.length === 0) {
    if (checkSimpleSelfIntersection(outerRing)) {
      errors.push(ERROR_MESSAGES.SELF_INTERSECTING);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate a linear ring (polygon ring)
 */
export function validateLinearRing(ring: Position[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!ring || ring.length < MIN_RING_POINTS) {
    errors.push(ERROR_MESSAGES.INSUFFICIENT_POINTS_POLYGON);
    return { isValid: false, errors };
  }

  // Check if ring is closed
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
    errors.push(ERROR_MESSAGES.UNCLOSED_RING);
  }

  // Validate each point
  for (let i = 0; i < ring.length; i++) {
    const point = ring[i];
    if (!point) {
      continue;
    }
    const pointResult = validatePoint(point);
    if (!pointResult.isValid) {
      errors.push(`Point ${i + 1}: ${pointResult.errors.join(', ')}`);
    }
  }

  // Check for duplicate consecutive points (excluding closing point)
  for (let i = 1; i < ring.length - 1; i++) {
    const prev = ring[i - 1];
    const curr = ring[i];
    if (prev && curr && prev[0] === curr[0] && prev[1] === curr[1]) {
      warnings.push(ERROR_MESSAGES.DUPLICATE_POINTS);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Simple self-intersection check for polygon rings
 * Checks if any non-adjacent edges intersect
 */
export function checkSimpleSelfIntersection(ring: Position[]): boolean {
  // Need at least 4 points to have self-intersection (excluding closing point)
  if (ring.length < 5) {
    return false;
  }

  // Check each pair of non-adjacent edges
  for (let i = 0; i < ring.length - 1; i++) {
    for (let j = i + 2; j < ring.length - 1; j++) {
      // Skip adjacent edges
      if (j === i + 1) {
        continue;
      }
      // Skip if we're comparing the first and last edge (they share a point)
      if (i === 0 && j === ring.length - 2) {
        continue;
      }

      const p1 = ring[i];
      const p2 = ring[i + 1];
      const p3 = ring[j];
      const p4 = ring[j + 1];

      if (p1 && p2 && p3 && p4 && edgesIntersect(p1, p2, p3, p4)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if two line segments intersect
 * Uses the cross product method
 */
function edgesIntersect(
  p1: Position,
  p2: Position,
  p3: Position,
  p4: Position,
): boolean {
  const ccw = (A: Position, B: Position, C: Position) => {
    const a0 = A[0];
    const a1 = A[1];
    const b0 = B[0];
    const b1 = B[1];
    const c0 = C[0];
    const c1 = C[1];

    if (
      a0 === undefined ||
      a1 === undefined ||
      b0 === undefined ||
      b1 === undefined ||
      c0 === undefined ||
      c1 === undefined
    ) {
      return false;
    }

    return (c1 - a1) * (b0 - a0) > (b1 - a1) * (c0 - a0);
  };

  return (
    ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  );
}

/**
 * Validate a coordinate string in "lat, lon" format
 */
export function validateCoordinateString(str: string): ValidationResult {
  const errors: string[] = [];

  const parsed = parseCoordinateString(str);

  if (!parsed) {
    errors.push(ERROR_MESSAGES.INVALID_COORDINATES);
    return { isValid: false, errors };
  }

  const { latitude, longitude } = parsed;

  if (longitude < MIN_COORDINATE_VALUE || longitude > MAX_COORDINATE_VALUE) {
    errors.push(ERROR_MESSAGES.OUT_OF_RANGE_LONGITUDE);
  }

  if (latitude < MIN_LATITUDE || latitude > MAX_LATITUDE) {
    errors.push(ERROR_MESSAGES.OUT_OF_RANGE_LATITUDE);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate circle radius
 */
export function validateCircleRadius(radius: number): ValidationResult {
  const errors: string[] = [];

  if (typeof radius !== 'number' || Number.isNaN(radius)) {
    errors.push(ERROR_MESSAGES.INVALID_CIRCLE_RADIUS);
  } else if (radius <= 0) {
    errors.push(ERROR_MESSAGES.INVALID_CIRCLE_RADIUS);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Alias for validateCoordinateString
 */
export const validateCoordinates = validateCoordinateString;
