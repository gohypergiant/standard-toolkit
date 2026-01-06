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
import type { Shape } from '../shared/types';

/**
 * Edit mode for shape editing
 * - 'view': Not editing, shape is viewable only
 * - 'bounding-transform': Scale/rotate/translate via bounding box handles (ellipses, rectangles)
 * - 'vertex-transform': Drag vertices OR scale/rotate/translate (polygons, lines)
 * - 'circle-transform': Drag edge to resize, drag body to translate (circles)
 * - 'translate': Drag to move the shape (points)
 */
export type EditMode =
  | 'view'
  | 'bounding-transform'
  | 'vertex-transform'
  | 'circle-transform'
  | 'translate';

/**
 * State for the editing store
 */
export type EditingState = {
  /** Shape currently being edited */
  editingShape: Shape | null;
  /** Current edit mode */
  editMode: EditMode;
  /** Live feature being edited (updates in real-time during drag) */
  featureBeingEdited: Feature | null;
};

/**
 * Options for starting an edit operation
 */
export type EditShapeOptions = {
  /** Override the default edit mode (auto-detected from shape type by default) */
  mode?:
    | 'bounding-transform'
    | 'vertex-transform'
    | 'circle-transform'
    | 'translate';
};

/**
 * Options for the useEditShape hook
 */
export type UseEditShapeOptions = {
  /** Callback when a shape edit is saved */
  onUpdate?: (shape: Shape) => void;
  /** Callback when editing is canceled */
  onCancel?: (shape: Shape) => void;
};

/**
 * Return type for the useEditShape hook
 */
export type UseEditShapeReturn = {
  /** Current editing state (null when not editing) */
  editingState: EditingState | null;
  /** Start editing a shape with optional mode override */
  edit: (shape: Shape, options?: EditShapeOptions) => void;
  /** Save the current edits and emit updated event */
  save: () => void;
  /** Cancel editing and revert to original shape */
  cancel: () => void;
  /** Whether currently in editing mode */
  isEditing: boolean;
  /** The shape currently being edited (null if not editing) */
  editingShape: Shape | null;
};

/**
 * Props for the EditShapeLayer component
 */
export type EditShapeLayerProps = {
  /** Layer ID (defaults to 'edit-shape-layer') */
  id?: string;
  /**
   * Map instance ID for multi-map isolation.
   * Optional when used inside a MapProvider (uses context).
   * Required when used outside a MapProvider.
   */
  mapId?: UniqueId;
  /** Distance unit for tooltip measurements (defaults to 'km') */
  unit?: DistanceUnitAbbreviation;
};

/**
 * Function type for the edit action
 */
export type EditFunction = (shape: Shape, options?: EditShapeOptions) => void;
