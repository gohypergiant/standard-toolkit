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

import { uuid } from '@accelint/core';
import { centroid, distance } from '@turf/turf';
import { DEFAULT_STYLE_PROPERTIES } from '../../shared/constants';
import { DEFAULT_DISTANCE_UNITS } from '../../../../shared/units';
import { ShapeFeatureType as ShapeFeatureTypeEnum } from '../../shared/types';
import type { Feature, Polygon, Position } from 'geojson';
import type {
  CircleProperties,
  DisplayShape,
  ShapeFeature,
  ShapeFeatureType,
  StyleProperties,
} from '../../shared/types';

/**
 * Generate a default name for a shape based on its type
 */
function generateShapeName(shapeType: ShapeFeatureType): string {
  const timestamp = new Date().toLocaleTimeString();
  return `New ${shapeType} (${timestamp})`;
}

/**
 * Compute circle properties from a polygon geometry (circle approximation)
 *
 * The EditableGeoJsonLayer creates circles as polygon approximations.
 * This function extracts the center and radius from that polygon.
 */
function computeCircleProperties(
  geometry: Polygon,
): CircleProperties | undefined {
  const coordinates = geometry.coordinates[0];
  if (!coordinates || coordinates.length < 3) {
    return undefined;
  }

  // Calculate center using turf centroid
  const centerFeature = centroid({
    type: 'Polygon',
    coordinates: geometry.coordinates,
  });
  const center = centerFeature.geometry.coordinates as [number, number];

  // Calculate radius as distance from center to first point
  const firstPoint = coordinates[0] as Position;
  const radius = distance(center, firstPoint, {
    units: DEFAULT_DISTANCE_UNITS,
  });

  return {
    center,
    radius: {
      value: radius,
      units: DEFAULT_DISTANCE_UNITS,
    },
  };
}

/**
 * Convert a raw GeoJSON Feature from EditableGeoJsonLayer to a DisplayShape
 *
 * @param feature - The raw GeoJSON feature from the editable layer
 * @param shapeType - The type of shape being created
 * @param styleDefaults - Optional style overrides
 * @returns A complete DisplayShape ready for use
 */
export function convertFeatureToDisplayShape(
  feature: Feature,
  shapeType: ShapeFeatureType,
  styleDefaults?: Partial<StyleProperties> | null,
): DisplayShape {
  const id = uuid();
  const name = generateShapeName(shapeType);

  // Merge default styles with any provided defaults
  const styleProperties: StyleProperties = {
    ...DEFAULT_STYLE_PROPERTIES,
    ...(styleDefaults ?? {}),
  };

  // Compute circle properties if this is a circle
  let circleProperties: CircleProperties | undefined;
  if (
    shapeType === ShapeFeatureTypeEnum.Circle &&
    feature.geometry.type === 'Polygon'
  ) {
    circleProperties = computeCircleProperties(feature.geometry as Polygon);
  }

  // Create the styled feature
  const styledFeature: ShapeFeature = {
    type: 'Feature',
    geometry: feature.geometry,
    properties: {
      styleProperties,
      circleProperties,
      shapeId: id,
    },
  };

  return {
    id,
    name,
    shapeType,
    feature: styledFeature,
    lastUpdated: Date.now(),
  };
}

/**
 * Create an empty FeatureCollection for initializing the editable layer
 */
export function createEmptyFeatureCollection(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}
