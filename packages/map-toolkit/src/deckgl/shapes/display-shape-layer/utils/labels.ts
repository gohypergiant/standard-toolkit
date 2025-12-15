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

/**
 * Label positioning utilities for shapes
 *
 * This module provides utilities for positioning labels on shapes and calculating
 * points along line segments. Use these to customize label placement in your shape data.
 *
 * ## Label Styling
 *
 * Labels are automatically styled to match their shapes:
 * - **Background fill**: Uses the shape's `fillColor` with `fillOpacity`
 * - **Border**: Uses the shape's `strokeColor` at full opacity with 2px width
 * - **Padding**: 8px on all sides (top, right, bottom, left)
 * - **Text**: Black (rgba(0, 0, 0, 255)) with bold Roboto Mono font at 10px
 *
 * ### Calculating Offsets
 *
 * When positioning labels, account for the 8px padding around the text.
 * For example, to position a label exactly 5px above a point:
 * - Label height ≈ text height (10px) + padding (16px) = 26px
 * - Offset needed: [0, -(26 + 5)] = [0, -31]
 *
 * @example Position label at the middle of a LineString
 * ```typescript
 * import { getLineStringMidpoint } from '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/utils/labels';
 *
 * // Calculate midpoint for custom positioning
 * const coordinates = [[-122.4, 37.8], [-122.3, 37.9], [-122.2, 38.0]];
 * const midpoint = getLineStringMidpoint(coordinates);
 *
 * // Use in shape data with custom label properties
 * const shape = {
 *   feature: {
 *     properties: {
 *       styleProperties: {
 *         labelVerticalAnchor: 'top',
 *         labelHorizontalAnchor: 'center',
 *         labelOffset: [0, -10], // Small offset above the line
 *       }
 *     }
 *   }
 * };
 * ```
 */

'use client';

import type { LineString, Point, Polygon } from 'geojson';
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
 * Calculate a point along a line segment
 * @param start - Start coordinate [lon, lat]
 * @param end - End coordinate [lon, lat]
 * @param ratio - Position along segment (0 = start, 0.5 = middle, 1 = end)
 * @returns Interpolated coordinate [lon, lat]
 *
 * @example
 * // Get a point 25% along a line segment
 * const start: [number, number] = [-122.4, 37.8];
 * const end: [number, number] = [-122.3, 37.9];
 * const point = interpolatePoint(start, end, 0.25);
 */
export function interpolatePoint(
  start: [number, number],
  end: [number, number],
  ratio: number,
): [number, number] {
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  return [
    start[0] + (end[0] - start[0]) * clampedRatio,
    start[1] + (end[1] - start[1]) * clampedRatio,
  ];
}

/**
 * Calculate segment lengths for a line
 */
function calculateSegmentLengths(coordinates: [number, number][]): {
  lengths: number[];
  total: number;
} {
  let total = 0;
  const lengths: number[] = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i];
    const end = coordinates[i + 1];
    if (start && end) {
      const length = Math.sqrt(
        (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2,
      );
      lengths.push(length);
      total += length;
    }
  }

  return { lengths, total };
}

/**
 * Find point at specific distance along line
 */
function findPointAtDistance(
  coordinates: [number, number][],
  segmentLengths: number[],
  targetDistance: number,
): [number, number] {
  let accumulatedLength = 0;

  for (let i = 0; i < segmentLengths.length; i++) {
    const segmentLength = segmentLengths[i];
    if (!segmentLength) {
      continue;
    }

    if (accumulatedLength + segmentLength >= targetDistance) {
      const start = coordinates[i];
      const end = coordinates[i + 1];
      if (start && end) {
        const ratio = (targetDistance - accumulatedLength) / segmentLength;
        return interpolatePoint(start, end, ratio);
      }
    }
    accumulatedLength += segmentLength;
  }

  return coordinates[coordinates.length - 1] ?? [0, 0];
}

/**
 * Get the midpoint of a LineString
 * @param coordinates - LineString coordinates array
 * @returns Midpoint coordinate [lon, lat]
 */
export function getLineStringMidpoint(
  coordinates: [number, number][],
): [number, number] {
  if (coordinates.length === 0) {
    return [0, 0];
  }
  if (coordinates.length === 1) {
    return coordinates[0] ?? [0, 0];
  }

  const { lengths, total } = calculateSegmentLengths(coordinates);
  const halfLength = total / 2;

  return findPointAtDistance(coordinates, lengths, halfLength);
}

/**
 * Get the end point of a LineString
 * @param coordinates - LineString coordinates array
 * @returns End coordinate [lon, lat]
 */
