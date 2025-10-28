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
) {
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
  };
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

        const result = parseDropTarget(event as any);

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

        const result = parseDropTarget(event as any);

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

        const result = parseDropTarget(event as any);

        expect(result).toEqual({
          columnId: 'column-2',
          position: 3, // At end of cards array
          edge: undefined,
        });
      });

      it('should return null when event.over is null', () => {
        const event = { over: null, active: {} };

        const result = parseDropTarget(event as any);

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

        const result = parseDropTarget(event as any);

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

        const result = parseDropTarget(event as any);

        expect(result).toEqual({
          columnId: 'column-3',
          position: 5,
          edge: 'bottom',
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
