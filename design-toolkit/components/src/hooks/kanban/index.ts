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

import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
  KanbanCardData,
  KanbanColumnData,
} from '@/components/kanban/types';

export function useColumnInteractions(column: KanbanColumnData) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: column.id,
    data: column,
  });

  const isHighlighted = Boolean(
    isOver ||
      (active &&
        active.data.current?.columnId !== column.id &&
        column.canDrop !== false),
  );

  const isActive = isOver && column.canDrop !== false;

  return {
    ref: setNodeRef,
    isHighlighted,
    isActive,
  };
}

export function useCardInteractions(card: KanbanCardData) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({
    id: card.id,
    data: card,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determine closest edge based on over position
  let closestEdge: 'top' | 'bottom' | null = null;

  if (over && over.id !== card.id) {
    // For simplicity, we'll use the middle of the card as the threshold
    // dnd-kit doesn't provide exact edge detection like Atlaskit,
    // but we can approximate based on the transform values
    closestEdge = transform && transform.y < 0 ? 'top' : 'bottom';
  }

  return {
    ref: setNodeRef,
    isDragging,
    container: null,
    closestEdge,
    style,
    attributes,
    listeners,
  };
}