export function getLineStringEndpoint(
  coordinates: [number, number][],
): [number, number] {
  if (coordinates.length === 0) {
    return [0, 0];
  }
  return coordinates[coordinates.length - 1] ?? [0, 0];
}

/**
 * Get the midpoint of a Polygon's outer ring
 * @param coordinates - Polygon coordinates array (rings)
 * @returns Midpoint of outer ring [lon, lat]
 */
export function getPolygonMidpoint(
  coordinates: [number, number][][],
): [number, number] {
  const outerRing = coordinates[0];
  if (!outerRing || outerRing.length === 0) {
    return [0, 0];
  }
  // Use the outer ring (first ring)
  return getLineStringMidpoint(outerRing);
}

/**
 * Vertical label position relative to anchor point
 */
export type LabelVerticalPosition = 'top' | 'middle' | 'bottom';

/**
 * Horizontal label position relative to anchor point
 */
export type LabelHorizontalPosition = 'left' | 'center' | 'right';

/**
 * Coordinate anchor position along geometry (where on the shape to place the label)
 */
export type LabelCoordinateAnchor = 'start' | 'middle' | 'end';

/**
 * Circle coordinate anchor for positioning labels on the perimeter
 * Uses edge positions relative to the circle's bounding box
 */
export type CircleLabelCoordinateAnchor = 'top' | 'right' | 'bottom' | 'left';

/**
 * Global label positioning options for DisplayShapeLayer
 *
 * ## Priority System
 * Label positioning follows a three-tier priority system:
 * 1. **Per-shape properties** in `styleProperties` (highest priority)
 * 2. **Global options** via this interface
 * 3. **Default values** (geometry-specific fallbacks)
 *
 * ## Label Appearance
 *
 * Labels automatically inherit styling from their shapes:
 * - **Background**: Shape's `fillColor` with `fillOpacity`
 * - **Border**: Shape's `strokeColor` at full opacity (2px width)
 * - **Padding**: 8px on all sides
 * - **Text**: Black, bold, Roboto Mono, 10px
 *
 * Total label box height ≈ 26px (10px text + 16px padding)
 *
 * ## Positioning Concepts
 *
 * ### Coordinate Anchor
 * Determines *where* on the geometry to place the label:
 * - **Point**: Label is always at the point coordinate
 * - **LineString/Polygon**: 'start', 'middle', or 'end' along the geometry
 * - **Circle**: 'top', 'right', 'bottom', or 'left' on the perimeter
 *
 * ### Vertical/Horizontal Anchor
 * Determines how the label aligns *relative to* the anchor point:
 * - **Vertical**: 'top' (label text below point), 'middle' (centered), 'bottom' (label text above point)
 * - **Horizontal**: 'left' (label text right of point), 'center' (centered), 'right' (label text left of point)
 *
 * ### Pixel Offset
 * Fine-tune label position with [x, y] pixel offsets:
 * - Positive x moves right, negative moves left
 * - Positive y moves down, negative moves up
 * - Account for 8px padding when calculating precise offsets
 *
 * @example Position circle labels at the top with 5px clearance
 * ```tsx
 * const labelOptions: LabelPositionOptions = {
 *   circleLabelCoordinateAnchor: 'top',
 *   circleLabelVerticalAnchor: 'bottom', // Label above the top point
 *   circleLabelOffset: [0, -31], // -(26px label height + 5px clearance)
 * };
 * ```
 *
 * @example Position line labels at middle with offset to the right
 * ```tsx
 * const labelOptions: LabelPositionOptions = {
 *   lineStringLabelCoordinateAnchor: 'middle',
 *   lineStringLabelHorizontalAnchor: 'left',
 *   lineStringLabelOffset: [10, 0], // 10px to the right
 * };
 * ```
 */
export interface LabelPositionOptions {
  // Point geometry options
  /** Vertical anchor for Point labels @default 'bottom' */
  pointLabelVerticalAnchor?: LabelVerticalPosition;
  /** Horizontal anchor for Point labels @default 'center' */
  pointLabelHorizontalAnchor?: LabelHorizontalPosition;
  /** Pixel offset for Point labels [x, y] @default [0, -13] */
  pointLabelOffset?: [number, number];

  // LineString geometry options
  /** Position along LineString (start/middle/end) @default 'start' */
  lineStringLabelCoordinateAnchor?: LabelCoordinateAnchor;
  /** Vertical anchor for LineString labels @default 'middle' */
  lineStringLabelVerticalAnchor?: LabelVerticalPosition;
  /** Horizontal anchor for LineString labels @default 'left' */
  lineStringLabelHorizontalAnchor?: LabelHorizontalPosition;
  /** Pixel offset for LineString labels [x, y] @default [7, -15] */
  lineStringLabelOffset?: [number, number];

