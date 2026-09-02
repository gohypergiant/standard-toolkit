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

import { useEffect, useMemo, useState } from 'react';
import { Button } from '../button';
import { Pagination } from '../pagination/index';
import { TableBody } from './body';
import { TableCell } from './cell';
import { createTableColumnHelper } from './features';
import { TableHeader } from './header';
import { TableHeaderCell } from './header-cell';
import { Table } from './index';
import { TableRow } from './row';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  RowPinningState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import type { TableProps } from './types';

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

const columnHelper = createTableColumnHelper<Person>();

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

// TableProps is a union (data mode | children mode); spreading the raw args
// union alongside prop overrides makes TS try the children-mode arm (where
// every table prop is `never`) and reject the story. Narrow to the data arm.
function dataArgs(args: unknown) {
  return args as Extract<TableProps<Person>, { data: Person[] }>;
}

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
          'Use the column header menu (kebab) to sort ascending, descending, or clear sorting; uncontrolled by default.',
      },
    },
  },
  render: (args) => <Table {...args} key={JSON.stringify(args)} />,
};

export const ControlledSorting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `sort` prop is the controlled sort value: pair it with `onSortChange`, which always receives the plain next `SortingState` (`[{ id, desc }]` or `[]`), never an updater function. The current sort state is rendered below the table as JSON.',
      },
    },
  },
  render: (args) => {
    const [sort, setSort] = useState<SortingState>([]);

    return (
      <div>
        <Table
          {...dataArgs(args)}
          sort={sort}
          onSortChange={setSort}
          key={JSON.stringify(args)}
        />
        <div style={{ marginTop: '1rem' }}>
          <strong>Sort state:</strong>
          <p>{JSON.stringify(sort)}</p>
        </div>
      </div>
    );
  },
};

export const ServerSideSorting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Server-side sorting with `manualSorting`: the table never reorders rows itself and renders `data` as given. The story holds the controlled `sort` state and re-sorts the data in a `useMemo` from `sort[0]` (standing in for a server query). The header still shows the sort arrow and `aria-sort` because the sort state feeds the table in both modes.',
      },
    },
  },
  render: (args) => {
    const [sort, setSort] = useState<SortingState>([]);

    const sortedData = useMemo(() => {
      const entry = sort[0];

      if (!entry) {
        return defaultData;
      }

      const key = entry.id as keyof Person;
      const direction = entry.desc ? -1 : 1;

      return [...defaultData].sort((a, b) => {
        if (a[key] < b[key]) {
          return -direction;
        }

        if (a[key] > b[key]) {
          return direction;
        }

        return 0;
      });
    }, [sort]);

    return (
      <div>
        <Table
          {...dataArgs(args)}
          data={sortedData}
          manualSorting
          sort={sort}
          onSortChange={setSort}
          key={JSON.stringify(args)}
        />
        <div style={{ marginTop: '1rem' }}>
          <strong>Sort state:</strong>
          <p>{JSON.stringify(sort)}</p>
        </div>
      </div>
    );
  },
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
      {...dataArgs(args)}
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
          'Use the `defaultRowSelection` prop to specify which rows start selected, and `onRowSelectionChange` to track selection changes. The callback always receives the plain next `RowSelectionState`, never an updater function. In this example, tanner and joe start selected, and the last callback payload is rendered below the table as JSON.',
      },
    },
  },
  render: (args) => {
    const [lastPayload, setLastPayload] = useState<RowSelectionState | null>(
      null,
    );

    return (
      <div>
        <Table
          {...dataArgs(args)}
          defaultRowSelection={{ tanner: true, joe: true }}
          onRowSelectionChange={setLastPayload}
          key={JSON.stringify(args)}
        />
        <div style={{ marginTop: '1rem' }}>
          <strong>Last onRowSelectionChange payload:</strong>
          <p>{lastPayload ? JSON.stringify(lastPayload) : 'No changes yet'}</p>
        </div>
      </div>
    );
  },
};

