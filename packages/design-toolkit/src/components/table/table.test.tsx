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

  it('should move a row up via the kebab menu', async () => {
    const data = [
      { id: 'a', name: 'alpha' },
      { id: 'b', name: 'bravo' },
      { id: 'c', name: 'charlie' },
    ];
    render(<Table columns={personColumns} data={data} enableSorting={false} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'row 2 actions' }),
    );
    await userEvent.click(screen.getByText('Move Up'));

    expect(dataRowNames()).toEqual(['bravo', 'alpha', 'charlie']);
  });

  it('should not move the first row up', async () => {
    const data = [
      { id: 'a', name: 'alpha' },
      { id: 'b', name: 'bravo' },
    ];
    render(<Table columns={personColumns} data={data} enableSorting={false} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'row 1 actions' }),
    );
    // Move Up is disabled for the first row; clicking it must be a no-op.
    // The menu stays open (and aria-hides the table), so close it to assert.
    await userEvent.click(screen.getByText('Move Up'));
    await userEvent.keyboard('{Escape}');

    expect(dataRowNames()).toEqual(['alpha', 'bravo']);
  });

  it('should disable Move Up when only pinned rows are above', async () => {
    const data = [
      { id: 'a', name: 'alpha' },
      { id: 'b', name: 'bravo' },
      { id: 'c', name: 'charlie' },
    ];
    render(<Table columns={personColumns} data={data} enableSorting={false} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'row 1 actions' }),
    );
    await userEvent.click(screen.getByText('Pin'));

    await userEvent.click(
      screen.getByRole('button', { name: 'row 2 actions' }),
    );

    // DTK Menu items render as menuitemradio; the popover also mounts
    // asynchronously after the previous menu's exit, hence findByRole
    expect(
      await screen.findByRole('menuitemradio', { name: 'Move Up' }),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByRole('menuitemradio', { name: 'Move Down' }),
    ).not.toHaveAttribute('aria-disabled');
  });

  it('should skip pinned neighbors when moving', async () => {
    const data = [
      { id: 'a', name: 'alpha' },
      { id: 'b', name: 'bravo' },
      { id: 'c', name: 'charlie' },
    ];
    render(<Table columns={personColumns} data={data} enableSorting={false} />);

    // pin bravo, then move charlie up: charlie skips pinned bravo and lands
    // above alpha (bravo renders first, in the pinned region)
    await userEvent.click(
      screen.getByRole('button', { name: 'row 2 actions' }),
    );
    await userEvent.click(screen.getByText('Pin'));

    await userEvent.click(
      screen.getByRole('button', { name: 'row 3 actions' }),
    );
    await userEvent.click(screen.getByText('Move Up'));

    expect(dataRowNames()).toEqual(['bravo', 'charlie', 'alpha']);
  });

  it('should move selected rows as a group', async () => {
    const data = [
      { id: 'a', name: 'alpha' },
      { id: 'b', name: 'bravo' },
      { id: 'c', name: 'charlie' },
    ];
    render(
      <Table
        columns={personColumns}
        data={data}
        enableSorting={false}
        showCheckbox
      />,
    );

    // select alpha and bravo (checkbox 0 is the header select-all)
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1] as HTMLElement);
    await userEvent.click(checkboxes[2] as HTMLElement);

    // acting on a selected row moves the whole selection below charlie
    await userEvent.click(
      screen.getByRole('button', { name: 'row 1 actions' }),
    );
    await userEvent.click(screen.getByText('Move Down'));

    expect(dataRowNames()).toEqual(['charlie', 'alpha', 'bravo']);
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

const changeHelper = createTableColumnHelper<{
  id: string;
  a: string;
  b: string;
  c: string;
}>();

const changeCol = (key: 'a' | 'b' | 'c') =>
  changeHelper.accessor(key, {
    id: key,
    header: () => <span>{`Header ${key.toUpperCase()}`}</span>,
    cell: (info) => info.getValue(),
  });

const changeData = [{ id: 'r1', a: 'va', b: 'vb', c: 'vc' }];

const contentHeaders = () =>
  screen
    .getAllByRole('columnheader')
    .map((th) => th.textContent)
    .filter((text) => text?.startsWith('Header '));

describe('Table column set changes', () => {
  it('renders a column added after mount in its given position', () => {
    const { rerender } = render(
      <Table data={changeData} columns={[changeCol('a'), changeCol('b')]} />,
    );

    expect(contentHeaders()).toEqual(['Header A', 'Header B']);

    rerender(
      <Table
        data={changeData}
        columns={[changeCol('a'), changeCol('c'), changeCol('b')]}
      />,
    );

    expect(contentHeaders()).toEqual(['Header A', 'Header C', 'Header B']);
    expect(screen.getByText('vc')).toBeInTheDocument();
  });

  it('drops a column removed after mount', () => {
    const { rerender } = render(
      <Table
        data={changeData}
        columns={[changeCol('a'), changeCol('c'), changeCol('b')]}
      />,
    );

    rerender(
      <Table data={changeData} columns={[changeCol('a'), changeCol('b')]} />,
    );

    expect(contentHeaders()).toEqual(['Header A', 'Header B']);
    expect(screen.queryByText('vc')).not.toBeInTheDocument();
  });
});

describe('Table column moves', () => {
  it('moves a column right on the first move (no pre-seeded order)', async () => {
    render(
      <Table data={changeData} columns={[changeCol('a'), changeCol('b')]} />,
    );

    expect(contentHeaders()).toEqual(['Header A', 'Header B']);

    // header kebabs are unnamed menu buttons; the first belongs to Header A
    const menuButtons = screen.getAllByRole('button', { name: 'Menu' });
    await userEvent.click(menuButtons[0] as HTMLElement);
    await userEvent.click(screen.getByText('Move Column Right'));

    expect(contentHeaders()).toEqual(['Header B', 'Header A']);
  });

  it('keeps a manual move and appends columns added afterwards', async () => {
    const { rerender } = render(
      <Table data={changeData} columns={[changeCol('a'), changeCol('b')]} />,
    );

    const menuButtons = screen.getAllByRole('button', { name: 'Menu' });
    await userEvent.click(menuButtons[0] as HTMLElement);
    await userEvent.click(screen.getByText('Move Column Right'));

    expect(contentHeaders()).toEqual(['Header B', 'Header A']);

    // once the user has customized the order, new columns append at the end
    rerender(
      <Table
        data={changeData}
        columns={[changeCol('a'), changeCol('c'), changeCol('b')]}
      />,
    );

    expect(contentHeaders()).toEqual(['Header B', 'Header A', 'Header C']);
  });
});

describe('Table density', () => {
  it('defaults to cozy', () => {
    render(<Table data={changeData} columns={[changeCol('a')]} />);

    expect(screen.getByRole('table')).toHaveAttribute('data-density', 'cozy');
  });

  it('exposes compact density on the table element', () => {
    render(
      <Table data={changeData} columns={[changeCol('a')]} density='compact' />,
    );

    expect(screen.getByRole('table')).toHaveAttribute(
      'data-density',
      'compact',
    );
  });
});

describe('Table numerals', () => {
  it('renders the numeral column by default', () => {
    render(<Table data={changeData} columns={[changeCol('a')]} />);

    expect(screen.getAllByTestId('numeral').length).toBeGreaterThan(0);
  });

  it('omits the numeral column when showNumerals is false', () => {
    render(
      <Table
        data={changeData}
        columns={[changeCol('a')]}
        showNumerals={false}
      />,
    );

    expect(screen.queryByTestId('numeral')).not.toBeInTheDocument();
  });
});
