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

import { useCallback } from 'react';
import type { ShapeId, StyleProperties } from '../../shared/types';
import type { ShapeStore } from '../store';

export interface UseStylePropertiesOptions {
  store: ShapeStore;
}

/**
 * Hook for managing shape style properties
 */
export function useStyleProperties(options: UseStylePropertiesOptions) {
  const { store } = options;

  /**
   * Update style properties for a shape
   */
  const updateShapeStyle = useCallback(
    (shapeId: ShapeId, styleUpdates: Partial<StyleProperties>) => {
      const shape = store.shapes.find((s) => s.id === shapeId);
      if (!shape) {
        return;
      }

      const currentStyle = shape.feature.properties?.styleProperties ?? {};
      const updatedStyle: StyleProperties = {
        ...currentStyle,
        ...styleUpdates,
      };

      store.updateShape(shapeId, {
        feature: {
          ...shape.feature,
          properties: {
            ...shape.feature.properties,
            styleProperties: updatedStyle,
          },
        },
      });
    },
    [store],
  );

  /**
   * Update fill color for a shape
   */
  const updateFillColor = useCallback(
    (shapeId: ShapeId, fillColor: string) => {
      updateShapeStyle(shapeId, { fillColor });
    },
    [updateShapeStyle],
  );

  /**
   * Update stroke color for a shape
   */
  const updateStrokeColor = useCallback(
    (shapeId: ShapeId, strokeColor: string) => {
      updateShapeStyle(shapeId, { strokeColor });
    },
    [updateShapeStyle],
  );

  /**
   * Update stroke width for a shape
   */
  const updateStrokeWidth = useCallback(
    (shapeId: ShapeId, strokeWidth: 1 | 2 | 4 | 8) => {
      updateShapeStyle(shapeId, { strokeWidth });
    },
    [updateShapeStyle],
  );

  /**
   * Update stroke pattern for a shape
   */
  const updateStrokePattern = useCallback(
    (shapeId: ShapeId, strokePattern: 'solid' | 'dashed' | 'dotted') => {
      updateShapeStyle(shapeId, { strokePattern });
    },
    [updateShapeStyle],
  );

  /**
   * Update fill opacity for a shape
   */
  const updateFillOpacity = useCallback(
    (shapeId: ShapeId, fillOpacity: number) => {
      updateShapeStyle(shapeId, { fillOpacity });
    },
    [updateShapeStyle],
  );

  /**
   * Update stroke opacity for a shape
   */
  const updateStrokeOpacity = useCallback(
    (shapeId: ShapeId, strokeOpacity: number) => {
      updateShapeStyle(shapeId, { strokeOpacity });
    },
    [updateShapeStyle],
  );

  /**
   * Get style properties for a shape
   */
  const getShapeStyle = useCallback(
    (shapeId: ShapeId): StyleProperties | undefined => {
      const shape = store.shapes.find((s) => s.id === shapeId);
      return shape?.feature.properties?.styleProperties;
    },
    [store.shapes],
  );

  /**
   * Reset shape style to default
   */
  const resetShapeStyle = useCallback(
    (shapeId: ShapeId) => {
      updateShapeStyle(shapeId, store.defaultStyleProperties);
    },
    [store.defaultStyleProperties, updateShapeStyle],
  );

  return {
    updateShapeStyle,
    updateFillColor,
    updateStrokeColor,
    updateStrokeWidth,
    updateStrokePattern,
    updateFillOpacity,
    updateStrokeOpacity,
    getShapeStyle,
    resetShapeStyle,
  };
}
