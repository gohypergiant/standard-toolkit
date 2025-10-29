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
import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Kanban } from '.';
import {
  calculateClosestEdge,
  getInsertIndex,
  KanbanProvider,
  parseDropTarget,
  useKanban,
} from './context';
import { columnData as columns } from './mock-data';
import type { DragEndEvent } from '@dnd-kit/core';
import type { KanbanCardData, KanbanColumnData } from './types';

// Mock helper utilities for edge detection tests
function createMockRect(
  top: number,
  left: number,
  width: number,
  height: number,
) {
  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
}

function createMockDragEvent(
  overRect: ReturnType<typeof createMockRect> | null,
  activeRect: ReturnType<typeof createMockRect> | null,
  overData?: Record<string, unknown>,
): Pick<DragEndEvent, 'over' | 'active'> {
  return {
    over: overRect
      ? {
          rect: overRect,
          data: {
            current: overData || {},
          },
        }
      : null,
    active: {
      rect: {
        current: {
          translated: activeRect,
        },
      },
    },
  } as Pick<DragEndEvent, 'over' | 'active'>;
}

function TestKanban() {
  const setColumns = vi.fn();
  return (
    <KanbanProvider columns={columns} updateColumnState={setColumns}>
      <Kanban>
        <Kanban.Header>
          <Kanban.Header.Title>Kanban Example</Kanban.Header.Title>
          <Kanban.Header.Actions>
            <Kanban.Header.Search />
            {/* Optional. */}
            {/* <Kanban.Header.Menu /> */}
          </Kanban.Header.Actions>
        </Kanban.Header>

        <Kanban.Column.Container data-testid='container'>
          {columns.map((column) => (
            <Kanban.Column key={column.id} column={column}>
              <Kanban.Column.Header>
                <Kanban.Column.Header.Title>
                  <Kanban.Column.DragHandle />
                  {column.title}
                </Kanban.Column.Header.Title>
                <Kanban.Column.Header.Actions />
              </Kanban.Column.Header>
              <Kanban.Column.Content column={column}>
                {column.cards.map((card) => (
                  <Kanban.Card key={card.id} card={card}>
                    <Kanban.Card.Header>
                      <Kanban.Card.Header.Title>
                        {card.title}
                      </Kanban.Card.Header.Title>
                      {/* Optional */}
                      {/* <Kanban.Card.Header.Actions /> */}
                    </Kanban.Card.Header>
                    <Kanban.Card.Body>{card.body}</Kanban.Card.Body>
                  </Kanban.Card>
                ))}
              </Kanban.Column.Content>
              <Kanban.Column.Content.Actions />
            </Kanban.Column>
          ))}
        </Kanban.Column.Container>
      </Kanban>
    </KanbanProvider>
  );
}

