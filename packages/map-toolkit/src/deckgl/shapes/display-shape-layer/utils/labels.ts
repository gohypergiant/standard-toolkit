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

import type { Position } from 'geojson';
import type { EditableShape } from '../../shared/types';

/**
 * Get label position for circle shapes
 */
function getCircleLabelPosition(shape: EditableShape): Position | null {
  const editProps = shape.feature.properties?.editProperties;
  if (editProps?.center && editProps?.radius) {
    const [lon, lat] = editProps.center;
    const radiusKm = editProps.radius.value;
    // Offset to top of circle (approximate)
    const latOffset = radiusKm / 111; // ~111km per degree
    return [lon, lat + latOffset];
  }
  return null;
}

/**
 * Get label position for polygon shapes
 */
function getPolygonLabelPosition(
  shape: EditableShape,
  ring: Position[],
): Position {
  // For circles, center the label at the top
  if (shape.shapeType === 'Circle') {
    const circlePos = getCircleLabelPosition(shape);
    if (circlePos) {
      return circlePos;
    }
  }

  // Default: first vertex with small offset
  const firstVertex = ring[0];
  if (!firstVertex || firstVertex.length < 2) {
    return [0, 0];
  }
  return [(firstVertex[0] ?? 0) + 0.0001, firstVertex[1] ?? 0];
}

/**
 * Get 2D position for label based on geometry type
 * Smart positioning that works for all shape types
 */
export function getLabelPosition2d(shape: EditableShape): Position {
  const { geometry } = shape.feature;

  switch (geometry.type) {
    case 'Point':
      // Point: Above the marker, centered
      return [
        geometry.coordinates[0] ?? 0,
        (geometry.coordinates[1] ?? 0) + 0.0001,
      ];

    case 'LineString': {
      // LineString: Start of first segment
      const firstCoord = geometry.coordinates[0];
      return firstCoord ?? [0, 0];
    }

    case 'Polygon': {
      // Polygon: First vertex, offset right
      const ring = geometry.coordinates[0];
      if (!ring || ring.length === 0) {
        return [0, 0];
      }
      return getPolygonLabelPosition(shape, ring);
    }

    default:
      // Fallback: return first coordinate if available
      return [0, 0];
  }
}

/**
 * Get label text for a shape
 * Prioritizes label property over name
 */
export function getLabelText(shape: EditableShape): string {
  return shape.label || shape.name;
}

/**
 * Get label background color (matches shape fill color)
 */
export function getLabelFillColor(
  shape: EditableShape,
): [number, number, number, number] {
  const styleProps = shape.feature.properties?.styleProperties;
  const fillColor = styleProps?.fillColor ?? '#62a6ff';

  // Parse hex color
  const hex = fillColor.replace('#', '');
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Use moderate opacity for label background
  return [r, g, b, 200];
}

/**
 * Get label border color (matches shape stroke color)
 */
export function getLabelBorderColor(
  shape: EditableShape,
): [number, number, number, number] {
  const styleProps = shape.feature.properties?.styleProperties;
  const strokeColor = styleProps?.strokeColor ?? '#62a6ff';

  // Parse hex color
  const hex = strokeColor.replace('#', '');
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Full opacity for border
  return [r, g, b, 255];
}
