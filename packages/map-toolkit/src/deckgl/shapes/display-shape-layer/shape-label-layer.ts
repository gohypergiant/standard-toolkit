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
} from './utils/labels';
import type { EditableShape } from '../shared/types';

export interface ShapeLabelLayerProps {
  id?: string;
  data: EditableShape[];
}

/**
 * ShapeLabelLayer - Renders text labels for shapes
 * Uses TextLayer from DeckGL with smart positioning based on geometry type
 */
export function createShapeLabelLayer(
  props: ShapeLabelLayerProps,
): TextLayer<EditableShape> {
  const { id = SHAPE_LAYER_IDS.DISPLAY_LABELS, data } = props;

  return new TextLayer<EditableShape>({
    id,
    data,

    // Text content
    getText: getLabelText,

    // Position
    // biome-ignore lint/suspicious/noExplicitAny: TextLayer position type compatibility
    getPosition: getLabelPosition2d as any,

    // Styling
    getColor: [255, 255, 255, 255], // White text
    getSize: 12,
    getAngle: 0,
    getTextAnchor: 'middle',
    getAlignmentBaseline: 'center',

    // Background
    background: true,
    backgroundPadding: [8, 8, 8, 8],
    getBackgroundColor: getLabelFillColor,

    // Border
    getBorderColor: getLabelBorderColor,
    getBorderWidth: 2,

    // Font
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: 500,

    // Behavior
    pickable: false,
  });
}
