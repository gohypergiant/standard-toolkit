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
import type { DisplayShape, Subscription } from '../shared/types';

export type { Subscription };

/**
 * Edit mode for shape editing
 * - 'view': Not editing, shape is viewable only
 * - 'modify': Drag vertices to modify shape geometry (polygons, lines, rectangles, points)
 * - 'resize-circle': Drag edge to resize circle radius from center
 */
export type EditMode = 'view' | 'modify' | 'resize-circle';

/**
 * State for the editing store
 */
export interface EditingState {
  /** Shape currently being edited */
  editingShape: DisplayShape | null;
  /** Current edit mode */
  editMode: EditMode;
  /** Live feature being edited (updates in real-time during drag) */
  featureBeingEdited: Feature | null;
}

/**
 * Options for starting an edit operation
 */
export interface EditShapeOptions {
  /** Override the default edit mode (auto-detected from shape type by default) */
  mode?: 'modify' | 'resize-circle';
}

/**
 * Options for the useEditShape hook
 */
export interface UseEditShapeOptions {
  /** Callback when a shape edit is saved */
  onUpdate?: (shape: DisplayShape) => void;
  /** Callback when editing is canceled */
  onCancel?: (shape: DisplayShape) => void;
}

/**
 * Return type for the useEditShape hook
 */
export interface UseEditShapeReturn {
  /** Current editing state (null when not editing) */
  editingState: EditingState | null;
  /** Start editing a shape with optional mode override */
  edit: (shape: DisplayShape, options?: EditShapeOptions) => void;
  /** Save the current edits and emit updated event */
  save: () => void;
  /** Cancel editing and revert to original shape */
  cancel: () => void;
  /** Whether currently in editing mode */
  isEditing: boolean;
  /** The shape currently being edited (null if not editing) */
  editingShape: DisplayShape | null;
}

/**
 * Props for the EditShapeLayer component
 */
export interface EditShapeLayerProps {
  /** Layer ID (defaults to 'edit-shape-layer') */
  id?: string;
  /** Map instance ID for multi-map isolation */
  mapId?: UniqueId;
  /** Distance unit for tooltip measurements (defaults to 'km') */
  unit?: DistanceUnitAbbreviation;
}

/**
 * Function type for the edit action
 */
export type EditFunction = (
  shape: DisplayShape,
  options?: EditShapeOptions,
) => void;
