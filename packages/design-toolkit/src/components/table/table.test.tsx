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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TableBody } from './body';
import { TableCell } from './cell';
import { createTableColumnHelper } from './features';
import { TableHeader } from './header';
import { TableHeaderCell } from './header-cell';
import { Table } from './index';
import { TableRow } from './row';
import type { TableProps } from './types';

function setup(
  props: Partial<TableProps<{ id: string; number: number }>> = {},
) {
  return {
    ...render(
      <table {...props}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Header 1</TableHeaderCell>
            <TableHeaderCell>Header 2</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </table>,
    ),
  };
}

describe('Table', () => {
  it('should render', () => {
    setup();
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Header 2')).toBeInTheDocument();
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });
});

type Person = { id: string; name: string };

const columnHelper = createTableColumnHelper<Person>();

const personColumns = [
  columnHelper.accessor('name', {
    id: 'name',
    header: () => <span>Name</span>,
    cell: (info) => info.getValue(),
  }),
];

function dataRowNames() {
  // skip the header row; extract the name cell text from each data row
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.textContent?.replace(/[^a-z-]/g, ''));
}

describe('Table data updates', () => {
  it('should reflect data prop changes without remount', () => {
    const { rerender } = render(
      <Table
        columns={personColumns}
        data={[
          { id: 'a', name: 'alpha' },
          { id: 'b', name: 'bravo' },
        ]}
      />,
    );

    expect(screen.getByText('alpha')).toBeInTheDocument();

    rerender(
      <Table
        columns={personColumns}
        data={[
          { id: 'b', name: 'bravo-updated' },
          { id: 'c', name: 'charlie' },
        ]}
      />,
    );

    expect(screen.getByText('bravo-updated')).toBeInTheDocument();
    expect(screen.getByText('charlie')).toBeInTheDocument();
    expect(screen.queryByText('alpha')).not.toBeInTheDocument();
  });

  it('should keep manual row order across data updates', async () => {
    const data = [
      { id: 'a', name: 'alpha' },
      { id: 'b', name: 'bravo' },
      { id: 'c', name: 'charlie' },
    ];
    const { rerender } = render(
      <Table columns={personColumns} data={data} enableSorting={false} />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'row 1 actions' }),
    );
    await userEvent.click(screen.getByText('Move Down'));

    expect(dataRowNames()).toEqual(['bravo', 'alpha', 'charlie']);

    rerender(
      <Table
        columns={personColumns}
        data={data.map((item) => ({ ...item, name: `${item.name}-updated` }))}
        enableSorting={false}
      />,
    );

    expect(dataRowNames()).toEqual([
      'bravo-updated',
      'alpha-updated',
      'charlie-updated',
    ]);
  });

  it('should keep an open row menu open across data updates', async () => {
    const data = [
      { id: 'a', name: 'alpha' },
      { id: 'b', name: 'bravo' },
    ];
    const { rerender } = render(<Table columns={personColumns} data={data} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'row 1 actions' }),
    );
    expect(screen.getByText('Move Down')).toBeInTheDocument();

    rerender(
      <Table
        columns={personColumns}
        data={data.map((item) => ({ ...item, name: `${item.name}-live` }))}
      />,
    );

    expect(screen.getByText('alpha-live')).toBeInTheDocument();
    expect(screen.getByText('Move Down')).toBeInTheDocument();
  });
});
