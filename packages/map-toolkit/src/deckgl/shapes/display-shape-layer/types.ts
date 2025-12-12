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

import type { UniqueId } from '@accelint/core';
import type { CompositeLayerProps } from '@deck.gl/core';
import type {
  EditableShape,
  ShapeId,
  StyledFeature as SharedStyledFeature,
} from '../shared/types';
import type { LabelPositionOptions } from './utils/labels';

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
 *
 * @example Basic usage
 * ```tsx
 * const props: DisplayShapeLayerProps = {
 *   id: 'my-shapes',
 *   data: myShapes,
 *   pickable: true,
 *   showLabels: true,
 * };
 * ```
 */
export interface DisplayShapeLayerProps extends CompositeLayerProps {
  /** Unique layer ID - required for deck.gl layer management */
  id: string;

  /**
   * Map instance ID for event bus isolation in multi-map scenarios.
   * Shape events will include this ID in their payload,
   * allowing listeners to filter events by map instance.
   */
  mapId: UniqueId;

  /**
   * Array of shapes to display
   * Each shape must have a GeoJSON feature with styleProperties
   */
  data: EditableShape[];

  /**
   * Currently selected shape ID (for highlighting)
   * When set, renders a highlight layer around the selected shape
   */
  selectedShapeId?: ShapeId;

  /**
   * Callback when a shape is clicked
   * Also triggers a shapes:selected event on the event bus
   * @param shape - The clicked shape with full properties
   */
  onShapeClick?: (shape: EditableShape) => void;

  /**
   * Callback when a shape is hovered
   * Called with null when hover ends
   * @param shape - The hovered shape, or null when hover ends
   */
  onShapeHover?: (shape: EditableShape | null) => void;

  /**
   * Whether shapes are pickable (clickable/hoverable)
   * @default true
   */
  pickable?: boolean;

  /**
   * Whether to show labels on shapes
   * Labels use the shape's `label` property, or `name` if label is not set
   * @default true
   */
  showLabels?: boolean;

  /**
   * Global label positioning options
   * Can be overridden per-shape via styleProperties
   * Priority: per-shape properties > labelOptions > defaults
   * @see LabelPositionOptions for available options
   */
  labelOptions?: LabelPositionOptions;

  /**
   * Custom highlight color for selected shapes [r, g, b, a]
   * Each channel is 0-255
   * @default [40, 245, 190, 100] - Turquoise at ~39% opacity
   * @example Custom red highlight
   * ```tsx
   * highlightColor={[255, 0, 0, 128]} // Red at 50% opacity
   * ```
   */
  highlightColor?: [number, number, number, number];
}
