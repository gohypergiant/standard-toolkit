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
import { KanbanProvider, useKanban } from './context';
import { columnData as columns } from './mock-data';

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
});
