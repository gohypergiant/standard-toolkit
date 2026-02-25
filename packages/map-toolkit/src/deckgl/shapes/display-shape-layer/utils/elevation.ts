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

import { isLineGeometry, isPolygonGeometry } from '../../shared/types';
import { getLineColor } from '../../shared/utils/style-utils';
import type { Shape, ShapeId } from '../../shared/types';
import type {
  CurtainFeature,
  ElevatedFeatureClassification,
  LineSegment,
} from '../types';

// =============================================================================
// Coordinate Helpers
// =============================================================================

/**
 * Extract elevation from 3D coordinates.
 * Drills into nested coordinate arrays to find the z-value.
 *
 * @param coordinates - GeoJSON coordinates (single, array, or nested)
 * @returns The z-coordinate if present, otherwise 0
 *
 * @example
 * ```typescript
 * getElevationFromCoordinates([10, 20, 5000]); // 5000
 * getElevationFromCoordinates([[10, 20, 5000], [11, 21, 6000]]); // 5000
 * getElevationFromCoordinates([10, 20]); // 0
 * ```
 */
export function getElevationFromCoordinates(coordinates: unknown): number {
  let current = coordinates;

  while (Array.isArray(current)) {
    // Leaf coordinate: [lon, lat] or [lon, lat, elevation]
    if (!Array.isArray(current[0])) {
      return (current[2] as number) ?? 0;
    }
    // Drill into nested coordinate arrays (polygons, multi-polygons)
    current = current[0];
  }

  return 0;
}

/**
 * Get elevation from a feature's geometry.
 * Extracts z-coordinate, returning 0 for missing geometry or GeometryCollection.
 *
 * @param feature - The GeoJSON feature
 * @returns The elevation value, or 0
 *
 * @example
 * ```typescript
 * const elevation = getFeatureElevation(feature);
 * if (elevation > 0) {
 *   // Feature has 3D elevation
 * }
 * ```
 */
export function getFeatureElevation(feature: Shape['feature']): number {
  const { geometry } = feature;

  if (!geometry) {
    return 0;
  }

  // GeometryCollection doesn't have coordinates property
  if (geometry.type === 'GeometryCollection') {
    return 0;
  }

  return getElevationFromCoordinates(geometry.coordinates);
}

/**
 * Extract [lon, lat] from a coordinate array if valid.
 */
function extractLonLat(
  coords: number[] | undefined,
): [number, number] | undefined {
  if (!coords || coords.length < 2) {
    return undefined;
  }
  const [lon, lat] = coords;
  return lon !== undefined && lat !== undefined ? [lon, lat] : undefined;
}

/**
 * Extract a representative coordinate from a feature for elevation indicators.
 *
 * @param geometry - The feature geometry
 * @returns [lon, lat] or undefined if coordinates cannot be extracted
 */
function getRepresentativeCoordinate(
  geometry: Shape['feature']['geometry'],
): [number, number] | undefined {
  if (geometry.type === 'Point') {
    return extractLonLat(geometry.coordinates as number[]);
  }

  if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
    return extractLonLat((geometry.coordinates as number[][])[0]);
  }

  if (geometry.type === 'MultiLineString') {
    return extractLonLat((geometry.coordinates as number[][][])[0]?.[0]);
  }

  return undefined;
}

// =============================================================================
// Line Segment Builders
// =============================================================================

/** Create a vertical line segment from ground to an elevated position. */
function createVerticalSegment(
  lon: number,
  lat: number,
  elevation: number,
  color: [number, number, number, number],
): LineSegment {
  return {
    source: [lon, lat, 0] as [number, number, number],
    target: [lon, lat, elevation] as [number, number, number],
    color,
  };
}

/** Process a coordinates array and create vertical segments for each elevated point. */
function processCoordinates(
  coordinates: number[][],
  color: [number, number, number, number],
): LineSegment[] {
  const segments: LineSegment[] = [];

  for (const coord of coordinates) {
    const [lon, lat, elevation] = coord;
    if (
      lon !== undefined &&
      lat !== undefined &&
      elevation !== undefined &&
      elevation > 0
    ) {
      segments.push(createVerticalSegment(lon, lat, elevation, color));
    }
  }

  return segments;
}

/**
 * Create elevation indicator line segments for a geometry.
 *
 * @param geometry - The feature geometry
 * @param color - RGBA color for the line segments
 * @returns Array of line segments from ground to elevated positions
 *
 * @example
 * ```typescript
 * const segments = createElevationLineSegments(
 *   feature.geometry,
 *   [255, 255, 255, 255],
 * );
 * // Each segment has { source: [lon, lat, 0], target: [lon, lat, elevation], color }
 * ```
 */
