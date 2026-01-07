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

/**
 * Edit Shape Store
 *
 * Manages editing state for shape modification.
 *
 * @example
 * ```tsx
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
import { getLogger } from '@accelint/logger';
import { createMapStore } from '../../../shared/create-map-store';
import { MapEvents } from '../../base-map/events';
import {
  isCircleShape,
  isEllipseShape,
  isPointShape,
  isRectangleShape,
} from '../shared/types';
import {
  releaseModeAndCursor,
  requestCursorChange,
  requestModeChange,
} from '../shared/utils/mode-utils';
import {
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

const logger = getLogger({
  enabled:
    process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  level: 'warn',
  prefix: '[EditShapeLayer]',
  pretty: true,
});

/**
 * Typed event bus instances
 */
const editShapeBus = Broadcast.getInstance<EditShapeEvent>();
const mapEventBus = Broadcast.getInstance<MapEventType>();

/**
 * Default editing state
 */
const DEFAULT_EDITING_STATE: EditingState = {
  editingShape: null,
  editMode: 'view',
  featureBeingEdited: null,
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
 */
function getEditModeForShape(shape: Shape): EditMode {
  if (isPointShape(shape)) {
    return 'translate';
  }
  if (isCircleShape(shape)) {
    return 'circle-transform';
  }
  if (isEllipseShape(shape) || isRectangleShape(shape)) {
    return 'bounding-transform';
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

  // Already editing - cancel first
  if (state.editingShape) {
    cancelEditingInternal(mapId, state, notify, setState);
  }

  // Determine edit mode (can be overridden via options)
  const editMode = options?.mode ?? getEditModeForShape(shape);

  // Update state with new object reference
  setState({
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

  const originalShape = state.editingShape;
  const updatedFeature = state.featureBeingEdited;

  // Create updated shape with new geometry
  const updatedShape = {
    ...originalShape,
    feature: {
      ...updatedFeature,
      properties: {
        ...originalShape.feature.properties,
        ...updatedFeature.properties,
      },
    },
    lastUpdated: Date.now(),
  } as Shape;

  // Reset state
  setState({
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
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

  const originalShape = state.editingShape;

  // Reset state
  setState({
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
  });

  // Return to default mode and cursor
  releaseModeAndCursor(mapId, EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit canceled event
  editShapeBus.emit(EditShapeEvents.canceled, {
    shape: originalShape,
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
        shape: state.editingShape,
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
 */
export function getEditingState(mapId: UniqueId): EditingState | null {
  if (!editStore.exists(mapId)) {
    return null;
  }
  return editStore.get(mapId);
}

/**
 * Hook for editing state
 */
export function useEditingState(
  mapId: UniqueId,
): { state: EditingState } & EditShapeActions {
  return editStore.use(mapId);
}

/**
 * Manually clear editing state for a specific mapId.
 */
export function clearEditingState(mapId: UniqueId): void {
  editStore.clear(mapId);
}

/**
 * Update feature from the layer component (called during drag operations)
 */
export function updateFeatureFromLayer(
  mapId: UniqueId,
  feature: Feature,
): void {
  editStore.set(mapId, { featureBeingEdited: feature });
}

/**
 * Cancel editing (called by the layer component on ESC)
 */
export function cancelEditingFromLayer(mapId: UniqueId): void {
  editStore.actions(mapId).cancel();
}
