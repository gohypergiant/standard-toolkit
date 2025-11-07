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
  getLabelBorderColor,
  getLabelFillColor,
  getLabelPosition2d,
  getLabelText,
  type LabelPositionOptions,
} from './utils/labels';
import type { EditableShape } from '../shared/types';

/**
 * Props for creating a shape label layer
 */
export interface ShapeLabelLayerProps {
  /** Layer ID (defaults to DISPLAY_LABELS constant) */
  id?: string;
  /** Array of shapes to label */
  data: EditableShape[];
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
 * - **Styled backgrounds**: Color-matched backgrounds with borders using shape colors
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
): TextLayer<EditableShape> {
  const { id = SHAPE_LAYER_IDS.DISPLAY_LABELS, data, labelOptions } = props;

  return new TextLayer<EditableShape>({
    id,
    data,

    // Text content
    getText: getLabelText,

    // Position - use pixel-based offsets for consistent positioning
    getPosition: (d: EditableShape) =>
      getLabelPosition2d(d, labelOptions).coordinates,
    getPixelOffset: (d: EditableShape) =>
      getLabelPosition2d(d, labelOptions).pixelOffset,
    getTextAnchor: (d: EditableShape) =>
      getLabelPosition2d(d, labelOptions).textAnchor,
    getAlignmentBaseline: (d: EditableShape) =>
      getLabelPosition2d(d, labelOptions).alignmentBaseline,

    // Styling
    getColor: [0, 0, 0, 255], // Black text
    getSize: 10,
    getAngle: 0,

    // Background
    background: true,
    backgroundPadding: [8, 8, 8, 8],
    getBackgroundColor: getLabelFillColor,

    // Border
    getBorderColor: getLabelBorderColor,
    getBorderWidth: 2,

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
