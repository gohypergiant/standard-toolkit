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

import { uuid } from '@accelint/core';
import { Add, Kebab } from '@accelint/icons';
import { useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { Kanban } from '.';
import { KanbanProvider } from './context';
import { columnData } from './mock-data';
import type { Meta, StoryObj } from '@storybook/react';
import type { KanbanCardData, KanbanColumnData } from './types';

const meta = {
  title: 'Components/Kanban',
  component: Kanban,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Kanban>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [columns, setColumns] = useState<KanbanColumnData[]>(columnData);

    return (
      <div className='h-screen'>
        <KanbanProvider columns={columns} updateColumnState={setColumns}>
          <Kanban>
            <Kanban.Header>
              <Kanban.Header.Title>Project Board</Kanban.Header.Title>
            </Kanban.Header>

            <Kanban.Column.Container>
              {columns.map((column) => (
                <Kanban.Column key={column.id} column={column}>
                  <Kanban.Column.Header>
                    <Kanban.Column.Header.Title>
                      {column.title}
                    </Kanban.Column.Header.Title>
                    <Kanban.Column.Header.Actions
                      cardCount={column.cards.length}
                    />
                  </Kanban.Column.Header>

                  <Kanban.Column.Content>
                    {column.cards.map((card) => (
                      <Kanban.Card key={card.id} card={card}>
                        <Kanban.Card.Header>
                          <Kanban.Card.Header.Title>
                            {card.title}
                          </Kanban.Card.Header.Title>
                        </Kanban.Card.Header>
                        <Kanban.Card.Body>{card.body}</Kanban.Card.Body>
                      </Kanban.Card>
                    ))}
                  </Kanban.Column.Content>
                </Kanban.Column>
              ))}
            </Kanban.Column.Container>
          </Kanban>
        </KanbanProvider>
      </div>
    );
  },
};

export const CompleteExample: Story = {
  render: () => {
    const [columns, setColumns] = useState<KanbanColumnData[]>(columnData);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredColumns = columns.map((column) => ({
      ...column,
      cards: column.cards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof card.body === 'string' &&
            card.body.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    }));

    const handleAddCard = (columnId: string) => {
      const newCard: KanbanCardData = {
        id: uuid(),
        title: `New Task ${Date.now()}`,
        body: 'Card description',
        columnId,
        position: columns.find((c) => c.id === columnId)?.cards.length || 0,
      };

      setColumns(
        columns.map((col) =>
          col.id === columnId
            ? { ...col, cards: [...col.cards, newCard] }
            : col,
        ),
      );
    };

    const handleDeleteCard = (cardId: string) => {
      setColumns(
        columns.map((col) => ({
          ...col,
          cards: col.cards.filter((card) => card.id !== cardId),
        })),
      );
    };

    const handleAddColumn = () => {
      const newColumn: KanbanColumnData = {
        id: uuid(),
        title: `New Column ${columns.length + 1}`,
        cards: [],
      };
      setColumns([...columns, newColumn]);
    };

    const handleEditCard = (cardId: string) => {
      const newTitle = prompt('Enter new title:');
      if (newTitle) {
        setColumns(
          columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId ? { ...card, title: newTitle } : card,
            ),
          })),
        );
      }
    };

    return (
      <div className='h-screen'>
        <KanbanProvider columns={columns} updateColumnState={setColumns}>
          <Kanban>
            <Kanban.Header>
              <Kanban.Header.Title>Complete Kanban Board</Kanban.Header.Title>
              <Kanban.Header.Actions className='space-x-s'>
                <Kanban.Header.Search
                  onInput={(e) => setSearchTerm(e.currentTarget.value)}
                  inputProps={{
                    placeholder: 'Search',
                  }}
                />
                <Button onPress={handleAddColumn}>
                  <Icon>
                    <Add />
                  </Icon>
                  Add Column
                </Button>
              </Kanban.Header.Actions>
            </Kanban.Header>

            <Kanban.Column.Container>
              {filteredColumns.map((column) => (
                <Kanban.Column key={column.id} column={column}>
                  <Kanban.Column.Header>
                    <Kanban.Column.Header.Title>
                      {column.title}
                    </Kanban.Column.Header.Title>
                    <Kanban.Column.Header.Actions
                      cardCount={column.cards.length}
                    />
                  </Kanban.Column.Header>

                  <Kanban.Column.Content>
                    {column.cards.map((card) => (
                      <Kanban.Card key={card.id} card={card}>
                        <Kanban.Card.Header>
                          <Kanban.Card.Header.Title>
                            {card.title}
                          </Kanban.Card.Header.Title>
                          <Kanban.Card.Header.Actions>
                            <Menu.Trigger>
                              <Button variant='icon'>
                                <Icon size='small'>
                                  <Kebab />
                                </Icon>
                              </Button>
                              <Menu>
                                <Menu.Item
                                  onAction={() => handleEditCard(card.id)}
                                >
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  onAction={() => handleDeleteCard(card.id)}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu>
                            </Menu.Trigger>
                          </Kanban.Card.Header.Actions>
                        </Kanban.Card.Header>
                        <Kanban.Card.Body>{card.body}</Kanban.Card.Body>
                      </Kanban.Card>
                    ))}
                  </Kanban.Column.Content>
                  <Kanban.Column.Actions
                    onAddCard={() => handleAddCard(column.id)}
                  />
                </Kanban.Column>
              ))}
            </Kanban.Column.Container>
          </Kanban>
        </KanbanProvider>
      </div>
    );
  },
};
