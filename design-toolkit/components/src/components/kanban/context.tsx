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
import { createContext, type ReactNode, useCallback, useContext } from 'react';
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
}

export interface KanbanProviderProps {
  columns: KanbanColumnData[];
  updateColumnState: (columns: KanbanColumnData[]) => void;
  children: ReactNode;
}

const updatePositions = (column: KanbanColumnData) => {
  column.cards.forEach((c, index) => {
    c.position = index;
  });
};

const getInsertIndex = (
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
});

const findCard = (
  columns: KanbanColumnData[],
  cardId: string,
): { column: KanbanColumnData; card: KanbanCardData; index: number } | null => {
  for (const column of columns) {
    const index = column.cards.findIndex((c) => c.id === cardId);
    if (index !== -1 && column.cards[index]) {
      return { column, card: column.cards[index], index };
    }
  }
  return null;
};

export const KanbanProvider = ({
  children,
  columns,
  updateColumnState,
}: KanbanProviderProps) => {
  const moveCard = useCallback(
    (
      cardId: string,
      targetColumnId: string,
      targetPosition: number,
      closestEdge: 'top' | 'bottom' | undefined,
    ) => {
      const newColumns = [...columns];

      // Find source card
      const source = findCard(newColumns, cardId);
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
        cards: [...source.column.cards],
      };
      newSourceColumn.cards.splice(source.index, 1);

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
    [columns, updateColumnState],
  );

  const getColumnById = useCallback(
    (id: string) => columns.find((c) => c.id === id),
    [columns],
  );

  return (
    <KanbanContext.Provider
      value={{ columns, updateColumnState, moveCard, getColumnById }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => useContext(KanbanContext);