  // Polygon geometry options
  /** Position along Polygon outer ring (start/middle/end) @default 'start' */
  polygonLabelCoordinateAnchor?: LabelCoordinateAnchor;
  /** Vertical anchor for Polygon labels @default 'middle' */
  polygonLabelVerticalAnchor?: LabelVerticalPosition;
  /** Horizontal anchor for Polygon labels @default 'left' */
  polygonLabelHorizontalAnchor?: LabelHorizontalPosition;
  /** Pixel offset for Polygon labels [x, y] @default [7, -15] */
  polygonLabelOffset?: [number, number];

  // Circle geometry options
  /** Position on Circle perimeter (top/right/bottom/left) @default 'top' */
  circleLabelCoordinateAnchor?: CircleLabelCoordinateAnchor;
  /** Vertical anchor for Circle labels @default 'middle' */
  circleLabelVerticalAnchor?: LabelVerticalPosition;
  /** Horizontal anchor for Circle labels @default 'center' */
  circleLabelHorizontalAnchor?: LabelHorizontalPosition;
  /** Pixel offset for Circle labels [x, y] @default [0, -17] */
  circleLabelOffset?: [number, number];
}

/**
 * Convert vertical/horizontal position to deck.gl textAnchor and alignmentBaseline
 */
function convertPositionToAnchors(
  vertical: LabelVerticalPosition,
  horizontal: LabelHorizontalPosition,
): {
  textAnchor: 'start' | 'middle' | 'end';
  alignmentBaseline: 'top' | 'center' | 'bottom';
} {
  // Map horizontal to textAnchor
  const textAnchorMap: Record<
    LabelHorizontalPosition,
    'start' | 'middle' | 'end'
  > = {
    left: 'start',
    center: 'middle',
    right: 'end',
  };

  // Map vertical to alignmentBaseline
  const alignmentBaselineMap: Record<
    LabelVerticalPosition,
    'top' | 'center' | 'bottom'
  > = {
    top: 'top',
    middle: 'center',
    bottom: 'bottom',
  };

  return {
    textAnchor: textAnchorMap[horizontal],
    alignmentBaseline: alignmentBaselineMap[vertical],
  };
}

/**
 * Helper to resolve label properties with priority: shape > options > default
 */
function resolveLabelProperties(
  shapeOffset: [number, number] | undefined,
  shapeVertical: string | undefined,
  shapeHorizontal: string | undefined,
  defaultOffset: [number, number],
  defaultVertical: LabelVerticalPosition,
  defaultHorizontal: LabelHorizontalPosition,
  optionsOffset?: [number, number],
  optionsVertical?: LabelVerticalPosition,
  optionsHorizontal?: LabelHorizontalPosition,
) {
  const vertical = (shapeVertical ??
    optionsVertical ??
    defaultVertical) as LabelVerticalPosition;
  const horizontal = (shapeHorizontal ??
    optionsHorizontal ??
    defaultHorizontal) as LabelHorizontalPosition;
  const pixelOffset = shapeOffset ?? optionsOffset ?? defaultOffset;

  const anchors = convertPositionToAnchors(vertical, horizontal);

  return {
    pixelOffset,
    ...anchors,
  };
}

/**
 * Get position for Point geometry
 */
function getPointPosition(
  geometry: Point,
  shapeOffset: [number, number] | undefined,
  shapeVertical: string | undefined,
  shapeHorizontal: string | undefined,
  options?: LabelPositionOptions,
): LabelPosition2d {
  const defaultOffset: [number, number] = [0, -27];
  const defaultVertical: LabelVerticalPosition = 'top';
  const defaultHorizontal: LabelHorizontalPosition = 'center';

  const resolved = resolveLabelProperties(
    shapeOffset,
    shapeVertical,
    shapeHorizontal,
    defaultOffset,
    defaultVertical,
    defaultHorizontal,
    options?.pointLabelOffset,
    options?.pointLabelVerticalAnchor,
    options?.pointLabelHorizontalAnchor,
  );

  return {
    coordinates: [
      geometry.coordinates[0] ?? 0,
      geometry.coordinates[1] ?? 0,
    ] as [number, number],
    ...resolved,
  };
}

/**
 * Get position for LineString geometry
 */
