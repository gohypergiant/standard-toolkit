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

import { GeoJsonLayer } from '@deck.gl/layers';
import { getStrokeWidth } from '../display-shape-layer/utils/display-style';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import type { EditableShape, ShapeId } from '../shared/types';

export interface EditHighlightLayerProps {
  id?: string;
  data: EditableShape[];
  selectedShapeId?: ShapeId;
  hoveredShapeId?: ShapeId;
  highlightColor?: [number, number, number, number];
}

/**
 * Creates a highlight layer for selected shape during editing
 */
export function createEditHighlightSelectedLayer(
  props: EditHighlightLayerProps,
): GeoJsonLayer | null {
  const {
    id = SHAPE_LAYER_IDS.EDIT_HIGHLIGHT_SELECTED,
    data,
    selectedShapeId,
    highlightColor = [40, 245, 190, 100], // Turquoise at 39% opacity
  } = props;

  if (!selectedShapeId) {
    return null;
  }

  const selectedShape = data.find((shape) => shape.id === selectedShapeId);
  if (!selectedShape) {
    return null;
  }

  // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer data type compatibility
  return new GeoJsonLayer<any>({
    id,
    // biome-ignore lint/suspicious/noExplicitAny: GeoJSON Feature type compatibility
    data: [selectedShape.feature] as any,

    // Filled geometries (Polygon, Circle)
    filled: true,
    getFillColor: highlightColor,

    // Line geometries (LineString, Polygon outline)
    stroked: true,
    getLineColor: highlightColor,
    getLineWidth: (f) => {
      const shape = data.find((s) => s.feature === f);
      return shape ? getStrokeWidth(shape.feature) + 2 : 4; // Slightly thicker for highlight
    },
    lineWidthUnits: 'pixels',
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 20,

    // Point geometries
    pointType: 'circle',
    getPointRadius: 8, // Slightly larger for highlight
    pointRadiusUnits: 'pixels',

    // Behavior
    pickable: false,
  });
}

/**
 * Creates a highlight layer for hovered shape during editing
 */
export function createEditHighlightHoveredLayer(
  props: EditHighlightLayerProps,
): GeoJsonLayer | null {
  const {
    id = SHAPE_LAYER_IDS.EDIT_HIGHLIGHT_HOVERED,
    data,
    hoveredShapeId,
    selectedShapeId,
  } = props;

  // Don't show hover highlight if the shape is already selected
  if (!hoveredShapeId || hoveredShapeId === selectedShapeId) {
    return null;
  }

  const hoveredShape = data.find((shape) => shape.id === hoveredShapeId);
  if (!hoveredShape) {
    return null;
  }

  const hoverColor: [number, number, number, number] = [255, 255, 255, 80]; // White at 31% opacity

  // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer data type compatibility
  return new GeoJsonLayer<any>({
    id,
    // biome-ignore lint/suspicious/noExplicitAny: GeoJSON Feature type compatibility
    data: [hoveredShape.feature] as any,

    // Filled geometries (Polygon, Circle)
    filled: true,
    getFillColor: hoverColor,

    // Line geometries (LineString, Polygon outline)
    stroked: true,
    getLineColor: hoverColor,
    getLineWidth: (f) => {
      const shape = data.find((s) => s.feature === f);
      return shape ? getStrokeWidth(shape.feature) + 1 : 3; // Slightly thicker for highlight
    },
    lineWidthUnits: 'pixels',
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 20,

    // Point geometries
    pointType: 'circle',
    getPointRadius: 7, // Slightly larger for highlight
    pointRadiusUnits: 'pixels',

    // Behavior
    pickable: false,
  });
}
