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
export const columnData = [
  {
    title: 'To Do',
    id: 'todo',
    headerActions: [],
    cards: [
      {
        title: 'Drag and Drop Columns',
        body: 'Reorganize the columns for drag and drop.',
        id: 'id-1',
        columnId: 'todo',
        position: 0,
      },
      {
        title: 'Drag and Drop Cards',
        body: 'Arrange cards for drag and drop.',
        id: 'id-2',
        columnId: 'todo',
        position: 1,
      },
      {
        title: 'Cross post cards to other columns',
        body: 'Extend the functionality of card drag and drop to allow for dragging to other columns.',
        id: 'id-3',
        columnId: 'todo',
        position: 2,
      },
    ],
  },
  {
    title: 'In Progress',
    id: 'inProgress',
    headerActions: [],
    cards: [
      {
        title: 'Base Implementation of Drag and Drop',
        body: 'Initial setup for @atlaskit/pragmatic-drag-and-drop',
        id: 'id-4',
        columnId: 'inProgress',
        position: 0,
      },
      {
        title: 'Refactor styling.',
        body: 'Update kanban board component styling to reflect proposed new standards.',
        id: 'id-5',
        columnId: 'inProgress',
        position: 1,
      },
    ],
  },
  {
    title: 'In Review',
    headerActions: [],
    cards: [],
    id: 'inReview',
  },
  {
    title: 'Done',
    headerActions: [],
    id: 'done',
    cards: [
      {
        title: 'Kanban Board',
        body: 'Base component for the kanban board.',
        id: 'id-6',
        columnId: 'done',
        position: 0,
      },
      {
        title: 'Kanban Card',
        body: 'Base components for kanban cards.',
        id: 'id-7',
        columnId: 'done',
        position: 1,
      },
    ],
  },
];
