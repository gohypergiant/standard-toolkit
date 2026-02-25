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
  const isSelected = shapeId === selectedShapeId;
  const featureIndex = shapeId ? shapeIdToIndex.get(shapeId) : undefined;
  const isHovered = hoverIndex !== undefined && featureIndex === hoverIndex;
  return { isSelected, isHovered };
}
