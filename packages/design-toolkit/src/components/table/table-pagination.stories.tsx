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
import { Table } from './index';
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

const statuses = ['Single', 'In Relationship', 'Complicated', 'Married'];
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
  parameters: {
    controls: {
      exclude: ['columns', 'data'],
    },
  },
} satisfies Meta<typeof Table<Person>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClientSidePagination: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Client-side pagination. Pass all data and a `pageSize` prop — the Table handles data slicing internally via TanStack `getPaginationRowModel()`. Render `<Pagination>` alongside the Table to control navigation.',
      },
    },
  },
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div>
        <Table
          columns={columns}
          data={allData}
          pageSize={PAGE_SIZE}
          page={page}
          onPageChange={setPage}
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
  render: () => {
    const [page, setPage] = useState(1);
    const pageData = allData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
      <div>
        <Table key={page} columns={columns} data={pageData} />
        <Pagination value={page} total={totalPages} onChange={setPage} />
      </div>
    );
  },
};