function getLineStringPosition(
  geometry: LineString,
  shapeOffset: [number, number] | undefined,
  shapeVertical: string | undefined,
  shapeHorizontal: string | undefined,
  shapeCoordinateAnchor: string | undefined,
  options?: LabelPositionOptions,
): LabelPosition2d {
  const defaultOffset: [number, number] = [7, -15];
  const defaultVertical: LabelVerticalPosition = 'middle';
  const defaultHorizontal: LabelHorizontalPosition = 'left';
  const defaultCoordinateAnchor: LabelCoordinateAnchor = 'start';

  const resolved = resolveLabelProperties(
    shapeOffset,
    shapeVertical,
    shapeHorizontal,
    defaultOffset,
    defaultVertical,
    defaultHorizontal,
    options?.lineStringLabelOffset,
    options?.lineStringLabelVerticalAnchor,
    options?.lineStringLabelHorizontalAnchor,
  );

  // Determine coordinate anchor (priority: shape > options > default)
  const coordinateAnchor = (shapeCoordinateAnchor ??
    options?.lineStringLabelCoordinateAnchor ??
    defaultCoordinateAnchor) as LabelCoordinateAnchor;

  // Calculate position based on coordinate anchor
  let coordinates: [number, number];
  switch (coordinateAnchor) {
    case 'start':
      coordinates = (geometry.coordinates[0] ?? [0, 0]) as [number, number];
      break;
    case 'middle':
      coordinates = getLineStringMidpoint(
        geometry.coordinates as [number, number][],
      );
      break;
    case 'end':
      coordinates = getLineStringEndpoint(
        geometry.coordinates as [number, number][],
      );
      break;
    default:
      coordinates = (geometry.coordinates[0] ?? [0, 0]) as [number, number];
  }

  return {
    coordinates,
    ...resolved,
  };
}

/**
 * Get vertex coordinate from ring
 */
function getVertexCoordinate(vertex: number[] | undefined): [number, number] {
  return vertex ? [vertex[0] ?? 0, vertex[1] ?? 0] : [0, 0];
}

/**
 * Check if a vertex should replace the current target based on edge position
 */
function shouldUpdateEdgeVertex(
  vertexValue: number,
  targetValue: number,
  position: CircleLabelCoordinateAnchor,
): boolean {
  // For top and right, find maximum value
  // For bottom and left, find minimum value
  return position === 'top' || position === 'right'
    ? vertexValue > targetValue
    : vertexValue < targetValue;
}

/**
 * Get the coordinate index based on edge position (0 for x/longitude, 1 for y/latitude)
 */
function getCoordinateIndexForEdgePosition(
  position: CircleLabelCoordinateAnchor,
): number {
  return position === 'top' || position === 'bottom' ? 1 : 0;
}

/**
 * Find the point on a circle's perimeter at the specified edge position
 * @param ring - Circle's polygon ring coordinates
 * @param position - Edge position (top/right/bottom/left) relative to bounding box
 * @returns Coordinate at the specified edge position
 */
function findCircleEdgePoint(
  ring: number[][] | undefined,
  position: CircleLabelCoordinateAnchor,
): [number, number] {
  if (!ring || ring.length === 0) {
    return [0, 0];
  }

  // Find the vertex with max/min latitude or longitude
  let targetVertex = ring[0];
  const coordinateIndex = getCoordinateIndexForEdgePosition(position);

  for (const vertex of ring) {
    if (!vertex) {
      continue;
    }
    if (!targetVertex) {
      continue;
    }

    const vertexValue = vertex[coordinateIndex];
    const targetValue = targetVertex[coordinateIndex];

    if (vertexValue === undefined || targetValue === undefined) {
      continue;
    }

    if (shouldUpdateEdgeVertex(vertexValue, targetValue, position)) {
      targetVertex = vertex;
    }
  }

  return getVertexCoordinate(targetVertex);
}

/**
 * Calculate coordinates for polygon based on coordinate anchor
 */
function calculatePolygonCoordinates(
  ring: number[][] | undefined,
  coordinateAnchor: LabelCoordinateAnchor,
  geometry: Polygon,
): [number, number] {
  if (!ring || ring.length === 0) {
    return [0, 0];
  }

  if (coordinateAnchor === 'start') {
    return getVertexCoordinate(ring[0]);
  }

  if (coordinateAnchor === 'middle') {
    return getPolygonMidpoint(geometry.coordinates as [number, number][][]);
  }

  if (coordinateAnchor === 'end') {
    // Use second-to-last vertex (last vertex is typically same as first in closed polygons)
    const lastIndex = ring.length > 1 ? ring.length - 2 : ring.length - 1;
    return getVertexCoordinate(ring[lastIndex]);
  }

  return getVertexCoordinate(ring[0]);
}

/**
 * Get position for Circle geometry (special case of Polygon)
 */
