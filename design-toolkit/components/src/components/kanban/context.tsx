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
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { KanbanCardData, KanbanColumnData } from './types';

export type MoveCard = (
  cardId: string,
  targetColumnId: string,
  targetPosition: number,
  closestEdge?: Edge,
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

const getInsertIndex = (targetPosition: number, closestEdge?: Edge) => {
  if (targetPosition <= 0) {
    return closestEdge === 'bottom' ? 1 : 0;
  }

  return targetPosition;
};

const KanbanContext = createContext<KanbanContextData>({
  columns: [],
  updateColumnState: () => null,
  moveCard: () => null,
  getColumnById: () => undefined,
});

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
      closestEdge: Edge | undefined,
    ) => {
      const newColumns = [...columns];

      let sourceColumn: KanbanColumnData | undefined;
      let card: KanbanCardData | undefined;
      let sourceCardIndex = -1;

      // Find current card.
      for (const column of newColumns) {
        sourceCardIndex = column.cards.findIndex((c) => c.id === cardId);
        if (sourceCardIndex !== -1) {
          sourceColumn = column;
          card = column?.cards?.[sourceCardIndex];
          break;
        }
      }

      if (!(sourceColumn && card)) {
        console.error('Error: Source card not found.');
        updateColumnState(columns);
        return;
      }

      // Find target column
      const targetColumn = newColumns.find((col) => col.id === targetColumnId);

      if (!targetColumn) {
        console.error('Error: Target column not found.');
        updateColumnState(columns);
        return;
      }

      // Remove card from current column.
      const newSourceColumn = { ...sourceColumn };
      newSourceColumn.cards.splice(sourceCardIndex, 1);

      // Get index for insert.
      const index = getInsertIndex(targetPosition, closestEdge);

      // Insert card.
      const newTargetColumn = { ...targetColumn };
      newTargetColumn.cards.splice(index, 0, {
        ...card,
        columnId: targetColumnId,
      });

      // Rewrite new positions for affected columns.
      updatePositions(newTargetColumn);
      if (newSourceColumn !== newTargetColumn) {
        updatePositions(sourceColumn);
      }
      updateColumnState([...newColumns]);
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
