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

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { KanbanCardData, KanbanColumnData } from './types';

export type MoveCard = (
  cardId: string,
  targetColumnId: string,
  targetPosition: number,
  closestEdge?: 'top' | 'bottom',
) => void;
export interface KanbanContextData {
  columns: KanbanColumnData[];
  updateColumnState: (columns: KanbanColumnData[]) => void;
  moveCard: MoveCard;
  getColumnById: (id: string) => KanbanColumnData | undefined;
  cardMap: Map<
    string,
    { column: KanbanColumnData; card: KanbanCardData; index: number }
  >;
}

export interface KanbanProviderProps {
  columns: KanbanColumnData[];
  updateColumnState: (columns: KanbanColumnData[]) => void;
  children: ReactNode;
}

/**
 * Result of parsing a drop target from a drag event
 */
export interface DropTargetInfo {
  /** The ID of the column where the card should be dropped */
  columnId: string;
  /** The position/index within the column */
  position: number;
  /** The edge to drop relative to (undefined when dropping on empty column) */
  edge: 'top' | 'bottom' | undefined;
}

/**
 * Calculates which edge of a drop target is closest to the dragged item
 * @param over - The drop target from dnd-kit
 * @param active - The active dragged item from dnd-kit
 * @returns 'top' if the dragged item's center is above the midpoint, 'bottom' otherwise
 */
export function calculateClosestEdge(
  over: DragEndEvent['over'],
  active: DragEndEvent['active'],
): 'top' | 'bottom' {
  if (!over?.rect) {
    return 'bottom';
  }

  const translated = active?.rect?.current?.translated;
  if (!translated) {
    return 'bottom';
  }

  const overRect = over.rect;
  const midpoint = overRect.top + overRect.height / 2;
  const draggedItemCenter = translated.top + translated.height / 2;

  return draggedItemCenter < midpoint ? 'top' : 'bottom';
}

/**
 * Parses a drag event to determine where a card should be dropped
 * @param event - The drag end event from dnd-kit
 * @returns Normalized drop target information or null if invalid drop
 */
export function parseDropTarget(event: DragEndEvent): DropTargetInfo | null {
  const { active, over } = event;

  if (!over) {
    return null;
  }

  const overData = over.data.current;

  if (!overData) {
    return null;
  }

  // Dropping on a column (empty space or column container)
  if (overData.cards !== undefined) {
    return {
      columnId: overData.id,
      position: overData.cards.length,
      edge: undefined,
    };
  }

  // Dropping on a card position
  const edge = calculateClosestEdge(over, active);
  return {
    columnId: overData.columnId,
    position: overData.position,
    edge,
  };
}

const updatePositions = (column: KanbanColumnData) => {
  column.cards.forEach((c, index) => {
    c.position = index;
  });
};

export const getInsertIndex = (
  targetPosition: number,
  closestEdge?: 'top' | 'bottom',
) => {
  // If no edge is specified, use the target position as-is
  if (!closestEdge) {
    return targetPosition;
  }

  // If dropping on top edge, insert at the target position (before the card)
  // If dropping on bottom edge, insert after the target position (position + 1)
  return closestEdge === 'top' ? targetPosition : targetPosition + 1;
};

const KanbanContext = createContext<KanbanContextData>({
  columns: [],
  updateColumnState: () => null,
  moveCard: () => null,
  getColumnById: () => undefined,
  cardMap: new Map(),
});

export const KanbanProvider = ({
  children,
  columns,
  updateColumnState,
}: KanbanProviderProps) => {
  // Create a lookup map for O(1) card access
  const cardMap = useMemo(() => {
    const map = new Map<
      string,
      { column: KanbanColumnData; card: KanbanCardData; index: number }
    >();

    columns.forEach((column) => {
      column.cards.forEach((card, index) => {
        map.set(card.id, { column, card, index });
      });
    });

    return map;
  }, [columns]);

  const moveCard = useCallback(
    (
      cardId: string,
      targetColumnId: string,
      targetPosition: number,
      closestEdge?: 'top' | 'bottom',
    ) => {
      const newColumns = [...columns];

      // Find source card
      const source = cardMap.get(cardId);
      if (!source) {
        return;
      }

      // Find target column
      const targetColumn = newColumns.find((col) => col.id === targetColumnId);
      if (!targetColumn) {
        return;
      }

      const isSameColumn = source.column.id === targetColumn.id;

      // Remove card from source column
      const newSourceColumn = {
        ...source.column,
        cards: source.column.cards.filter((_, i) => i !== source.index),
      };

      // Calculate insert index
      let index = getInsertIndex(targetPosition, closestEdge);

      // If moving within the same column and moving down, adjust index
      if (isSameColumn && source.index < index) {
        index -= 1;
      }

      // Insert card into target column
      const newTargetColumn = isSameColumn
        ? newSourceColumn
        : { ...targetColumn, cards: [...targetColumn.cards] };

      newTargetColumn.cards.splice(index, 0, {
        ...source.card,
        columnId: targetColumnId,
      });

      // Update positions
      updatePositions(newTargetColumn);
      if (!isSameColumn) {
        updatePositions(newSourceColumn);
      }

      // Update the columns array with the modified columns
      const updatedColumns = newColumns.map((col) => {
        if (col.id === source.column.id) {
          return newSourceColumn;
        }
        if (col.id === targetColumn.id) {
          return newTargetColumn;
        }
        return col;
      });

      updateColumnState(updatedColumns);
    },
    [columns, updateColumnState, cardMap.get],
  );

  const getColumnById = useCallback(
    (id: string) => columns.find((c) => c.id === id),
    [columns],
  );

  return (
    <KanbanContext.Provider
      value={{ columns, updateColumnState, moveCard, getColumnById, cardMap }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within KanbanProvider');
  }
  return context;
};
