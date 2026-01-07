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
  enabled: process.env.NODE_ENV !== 'production',
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
  edit: EditFunction;
  save: () => void;
  cancel: () => void;
  // Internal cached functions
  snapshot: () => EditingState | null;
  serverSnapshot: () => EditingState | null;
};

/**
 * Local cache for snapshot functions (to avoid creating instance on snapshot call)
 */
const snapshotFnCache = new Map<UniqueId, () => EditingState | null>();
const serverSnapshotFnCache = new Map<UniqueId, () => EditingState | null>();

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
    // Ellipses and rectangles use bounding-transform (no vertex editing)
    // for scale/rotate/translate via bounding box handles
    return 'bounding-transform';
  }
  // Polygons and LineStrings get vertex-transform for combined
  // vertex editing + scale/rotate/translate
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

  // Disable map panning during editing to prevent accidental map movement
  mapEventBus.emit(MapEvents.disablePan, { id: mapId });

  // Emit editing started event
  // Shape contains GeoJSON Feature which is structurally cloneable
  // but lacks the index signature TypeScript requires for StructuredCloneable.
  editShapeBus.emit(EditShapeEvents.editing, {
    shape,
    mapId,
  } as unknown as ShapeEditingEvent['payload']);

  notify();
}

/**
 * Update the feature being edited (called during drag operations)
 */
function updateFeatureInternal(
  _mapId: UniqueId,
  feature: Feature,
  notify: () => void,
  setState: (updates: Partial<EditingState>) => void,
): void {
  setState({ featureBeingEdited: feature });
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

  // Create updated shape with new geometry.
  // Type assertion needed because TypeScript can't preserve the discriminated
  // union type through the spread. The shapeType from originalShape is preserved
  // at runtime, maintaining the correct shape variant.
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

  // Reset state with new object reference
  setState({
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
  });

  // Return to default mode and cursor
  releaseModeAndCursor(mapId, EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning after editing is complete
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit shape updated event
  // Shape contains GeoJSON Feature which is structurally cloneable
  // but lacks the index signature TypeScript requires for StructuredCloneable.
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

  // Reset state with new object reference
  setState({
    editingShape: null,
    editMode: 'view',
    featureBeingEdited: null,
  });

  // Return to default mode and cursor
  releaseModeAndCursor(mapId, EDIT_SHAPE_LAYER_ID);

  // Re-enable map panning after editing is canceled
  mapEventBus.emit(MapEvents.enablePan, { id: mapId });

  // Emit canceled event with original shape
  // Shape contains GeoJSON Feature which is structurally cloneable
  // but lacks the index signature TypeScript requires for StructuredCloneable.
  editShapeBus.emit(EditShapeEvents.canceled, {
    shape: originalShape,
    mapId,
  } as unknown as ShapeEditCanceledEvent['payload']);

  notify();
}

/**
 * Edit shape store using the map store factory
 */
const store = createMapStore<EditingState, EditShapeActions>({
  createDefaultState: () => ({ ...DEFAULT_EDITING_STATE }),
  serverDefault: { ...DEFAULT_EDITING_STATE },

  // Note: EditShapeLayer is "neutral" regarding mode change authorization.
  // It doesn't auto-cancel or reject mode changes - those decisions are
  // left to UI components that can prompt the user (e.g., "You have unsaved
  // changes. Switch to draw mode?"). The edit layer still EMITS mode change
  // requests (when starting/ending edit), but doesn't LISTEN for authorization
  // requests from other components.

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

    // Clear local caches
    snapshotFnCache.delete(mapId);
    serverSnapshotFnCache.delete(mapId);
  },
});

// =============================================================================
// Public API (maintains backward compatibility with existing hook)
// =============================================================================

/**
 * Creates or retrieves a cached subscription function for a given mapId.
 * Automatically cleans up editing state when the last subscriber unmounts.
 */
export function getOrCreateSubscription(
  mapId: UniqueId,
): (onStoreChange: () => void) => () => void {
  return store.getSubscription(mapId);
}

/**
 * Creates or retrieves a cached snapshot function for a given mapId.
 * Returns the current editing state or null if no state exists.
 */
export function getOrCreateSnapshot(
  mapId: UniqueId,
): () => EditingState | null {
  let snapshotFn = snapshotFnCache.get(mapId);
  if (!snapshotFn) {
    snapshotFn = () => {
      if (!store.exists(mapId)) {
        return null;
      }
      return store.getState(mapId);
    };
    snapshotFnCache.set(mapId, snapshotFn);
  }
  return snapshotFn;
}

/**
 * Creates or retrieves a cached server snapshot function for a given mapId.
 * Server snapshots always return null since editing state is client-only.
 * Required for SSR/RSC compatibility with useSyncExternalStore.
 */
export function getOrCreateServerSnapshot(
  mapId: UniqueId,
): () => EditingState | null {
  let serverSnapshotFn = serverSnapshotFnCache.get(mapId);
  if (!serverSnapshotFn) {
    serverSnapshotFn = () => null;
    serverSnapshotFnCache.set(mapId, serverSnapshotFn);
  }
  return serverSnapshotFn;
}

/**
 * Creates or retrieves a cached edit function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateEdit(mapId: UniqueId): EditFunction {
  return store.getAction(mapId, 'edit', () => {
    return (shape: Shape, options?: EditShapeOptions) => {
      const state = store.getState(mapId);
      startEditing(
        mapId,
        state,
        shape,
        options,
        () => store.notify(mapId),
        (updates) => store.setState(mapId, updates),
      );
    };
  });
}

/**
 * Creates or retrieves a cached save function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateSave(mapId: UniqueId): () => void {
  return store.getAction(mapId, 'save', () => {
    return () => {
      const state = store.getState(mapId);
      saveEditingInternal(
        mapId,
        state,
        () => store.notify(mapId),
        (updates) => store.setState(mapId, updates),
      );
    };
  });
}

/**
 * Creates or retrieves a cached cancel function for a given mapId.
 * This maintains referential stability for the function reference.
 */
export function getOrCreateCancel(mapId: UniqueId): () => void {
  return store.getAction(mapId, 'cancel', () => {
    return () => {
      const state = store.getState(mapId);
      cancelEditingInternal(
        mapId,
        state,
        () => store.notify(mapId),
        (updates) => store.setState(mapId, updates),
      );
    };
  });
}

/**
 * Update feature from the layer component (called during edit operations)
 */
export function updateFeatureFromLayer(
  mapId: UniqueId,
  feature: Feature,
): void {
  updateFeatureInternal(
    mapId,
    feature,
    () => store.notify(mapId),
    (updates) => store.setState(mapId, updates),
  );
}

/**
 * Cancel editing (called by the layer component on ESC)
 */
export function cancelEditingFromLayer(mapId: UniqueId): void {
  const state = store.getState(mapId);
  cancelEditingInternal(
    mapId,
    state,
    () => store.notify(mapId),
    (updates) => store.setState(mapId, updates),
  );
}

/**
 * Get the current editing state for a mapId
 */
export function getEditingState(mapId: UniqueId): EditingState | null {
  if (!store.exists(mapId)) {
    return null;
  }
  return store.getState(mapId);
}

/**
 * Manually clear editing state for a specific mapId.
 * This is typically not needed as cleanup happens automatically when all subscribers unmount.
 * Use this only in advanced scenarios where manual cleanup is required.
 */
export function clearEditingState(mapId: UniqueId): void {
  store.clear(mapId);
}
