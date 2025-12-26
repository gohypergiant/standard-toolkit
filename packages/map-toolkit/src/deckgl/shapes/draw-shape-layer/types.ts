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
import type { Feature } from 'geojson';
import type { DistanceUnitAbbreviation } from '../../../shared/units';
import type {
  CircleProperties,
  DisplayShape,
  ShapeFeatureType,
  StyleProperties,
} from '../shared/types';

/**
 * State for the drawing store
 */
export interface DrawingState {
  /** Current shape type being drawn, null when not drawing */
  activeShapeType: ShapeFeatureType | null;
  /** Tentative feature being drawn (updates in real-time) */
  tentativeFeature: Feature | null;
  /** Default style properties to apply to drawn shapes */
  styleDefaults: Partial<StyleProperties> | null;
  /** Default circle properties (for Circle shapes) */
  circleDefaults: Partial<CircleProperties> | null;
}

/**
 * Options for starting a drawing operation
 */
export interface DrawShapeOptions {
  /** Default style properties for the drawn shape */
  styleDefaults?: Partial<StyleProperties>;
  /** Circle-specific defaults (only used for Circle shapes) */
  circleDefaults?: Partial<CircleProperties>;
}

/**
 * Options for the useDrawShapes hook
 */
export interface UseDrawShapesOptions {
  /** Callback when a shape is successfully drawn */
  onCreate?: (shape: DisplayShape) => void;
  /** Callback when drawing is canceled */
  onCancel?: (shapeType: ShapeFeatureType) => void;
}

/**
 * Return type for the useDrawShapes hook
 */
export interface UseDrawShapesReturn {
  /** Current drawing state (null when not drawing) */
  drawingState: DrawingState | null;
  /** Start drawing a shape type with optional defaults */
  draw: (shapeType: ShapeFeatureType, options?: DrawShapeOptions) => void;
  /** Cancel the current drawing operation */
  cancel: () => void;
  /** Whether currently in drawing mode */
  isDrawing: boolean;
  /** The shape type currently being drawn (null if not drawing) */
  activeShapeType: ShapeFeatureType | null;
}

/**
 * Props for the DrawShapeLayer component
 */
export interface DrawShapeLayerProps {
  /** Layer ID (defaults to 'draw-shape-layer') */
  id?: string;
  /** Map instance ID for multi-map isolation */
  mapId: UniqueId;
  /** Distance unit for tooltip measurements (defaults to 'km') */
  unit?: DistanceUnitAbbreviation;
}

/**
 * Function type for the draw action
 */
export type DrawFunction = (
  shapeType: ShapeFeatureType,
  options?: DrawShapeOptions,
) => void;

/**
 * Function type for subscription (useSyncExternalStore pattern)
 */
export type Subscription = (onStoreChange: () => void) => () => void;
