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

import type { CompositeLayerProps } from '@deck.gl/core';
import type {
  EditableShape,
  ShapeId,
  StyledFeature as SharedStyledFeature,
} from '../shared/types';

/**
 * Re-export StyledFeature from shared types
 */
export type StyledFeature = SharedStyledFeature;

/**
 * Re-export StyledFeatureProperties from shared types
 */
export type StyledFeatureProperties = SharedStyledFeature['properties'];

/**
 * Props for DisplayShapeLayer
 */
export interface DisplayShapeLayerProps extends CompositeLayerProps {
  /** Unique layer ID */
  id: string;

  /** Array of shapes to display */
  data: EditableShape[];

  /** Currently selected shape ID (for highlighting) */
  selectedShapeId?: ShapeId;

  /** Callback when a shape is clicked */
  onShapeClick?: (shape: EditableShape) => void;

  /** Callback when a shape is hovered (null when hover ends) */
  onShapeHover?: (shape: EditableShape | null) => void;

  /** Whether shapes are pickable (clickable/hoverable) */
  pickable?: boolean;

  /** Whether to show labels */
  showLabels?: boolean;

  /** Custom highlight color [r, g, b, a] */
  highlightColor?: [number, number, number, number];
}
