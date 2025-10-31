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

import { useMemo } from 'react';
import { type ShapeStore, useShapeStore } from '../store';
import type { CircleEditProperties, EditableShape } from '../../shared/types';

export interface CircleState {
  /** Circle shapes in the store */
  circles: EditableShape[];
  /** Get circle edit properties for a shape */
  getCircleProperties: (
    shape: EditableShape,
  ) => CircleEditProperties | undefined;
  /** Check if a shape is a circle */
  isCircle: (shape: EditableShape) => boolean;
}

/**
 * Hook for managing circle-specific state
 * Circles are stored as polygons with center/radius in editProperties
 */
export function useCircleState(store: ShapeStore): CircleState {
  const state = useShapeStore(store);

  const circles = useMemo(
    () => state.shapes.filter((shape) => shape.shapeType === 'Circle'),
    [state.shapes],
  );

  const getCircleProperties = (
    shape: EditableShape,
  ): CircleEditProperties | undefined => {
    if (shape.shapeType !== 'Circle') {
      return undefined;
    }
    return shape.feature.properties?.editProperties as
      | CircleEditProperties
      | undefined;
  };

  const isCircle = (shape: EditableShape): boolean => {
    return shape.shapeType === 'Circle';
  };

  return {
    circles,
    getCircleProperties,
    isCircle,
  };
}
