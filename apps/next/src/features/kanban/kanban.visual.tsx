/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Button } from '@accelint/design-toolkit/components/button';
import { Icon } from '@accelint/design-toolkit/components/icon';
import { Kanban } from '@accelint/design-toolkit/components/kanban';
import { KanbanCard } from '@accelint/design-toolkit/components/kanban/card';
import { KanbanCardBody } from '@accelint/design-toolkit/components/kanban/card-body';
import { KanbanCardHeader } from '@accelint/design-toolkit/components/kanban/card-header';
import { KanbanCardHeaderActions } from '@accelint/design-toolkit/components/kanban/card-header-actions';
import { KanbanCardHeaderTitle } from '@accelint/design-toolkit/components/kanban/card-header-title';
import { KanbanColumn } from '@accelint/design-toolkit/components/kanban/column';
import { KanbanColumnActions } from '@accelint/design-toolkit/components/kanban/column-actions';
import { KanbanColumnContainer } from '@accelint/design-toolkit/components/kanban/column-container';
import { KanbanColumnContent } from '@accelint/design-toolkit/components/kanban/column-content';
import { KanbanColumnHeader } from '@accelint/design-toolkit/components/kanban/column-header';
import { KanbanColumnHeaderActions } from '@accelint/design-toolkit/components/kanban/column-header-actions';
import { KanbanColumnHeaderTitle } from '@accelint/design-toolkit/components/kanban/column-header-title';
import { KanbanProvider } from '@accelint/design-toolkit/components/kanban/context';
import { KanbanHeader } from '@accelint/design-toolkit/components/kanban/header';
import { KanbanHeaderActions } from '@accelint/design-toolkit/components/kanban/header-actions';
import { KanbanHeaderSearch } from '@accelint/design-toolkit/components/kanban/header-search';
import { KanbanHeaderTitle } from '@accelint/design-toolkit/components/kanban/header-title';
import { columnData } from '@accelint/design-toolkit/components/kanban/mock-data';
import { Menu } from '@accelint/design-toolkit/components/menu';
import { MenuItem } from '@accelint/design-toolkit/components/menu/item';
import { MenuItemLabel } from '@accelint/design-toolkit/components/menu/item-label';
import { MenuTrigger } from '@accelint/design-toolkit/components/menu/trigger';
import { Add, Kebab } from '@accelint/icons';
import { createVisualTestScenarios } from '~/visual-regression/vitest';
import type { KanbanColumnData } from '@accelint/design-toolkit/components/kanban/types';

const noop = () => {
  return null;
};

const activeCardColumns: KanbanColumnData[] = [
  {
    title: 'Active',
    id: 'active',
    cards: [
      {
        title: 'Active Card',
        body: 'This card is currently active.',
        id: 'active-1',
        columnId: 'active',
        position: 0,
        isActive: true,
      },
      {
        title: 'Inactive Card',
        body: 'This card is not active.',
        id: 'active-2',
        columnId: 'active',
        position: 1,
      },
    ],
  },
  {
    title: 'Other',
    id: 'other',
    cards: [
      {
        title: 'Regular Card',
        body: 'A standard card.',
        id: 'active-3',
        columnId: 'other',
        position: 0,
      },
    ],
  },
];

const emptyColumns: KanbanColumnData[] = [
  { title: 'Backlog', id: 'empty-1', cards: [] },
  { title: 'In Progress', id: 'empty-2', cards: [] },
  { title: 'Done', id: 'empty-3', cards: [] },
];

const singleColumn: KanbanColumnData[] = [
  {
    title: 'Tasks',
    id: 'single',
    cards: [
      {
        title: 'First Task',
        body: 'Description of the first task.',
        id: 'single-1',
        columnId: 'single',
        position: 0,
      },
      {
        title: 'Second Task',
        body: 'Description of the second task.',
        id: 'single-2',
        columnId: 'single',
        position: 1,
      },
      {
        title: 'Third Task',
        body: 'Description of the third task.',
        id: 'single-3',
        columnId: 'single',
        position: 2,
      },
    ],
  },
];