describe('Kanban Board', () => {
  describe('Kanban Components', () => {
    render(<TestKanban />);
    const mainContainer = screen.getByTestId('container');

    it('should render', () => {
      expect(screen.getByText('Kanban Example')).toBeTruthy();
    });

    it('should render correct number of columns for data', () => {
      expect(mainContainer).toBeTruthy();
      expect(mainContainer.childNodes.length).toEqual(columns.length);
    });

    it('should render correct number of cards for given column data', () => {
      expect(
        mainContainer.childNodes[0]?.childNodes[1]?.childNodes.length,
      ).toEqual(columns[0]?.cards.length);
    });
  });

  describe('useKanban', () => {
    it('hooks should render', () => {
      const { result } = renderHook(() => useKanban());
      const { moveCard, getColumnById } = result.current;

      expect(moveCard).toBeTruthy();
      expect(getColumnById).toBeTruthy();
    });
  });

  describe('Position Index Calculation', () => {
    describe('moveCard - Same Column Movement', () => {
      it('should adjust index when moving card down within same column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const targetColumn = columns[0] as KanbanColumnData;
        expect(targetColumn).toBeDefined();
        const targetCard = targetColumn?.cards[0] as KanbanCardData;
        expect(targetCard).toBeDefined();

        // Move card from position 0 to position 2 in same column
        // After removing from position 0, target position 2 becomes position 1
        // So card should end up at position 1 (2 - 1 = 1)
        moveCard(targetCard.id, targetColumn.id, 2);

        expect(setColumns).toHaveBeenCalled();
        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === targetColumn.id,
        );

        // Verify id-1 is at position 1 (not position 2)
        const movedCard = updatedColumn.cards.find(
          (card: KanbanCardData) => card.id === 'id-1',
        );
        expect(movedCard.position).toBe(1);

        // Verify all positions are sequential
        updatedColumn.cards.forEach((card: KanbanCardData, idx: number) => {
          expect(card.position).toBe(idx);
        });
      });

      it('should adjust index when moving card down by one position', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const targetColumn = columns[0] as KanbanColumnData;
        expect(targetColumn).toBeDefined();
        const targetCard = targetColumn?.cards[1] as KanbanCardData;
        expect(targetCard).toBeDefined();

        // Move card from position 1 to position 2 in same column
        // After removing from position 1, target position 2 becomes position 1
        moveCard(targetCard.id, targetColumn.id, 2);

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === targetColumn.id,
        );

        const movedCard = updatedColumn.cards.find(
          (card: KanbanCardData) => card.id === targetCard.id,
        );
        expect(movedCard.position).toBe(1);
      });

      it('should not adjust index when moving card up within same column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const targetColumn = columns[0] as KanbanColumnData;
        expect(targetColumn).toBeDefined();
        const targetCard = targetColumn?.cards[2] as KanbanCardData;
        expect(targetCard).toBeDefined();
        const firstCard = targetColumn?.cards[0] as KanbanCardData;
        const secondCard = targetColumn?.cards[1] as KanbanCardData;

        // Move card from position 2 to position 0 in same column
        // No adjustment needed since we're moving up
        moveCard(targetCard.id, targetColumn.id, 0);

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === targetColumn.id,
        );

        const movedCard = updatedColumn.cards.find(
          (card: KanbanCardData) => card.id === targetCard.id,
        );
        expect(movedCard.position).toBe(0);

        // Verify card order
        expect(updatedColumn.cards[0].id).toBe(targetCard.id);
        expect(updatedColumn.cards[1].id).toBe(firstCard.id);
        expect(updatedColumn.cards[2].id).toBe(secondCard.id);
      });

      it('should not adjust index when moving card up by one position', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const targetColumn = columns[0] as KanbanColumnData;
        expect(targetColumn).toBeDefined();
        const targetCard = targetColumn?.cards[2] as KanbanCardData;
        expect(targetCard).toBeDefined();
        const firstCard = targetColumn?.cards[0] as KanbanCardData;
        const secondCard = targetColumn?.cards[1] as KanbanCardData;

        // Move card from position 2 to position 1
        moveCard(targetCard.id, targetColumn.id, 1);

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === targetColumn.id,
        );

        const movedCard = updatedColumn.cards.find(
          (card: KanbanCardData) => card.id === targetCard.id,
        );
        expect(movedCard.position).toBe(1);

        // Verify card order
        expect(updatedColumn.cards[0].id).toBe(firstCard.id);
        expect(updatedColumn.cards[1].id).toBe(targetCard.id);
        expect(updatedColumn.cards[2].id).toBe(secondCard.id);
      });

      it('should handle moving card to its own position as no-op', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const targetColumn = columns[0] as KanbanColumnData;
        expect(targetColumn).toBeDefined();
        const targetCard = targetColumn?.cards[0] as KanbanCardData;
        expect(targetCard).toBeDefined();

        // Move card from position 0 to position 0
        moveCard(targetCard.id, targetColumn.id, 0);

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === targetColumn.id,
        );

        // Card should still be at position 0
        expect(updatedColumn.cards[0].id).toBe(targetCard.id);
        expect(updatedColumn.cards[0].position).toBe(0);
      });
    });

    describe('moveCard - Cross Column Movement', () => {
      it('should move card to different column without index adjustment', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const sourceColumn = columns[0] as KanbanColumnData;
        expect(sourceColumn).toBeDefined();
        const sourceCard = sourceColumn?.cards[0] as KanbanCardData;
        expect(sourceCard).toBeDefined();
        const destColumn = columns[1] as KanbanColumnData;
        expect(destColumn).toBeDefined();

        // Move card from todo to inProgress at position 0
        moveCard(sourceCard.id, destColumn.id, 0);

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedSourceColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === sourceColumn.id,
        );
        const updatedDestColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === destColumn.id,
        );

        // Card should be at position 0 in target column (no adjustment)
        const movedCard = updatedDestColumn.cards.find(
          (card: KanbanCardData) => card.id === sourceCard.id,
        );
        expect(movedCard.position).toBe(0);
        expect(movedCard.columnId).toBe(destColumn.id);

        // Source column should have one fewer card
        expect(updatedSourceColumn.cards.length).toBe(
          sourceColumn.cards.length - 1,
        );

        // All positions should be sequential in both columns
        updatedSourceColumn.cards.forEach(
          (card: KanbanCardData, idx: number) => {
            expect(card.position).toBe(idx);
          },
        );
        updatedDestColumn.cards.forEach((card: KanbanCardData, idx: number) => {
          expect(card.position).toBe(idx);
        });
      });

      it('should move card to end of different column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const sourceColumn = columns[0] as KanbanColumnData;
        expect(sourceColumn).toBeDefined();
        const sourceCard = sourceColumn?.cards[0] as KanbanCardData;
        expect(sourceCard).toBeDefined();
        const destColumn = columns[1] as KanbanColumnData;
        expect(destColumn).toBeDefined();
        const targetPosition = destColumn.cards.length;

        // Move card to end of inProgress column (which has 2 cards)
        moveCard(sourceCard.id, destColumn.id, targetPosition);

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedDestColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === destColumn.id,
        );

        // Card should be at the last position
        const movedCard =
          updatedDestColumn.cards[updatedDestColumn.cards.length - 1];
        expect(movedCard.id).toBe(sourceCard.id);
        expect(movedCard.position).toBe(updatedDestColumn.cards.length - 1);
      });

      it('should move card to empty column at position 0', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const sourceColumn = columns[0] as KanbanColumnData;
        expect(sourceColumn).toBeDefined();
        const sourceCard = sourceColumn?.cards[0] as KanbanCardData;
        expect(sourceCard).toBeDefined();
        const emptyColumn = columns[2] as KanbanColumnData; // inReview has no cards
        expect(emptyColumn).toBeDefined();
        expect(emptyColumn.cards.length).toBe(0);

        // Move card to empty column
        moveCard(sourceCard.id, emptyColumn.id, 0);

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedDestColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === emptyColumn.id,
        );

        // Target column should now have exactly one card
        expect(updatedDestColumn.cards.length).toBe(1);
        expect(updatedDestColumn.cards[0].id).toBe(sourceCard.id);
        expect(updatedDestColumn.cards[0].position).toBe(0);
        expect(updatedDestColumn.cards[0].columnId).toBe(emptyColumn.id);
      });
    });

    describe('moveCard - Edge Parameter Interaction', () => {
      it('should use getInsertIndex with edge="top" in same column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const targetColumn = columns[0] as KanbanColumnData;
        expect(targetColumn).toBeDefined();
        const targetCard = targetColumn?.cards[2] as KanbanCardData;
        expect(targetCard).toBeDefined();

        // Move card with edge="top" - should insert at target position
        // Moving card from position 2 to position 1 with edge="top"
        // Since we're moving up, no adjustment: should end at position 1
        moveCard(targetCard.id, targetColumn.id, 1, 'top');

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === targetColumn.id,
        );

        const movedCard = updatedColumn.cards.find(
          (card: KanbanCardData) => card.id === targetCard.id,
        );
        expect(movedCard.position).toBe(1);
      });

      it('should use getInsertIndex with edge="bottom" in same column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const targetColumn = columns[0] as KanbanColumnData;
        expect(targetColumn).toBeDefined();
        const targetCard = targetColumn?.cards[0] as KanbanCardData;
        expect(targetCard).toBeDefined();

        // Move card with edge="bottom" - should insert at target position + 1
        // Moving card from position 0 to position 0 with edge="bottom"
        // getInsertIndex returns 0 + 1 = 1
        // Since source index (0) < target index (1), adjust: 1 - 1 = 0
        moveCard(targetCard.id, targetColumn.id, 0, 'bottom');

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === targetColumn.id,
        );

        // Should effectively be a no-op (stays at position 0)
        expect(updatedColumn.cards[0].id).toBe(targetCard.id);
      });

      it('should use getInsertIndex with edge="top" in different column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const sourceColumn = columns[0] as KanbanColumnData;
        expect(sourceColumn).toBeDefined();
        const sourceCard = sourceColumn?.cards[0] as KanbanCardData;
        expect(sourceCard).toBeDefined();
        const destColumn = columns[1] as KanbanColumnData;
        expect(destColumn).toBeDefined();

        // Move card with edge="top" to different column
        // Should insert at exactly the target position (no adjustment)
        moveCard(sourceCard.id, destColumn.id, 1, 'top');

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedDestColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === destColumn.id,
        );

        const movedCard = updatedDestColumn.cards.find(
          (card: KanbanCardData) => card.id === sourceCard.id,
        );
        expect(movedCard.position).toBe(1);
      });

      it('should use getInsertIndex with edge="bottom" in different column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const sourceColumn = columns[0] as KanbanColumnData;
        expect(sourceColumn).toBeDefined();
        const sourceCard = sourceColumn?.cards[0] as KanbanCardData;
        expect(sourceCard).toBeDefined();
        const destColumn = columns[1] as KanbanColumnData;
        expect(destColumn).toBeDefined();

        // Move card with edge="bottom" to different column
        // getInsertIndex should return position + 1
        moveCard(sourceCard.id, destColumn.id, 0, 'bottom');

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedDestColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === destColumn.id,
        );

        const movedCard = updatedDestColumn.cards.find(
          (card: KanbanCardData) => card.id === sourceCard.id,
        );
        expect(movedCard.position).toBe(1); // 0 + 1 = 1
      });

      it('should handle undefined edge (empty column scenario)', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const sourceColumn = columns[0] as KanbanColumnData;
        expect(sourceColumn).toBeDefined();
        const sourceCard = sourceColumn?.cards[0] as KanbanCardData;
        expect(sourceCard).toBeDefined();
        const emptyColumn = columns[2] as KanbanColumnData; // inReview
        expect(emptyColumn).toBeDefined();

        // Move with undefined edge (typical empty column drop)
        moveCard(sourceCard.id, emptyColumn.id, 0, undefined);

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedDestColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === emptyColumn.id,
        );

        expect(updatedDestColumn.cards[0].id).toBe(sourceCard.id);
        expect(updatedDestColumn.cards[0].position).toBe(0);
      });
    });

    describe('Integration - Full Drag-and-Drop Flow', () => {
      it('should correctly handle parseDropTarget → getInsertIndex → moveCard flow', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;

        // Simulate a real drag-and-drop scenario:
        // 1. User drags id-1 over id-2 (position 1)
        // 2. id-1 is dropped above id-2 (edge="top")
        const overRect = createMockRect(100, 0, 200, 100); // id-2's rect
        const activeRect = createMockRect(50, 0, 200, 50); // id-1's rect (above midpoint)
        const overData = {
          columnId: 'todo',
          position: 1, // id-2 is at position 1
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        // Step 1: Parse drop target
        const dropTarget = parseDropTarget(event as DragEndEvent);
        expect(dropTarget).toEqual({
          columnId: 'todo',
          position: 1,
          edge: 'top',
        });
        expect(dropTarget).toBeDefined();
        if (!dropTarget) {
          return;
        }

        // Step 2: Move card (moveCard internally calls getInsertIndex)
        moveCard(
          'id-1',
          dropTarget.columnId,
          dropTarget.position,
          dropTarget.edge,
        );

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const targetColumn = updatedColumns.find(
          (col: KanbanCardData) => col.id === 'todo',
        );

        // Since id-1 was at position 0 and we're moving to position 1
        // and source.index (0) < index (1), adjustment: 1 - 1 = 0
        // Result: card should stay at position 0 (no effective movement)
        expect(targetColumn.cards[0].id).toBe('id-1');
      });

      it('should handle complex scenario: drop below card in same column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const targetColumn = columns[0] as KanbanColumnData;
        expect(targetColumn).toBeDefined();
        const draggedCard = targetColumn?.cards[0] as KanbanCardData;
        const targetCard = targetColumn?.cards[1] as KanbanCardData;
        const thirdCard = targetColumn?.cards[2] as KanbanCardData;

        // Drag card (position 0) below another card (position 1)
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(175, 0, 200, 50); // below midpoint
        const overData = {
          columnId: targetColumn.id,
          position: 1,
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const dropTarget = parseDropTarget(event as DragEndEvent);
        expect(dropTarget?.edge).toBe('bottom');
        expect(dropTarget).toBeDefined();
        if (!dropTarget) {
          return;
        }

        // moveCard internally calls getInsertIndex
        moveCard(
          draggedCard.id,
          dropTarget.columnId,
          dropTarget.position,
          dropTarget.edge,
        );

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === targetColumn.id,
        );

        // moveCard will:
        // 1. Call getInsertIndex(1, 'bottom') = 2
        // 2. Since source.index (0) < 2, adjust: 2 - 1 = 1
        const movedCard = updatedColumn.cards.find(
          (card: KanbanCardData) => card.id === draggedCard.id,
        );
        expect(movedCard.position).toBe(1);

        // Final order should be: targetCard, draggedCard, thirdCard
        expect(updatedColumn.cards[0].id).toBe(targetCard.id);
        expect(updatedColumn.cards[1].id).toBe(draggedCard.id);
        expect(updatedColumn.cards[2].id).toBe(thirdCard.id);
      });

      it('should handle dropping on empty column', () => {
        const setColumns = vi.fn();
        const { result } = renderHook(() => useKanban(), {
          wrapper: ({ children }) => (
            <KanbanProvider columns={columns} updateColumnState={setColumns}>
              {children}
            </KanbanProvider>
          ),
        });

        const { moveCard } = result.current;
        const sourceColumn = columns[0] as KanbanColumnData;
        expect(sourceColumn).toBeDefined();
        const sourceCard = sourceColumn?.cards[0] as KanbanCardData;
        expect(sourceCard).toBeDefined();
        const emptyColumn = columns[2] as KanbanColumnData; // inReview
        expect(emptyColumn).toBeDefined();

        // Simulate dropping on empty column
        const overRect = createMockRect(100, 0, 200, 400); // Empty column area
        const activeRect = createMockRect(150, 0, 200, 50);
        const overData = {
          id: emptyColumn.id,
          cards: [], // Empty column
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const dropTarget = parseDropTarget(event as DragEndEvent);
        expect(dropTarget).toEqual({
          columnId: emptyColumn.id,
          position: 0,
          edge: undefined,
        });
        expect(dropTarget).toBeDefined();
        if (!dropTarget) {
          return;
        }

        // moveCard internally calls getInsertIndex
        moveCard(
          sourceCard.id,
          dropTarget.columnId,
          dropTarget.position,
          dropTarget.edge,
        );

        const updatedColumns = setColumns.mock.calls[0]?.[0];
        const updatedDestColumn = updatedColumns.find(
          (column: KanbanColumnData) => column.id === emptyColumn.id,
        );

        expect(updatedDestColumn.cards.length).toBe(1);
        expect(updatedDestColumn.cards[0].id).toBe(sourceCard.id);
        expect(updatedDestColumn.cards[0].position).toBe(0);
      });
    });
  });

  describe('Edge Detection Logic', () => {
    describe('calculateClosestEdge', () => {
      it('should return "top" when dragged card center is above target midpoint', () => {
        const overRect = createMockRect(100, 0, 200, 100); // midpoint at 150
        const activeRect = createMockRect(50, 0, 200, 50); // center at 75
        const event = createMockDragEvent(overRect, activeRect);

        const result = calculateClosestEdge(event.over, event.active);

        expect(result).toBe('top');
      });

      it('should return "bottom" when dragged card center is below target midpoint', () => {
        const overRect = createMockRect(100, 0, 200, 100); // midpoint at 150
        const activeRect = createMockRect(200, 0, 200, 50); // center at 225
        const event = createMockDragEvent(overRect, activeRect);

        const result = calculateClosestEdge(event.over, event.active);

        expect(result).toBe('bottom');
      });

      it('should return "bottom" when dragged card center is exactly at midpoint', () => {
        const overRect = createMockRect(100, 0, 200, 100); // midpoint at 150
        const activeRect = createMockRect(125, 0, 200, 50); // center at 150
        const event = createMockDragEvent(overRect, activeRect);

        const result = calculateClosestEdge(event.over, event.active);

        expect(result).toBe('bottom');
      });

      it('should return "bottom" when over.rect is missing', () => {
        const activeRect = createMockRect(100, 0, 200, 50);
        const event = createMockDragEvent(null, activeRect);

        const result = calculateClosestEdge(event.over, event.active);

        expect(result).toBe('bottom');
      });

      it('should return "bottom" when active translated rect is missing', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const event = createMockDragEvent(overRect, null);

        const result = calculateClosestEdge(event.over, event.active);

        expect(result).toBe('bottom');
      });

      it('should work correctly with small card sizes', () => {
        const overRect = createMockRect(100, 0, 50, 20); // midpoint at 110
        const activeRect = createMockRect(95, 0, 50, 10); // center at 100
        const event = createMockDragEvent(overRect, activeRect);

        const result = calculateClosestEdge(event.over, event.active);

        expect(result).toBe('top');
      });

      it('should work correctly with large card sizes', () => {
        const overRect = createMockRect(0, 0, 400, 500); // midpoint at 250
        const activeRect = createMockRect(300, 0, 400, 200); // center at 400
        const event = createMockDragEvent(overRect, activeRect);

        const result = calculateClosestEdge(event.over, event.active);

        expect(result).toBe('bottom');
      });
    });

    describe('parseDropTarget', () => {
      it('should return correct DropTargetInfo when dropping on a card', () => {
        const overRect = createMockRect(100, 0, 200, 100); // midpoint at 150
        const activeRect = createMockRect(50, 0, 200, 50); // center at 75 (above midpoint)
        const overData = {
          columnId: 'column-1',
          position: 2,
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: 'column-1',
          position: 2,
          edge: 'top',
        });
      });

      it('should return edge: undefined when dropping on empty column', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          id: 'column-1',
          cards: [], // Empty column indicated by cards array
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: 'column-1',
          position: 0,
          edge: undefined,
        });
      });

      it('should return correct position for non-empty column drop', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          id: 'column-2',
          cards: [{ id: '1' }, { id: '2' }, { id: '3' }], // 3 cards
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: 'column-2',
          position: 3, // At end of cards array
          edge: undefined,
        });
      });

      it('should return null when event.over is null', () => {
        const event = { over: null, active: {} };

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toBe(null);
      });

      it('should return null when over.data.current is missing', () => {
        const event = {
          over: {
            rect: createMockRect(100, 0, 200, 100),
            data: {},
          },
          active: {
            rect: {
              current: {
                translated: createMockRect(50, 0, 200, 50),
              },
            },
          },
        };

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toBe(null);
      });

      it('should calculate edge correctly based on drop position', () => {
        const overRect = createMockRect(100, 0, 200, 100); // midpoint at 150
        const activeRect = createMockRect(175, 0, 200, 50); // center at 200 (below midpoint)
        const overData = {
          columnId: 'column-3',
          position: 5,
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: 'column-3',
          position: 5,
          edge: 'bottom',
        });
      });

      it('should return null when columnId is missing in card drop', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          position: 2,
          // columnId is missing
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: undefined,
          position: 2,
          edge: 'top',
        });
      });

      it('should return null when position is missing in card drop', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          columnId: 'column-1',
          // position is missing
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: 'column-1',
          position: undefined,
          edge: 'top',
        });
      });

      it('should handle empty string columnId in card drop', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          columnId: '',
          position: 1,
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: '',
          position: 1,
          edge: 'top',
        });
      });

      it('should handle negative position values', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          columnId: 'column-1',
          position: -1,
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: 'column-1',
          position: -1,
          edge: 'top',
        });
      });

      it('should return null when id is missing in column drop', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          cards: [{ id: '1' }, { id: '2' }],
          // id is missing
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: undefined,
          position: 2,
          edge: undefined,
        });
      });

      it('should return null when overData is empty object', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {};
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        expect(result).toEqual({
          columnId: undefined,
          position: undefined,
          edge: 'top',
        });
      });

      it('should handle cards property being null', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          id: 'column-1',
          cards: null,
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        // When cards is null (not an array), it should fall through to card drop path
        expect(result).toEqual({
          columnId: undefined,
          position: undefined,
          edge: 'top',
        });
      });

      it('should prioritize cards property when both cards and columnId present', () => {
        const overRect = createMockRect(100, 0, 200, 100);
        const activeRect = createMockRect(50, 0, 200, 50);
        const overData = {
          id: 'column-1',
          cards: [{ id: '1' }],
          columnId: 'column-2',
          position: 3,
        };
        const event = createMockDragEvent(overRect, activeRect, overData);

        const result = parseDropTarget(event as DragEndEvent);

        // Should use column drop logic (cards property takes precedence)
        expect(result).toEqual({
          columnId: 'column-1',
          position: 1,
          edge: undefined,
        });
      });
    });

    describe('getInsertIndex', () => {
      it('should return position when edge is "top"', () => {
        const result = getInsertIndex(5, 'top');

        expect(result).toBe(5);
      });

      it('should return position + 1 when edge is "bottom"', () => {
        const result = getInsertIndex(5, 'bottom');

        expect(result).toBe(6);
      });

      it('should return position when edge is undefined', () => {
        const result = getInsertIndex(5, undefined);

        expect(result).toBe(5);
      });

      it('should handle position 0 with top edge', () => {
        const result = getInsertIndex(0, 'top');

        expect(result).toBe(0);
      });

      it('should handle position 0 with bottom edge', () => {
        const result = getInsertIndex(0, 'bottom');

        expect(result).toBe(1);
      });

      it('should handle large position values with top edge', () => {
        const result = getInsertIndex(999, 'top');

        expect(result).toBe(999);
      });

      it('should handle large position values with bottom edge', () => {
        const result = getInsertIndex(999, 'bottom');

        expect(result).toBe(1000);
      });
    });
  });
});
