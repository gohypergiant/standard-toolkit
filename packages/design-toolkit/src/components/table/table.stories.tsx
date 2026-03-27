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

import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { Pagination } from '../pagination/index';
import { TableBody } from './body';
import { TableCell } from './cell';
import { TableHeader } from './header';
import { TableHeaderCell } from './header-cell';
import { Table } from './index';
import { TableRow } from './row';
import type { Meta, StoryObj } from '@storybook/react-vite';

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
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

const firstNames = [
  'Alice',
  'Bob',
  'Charlie',
  'Dave',
  'Eve',
  'Frank',
  'Grace',
  'Hank',
  'Ivy',
  'Jack',
];
const lastNames = [
  'Smith',
  'Johnson',
  'Brown',
  'White',
  'Green',
  'Miller',
  'Davis',
  'Wilson',
  'Moore',
  'Taylor',
];
const statuses = ['Single', 'In Relationship', 'Complicated', 'Married'];

function generateData(count: number): Person[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      id: `person-${n}`,
      firstName: `${firstNames[i % firstNames.length]}-${n}`,
      lastName: `${lastNames[i % lastNames.length]}-${n}`,
      age: 20 + (i % 40),
      visits: (i * 7) % 100,
      status: statuses[i % statuses.length] as string,
      progress: (i * 13) % 100,
    };
  });
}

const allData = generateData(100);
const PAGE_SIZE = 10;
const totalPages = Math.ceil(allData.length / PAGE_SIZE);

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
    size: 42,
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: () => <span>Visits</span>,
    size: 42,
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
  subcomponents: {
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
  },
  args: {
    columns: columns,
    data: defaultData,
    showCheckbox: true,
    kebabPosition: 'right',
    persistHeaderKebabMenu: true,
    persistRowKebabMenu: true,
    persistNumerals: true,
    enableSorting: true,
    enableColumnReordering: true,
    enableRowActions: true,
    fullWidth: false,
  },
  argTypes: {
    kebabPosition: {
      control: {
        type: 'radio',
        options: ['left', 'right'],
      },
    },
    manualSorting: {
      control: 'boolean',
      description:
        'When true, sorting is handled externally (server-side). getSortedRowModel() is not needed.',
      table: { defaultValue: { summary: 'false' } },
    },
    pageSize: {
      control: 'number',
      description:
        'Number of rows per page. Enables built-in pagination when set.',
    },
    defaultPage: {
      control: 'number',
      description: 'Uncontrolled default page (1-indexed)',
      table: { defaultValue: { summary: '1' } },
    },
  },
  tags: ['autodocs'],
  parameters: {
    controls: {
      exclude: ['columns', 'data'],
    },
    docs: {
      subtitle:
        'Configurable data table with sorting, selection, and row actions',
    },
  },
} satisfies Meta<typeof Table<Person>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    kebabPosition: 'right',
    enableSorting: false,
  },

  render: (args) => <Table {...args} key={JSON.stringify(args)} />,
};

export const SortableColumns: Story = {
  args: {
    kebabPosition: 'left',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Columns are sortable by clicking the headers. Click a header to sort ascending, descending, or clear sorting.',
      },
    },
  },
  render: (args) => <Table {...args} key={JSON.stringify(args)} />,
};

const columnsWithSizing = [
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
    size: 42,
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: () => <span>Visits</span>,
    size: 42,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    header: 'Profile Progress',
    size: 64,
  }),
];

export const ColumnSizing: Story = {
  args: {
    fullWidth: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Columns can have custom sizes defined using the `size` property in the column definition. The table automatically applies these widths.',
      },
    },
    layout: 'fullscreen',
  },
  render: (args) => (
    <Table
      {...args}
      columns={columnsWithSizing}
      data={defaultData}
      key={JSON.stringify(args)}
    />
  ),
};

export const InitialRowSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `rowSelection` prop to specify which rows should be selected initially, and `onRowSelectionChange` to track selection changes. The callback receives an updater function or direct value following TanStack Table's API pattern. In this example, the first two rows (tanner and joe) are pre-selected, and selected row IDs are displayed below the table.",
      },
    },
  },
  render: (args) => {
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({
      tanner: true,
      joe: true,
    });

    return (
      <div>
        <Table
          {...args}
          rowSelection={selectedRows}
          onRowSelectionChange={setSelectedRows}
          key={JSON.stringify(args)}
        />
        <div style={{ marginTop: '1rem' }}>
          <strong>Selected Row IDs:</strong>
          {Object.values(selectedRows).filter(Boolean).length > 0 ? (
            <p>
              {Object.keys(selectedRows)
                .filter((id) => selectedRows[id])
                .join(', ')}
            </p>
          ) : (
            <p>No rows selected</p>
          )}
        </div>
      </div>
    );
  },
};

export const ClientSidePagination: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Client-side pagination. Pass all data and a `pageSize` prop — the Table handles data slicing internally via TanStack `getPaginationRowModel()`. Render `<Pagination>` alongside the Table to control navigation.',
      },
    },
  },
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <div>
        <Table
          {...args}
          data={allData}
          pageSize={PAGE_SIZE}
          page={page}
          onPageChange={setPage}
          key={JSON.stringify(args)}
        />
        <Pagination
          value={page}
          total={Math.ceil(allData.length / PAGE_SIZE)}
          onChange={setPage}
        />
      </div>
    );
  },
};

export const PrePaginated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Simulates server-side pagination where only the current page of data is passed to the Table. Uses `key={page}` to force remount when the page changes, since `useListData` only reads `initialItems` on mount.',
      },
    },
  },
  render: (args) => {
    const [page, setPage] = useState(1);
    const pageData = allData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
      <div>
        <Table
          {...args}
          data={pageData}
          key={`${page}-${JSON.stringify(args)}`}
        />
        <Pagination value={page} total={totalPages} onChange={setPage} />
      </div>
    );
  },
};

export const Static: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Manual table composition using sub-components (`TableHeader`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`) for full control over rendering.',
      },
    },
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>First Name</TableHeaderCell>
          <TableHeaderCell>Last Name</TableHeaderCell>
          <TableHeaderCell>Age</TableHeaderCell>
          <TableHeaderCell>Visits</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Progress</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultData.map((person) => (
          <TableRow key={person.id}>
            <TableCell>{person.firstName}</TableCell>
            <TableCell>{person.lastName}</TableCell>
            <TableCell>{person.age}</TableCell>
            <TableCell>{person.visits}</TableCell>
            <TableCell>{person.status}</TableCell>
            <TableCell>{person.progress}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