const manyCardsColumn: KanbanColumnData[] = [
  {
    title: 'Overflow',
    id: 'many',
    cards: Array.from({ length: 8 }, (_, i) => ({
      title: `Card ${i + 1}`,
      body: `Body content for card ${i + 1}.`,
      id: `many-${i + 1}`,
      columnId: 'many',
      position: i,
    })),
  },
];

const longContentColumns: KanbanColumnData[] = [
  {
    title: 'Long Content',
    id: 'long',
    cards: [
      {
        title:
          'This is a very long card title that should wrap to multiple lines to verify text wrapping behavior',
        body: 'This card has a long body text that contains multiple sentences. It should demonstrate how the card layout handles overflow and text wrapping when the content exceeds the typical card width. The layout should stretch vertically to accommodate all content.',
        id: 'long-1',
        columnId: 'long',
        position: 0,
      },
      {
        title: 'Short Title',
        body: 'Short body for contrast.',
        id: 'long-2',
        columnId: 'long',
        position: 1,
      },
    ],
  },
  {
    title: 'Normal',
    id: 'normal',
    cards: [
      {
        title: 'Normal Card',
        body: 'Standard length content.',
        id: 'long-3',
        columnId: 'normal',
        position: 0,
      },
    ],
  },
];

function renderBoard(columns: KanbanColumnData[]) {
  return (
    <KanbanProvider columns={columns} updateColumnState={noop}>
      <Kanban>
        <KanbanColumnContainer>
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column}>
              <KanbanColumnHeader>
                <KanbanColumnHeaderTitle>
                  {column.title}
                </KanbanColumnHeaderTitle>
                <KanbanColumnHeaderActions cardCount={column.cards.length} />
              </KanbanColumnHeader>

              <KanbanColumnContent column={column}>
                {column.cards.map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    isActive={card.isActive}
                  >
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
  );
}

function renderCompleteBoard() {
  return (
    <KanbanProvider columns={columnData} updateColumnState={noop}>
      <Kanban>
        <KanbanHeader>
          <KanbanHeaderTitle>Complete Kanban Board</KanbanHeaderTitle>
          <KanbanHeaderActions className='space-x-s'>
            <KanbanHeaderSearch inputProps={{ placeholder: 'Search' }} />
            <Button>
              <Icon>
                <Add />
              </Icon>
              Add Column
            </Button>
          </KanbanHeaderActions>
        </KanbanHeader>

        <KanbanColumnContainer>
          {columnData.map((column) => (
            <KanbanColumn key={column.id} column={column}>
              <KanbanColumnHeader>
                <KanbanColumnHeaderTitle>
                  {column.title}
                </KanbanColumnHeaderTitle>
                <KanbanColumnHeaderActions cardCount={column.cards.length} />
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
                            <MenuItem>
                              <MenuItemLabel>Edit</MenuItemLabel>
                            </MenuItem>
                            <MenuItem>
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
              <KanbanColumnActions />
            </KanbanColumn>
          ))}
        </KanbanColumnContainer>
      </Kanban>
    </KanbanProvider>
  );
}

createVisualTestScenarios('Kanban', [
  {
    name: 'default-board',
    render: () => renderBoard(columnData),
    screenshotName: 'kanban-default-board.png',
    className: 'p-s w-[900px]',
  },
  {
    name: 'active-card',
    render: () => renderBoard(activeCardColumns),
    screenshotName: 'kanban-active-card.png',
    className: 'p-s w-[900px]',
  },
  {
    name: 'empty-board',
    render: () => renderBoard(emptyColumns),
    screenshotName: 'kanban-empty-board.png',
    className: 'p-s w-[900px]',
  },
  {
    name: 'single-column',
    render: () => renderBoard(singleColumn),
    screenshotName: 'kanban-single-column.png',
    className: 'p-s w-[300px]',
  },
  {
    name: 'many-cards',
    render: () => renderBoard(manyCardsColumn),
    screenshotName: 'kanban-many-cards.png',
    className: 'p-s w-[300px]',
  },
  {
    name: 'complete-board',
    render: renderCompleteBoard,
    screenshotName: 'kanban-complete-board.png',
    className: 'p-s w-[900px]',
  },
  {
    name: 'long-content',
    render: () => renderBoard(longContentColumns),
    screenshotName: 'kanban-long-content.png',
    className: 'p-s w-[900px]',
  },
]);
