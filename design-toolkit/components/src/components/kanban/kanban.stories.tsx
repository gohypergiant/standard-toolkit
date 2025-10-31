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
import { MenuItem } from '../menu/item';
import { MenuItemLabel } from '../menu/item-label';
import { MenuTrigger } from '../menu/trigger';
import { Kanban } from '.';
import { KanbanCard } from './card';
import { KanbanCardBody } from './card-body';
import { KanbanCardHeader } from './card-header';
import { KanbanCardHeaderActions } from './card-header-actions';
import { KanbanCardHeaderTitle } from './card-header-title';
import { KanbanColumn } from './column';
import { KanbanColumnActions } from './column-actions';
import { KanbanColumnContainer } from './column-container';
import { KanbanColumnContent } from './column-content';
import { KanbanColumnHeader } from './column-header';
import { KanbanColumnHeaderActions } from './column-header-actions';
import { KanbanColumnHeaderTitle } from './column-header-title';
import { KanbanProvider } from './context';
import { KanbanHeader } from './header';
import { KanbanHeaderActions } from './header-actions';
import { KanbanHeaderSearch } from './header-search';
import { KanbanHeaderTitle } from './header-title';
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
            <KanbanHeader>
              <KanbanHeaderTitle>Project Board</KanbanHeaderTitle>
            </KanbanHeader>

            <KanbanColumnContainer>
              {columns.map((column) => (
                <KanbanColumn key={column.id} column={column}>
                  <KanbanColumnHeader>
                    <KanbanColumnHeaderTitle>
                      {column.title}
                    </KanbanColumnHeaderTitle>
                    <KanbanColumnHeaderActions
                      cardCount={column.cards.length}
                    />
                  </KanbanColumnHeader>

                  <KanbanColumnContent column={column}>
                    {column.cards.map((card) => (
                      <KanbanCard key={card.id} card={card}>
                        <KanbanCardHeader>
                          <KanbanCardHeaderTitle>
                            {card.title}
                          </KanbanCardHeaderTitle>
                        </KanbanCardHeader>
                        <KanbanCardBody>{card.body}</KanbanCardBody>
                      </KanbanCard>
                    ))}
                  </KanbanColumnContent>
                </KanbanColumn>
              ))}
            </KanbanColumnContainer>
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
            <KanbanHeader>
              <KanbanHeaderTitle>Complete Kanban Board</KanbanHeaderTitle>
              <KanbanHeaderActions className='space-x-s'>
                <KanbanHeaderSearch
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
              </KanbanHeaderActions>
            </KanbanHeader>

            <KanbanColumnContainer>
              {filteredColumns.map((column) => (
                <KanbanColumn key={column.id} column={column}>
                  <KanbanColumnHeader>
                    <KanbanColumnHeaderTitle>
                      {column.title}
                    </KanbanColumnHeaderTitle>
                    <KanbanColumnHeaderActions
                      cardCount={column.cards.length}
                    />
                  </KanbanColumnHeader>

                  <KanbanColumnContent column={column}>
                    {column.cards.map((card) => (
                      <KanbanCard key={card.id} card={card}>
                        <KanbanCardHeader>
                          <KanbanCardHeaderTitle>
                            {card.title}
                          </KanbanCardHeaderTitle>
                          <KanbanCardHeaderActions>
                            <MenuTrigger>
                              <Button variant='icon'>
                                <Icon size='small'>
                                  <Kebab />
                                </Icon>
                              </Button>
                              <Menu>
                                <MenuItem
                                  onAction={() => handleEditCard(card.id)}
                                >
                                  <MenuItemLabel>Edit</MenuItemLabel>
                                </MenuItem>
                                <MenuItem
                                  onAction={() => handleDeleteCard(card.id)}
                                >
                                  <MenuItemLabel>Delete</MenuItemLabel>
                                </MenuItem>
                              </Menu>
                            </MenuTrigger>
                          </KanbanCardHeaderActions>
                        </KanbanCardHeader>
                        <KanbanCardBody>{card.body}</KanbanCardBody>
                      </KanbanCard>
                    ))}
                  </KanbanColumnContent>
                  <KanbanColumnActions
                    onAddCard={() => handleAddCard(column.id)}
                  />
                </KanbanColumn>
              ))}
            </KanbanColumnContainer>
          </Kanban>
        </KanbanProvider>
      </div>
    );
  },
};
