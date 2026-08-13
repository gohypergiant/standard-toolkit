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

/**
 * Edit Shape Store
 *
 * Manages editing state for shape modification.
 *
 * @example
 * ```typescript
 * import { editStore } from '@accelint/map-toolkit/deckgl/shapes';
 *
 * function EditControls({ mapId }) {
 *   const { state, edit, save, cancel } = editStore.use(mapId);
 *
 *   return (
 *     <div>
 *       <p>Editing: {state.editingShape?.name ?? 'none'}</p>
 *       <button onClick={save}>Save</button>
 *       <button onClick={cancel}>Cancel</button>
 *     </div>
 *   );
 * }
 * ```
 */

import { Broadcast } from '@accelint/bus';
import { createMapStore } from '@/shared/create-map-store';
import { createLoggerDomain } from '@/shared/logger';
import { MapEvents } from '../../base-map/events';
import type { DistanceUnit } from '@accelint/constants/units';
import {
  isCircleShape,
  isEllipseShape,
  isPointShape,
  isRectangleShape,
  isWagonWheelShape,
} from '../shared/types';
import {
  computeCirclePropertiesFromGeometry,
  computeCirclePropertiesFromMultiPolygon,
} from '../shared/utils/geometry-measurements';
import {
  releaseModeAndCursor,
  requestCursorChange,
  requestModeChange,
} from '../shared/utils/mode-utils';
import {
  COMPLETION_EDIT_TYPES,
  EDIT_CURSOR_MAP,
  EDIT_SHAPE_LAYER_ID,
  EDIT_SHAPE_MODE,
} from './constants';
import { EditShapeEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { Feature } from 'geojson';
import type { MapEventType } from '../../base-map/types';
import type { Shape } from '../shared/types';
import type {
  EditShapeEvent,
  FeatureEditingEvent,
  ShapeEditCanceledEvent,
  ShapeEditingEvent,
  ShapeUpdatedEvent,
} from './events';
import type {
  EditFunction,
  EditingState,
  EditMode,
  EditShapeOptions,
} from './types';

const logger = createLoggerDomain('[EditShapeLayer]');

/**
 * Typed event bus instances
 */
const editShapeBus = Broadcast.getInstance<EditShapeEvent>();
const mapEventBus = Broadcast.getInstance<MapEventType>();

/**
 * Default editing state
 */
const DEFAULT_EDITING_STATE: EditingState = {
  originalShape: null,
  editingShape: null,
  editMode: 'view',
  featureBeingEdited: null,
  previousMode: null,
  lastCompletedEditType: null,
};

/**
 * Actions for edit shape store
 */
type EditShapeActions = {
  /** Start editing a shape */
  edit: EditFunction;
  /** Save the current edits */
  save: () => void;
  /** Cancel editing */
  cancel: () => void;
};

/**
 * Determine the appropriate edit mode for a shape type
 *
 * @param shape - The shape to determine the edit mode for
 * @returns The edit mode to use for this shape type
 */
function getEditModeForShape(shape: Shape): EditMode {
  if (isPointShape(shape)) {
    return 'point-translate';
  }
  if (isCircleShape(shape)) {
    return 'circle-transform';
  }
  if (isWagonWheelShape(shape)) {
    return 'locked-bounding-transform';
  }
  if (isRectangleShape(shape)) {
    // Rectangles use rotation-aware corner-drag scaling so a rotated
    // rectangle doesn't distort into a parallelogram during scale
    // (axis-aligned bbox scaling would).
    return 'rectangle-transform';
  }
  if (isEllipseShape(shape)) {
    // Ellipses use axis-endpoint scaling (handles on the curve at the
    // major/minor axis endpoints) so a rotated ellipse stays a clean
    // rotated ellipse during scale (lat/lon-axis-aligned bbox scaling
    // would stretch it into a non-ellipse).
    return 'ellipse-transform';
  }
  return 'vertex-transform';
}

/**
 * Start editing a shape
 */
function startEditing(
  mapId: UniqueId,
  state: EditingState,
  shape: Shape,
  options: EditShapeOptions | undefined,
  notify: () => void,
  setState: (updates: Partial<EditingState>) => void,
): void {
  // Prevent editing locked shapes
  if (shape.locked) {
    logger.warn(`Cannot edit locked shape: "${shape.name}"`);
    return;
  }

  // Determine edit mode (can be overridden via options)
  const editMode = options?.mode ?? getEditModeForShape(shape);

  // When re-entering edit mode for the same shape (e.g. form commit updating
  // geometry, or Point→MultiPolygon mode transition during creation), update
  // state in-place without cancel/restart. This avoids a race condition where
  // releaseModeAndCursor from cancel fires after requestModeChange.
  // originalShape is intentionally NOT updated here — it preserves the
  // pre-edit state so cancel always reverts to the true original.
  if (state.editingShape?.id === shape.id) {
    const modeChanged = state.editMode !== editMode;
    setState({
      editingShape: shape,
      editMode,
      featureBeingEdited: shape.feature,
    });
    // Only request new mode/cursor if the edit mode actually changed
    if (modeChanged) {
      requestModeChange(mapId, EDIT_SHAPE_MODE, EDIT_SHAPE_LAYER_ID);
      const cursor = EDIT_CURSOR_MAP[editMode];
      requestCursorChange(mapId, cursor, EDIT_SHAPE_LAYER_ID);
    }
    notify();
    return;
  }

  // Different shape — cancel current edit first
  if (state.editingShape) {
    cancelEditingInternal(mapId, state, notify, setState);
  }

  // Update state with new object reference — capture originalShape for cancel revert
  setState({
    originalShape: shape,
    editingShape: shape,
    editMode,
    featureBeingEdited: shape.feature,
  });

  // Request map mode and cursor
  requestModeChange(mapId, EDIT_SHAPE_MODE, EDIT_SHAPE_LAYER_ID);
  const cursor = EDIT_CURSOR_MAP[editMode];
  requestCursorChange(mapId, cursor, EDIT_SHAPE_LAYER_ID);

  // Disable map panning during editing
  mapEventBus.emit(MapEvents.disablePan, { id: mapId });

  // Emit editing started event
  editShapeBus.emit(EditShapeEvents.editing, {
    shape,
    mapId,
  } as unknown as ShapeEditingEvent['payload']);

  notify();
}

/**
 * Save editing and create updated shape
 */
function saveEditingInternal(
  mapId: UniqueId,
  state: EditingState,
  notify: () => void,
  setState: (updates: Partial<EditingState>) => void,
): Shape | null {
  if (!(state.editingShape && state.featureBeingEdited)) {
    return null;
  }

  const updatedFeature = state.featureBeingEdited;

  // Create updated shape — use editingShape (most recent) as the base,
  // merge with the live feature's geometry and properties.
  const updatedShape = {
    ...state.editingShape,
    feature: {
      ...updatedFeature,
      properties: {
        ...state.editingShape.feature.properties,
        ...updatedFeature.properties,
      },
    },
    lastUpdated: Date.now(),
  } as Shape;

  // Reset state
  setState({
    originalShape: null,
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
    previousMode: null,
  });

  // Return to default mode and cursor
  releaseModeAndCursor(mapId, EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit shape updated event
  editShapeBus.emit(EditShapeEvents.updated, {
    shape: updatedShape,
    mapId,
  } as unknown as ShapeUpdatedEvent['payload']);

  notify();

  return updatedShape;
}

/**
 * Cancel the current editing operation
 */
function cancelEditingInternal(
  mapId: UniqueId,
  state: EditingState,
  notify: () => void,
  setState: (updates: Partial<EditingState>) => void,
): void {
  if (!state.editingShape) {
    return; // Nothing to cancel
  }

  // Use originalShape (captured at edit start) for reliable revert.
  // editingShape gets overwritten on same-ID re-entry, but originalShape
  // is only set once when editing first starts.
  const shapeToRevert = state.originalShape;

  // Reset state
  setState({
    originalShape: null,
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
    previousMode: null,
  });

  // Return to default mode and cursor
  releaseModeAndCursor(mapId, EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit canceled event
  editShapeBus.emit(EditShapeEvents.canceled, {
    shape: shapeToRevert,
    mapId,
  } as unknown as ShapeEditCanceledEvent['payload']);

  notify();
}

/**
 * Edit shape store
 */
export const editStore = createMapStore<EditingState, EditShapeActions>({
  defaultState: { ...DEFAULT_EDITING_STATE },

  actions: (mapId, { get, set, notify }) => ({
    edit: (shape: Shape, options?: EditShapeOptions) => {
      startEditing(mapId, get(), shape, options, notify, set);
    },

    save: () => {
      saveEditingInternal(mapId, get(), notify, set);
    },

    cancel: () => {
      cancelEditingInternal(mapId, get(), notify, set);
    },
  }),

  // Note: EditShapeLayer is "neutral" regarding mode change authorization.
  // It doesn't auto-cancel or reject mode changes - those decisions are
  // left to UI components that can prompt the user.

  onCleanup: (mapId, state) => {
    // Cancel any active editing before cleanup
    if (state.editingShape) {
      // Return to default mode and cursor
      releaseModeAndCursor(mapId, EDIT_SHAPE_LAYER_ID);

      // Re-enable map panning
      mapEventBus.emit(MapEvents.enablePan, { id: mapId });

      // Emit canceled event
      editShapeBus.emit(EditShapeEvents.canceled, {
        shape: state.originalShape,
        mapId,
      } as unknown as ShapeEditCanceledEvent['payload']);
    }
  },
});

// =============================================================================
// Convenience exports
// =============================================================================

/**
 * Get the current editing state for a mapId
 * Returns null if no store instance exists
 *
 * @param mapId - The map instance ID.
 * @returns The current editing state, or null if no store instance exists.
 */
export function getEditingState(mapId: UniqueId): EditingState | null {
  if (!editStore.exists(mapId)) {
    return null;
  }
  return editStore.get(mapId);
}

/**
 * Hook for editing state
 * @param mapId - The map instance ID.
 * @returns The current editing state and edit actions.
 *
 * @example
 * ```typescript
 * const { state, edit, save, cancel } = useEditingState(mapId);
 */
export function useEditingState(
  mapId: UniqueId,
): { state: EditingState } & EditShapeActions {
  return editStore.use(mapId);
}

/**
 * Manually clear editing state for a specific mapId.
 * @param mapId - The map instance ID.
 */
export function clearEditingState(mapId: UniqueId): void {
  editStore.clear(mapId);
}

/**
 * Resolve the radius units from a circular shape (Circle or WagonWheel).
 * Returns `undefined` for non-circular shapes.
 */
function getCircularShapeUnits(shape: Shape): DistanceUnit | undefined {
  if (isCircleShape(shape)) {
    return shape.feature.properties.circleProperties.radius.units;
  }
  if (isWagonWheelShape(shape)) {
    return shape.feature.properties.wagonWheelProperties.radius.units;
  }
  return undefined;
}

/**
 * Recompute circle properties from the given feature geometry using the
 * appropriate computation function for the geometry type.
 */
function recomputeCircleProperties(
  feature: Feature,
  units: DistanceUnit | undefined,
): ReturnType<typeof computeCirclePropertiesFromGeometry> {
  if (feature.geometry.type === 'Polygon') {
    return computeCirclePropertiesFromGeometry(feature.geometry, units);
  }
  if (feature.geometry.type === 'MultiPolygon') {
    return computeCirclePropertiesFromMultiPolygon(feature.geometry, units);
  }
  return undefined;
}

/**
 * Update the feature currently being edited.
 *
 * Called internally by the layer during drag operations, and also available
 * to consumers via the `useEditShape` hook for form-driven updates.
 * For circular shapes (Circle, WagonWheel), automatically recomputes
 * `circleProperties` from the updated geometry.
 *
 * @param mapId - The map instance ID.
 * @param feature - The updated GeoJSON feature from the editable layer to store as the live editing state.
 * @param editType - The edit type string from the editable layer (e.g. 'scaled', 'rotated', 'translated'). Completion types are stored in `lastCompletedEditType`; continuous types clear it.
 *
 * @example
 * ```typescript
 * // From a form input handler
 * const newGeometry = circle(center, radius, { units: 'kilometers' }).geometry;
 * updateFeature(mapId, { ...currentFeature, geometry: newGeometry });
 * ```
 */
export function updateFeature(
  mapId: UniqueId,
  feature: Feature,
  editType?: string,
): void {
  const state = editStore.get(mapId);

  // Only store completion editTypes (scaled, rotated, translated) —
  // continuous events fire via RAF and can overwrite due to frame timing.
  // Clear lastCompletedEditType on continuous events so it doesn't persist.
  const isCompletion = editType != null && COMPLETION_EDIT_TYPES.has(editType);
  const lastCompletedEditType = isCompletion ? editType : null;

  // Recompute circleProperties from updated geometry so metadata stays in sync
  const editingShape = state?.editingShape;
  let featureToStore: Feature = feature;

  if (
    editingShape &&
    (isCircleShape(editingShape) || isWagonWheelShape(editingShape))
  ) {
    const shapeUnits = getCircularShapeUnits(editingShape);
    const circleProperties = recomputeCircleProperties(feature, shapeUnits);

    if (circleProperties) {
      featureToStore = {
        ...feature,
        properties: {
          ...feature.properties,
          circleProperties,
        },
      };
    }
  }

  editStore.set(mapId, {
    featureBeingEdited: featureToStore,
    lastCompletedEditType,
  });

  // Emit the raw edit event so consumers can react to editType directly
  if (editType != null) {
    editShapeBus.emit(EditShapeEvents.featureEditing, {
      feature: featureToStore,
      editType,
      mapId,
    } as unknown as FeatureEditingEvent['payload']);
  }
}

/**
 * Cancel editing (called by the layer component on ESC)
 * @param mapId - The map instance ID.
 */
export function cancelEditingFromLayer(mapId: UniqueId): void {
  editStore.actions(mapId).cancel();
}

/**
 * Save editing (called by the layer component on Enter)
 * @param mapId - The map instance ID.
 */
export function saveEditingFromLayer(mapId: UniqueId): void {
  editStore.actions(mapId).save();
}

/**
 * Enables map panning while editing by switching to view mode and storing the
 * current edit mode for restoration.
 *
 * No-op if no shape is currently being edited.
 *
 * @param mapId - The map instance ID.
 *
 * @example
 * ```typescript
 * enableEditPanning(mapId);
 * ```
 */
export function enableEditPanning(mapId: UniqueId): void {
  const state = editStore.get(mapId);
  if (state?.previousMode !== null || !state?.editingShape) {
    return;
  }

  editStore.set(mapId, { previousMode: state.editMode, editMode: 'view' });
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });
  requestCursorChange(mapId, 'grab', EDIT_SHAPE_LAYER_ID);
}

/**
 * Disables map panning and restores the previous edit mode.
 *
 * If no shape is being edited, clears the stored `previousMode` and returns.
 * Otherwise, restores the edit mode from `previousMode`, re-disables panning,
 * and sets the cursor back to the shape-appropriate edit cursor.
 *
 * @param mapId - The map instance ID.
 *
 * @example
 * ```typescript
 * disableEditPanning(mapId);
 * ```
 */
export function disableEditPanning(mapId: UniqueId): void {
  const state = editStore.get(mapId);

  if (!state?.editingShape) {
    editStore.set(mapId, { previousMode: null });
    return;
  }

  const previousMode = state?.previousMode;
  if (!previousMode) {
    editStore.set(mapId, { previousMode: null });
    return;
  }

  editStore.set(mapId, { editMode: previousMode, previousMode: null });
  mapEventBus.emit(MapEvents.disablePan, { id: mapId });
  requestCursorChange(
    mapId,
    EDIT_CURSOR_MAP[previousMode],
    EDIT_SHAPE_LAYER_ID,
  );
}
