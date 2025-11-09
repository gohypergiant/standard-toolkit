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

import { useDndContext, useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { calculateClosestEdge } from '@/components/kanban/context';
import type {
  KanbanCardData,
  KanbanColumnData,
} from '@/components/kanban/types';

/**
 * Hook that provides drag-and-drop interactions for a kanban column.
 *
 * This hook integrates with `@dnd-kit/core` to enable dropping cards into columns.
 * It tracks hover states, validates drop targets based on the column's `canDrop` property,
 * and provides visual feedback states for both the column itself and cards within it.
 *
 * @param column - The kanban column data object containing the column's id, canDrop status, and other properties
 *
 * @returns An object containing:
 * - `ref` - Ref callback to attach to the droppable column DOM element
 * - `isHighlighted` - Boolean indicating if the column should be visually highlighted (when a card from another column is being dragged)
 * - `isActive` - Boolean indicating if the column is actively being hovered over and can accept the drop
 *
 * @example
 * ```tsx
 * function KanbanColumn({ column }: { column: KanbanColumnData }) {
 *   const { ref, isHighlighted, isActive } = useColumnInteractions(column);
 *
 *   return (
 *     <div
 *       ref={ref}
 *       className={cn({
 *         'ring-2 ring-blue-300': isHighlighted && !isActive, // Potential drop target
 *         'ring-2 ring-blue-500 bg-blue-50': isActive,        // Active drop target
 *       })}
 *     >
 *       <h2>{column.title}</h2>
 *       {column.cards.map(card => <Card key={card.id} card={card} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useColumnInteractions(column: KanbanColumnData) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: column.id,
    data: column,
  });

  // Get the global over state to detect when hovering over cards in this column
  const { over } = useDndContext();

  // Check if we're over the column itself OR over a card that belongs to this column
  const isOverColumn = isOver || over?.data?.current?.columnId === column.id;

  const isHighlighted = Boolean(
    isOverColumn ||
      (active &&
        active.data.current?.columnId !== column.id &&
        column.canDrop !== false),
  );

  const isActive = isOverColumn && column.canDrop !== false;

  return {
    ref: setNodeRef,
    isHighlighted,
    isActive,
  };
}

/**
 * Hook that provides drag-and-drop interactions for a kanban card.
 *
 * This hook integrates with `@dnd-kit/sortable` to enable dragging, dropping, and reordering
 * of cards within and between columns. It handles transform animations, drag state tracking,
 * and edge detection for insertion positioning.
 *
 * @param card - The kanban card data object containing the card's id and other properties
 *
 * @returns An object containing:
 * - `ref` - Ref callback to attach to the draggable card DOM element
 * - `isDragging` - Boolean indicating if this card is currently being dragged
 * - `closestEdge` - The closest edge ('top' or 'bottom') when another card is hovering over this card, or null if not hovering
 * - `style` - CSS style object with transform and transition properties for drag animations
 * - `attributes` - Accessibility and drag attributes to spread on the card element
 * - `listeners` - Event listeners to spread on the drag handle element
 *
 * @example
 * ```tsx
 * function KanbanCard({ card }: { card: KanbanCardData }) {
 *   const { ref, isDragging, closestEdge, style, attributes, listeners } = useCardInteractions(card);
 *
 *   return (
 *     <div ref={ref} style={style} {...attributes} {...listeners}>
 *       {card.title}
 *       {closestEdge && <DropIndicator edge={closestEdge} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCardInteractions(card: KanbanCardData) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
    active,
  } = useSortable({
    id: card.id,
    data: card,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determine closest edge based on over position
  let closestEdge: 'top' | 'bottom' | undefined;

  if (over && over.id === card.id && active) {
    closestEdge = calculateClosestEdge(over, active);
  }

  return {
    ref: setNodeRef,
    isDragging,
    closestEdge,
    style,
    attributes,
    listeners,
  };
}