export const ControlledRowSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `rowSelection` prop is the controlled selection value: pair it with `onRowSelectionChange` and the table reflects every prop change after mount. The "Clear selection" button drives the checkboxes from outside the table without a remount.',
      },
    },
  },
  render: (args) => {
    const [selection, setSelection] = useState<RowSelectionState>({
      tanner: true,
      joe: true,
    });
    const selectedIds = Object.keys(selection).filter((id) => selection[id]);

    return (
      <div>
        <Table
          {...dataArgs(args)}
          rowSelection={selection}
          onRowSelectionChange={setSelection}
          key={JSON.stringify(args)}
        />
        <div style={{ marginTop: '1rem' }}>
          <Button onPress={() => setSelection({})}>Clear selection</Button>
          <p>
            <strong>Selected Row IDs:</strong>{' '}
            {selectedIds.length > 0
              ? selectedIds.join(', ')
              : 'No rows selected'}
          </p>
        </div>
      </div>
    );
  },
};

export const ControlledRowPinning: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `rowPinning` prop is the controlled pinning value: pair it with `onRowPinningChange`, which always receives the plain next `RowPinningState` (`{ top, bottom }`), never an updater function. Pin or unpin rows via the row kebab menu; the "Unpin all" button clears the pinning from outside the table without a remount. The current pinning state is rendered below the table as JSON.',
      },
    },
  },
  render: (args) => {
    const [pinning, setPinning] = useState<RowPinningState>({
      top: ['joe'],
      bottom: [],
    });

    return (
      <div>
        <Table
          {...dataArgs(args)}
          rowPinning={pinning}
          onRowPinningChange={setPinning}
          key={JSON.stringify(args)}
        />
        <div style={{ marginTop: '1rem' }}>
          <Button onPress={() => setPinning({ top: [], bottom: [] })}>
            Unpin all
          </Button>
          <p>
            <strong>Pinning state:</strong> {JSON.stringify(pinning)}
          </p>
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
          {...dataArgs(args)}
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
          'Simulates server-side pagination where only the current page of data is passed to the Table. The Table reflects `data` prop changes directly, so no remount is needed when the page changes.',
      },
    },
  },
  render: (args) => {
    const [page, setPage] = useState(1);
    const pageData = allData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
      <div>
        <Table {...dataArgs(args)} data={pageData} key={JSON.stringify(args)} />
        <Pagination value={page} total={totalPages} onChange={setPage} />
      </div>
    );
  },
};

export const LiveUpdates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Simulates polling an endpoint: every second the `data` prop is replaced and the Visits/Profile Progress cells of a single row change, cycling through the rows; every few seconds a row is added or removed. The Table reflects each update directly — no `key` remount is needed for data changes. Manual row reordering (kebab menu → Move Up/Down) is preserved; rows that appear after a manual reorder are appended at the end. The wrapper reserves height for the maximum row count so add/remove doesn't shift the layout — in real apps, a fixed-height scroll container or `pageSize` does the same job.",
      },
    },
  },
  render: (args) => {
    const [tick, setTick] = useState(0);

    useEffect(() => {
      const id = setInterval(() => setTick((prev) => prev + 1), 1000);
      return () => clearInterval(id);
    }, []);

    const data = useMemo(() => {
      // 5..9 rows, one added/removed every 7 ticks
      const count = 5 + (Math.floor(tick / 7) % 5);

      return defaultData.slice(0, count).map((person, index) => {
        // staggered so exactly one row's cells change per tick
        const steps = Math.floor((tick + index) / count);

        return {
          ...person,
          visits: person.visits + steps,
          progress: (person.progress + steps * 7) % 100,
        };
      });
    }, [tick]);

    return (
      // reserve height for the max row count so add/remove doesn't shift layout
      <div style={{ minHeight: 500 }}>
        <Table {...dataArgs(args)} data={data} key={JSON.stringify(args)} />
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
