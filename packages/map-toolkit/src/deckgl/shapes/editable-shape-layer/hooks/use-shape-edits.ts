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

import { useEmit } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { useCallback } from 'react';
import { ShapeEvents } from '../../shared/events';
import { emitValidationErrors } from '../utils/error-handling';
import { validateShape } from '../utils/validation';
import type { FeatureCollection } from '@deck.gl-community/editable-layers';
import type {
  EditableShape,
  ShapeFeature,
  StyleProperties,
} from '../../shared/types';
import type { ShapeStore } from '../store';

export interface UseShapeEditsOptions {
  store: ShapeStore;
  defaultStyleProperties?: StyleProperties;
  onValidationError?: (errors: string[]) => void;
}

/**
 * Handle adding a new feature
 */
function handleAddFeature(
  features: ShapeFeature[],
  store: ShapeStore,
  emit: ReturnType<typeof useEmit>,
  defaultStyleProperties?: StyleProperties,
  onValidationError?: (errors: string[]) => void,
): void {
  const newFeature = features[features.length - 1];
  if (!newFeature) {
    return;
  }

  // Create a new shape from the feature
  const newShape: EditableShape = {
    id: uuid(),
    name: `New ${newFeature.geometry.type}`,
    label: newFeature.geometry.type,
    shapeType:
      newFeature.geometry.type === 'Point'
        ? 'Point'
        : newFeature.geometry.type === 'LineString'
          ? 'LineString'
          : 'Polygon',
    locked: false,
    feature: {
      ...newFeature,
      properties: {
        ...newFeature.properties,
        shapeId: uuid(),
        styleProperties: defaultStyleProperties ?? store.defaultStyleProperties,
      },
    },
  };

  // Validate the new shape
  const validation = validateShape(newShape);
  if (!validation.isValid) {
    emitValidationErrors(validation.errors, onValidationError);
    emit(ShapeEvents.validationError, {
      errors: validation.errors,
    });
    return;
  }

  // Add to store
  store.addShape(newShape);

  // Emit event
  emit(ShapeEvents.drawn, { shape: newShape });
}

/**
 * Handle updating an existing feature
 */
function handleUpdateFeature(
  // biome-ignore lint/suspicious/noExplicitAny: editContext type from deck.gl-community
  editContext: any,
  store: ShapeStore,
  emit: ReturnType<typeof useEmit>,
  onValidationError?: (errors: string[]) => void,
): void {
  const updatedFeature = editContext?.updatedData?.features?.[0];
  if (!updatedFeature) {
    return;
  }

  // Find the corresponding shape
  const existingShape = store.shapes.find(
    (s) => s.feature.properties?.shapeId === updatedFeature.properties?.shapeId,
  );
  if (!existingShape) {
    return;
  }

  // Create updated shape
  const updatedShape: EditableShape = {
    ...existingShape,
    feature: updatedFeature,
  };

  // Validate the updated shape
  const validation = validateShape(updatedShape);
  if (!validation.isValid) {
    emitValidationErrors(validation.errors, onValidationError);
    emit(ShapeEvents.validationError, {
      errors: validation.errors,
    });
    return;
  }

  // Update in store
  store.updateShape(existingShape.id, { feature: updatedFeature });

  // Emit event
  emit(ShapeEvents.updated, { shape: updatedShape });
}

/**
 * Handle removing a feature
 */
function handleRemoveFeature(
  // biome-ignore lint/suspicious/noExplicitAny: editContext type from deck.gl-community
  editContext: any,
  store: ShapeStore,
  emit: ReturnType<typeof useEmit>,
): void {
  const removedFeature = editContext?.featureIndexes?.[0];
  if (removedFeature === undefined) {
    return;
  }

  // Find the corresponding shape
  const removedShape = store.shapes[removedFeature];
  if (!removedShape) {
    return;
  }

  // Remove from store
  store.deleteShape(removedShape.id);

  // Emit event
  emit(ShapeEvents.deleted, { shapeId: removedShape.id });
}

/**
 * Handle other edit types (move, extrude, etc.)
 */
function handleOtherEdit(
  features: ShapeFeature[],
  store: ShapeStore,
  emit: ReturnType<typeof useEmit>,
): void {
  if (features.length === 0) {
    return;
  }

  const feature = features[0];
  if (!feature) {
    return;
  }

  const shape = store.shapes.find(
    (s) => s.feature.properties?.shapeId === feature.properties?.shapeId,
  );

  if (shape && feature) {
    const updatedShape: EditableShape = {
      ...shape,
      feature,
    };
    store.setEditingShape(updatedShape);
    emit(ShapeEvents.editing, { shapeId: shape.id });
  }
}

/**
 * Hook for handling shape edits from EditableGeoJsonLayer
 * Integrates with the shape store and emits appropriate events
 */
export function useShapeEdits(options: UseShapeEditsOptions) {
  const { store, defaultStyleProperties, onValidationError } = options;
  const emit = useEmit();

  /**
   * Handle edit events from EditableGeoJsonLayer
   */
  const handleEdit = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: editContext type from deck.gl-community
    (editType: string, updatedData: FeatureCollection, editContext: any) => {
      try {
        const features = updatedData.features as ShapeFeature[];

        switch (editType) {
          case 'addFeature':
            handleAddFeature(
              features,
              store,
              emit,
              defaultStyleProperties,
              onValidationError,
            );
            break;

          case 'updateFeature':
            handleUpdateFeature(editContext, store, emit, onValidationError);
            break;

          case 'removeFeature':
            handleRemoveFeature(editContext, store, emit);
            break;

          default:
            // Other edit types (e.g., 'movePosition', 'extruding', etc.)
            handleOtherEdit(features, store, emit);
            break;
        }
      } catch (error) {
        console.error('Error handling shape edit:', error);
      }
    },
    [store, emit, defaultStyleProperties, onValidationError],
  );

  return { handleEdit };
}