function getCirclePosition(
  ring: number[][] | undefined,
  shapeOffset: [number, number] | undefined,
  shapeVertical: string | undefined,
  shapeHorizontal: string | undefined,
  shapeCoordinateAnchor: string | undefined,
  options?: LabelPositionOptions,
): LabelPosition2d {
  const defaultOffset: [number, number] = [0, -17];
  const defaultVertical: LabelVerticalPosition = 'middle';
  const defaultHorizontal: LabelHorizontalPosition = 'center';
  const defaultCoordinateAnchor: CircleLabelCoordinateAnchor = 'top';

  const resolved = resolveLabelProperties(
    shapeOffset,
    shapeVertical,
    shapeHorizontal,
    defaultOffset,
    defaultVertical,
    defaultHorizontal,
    options?.circleLabelOffset,
    options?.circleLabelVerticalAnchor,
    options?.circleLabelHorizontalAnchor,
  );

  // Determine coordinate anchor (priority: shape > options > default)
  const coordinateAnchor = (shapeCoordinateAnchor ??
    options?.circleLabelCoordinateAnchor ??
    defaultCoordinateAnchor) as CircleLabelCoordinateAnchor;

  // Calculate position based on coordinate anchor
  const coordinates = findCircleEdgePoint(ring, coordinateAnchor);

  return {
    coordinates,
    ...resolved,
  };
}

/**
 * Get position for Polygon geometry
 */
function getPolygonPosition(
  geometry: Polygon,
  shape: EditableShape,
  shapeOffset: [number, number] | undefined,
  shapeVertical: string | undefined,
  shapeHorizontal: string | undefined,
  shapeCoordinateAnchor: string | undefined,
  options?: LabelPositionOptions,
): LabelPosition2d {
  const ring = geometry.coordinates[0];

  // Circle shapes override: use cardinal direction positioning
  if (shape.shapeType === 'Circle') {
    return getCirclePosition(
      ring,
      shapeOffset,
      shapeVertical,
      shapeHorizontal,
      shapeCoordinateAnchor,
      options,
    );
  }

  // Regular polygons use coordinate anchor to determine position along outer ring
  const defaultOffset: [number, number] = [7, -15];
  const defaultVertical: LabelVerticalPosition = 'middle';
  const defaultHorizontal: LabelHorizontalPosition = 'left';
  const defaultCoordinateAnchor: LabelCoordinateAnchor = 'start';

  const resolved = resolveLabelProperties(
    shapeOffset,
    shapeVertical,
    shapeHorizontal,
    defaultOffset,
    defaultVertical,
    defaultHorizontal,
    options?.polygonLabelOffset,
    options?.polygonLabelVerticalAnchor,
    options?.polygonLabelHorizontalAnchor,
  );

  // Determine coordinate anchor (priority: shape > options > default)
  const coordinateAnchor = (shapeCoordinateAnchor ??
    options?.polygonLabelCoordinateAnchor ??
    defaultCoordinateAnchor) as LabelCoordinateAnchor;

  // Calculate position based on coordinate anchor
  const coordinates = calculatePolygonCoordinates(
    ring,
    coordinateAnchor,
    geometry,
  );

  return {
    coordinates,
    ...resolved,
  };
}

/**
 * Get 2D position for label based on geometry type
 * Uses pixel-based offsets for consistent positioning at all zoom levels
 *
 * Priority for positioning:
 * 1. Per-shape properties in styleProperties (highest)
 * 2. Global labelOptions from layer props
 * 3. Default values (fallback)
 */
export function getLabelPosition2d(
  shape: EditableShape,
  options?: LabelPositionOptions,
): LabelPosition2d {
  const { geometry } = shape.feature;
  const styleProps = shape.feature.properties?.styleProperties;

  // Check if shape has custom label properties
  const shapeOffset = styleProps?.labelOffset as [number, number] | undefined;
  const shapeVertical = styleProps?.labelVerticalAnchor;
  const shapeHorizontal = styleProps?.labelHorizontalAnchor;
  const shapeCoordinateAnchor = styleProps?.labelCoordinateAnchor;

  switch (geometry.type) {
    case 'Point':
      return getPointPosition(
        geometry,
        shapeOffset,
        shapeVertical,
        shapeHorizontal,
        options,
      );

    case 'LineString':
      return getLineStringPosition(
        geometry,
        shapeOffset,
        shapeVertical,
        shapeHorizontal,
        shapeCoordinateAnchor,
        options,
      );

    case 'Polygon':
      return getPolygonPosition(
        geometry,
        shape,
        shapeOffset,
        shapeVertical,
        shapeHorizontal,
        shapeCoordinateAnchor,
        options,
      );

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