export function createElevationLineSegments(
  geometry: Shape['feature']['geometry'],
  color: [number, number, number, number],
): LineSegment[] {
  // Skip GeometryCollection
  if (geometry.type === 'GeometryCollection') {
    return [];
  }

  if (geometry.type === 'LineString') {
    // Create vertical lines at EACH coordinate to form a "curtain"
    return processCoordinates(geometry.coordinates as number[][], color);
  }

  if (geometry.type === 'MultiLineString') {
    // Create vertical lines for each coordinate in each line
    const allSegments: LineSegment[] = [];
    const lines = geometry.coordinates as number[][][];
    for (const line of lines) {
      for (const segment of processCoordinates(line, color)) {
        allSegments.push(segment);
      }
    }
    return allSegments;
  }

  // For Point and MultiPoint, use single representative coordinate
  const coords = getRepresentativeCoordinate(geometry);
  if (coords) {
    const [lon, lat] = coords;
    const elevation = getElevationFromCoordinates(geometry.coordinates);
    if (elevation > 0) {
      return [createVerticalSegment(lon, lat, elevation, color)];
    }
  }

  return [];
}

// =============================================================================
// Feature Classification
// =============================================================================

/**
 * Single-pass classification of features by geometry type and elevation.
 * Avoids multiple .filter() passes per render frame.
 *
 * @param features - The features to classify
 * @param getElevation - Elevation accessor function
 * @returns Classified features: lines, polygons, nonPolygons
 *
 * @example
 * ```typescript
 * const { lines, polygons, nonPolygons } = classifyElevatedFeatures(
 *   features,
 *   getFeatureElevation,
 * );
 * ```
 */
export function classifyElevatedFeatures(
  features: Shape['feature'][],
  getElevation: (feature: Shape['feature']) => number,
): ElevatedFeatureClassification {
  const lines: Shape['feature'][] = [];
  const polygons: Shape['feature'][] = [];
  const nonPolygons: Shape['feature'][] = [];

  for (const f of features) {
    const elevation = getElevation(f);
    if (elevation <= 0) {
      continue;
    }

    const geomType = f.geometry.type;
    if (isPolygonGeometry(geomType)) {
      polygons.push(f);
    } else {
      nonPolygons.push(f);
      if (isLineGeometry(geomType)) {
        lines.push(f);
      }
    }
  }

  return { lines, polygons, nonPolygons };
}

// =============================================================================
// Curtain Polygon Builders
// =============================================================================

/**
 * Create curtain polygon features from a single LineString's coordinate array.
 * Each pair of consecutive coordinates becomes a vertical rectangular polygon.
 *
 * @param coordinates - Array of [lon, lat, elevation] coordinates
 * @param fillColor - RGBA fill color for the curtain
 * @param lineColor - RGBA line color for the curtain
 * @param shapeId - Optional shape ID for picking correlation
 * @returns Array of curtain polygon features
 *
 * @example
 * ```typescript
 * const curtains = createCurtainPolygonsFromLine(
 *   [[10, 20, 5000], [11, 21, 6000]],
 *   [98, 166, 255, 51],
 *   [98, 166, 255, 255],
 *   'shape-1',
 * );
 * ```
 */
export function createCurtainPolygonsFromLine(
  coordinates: number[][],
  fillColor: [number, number, number, number],
  lineColor: [number, number, number, number],
  shapeId?: ShapeId,
): CurtainFeature[] {
  const polygons: CurtainFeature[] = [];

  // Create vertical polygon for each pair of consecutive coordinates
  for (let i = 0; i < coordinates.length - 1; i++) {
    const coord1 = coordinates[i];
    const coord2 = coordinates[i + 1];
    if (coord1 === undefined || coord2 === undefined) {
      continue;
    }

    const [lon1, lat1, elev1] = coord1;
    const [lon2, lat2, elev2] = coord2;

    if (
      lon1 === undefined ||
      lat1 === undefined ||
      elev1 === undefined ||
      lon2 === undefined ||
      lat2 === undefined ||
      elev2 === undefined
    ) {
      continue;
    }

    // Skip if both points are at ground level
    if (elev1 === 0 && elev2 === 0) {
      continue;
    }

    // Create vertical rectangle as a polygon
    // Winding order: counter-clockwise when viewed from outside
    // Bottom-left -> Bottom-right -> Top-right -> Top-left -> Bottom-left (closing)
    const ring: number[][] = [
      [lon1, lat1, 0], // Bottom left (ground)
      [lon2, lat2, 0], // Bottom right (ground)
      [lon2, lat2, elev2], // Top right (elevated)
      [lon1, lat1, elev1], // Top left (elevated)
      [lon1, lat1, 0], // Close the ring
    ];

    polygons.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ring],
      },
      properties: {
        fillColor,
        lineColor,
        shapeId,
      },
    });
  }

  return polygons;
}

