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
import { useSyncExternalStore } from 'react';
import {
  type EditShapeMode,
  type ShapeEvent,
  ShapeEvents,
} from '../shared/events';
import type {
  EditableShape,
  ShapeFeatureTypeValues,
  ShapeId,
  StyleProperties,
} from '../shared/types';

/**
 * Shape store state
 */
export interface ShapeStoreState {
  /** All shapes in the system */
  shapes: EditableShape[];
  /** Currently selected shape ID */
  selectedShapeId?: ShapeId;
  /** Currently hovered shape ID */
  hoveredShapeId?: ShapeId;
  /** Current edit mode */
  mode: EditShapeMode;
  /** Shape being actively edited (temporary state) */
  editingShape?: EditableShape;
  /** Default style properties for new shapes */
  defaultStyleProperties: StyleProperties;
}

/**
 * Shape store actions
 */
export interface ShapeStoreActions {
  /** Set the shapes array */
  setShapes: (shapes: EditableShape[]) => void;
  /** Add a new shape */
  addShape: (shape: EditableShape) => void;
  /** Update an existing shape */
  updateShape: (id: ShapeId, updates: Partial<EditableShape>) => void;
  /** Delete a shape */
  deleteShape: (id: ShapeId) => void;
  /** Set selected shape ID */
  setSelectedShapeId: (id?: ShapeId) => void;
  /** Set hovered shape ID */
  setHoveredShapeId: (id?: ShapeId) => void;
  /** Set current edit mode */
  setMode: (mode: EditShapeMode) => void;
  /** Set the shape being actively edited */
  setEditingShape: (shape?: EditableShape) => void;
  /** Set default style properties */
  setDefaultStyleProperties: (props: StyleProperties) => void;
  /** Clear all temporary editing state */
  clearEditingState: () => void;
}

/**
 * Combined shape store type
 */
export type ShapeStore = ShapeStoreState & ShapeStoreActions;

/**
 * Shape store listener function
 */
type ShapeStoreListener = () => void;

/**
 * Creates a shape store instance
 */
export function createShapeStore(
  initialState?: Partial<ShapeStoreState>,
): ShapeStore {
  let state: ShapeStoreState = {
    shapes: [],
    mode: 'view',
    defaultStyleProperties: {
      fillColor: '#62a6ff',
      strokeColor: '#62a6ff',
      strokeWidth: 2,
      fillOpacity: 59,
      strokeOpacity: 100,
      strokePattern: 'solid',
    },
    ...initialState,
  };

  const listeners = new Set<ShapeStoreListener>();

  const notifyListeners = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const store: ShapeStore = {
    // State getters
    get shapes() {
      return state.shapes;
    },
    get selectedShapeId() {
      return state.selectedShapeId;
    },
    get hoveredShapeId() {
      return state.hoveredShapeId;
    },
    get mode() {
      return state.mode;
    },
    get editingShape() {
      return state.editingShape;
    },
    get defaultStyleProperties() {
      return state.defaultStyleProperties;
    },

    // Actions
    setShapes: (shapes) => {
      state = { ...state, shapes };
      notifyListeners();
    },

    addShape: (shape) => {
      state = { ...state, shapes: [...state.shapes, shape] };
      notifyListeners();
    },

    updateShape: (id, updates) => {
      state = {
        ...state,
        shapes: state.shapes.map((shape) =>
          shape.id === id ? { ...shape, ...updates } : shape,
        ),
      };
      notifyListeners();
    },

    deleteShape: (id) => {
      state = {
        ...state,
        shapes: state.shapes.filter((shape) => shape.id !== id),
        selectedShapeId:
          state.selectedShapeId === id ? undefined : state.selectedShapeId,
      };
      notifyListeners();
    },

    setSelectedShapeId: (id) => {
      state = { ...state, selectedShapeId: id };
      notifyListeners();
    },

    setHoveredShapeId: (id) => {
      state = { ...state, hoveredShapeId: id };
      notifyListeners();
    },

    setMode: (mode) => {
      state = { ...state, mode };
      notifyListeners();
      // Emit mode change event for map interaction coordination
      Broadcast.getInstance<ShapeEvent>().emit(ShapeEvents.modeChanged, {
        mode,
      });
    },

    setEditingShape: (shape) => {
      state = { ...state, editingShape: shape };
      notifyListeners();
    },

    setDefaultStyleProperties: (props) => {
      state = { ...state, defaultStyleProperties: props };
      notifyListeners();
    },

    clearEditingState: () => {
      state = {
        ...state,
        editingShape: undefined,
        selectedShapeId: undefined,
        hoveredShapeId: undefined,
      };
      notifyListeners();
    },
  };

  // Subscribe/unsubscribe for useSyncExternalStore
  (store as any).subscribe = (listener: ShapeStoreListener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // Snapshot getter for useSyncExternalStore
  (store as any).getSnapshot = () => state;

  return store;
}

/**
 * Hook to use the shape store with React
 */
export function useShapeStore(store: ShapeStore): ShapeStoreState {
  return useSyncExternalStore(
    (store as any).subscribe,
    (store as any).getSnapshot,
    (store as any).getSnapshot,
  );
}

/**
 * Hook to select a specific shape by ID from the store
 */
export function useShape(
  store: ShapeStore,
  id: ShapeId,
): EditableShape | undefined {
  const state = useShapeStore(store);
  return state.shapes.find((shape) => shape.id === id);
}

/**
 * Hook to get the currently selected shape
 */
export function useSelectedShape(store: ShapeStore): EditableShape | undefined {
  const state = useShapeStore(store);
  return state.selectedShapeId
    ? state.shapes.find((shape) => shape.id === state.selectedShapeId)
    : undefined;
}

/**
 * Hook to get the currently hovered shape
 */
export function useHoveredShape(store: ShapeStore): EditableShape | undefined {
  const state = useShapeStore(store);
  return state.hoveredShapeId
    ? state.shapes.find((shape) => shape.id === state.hoveredShapeId)
    : undefined;
}

/**
 * Hook to get shapes filtered by type
 */
export function useShapesByType(
  store: ShapeStore,
  type: ShapeFeatureTypeValues,
): EditableShape[] {
  const state = useShapeStore(store);
  return state.shapes.filter((shape) => shape.shapeType === type);
}
