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

import type { Shape, ShapeId } from '../../shared/types';

/**
 * Compute hover/selection interaction state for a feature by index.
 *
 * @param feature - The feature to check
 * @param selectedShapeId - Currently selected shape ID
 * @param hoverIndex - Currently hovered feature index
 * @param shapeIdToIndex - Map of shapeId to feature index for O(1) lookup
 * @returns `{ isSelected, isHovered }`
 * @example
 * ```typescript
 * const { isSelected, isHovered } = getPointInteractionState(
 *   feature,
 *   selectedShapeId,
 *   hoverIndex,
 *   shapeIdToIndex, // Map<ShapeId, number> from getFeaturesWithId()
 * );
 * if (isSelected || isHovered) {
 *   // render interaction feedback
 * }
 * ```
 */
export function getPointInteractionState(
  feature: Shape['feature'],
  selectedShapeId: ShapeId | undefined,
  hoverIndex: number | undefined,
  shapeIdToIndex: Map<ShapeId, number>,
): { isSelected: boolean; isHovered: boolean } {
  const shapeId = feature.properties?.shapeId;
  const isSelected = shapeId != null && shapeId === selectedShapeId;
  const featureIndex = shapeId ? shapeIdToIndex.get(shapeId) : undefined;
  const isHovered = hoverIndex !== undefined && featureIndex === hoverIndex;
  return { isSelected, isHovered };
}

/** Result of collecting point features that need coffin corner feedback. */
export type ActivePointFeatures = {
  features: Shape['feature'][];
  hoveredEntityId: ShapeId | undefined;
  selectedEntityId: ShapeId | undefined;
};

/**
 * Collect point features with icons that are hovered or selected,
 * along with their resolved entity IDs.
 */
export function collectActivePointFeatures(
  features: Shape['feature'][],
  selectedShapeId: ShapeId | undefined,
  hoverIndex: number | undefined,
  shapeIdToIndex: Map<ShapeId, number>,
): ActivePointFeatures {
  const result: Shape['feature'][] = [];
  let hoveredEntityId: ShapeId | undefined;
  let selectedEntityId: ShapeId | undefined;

  for (const f of features) {
    if (f.geometry.type !== 'Point' || !f.properties?.styleProperties?.icon) {
      continue;
    }
    const shapeId = f.properties?.shapeId as ShapeId | undefined;
    const { isSelected, isHovered } = getPointInteractionState(
      f,
      selectedShapeId,
      hoverIndex,
      shapeIdToIndex,
    );
    if (isHovered) {
      hoveredEntityId = shapeId;
    }
    if (isSelected) {
      selectedEntityId = shapeId;
    }
    if (isSelected || isHovered) {
      result.push(f);
    }
  }

  return { features: result, hoveredEntityId, selectedEntityId };
}