/**
 * Create vertical curtain polygon features from elevated LineString features.
 * Converts elevated LineStrings into vertical rectangular polygons from ground to elevation.
 *
 * @param elevatedLines - Features with LineString/MultiLineString geometry and elevation
 * @param applyBaseOpacity - Whether to apply reduced opacity to fills
 * @returns Array of curtain polygon features
 *
 * @example
 * ```typescript
 * const curtainFeatures = createCurtainPolygonFeatures(elevatedLines, true);
 * // Returns vertical polygon features for each consecutive coordinate pair
 * ```
 */
export function createCurtainPolygonFeatures(
  elevatedLines: Shape['feature'][],
  applyBaseOpacity: boolean | undefined,
): CurtainFeature[] {
  const curtainFeatures: CurtainFeature[] = [];

  for (const feature of elevatedLines) {
    const { geometry } = feature;
    const lineColorRGBA = getLineColor(feature) as [
      number,
      number,
      number,
      number,
    ];
    const shapeId = feature.properties?.shapeId;

    // Create fill color with base opacity (same as polygon fills)
    const fillColor: [number, number, number, number] = applyBaseOpacity
      ? [
          lineColorRGBA[0],
          lineColorRGBA[1],
          lineColorRGBA[2],
          Math.round(lineColorRGBA[3] * 0.2),
        ]
      : lineColorRGBA;

    // Normalize to array of coordinate arrays for both LineString and MultiLineString
    // Safe cast: elevatedLines only contains LineString/MultiLineString features
    const rawCoords = (geometry as { coordinates: unknown }).coordinates;
    const coordArrays: number[][][] =
      geometry.type === 'LineString'
        ? [rawCoords as number[][]]
        : (rawCoords as number[][][]);

    for (const coords of coordArrays) {
      for (const polygon of createCurtainPolygonsFromLine(
        coords,
        fillColor,
        lineColorRGBA,
        shapeId,
      )) {
        curtainFeatures.push(polygon);
      }
    }
  }

  return curtainFeatures;
}

// =============================================================================
// Coordinate Projection
// =============================================================================

/**
 * Returns a copy of a feature with Z coordinates stripped from its geometry.
 *
 * LineStrings and MultiLineStrings have elevation baked into their coordinates
 * as the Z component. When rendered by GeoJsonLayer, those Z values position
 * the path in 3D space. Use this to project a feature back to the ground plane
 * (e.g. for the highlight outline layer, which should always render at ground).
 *
 * Polygon features are unaffected — deck.gl reads their elevation via the
 * `getElevation` accessor, not from geometry coordinates.
 *
 * @param feature - The feature to flatten
 * @returns A new feature with 2D coordinates, or the original if no Z present
 *
 * @example
 * ```typescript
 * // Elevated LineString [lon, lat, 20000] → [lon, lat]
 * const flat = flattenFeatureTo2D(elevatedLineStringFeature);
 * // flat.geometry.coordinates: [[lon, lat], [lon, lat], ...]
 * ```
 */
export function flattenFeatureTo2D(
  feature: Shape['feature'],
): Shape['feature'] {
  const { geometry } = feature;
  if (geometry.type === 'LineString') {
    return {
      ...feature,
      geometry: {
        ...geometry,
        coordinates: (geometry.coordinates as number[][]).map(
          ([lon, lat]) => [lon, lat] as [number, number],
        ),
      },
    };
  }
  if (geometry.type === 'MultiLineString') {
    return {
      ...feature,
      geometry: {
        ...geometry,
        coordinates: (geometry.coordinates as number[][][]).map((line) =>
          line.map(([lon, lat]) => [lon, lat] as [number, number]),
        ),
      },
    };
  }
  return feature;
}

/**
 * Partition curtain features by interaction state (main, hovered, selected).
 *
 * @param allCurtainFeatures - All curtain features to partition
 * @param hoveredShapeId - Currently hovered shape ID
 * @param selectedShapeId - Currently selected shape ID
 * @returns Partitioned curtain features by state
 *
 * @example
 * ```typescript
 * const { main, hovered, selected } = partitionCurtains(
 *   curtainFeatures,
 *   hoveredShapeId,
 *   selectedShapeId,
 * );
 * ```
 */
export function partitionCurtains(
  allCurtainFeatures: CurtainFeature[],
  hoveredShapeId: ShapeId | undefined,
  selectedShapeId: ShapeId | undefined,
): {
  main: CurtainFeature[];
  hovered: CurtainFeature[];
  selected: CurtainFeature[];
} {
  const main: CurtainFeature[] = [];
  const hovered: CurtainFeature[] = [];
  const selected: CurtainFeature[] = [];

  for (const f of allCurtainFeatures) {
    const id = f.properties.shapeId;
    if (id === selectedShapeId) {
      selected.push(f);
    } else if (id === hoveredShapeId) {
      hovered.push(f);
    } else {
      main.push(f);
    }
  }

  return { main, hovered, selected };
}
