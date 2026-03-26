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

import { describe, expect, it } from 'vitest';
import { getPointInteractionState } from './interaction';
import type { Shape, ShapeId } from '../../shared/types';

function createFeature(shapeId?: string): Shape['feature'] {
  return {
    type: 'Feature',
    properties: {
      styleProperties: {
        fillColor: [0, 0, 0, 255],
        lineColor: [0, 0, 0, 255],
        lineWidth: 2,
        linePattern: 'solid',
      },
      ...(shapeId ? { shapeId } : {}),
    },
    geometry: { type: 'Point', coordinates: [0, 0] },
  } as Shape['feature'];
}

describe('getPointInteractionState', () => {
  const featureA = createFeature('shape-a');
  const shapeIdToIndex = new Map<ShapeId, number>([
    ['shape-a' as ShapeId, 0],
    ['shape-b' as ShapeId, 1],
  ]);

  it('should return both false when no selection or hover', () => {
    const result = getPointInteractionState(
      featureA,
      undefined,
      undefined,
      shapeIdToIndex,
    );

    expect(result).toEqual({ isSelected: false, isHovered: false });
  });

  it('should return isSelected true when feature matches selectedShapeId', () => {
    const result = getPointInteractionState(
      featureA,
      'shape-a' as ShapeId,
      undefined,
      shapeIdToIndex,
    );

    expect(result).toEqual({ isSelected: true, isHovered: false });
  });

  it('should return isHovered true when feature index matches hoverIndex', () => {
    const result = getPointInteractionState(
      featureA,
      undefined,
      0,
      shapeIdToIndex,
    );

    expect(result).toEqual({ isSelected: false, isHovered: true });
  });

  it('should return both true when selected and hovered', () => {
    const result = getPointInteractionState(
      featureA,
      'shape-a' as ShapeId,
      0,
      shapeIdToIndex,
    );

    expect(result).toEqual({ isSelected: true, isHovered: true });
  });

  it('should return isSelected false when different shape is selected', () => {
    const result = getPointInteractionState(
      featureA,
      'shape-b' as ShapeId,
      undefined,
      shapeIdToIndex,
    );

    expect(result).toEqual({ isSelected: false, isHovered: false });
  });

  it('should return isHovered false when different index is hovered', () => {
    const result = getPointInteractionState(
      featureA,
      undefined,
      1,
      shapeIdToIndex,
    );

    expect(result).toEqual({ isSelected: false, isHovered: false });
  });

  it('should return both false for feature without shapeId', () => {
    const noIdFeature = createFeature();

    const result = getPointInteractionState(
      noIdFeature,
      undefined,
      undefined,
      shapeIdToIndex,
    );

    expect(result).toEqual({ isSelected: false, isHovered: false });
  });

  it('should not false-positive isSelected when both shapeId and selectedShapeId are undefined', () => {
    const noIdFeature = createFeature();

    const result = getPointInteractionState(
      noIdFeature,
      undefined,
      0,
      shapeIdToIndex,
    );

    expect(result.isSelected).toBe(false);
  });
});
