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

import type { EditableShape } from '../../shared/types';

/**
 * Label positioning information including coordinates and screen-space offsets
 */
export interface LabelPosition2d {
  /** Geographic coordinates [longitude, latitude] */
  coordinates: [number, number];
  /** Horizontal text anchor point */
  textAnchor: 'start' | 'middle' | 'end';
  /** Vertical text alignment */
  alignmentBaseline: 'top' | 'center' | 'bottom';
  /** Pixel offset from coordinates [x, y] */
  pixelOffset: [number, number];
}

/**
 * Options for label positioning
 */
export interface LabelPositionOptions {
  /** Custom pixel offset for point shapes [x, y] */
  pointOffset?: [number, number];
}

/**
 * Get 2D position for label based on geometry type
 * Uses pixel-based offsets for consistent positioning at all zoom levels
 */
export function getLabelPosition2d(
  shape: EditableShape,
  options?: LabelPositionOptions,
): LabelPosition2d {
  const { geometry } = shape.feature;

  switch (geometry.type) {
    case 'Point': {
      // Point: Above the marker, centered
      // Use custom offset if provided, otherwise use default
      const defaultOffset: [number, number] = [0, -14];
      const pixelOffset = options?.pointOffset ?? defaultOffset;

      return {
        coordinates: [
          geometry.coordinates[0] ?? 0,
          geometry.coordinates[1] ?? 0,
        ],
        textAnchor: 'middle',
        alignmentBaseline: 'bottom',
        pixelOffset,
      };
    }

    case 'LineString': {
      // LineString: Start of first segment, offset to top-right
      const firstCoord = geometry.coordinates[0];
      return {
        coordinates: firstCoord ?? [0, 0],
        textAnchor: 'start',
        alignmentBaseline: 'center',
        pixelOffset: [7, -15],
      };
    }

    case 'Polygon': {
      // Polygon: First vertex or center, offset to top-right
      const ring = geometry.coordinates[0];
      if (!ring || ring.length === 0) {
        return {
          coordinates: [0, 0],
          textAnchor: 'start',
          alignmentBaseline: 'center',
          pixelOffset: [7, -15],
        };
      }

      // Default to first vertex for polygons
      const firstVertex = ring[0];
      const position: [number, number] = firstVertex
        ? [firstVertex[0] ?? 0, firstVertex[1] ?? 0]
        : [0, 0];

      // Circle shapes override: use center alignment with static offset (matches NGC2)
      if (shape.shapeType === 'Circle') {
        // For circles, get the first coordinate of the first ring
        const circlePosition = geometry.coordinates[0]?.[0] as
          | [number, number]
          | undefined;
        return {
          coordinates: circlePosition || [0, 0],
          textAnchor: 'middle',
          alignmentBaseline: 'center',
          pixelOffset: [0, -17],
        };
      }

      // Regular polygons use top-right offset
      return {
        coordinates: position,
        textAnchor: 'start',
        alignmentBaseline: 'center',
        pixelOffset: [7, -15],
      };
    }

    default:
      // Fallback
      return {
        coordinates: [0, 0],
        textAnchor: 'middle',
        alignmentBaseline: 'center',
        pixelOffset: [0, 0],
      };
  }
}

/**
 * Get label text for a shape
 *
 * Returns the display label for the shape on the map.
 * - `label`: Optional short display name shown on the map (e.g., "NYC")
 * - `name`: Full shape name used internally (e.g., "New York City Office")
 *
 * If `label` is not provided, falls back to using `name`.
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
