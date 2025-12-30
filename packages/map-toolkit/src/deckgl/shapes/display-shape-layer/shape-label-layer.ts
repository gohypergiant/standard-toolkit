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

import { TextLayer } from '@deck.gl/layers';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import {
  getLabelPosition2d,
  getLabelText,
  type LabelPosition2d,
  type LabelPositionOptions,
} from './utils/labels';
import type { Shape } from '../shared/types';

/**
 * Creates a cached label position getter to avoid computing position multiple times per shape.
 * Uses WeakMap so positions are garbage collected when shapes are removed.
 */
function createCachedPositionGetter(
  labelOptions: LabelPositionOptions | undefined,
) {
  const cache = new WeakMap<Shape, LabelPosition2d | null>();

  // Returns nullable position for filtering
  const getNullable = (shape: Shape): LabelPosition2d | null => {
    if (cache.has(shape)) {
      return cache.get(shape) ?? null;
    }
    const position = getLabelPosition2d(shape, labelOptions);
    cache.set(shape, position);
    return position;
  };

  // Returns position, throwing if null (use only after filtering)
  const getRequired = (shape: Shape): LabelPosition2d => {
    const position = getNullable(shape);
    if (!position) {
      throw new Error(
        'Shape has no valid position - should have been filtered',
      );
    }
    return position;
  };

  return { getRequired, getNullable };
}

/**
 * Props for creating a shape label layer
 */
export interface ShapeLabelLayerProps {
  /** Layer ID (defaults to DISPLAY_LABELS constant) */
  id?: string;
  /** Array of shapes to label */
  data: Shape[];
  /**
   * Global label positioning options
   * Per-shape properties in styleProperties take precedence
   */
  labelOptions?: LabelPositionOptions;
}

/**
 * Creates a TextLayer for rendering shape labels with intelligent positioning
 *
 * ## Features
 * - **Geometry-aware positioning**: Different defaults for Point, LineString, Polygon, and Circle
 * - **Three-tier priority system**: Per-shape properties > labelOptions > defaults
 * - **Coordinate anchoring**: Position labels at start/middle/end (or edge positions for circles)
 * - **Pixel-based offsets**: Consistent label placement at all zoom levels
 * - **Text-only styling**: White uppercase text with black outline for legibility
 * - **Position caching**: Label positions are computed once per shape using a WeakMap cache
 *
 * ## Label Positioning Priority
 * 1. Per-shape `styleProperties` (highest priority)
 * 2. Global `labelOptions` parameter
 * 3. Geometry-specific defaults (fallback)
 *
 * @param props - Shape label layer configuration
 * @returns Configured TextLayer instance
 *
 * @example
 * ```tsx
 * const labelLayer = createShapeLabelLayer({
 *   id: 'my-labels',
 *   data: shapes,
 *   labelOptions: {
 *     circleLabelCoordinateAnchor: 'top',
 *     pointLabelOffset: [0, -20],
 *   },
 * });
 * ```
 */
export function createShapeLabelLayer(
  props: ShapeLabelLayerProps,
): TextLayer<Shape> {
  const { id = SHAPE_LAYER_IDS.DISPLAY_LABELS, data, labelOptions } = props;

  // Create cached position getter to avoid computing position 4x per shape
  const { getRequired, getNullable } = createCachedPositionGetter(labelOptions);

  // Filter out shapes with invalid positions (null coordinates)
  const validData = data.filter((shape) => getNullable(shape) !== null);

  return new TextLayer<Shape>({
    id,
    data: validData,

    // Text content - uppercase
    getText: getLabelText,

    // Position - use cached getter for all position-related properties
    // getRequired is safe because we filtered out null positions above
    getPosition: (d: Shape) => getRequired(d).coordinates,
    getPixelOffset: (d: Shape) => getRequired(d).pixelOffset,
    getTextAnchor: (d: Shape) => getRequired(d).textAnchor,
    getAlignmentBaseline: (d: Shape) => getRequired(d).alignmentBaseline,

    // Styling - white text with black outline, no background
    getColor: [255, 255, 255, 255], // White text
    getSize: 10,
    getAngle: 0,

    // Text outline for legibility (black stroke around white text)
    outlineWidth: 2,
    outlineColor: [0, 0, 0, 255], // Black outline

    // No background or border
    background: false,

    // Font
    fontFamily: 'Roboto MonoVariable, monospace',
    fontWeight: 'bold',
    fontSettings: {
      sdf: true,
    },

    // Update triggers - tell deck.gl to recalculate when labelOptions change
    updateTriggers: {
      getPosition: [labelOptions],
      getPixelOffset: [labelOptions],
      getTextAnchor: [labelOptions],
      getAlignmentBaseline: [labelOptions],
    },

    // Behavior
    pickable: false,
  });
}
