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

import { uuid } from '@accelint/core';
import { DEFAULT_STYLE_PROPERTIES } from '../../shared/constants';
import { emitValidationErrors } from './error-handling';
import { computeCircleProperties } from './geometry';
import { validateShape } from './validation';
import type { Feature } from 'geojson';
import type {
  EditableShape,
  EditMode,
  ShapeFeatureType,
  StyledFeature,
} from '../../shared/types';

/**
 * Get shape type from edit mode
 */
function getShapeTypeFromMode(mode: EditMode): ShapeFeatureType {
  switch (mode) {
    case 'DrawCircleFromCenterMode':
      return 'Circle';
    case 'DrawPolygonMode':
      return 'Polygon';
    case 'DrawLineStringMode':
      return 'LineString';
    case 'DrawPointMode':
      return 'Point';
    default:
      return 'Polygon'; // Default fallback
  }
}

/**
 * Generate a default name for a shape based on its type
 */
function generateDefaultName(shapeType: ShapeFeatureType): string {
  const timestamp = new Date().toLocaleTimeString();
  return `New ${shapeType} ${timestamp}`;
}

/**
 * Create a temporary shape from a feature
 * Used when drawing is complete but shape is not yet saved
 *
 * @param feature GeoJSON feature from drawing
 * @param editMode The edit mode used to create the shape
 * @returns New temporary shape with validation result
 */
export function createTemporaryShape(
  feature: Feature,
  editMode: EditMode,
): {
  shape: EditableShape;
  isValid: boolean;
} {
  const shapeType = getShapeTypeFromMode(editMode);
  const shapeId = uuid();

  // Create styled feature with default properties
  const styledFeature: StyledFeature = {
    ...feature,
    properties: {
      styleProperties: { ...DEFAULT_STYLE_PROPERTIES },
      shapeId,
    },
  };

  // For circles, compute and store the original center/radius
  if (shapeType === 'Circle' && feature.geometry.type === 'Polygon') {
    const circleProps = computeCircleProperties(feature.geometry.coordinates);
    if (circleProps) {
      styledFeature.properties.editProperties = circleProps;
    }
  }

  const shape: EditableShape = {
    id: shapeId,
    name: generateDefaultName(shapeType),
    shapeType,
    feature: styledFeature,
    locked: false,
    // No lastUpdated - will be set only when saved
  };

  // Validate the shape
  const validationResult = validateShape(shape);

  // Emit validation errors/warnings if any
  if (!validationResult.isValid || validationResult.warnings) {
    emitValidationErrors(validationResult.errors, validationResult.warnings);
  }

  return {
    shape,
    isValid: validationResult.isValid,
  };
}

/**
 * Create a saved shape (with lastUpdated timestamp)
 *
 * @param shape The shape to mark as saved
 * @returns Shape with lastUpdated timestamp
 */
export function createSavedShape(shape: EditableShape): EditableShape {
  return {
    ...shape,
    lastUpdated: Date.now(),
  };
}

/**
 * Update shape geometry while preserving other properties
 *
 * @param shape Original shape
 * @param newFeature New feature with updated geometry
 * @returns Updated shape
 */
export function updateShapeGeometry(
  shape: EditableShape,
  newFeature: Feature,
): EditableShape {
  const styledFeature: StyledFeature = {
    ...newFeature,
    properties: {
      ...shape.feature.properties,
      shapeId: shape.id,
    },
  };

  // For circles, recompute center/radius
  if (shape.shapeType === 'Circle' && newFeature.geometry.type === 'Polygon') {
    const circleProps = computeCircleProperties(
      newFeature.geometry.coordinates,
    );
    if (circleProps) {
      styledFeature.properties.editProperties = circleProps;
    }
  }

  return {
    ...shape,
    feature: styledFeature,
    // Don't update lastUpdated - shape hasn't been saved yet
  };
}

/**
 * Clone a shape with a new ID
 *
 * @param shape Shape to clone
 * @returns Cloned shape with new ID
 */
export function cloneShape(shape: EditableShape): EditableShape {
  const newId = uuid();

  return {
    ...shape,
    id: newId,
    name: `${shape.name} (copy)`,
    feature: {
      ...shape.feature,
      properties: {
        ...shape.feature.properties,
        shapeId: newId,
      },
    },
    lastUpdated: undefined, // Remove lastUpdated from clone
  };
}
