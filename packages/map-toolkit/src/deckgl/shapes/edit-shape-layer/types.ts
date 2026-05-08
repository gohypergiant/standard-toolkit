/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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

import type { DistanceUnitSymbol } from '@accelint/constants/units';
import type { UniqueId } from '@accelint/core';
import type { KeyOption } from '@accelint/hotkey-manager';
import type { NonEmptyArray } from '@accelint/hotkey-manager/types/non-empty-array';
import type { Color } from '@deck.gl/core';
import type { Feature } from 'geojson';
import type { Shape } from '../shared/types';

/**
 * Edit mode for shape editing
 * - 'view': Not editing, shape is viewable only
 * - 'bounding-transform': Scale/rotate/translate via bounding box handles (generic axis-bounded shapes)
 * - 'rectangle-transform': Like bounding-transform but with rectangle-aware scaling that
 *   preserves rotation when the rectangle has been spun (rectangles)
 * - 'ellipse-transform': Like bounding-transform but with ellipse-aware scaling that
 *   preserves rotation, with axis-endpoint handles instead of bbox corners (ellipses)
 * - 'locked-bounding-transform': Like bounding-transform but scaling always maintains aspect ratio (wagon wheels)
 * - 'vertex-transform': Drag vertices OR scale/rotate/translate (polygons, lines)
 * - 'circle-transform': Drag edge to resize, drag body to translate (circles)
 * - 'translate': Drag to move the shape (generic translation)
 * - 'point-translate': Click to place OR drag to move (points)
 */
export type EditMode =
  | 'view'
  | 'bounding-transform'
  | 'rectangle-transform'
  | 'ellipse-transform'
  | 'locked-bounding-transform'
  | 'vertex-transform'
  | 'circle-transform'
  | 'translate'
  | 'point-translate';

/**
 * State for the editing store
 */
export type EditingState = {
  /** The original shape captured when editing first started. Preserved across same-ID re-entry
   *  (e.g. form commits calling edit()) so cancel always reverts to the true pre-edit state. */
  originalShape: Shape | null;
  /** Shape currently being edited — updated on every edit() call including re-entry. */
  editingShape: Shape | null;
  /** Current edit mode */
  editMode: EditMode;
  /** Live feature being edited (updates in real-time during drag) */
  featureBeingEdited: Feature | null;
  /** Edit mode to restore after held panning hotkey is released. Null when not panning. */
  previousMode: EditMode | null;
  /** The most recent completion edit type (e.g. 'scaled', 'rotated', 'translated'). Null during continuous drag events. */
  lastCompletedEditType: string | null;
};

/**
 * Options for starting an edit operation
 */
export type EditShapeOptions = {
  /** Override the default edit mode (auto-detected from shape type by default) */
  mode?: Exclude<EditMode, 'view'>;
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
  /**
   * Update the feature geometry mid-edit without restarting the edit session.
   *
   * Use this to sync external changes (e.g. form coordinate input) to the map
   * while the user is still editing. Unlike {@link edit}, this does not cancel
   * the current session or re-emit editing events.
   *
   * No-op when not currently editing.
   *
   * @param feature - The updated GeoJSON feature to render on the map.
   */
  updateFeature: (feature: Feature) => void;
  /** Whether currently in editing mode */
  isEditing: boolean;
  /** The shape currently being edited (null if not editing) */
  editingShape: Shape | null;
};

/**
 * Visual customization for edit-handle dots and the polygon/line bounding
 * box. All fields are optional — omit any field to fall back to the
 * package defaults from `shared/constants`.
 *
 * Edit handles split into three roles by `editHandleType`:
 * - `vertex` — circles on the polygon's existing/intermediate points
 *   (white by default).
 * - `scale` — corner handles on the bounding box (turquoise by default).
 * - `rotate` — the dot at the end of the rotation stem (amber by default).
 *
 * Each role can be styled independently with its own fill color, outline
 * color, and radius. The outline width and "show outline" toggle are
 * single values that apply to all three roles, mirroring the upstream
 * `editHandlePointStrokeWidth` / `editHandlePointOutline` props (deck.gl
 * doesn't accept per-handle accessors for those).
 *
 * `bboxLineColor`, `bboxLineWidth`, and `bboxDashArray` style only the
 * polygon/line bounding box; the rotate stem connector and other guide
 * lines stay solid in the standard line color so the bbox reads as
 * scaffolding distinct from interactive feedback.
 */
export type EditShapeStyle = {
  /** Fill color for vertex handles (existing + intermediate points). */
  vertexHandleColor?: Color;
  /** Fill color for scale corner handles on the bounding box. */
  scaleHandleColor?: Color;
  /** Fill color for the rotate handle at the end of the rotate stem. */
  rotateHandleColor?: Color;
  /** Outline (stroke) color for vertex handles. */
  vertexHandleOutlineColor?: Color;
  /** Outline (stroke) color for scale corner handles. */
  scaleHandleOutlineColor?: Color;
  /** Outline (stroke) color for the rotate handle. */
  rotateHandleOutlineColor?: Color;
  /** Vertex handle radius in pixels. */
  vertexHandleRadius?: number;
  /** Scale corner handle radius in pixels. */
  scaleHandleRadius?: number;
  /** Rotate handle radius in pixels. */
  rotateHandleRadius?: number;
  /**
   * Outline thickness in pixels for *all* edit-handle dots. Single value
   * because the upstream `editHandlePointStrokeWidth` prop doesn't accept
   * a per-handle-type accessor.
   */
  editHandleStrokeWidth?: number;
  /**
   * Whether edit handles render with an outline ring. Defaults to `true`
   * (matches upstream); set to `false` to render handles as solid dots
   * with no stroke.
   */
  editHandleOutline?: boolean;
  /** Stroke color for the polygon/line bounding box outline. */
  bboxLineColor?: Color;
  /** Stroke width in pixels for the polygon/line bounding box outline. */
  bboxLineWidth?: number;
  /** Dash pattern `[dashLength, gapLength]` in pixels for the bbox outline. */
  bboxDashArray?: [number, number];
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
  unit?: DistanceUnitSymbol;
  /** Configuration for hotkeys in EditShapesLayer */
  hotkeyConfig?: EditShapeHotkeyConfig;
  /**
   * Visual customization for edit handles and the bounding box. Each
   * field is independently overridable; omitted fields use the package
   * defaults. See {@link EditShapeStyle}.
   */
  style?: EditShapeStyle;
};

/**
 * Function type for the edit action
 */
export type EditFunction = (shape: Shape, options?: EditShapeOptions) => void;

/**
 * Type to define hotkey configurations for functions in EditShapeLayer
 */
export type EditShapeHotkeyConfig = {
  panning: KeyOption | NonEmptyArray<KeyOption>;
};
