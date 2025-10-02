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

import { createControl, EXCLUSIONS, hideControls } from '^storybook/utils';
import { createColumnHelper } from '@tanstack/react-table';
import { Table } from './index';
import type { Meta, StoryObj } from '@storybook/react';

type Person = {
  age: number;
  firstName: string;
  id: string;
  lastName: string;
  progress: number;
  status: string;
  visits: number;
};

const defaultData: Person[] = [
  {
    id: 'tanner',
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    id: 'tandy',
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    id: 'joe',
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    id: 'jane',
    firstName: 'jane',
    lastName: 'doe',
    age: 30,
    visits: 60,
    status: 'Married',
    progress: 70,
  },
  {
    id: 'john',
    firstName: 'john',
    lastName: 'smith',
    age: 35,
    visits: 80,
    status: 'Single',
    progress: 90,
  },
  {
    id: 'alice',
    firstName: 'alice',
    lastName: 'johnson',
    age: 28,
    visits: 50,
    status: 'In Relationship',
    progress: 40,
  },
  {
    id: 'bob',
    firstName: 'bob',
    lastName: 'brown',
    age: 32,
    visits: 70,
    status: 'Complicated',
    progress: 20,
  },
  {
    id: 'charlie',
    firstName: 'charlie',
    lastName: 'white',
    age: 29,
    visits: 90,
    status: 'Single',
    progress: 30,
  },
  {
    id: 'dave',
    firstName: 'dave',
    lastName: 'green',
    age: 38,
    visits: 110,
    status: 'In Relationship',
    progress: 60,
  },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('firstName', {
    id: 'firstName',
    cell: (info) => info.getValue(),
    header: () => <span>First Name</span>,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor('age', {
    id: 'age',
    cell: (info) => info.renderValue(),
    header: () => 'Age',
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: () => <span>Visits</span>,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    header: 'Profile Progress',
  }),
];

const meta = {
  title: 'Components/Table',
  component: Table,
  args: {
    columns: columns,
    data: defaultData,
    enableColumnOrdering: true,
    enableRowActions: true,
    enableSorting: false,
    kebabPosition: 'right',
    persistHeaderKebabMenu: true,
    persistNumerals: true,
    persistRowKebabMenu: true,
    showCheckbox: true,
  },
  argTypes: {
    kebabPosition: createControl.radio('Kebab position', ['left', 'right']),
  },
  parameters: {
    controls: {
      exclude: [...EXCLUSIONS.COMMON, 'columns', 'data'],
    },
    docs: {
      subtitle: 'TODO',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table<Person>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // render: Table, // default
};

export const SortableColumns: Story = {
  args: {
    enableSorting: true,
    kebabPosition: 'left',
  },
  // render: Table, // default
};

export const Static: Story = {
  render: (...args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>First Name</Table.HeaderCell>
          <Table.HeaderCell>Last Name</Table.HeaderCell>
          <Table.HeaderCell>Age</Table.HeaderCell>
          <Table.HeaderCell>Visits</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Progress</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {defaultData.map((person) => (
          <Table.Row key={person.id}>
            <Table.Cell>{person.firstName}</Table.Cell>
            <Table.Cell>{person.lastName}</Table.Cell>
            <Table.Cell>{person.age}</Table.Cell>
            <Table.Cell>{person.visits}</Table.Cell>
            <Table.Cell>{person.status}</Table.Cell>
            <Table.Cell>{person.progress}%</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
  ...hideControls(meta),
};
