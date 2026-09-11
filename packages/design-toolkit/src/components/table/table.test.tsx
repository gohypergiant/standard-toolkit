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
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TableBody } from './body';
import { TableCell } from './cell';
import { createTableColumnHelper } from './features';
import { TableHeader } from './header';
import { TableHeaderCell } from './header-cell';
import { Table } from './index';
import { TableRow } from './row';
import type {
  RowPinningState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
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

const selectionData: Person[] = [
  { id: 'tanner', name: 'tanner' },
  { id: 'tandy', name: 'tandy' },
  { id: 'joe', name: 'joe' },
];

type SelectionTableProps = {
  rowSelection?: RowSelectionState;
  defaultRowSelection?: RowSelectionState;
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
};

function SelectionTable(props: SelectionTableProps) {
  return (
    <Table
      columns={personColumns}
      data={selectionData}
      showCheckbox
      {...props}
    />
  );
}

function ControlledSelectionTable({
  initialSelection,
}: {
  initialSelection: RowSelectionState;
}) {
  const [selection, setSelection] = useState(initialSelection);

  return (
    <>
      <SelectionTable
        rowSelection={selection}
        onRowSelectionChange={setSelection}
      />
      <button type='button' onClick={() => setSelection({})}>
        Clear selection
      </button>
    </>
  );
}

function rowCheckboxes() {
  // checkbox 0 is the header select-all; rows follow in data order
  return screen.getAllByRole('checkbox').slice(1);
}

describe('Table row selection', () => {
  function setup(props: SelectionTableProps = {}) {
    return {
      ...render(<SelectionTable {...props} />),
    };
  }

  it('should reflect a controlled rowSelection change after mount', async () => {
    render(<ControlledSelectionTable initialSelection={{ tanner: true }} />);

    expect(rowCheckboxes()[0]).toBeChecked();

    await userEvent.click(
      screen.getByRole('button', { name: 'Clear selection' }),
    );

    expect(rowCheckboxes()[0]).not.toBeChecked();
  });

  it('should seed selection from defaultRowSelection', async () => {
    setup({ defaultRowSelection: { tanner: true, joe: true } });

    expect(rowCheckboxes()[0]).toBeChecked();
    expect(rowCheckboxes()[1]).not.toBeChecked();
    expect(rowCheckboxes()[2]).toBeChecked();

    // uncontrolled interaction updates internally without any callback
    await userEvent.click(rowCheckboxes()[1] as HTMLElement);

    expect(rowCheckboxes()[1]).toBeChecked();
  });

  it('should call onRowSelectionChange with the plain next selection', async () => {
    const onRowSelectionChange = vi.fn();
    setup({ rowSelection: { tanner: true }, onRowSelectionChange });

    await userEvent.click(rowCheckboxes()[2] as HTMLElement);

    expect(onRowSelectionChange).toHaveBeenCalledTimes(1);
    const payload = onRowSelectionChange.mock.calls[0]?.[0];
    expect(typeof payload).toBe('object');
    expect(payload).toEqual({ tanner: true, joe: true });
  });

  it('should omit the key when a row is deselected', async () => {
    const onRowSelectionChange = vi.fn();
    setup({
      rowSelection: { tanner: true, joe: true },
      onRowSelectionChange,
    });

    await userEvent.click(rowCheckboxes()[2] as HTMLElement);

    expect(onRowSelectionChange).toHaveBeenCalledTimes(1);
    const payload = onRowSelectionChange.mock.calls[0]?.[0];
    expect(payload).toEqual({ tanner: true });
    expect(payload).not.toHaveProperty('joe');
  });

  it('should emit every row id on select-all against a controlled value', async () => {
    const onRowSelectionChange = vi.fn();
    setup({ rowSelection: { tanner: true }, onRowSelectionChange });

    await userEvent.click(screen.getAllByRole('checkbox')[0] as HTMLElement);

    expect(onRowSelectionChange).toHaveBeenCalledWith({
      tanner: true,
      tandy: true,
      joe: true,
    });
  });

  it('should freeze selection when controlled without a callback', async () => {
    setup({ rowSelection: { tanner: true } });

    await userEvent.click(rowCheckboxes()[2] as HTMLElement);

    expect(rowCheckboxes()[0]).toBeChecked();
    expect(rowCheckboxes()[2]).not.toBeChecked();
  });

  it('should ignore defaultRowSelection while controlled', () => {
    setup({
      rowSelection: { joe: true },
      defaultRowSelection: { tanner: true },
    });

    expect(rowCheckboxes()[0]).not.toBeChecked();
    expect(rowCheckboxes()[2]).toBeChecked();
  });
});

type SortPerson = { id: string; firstName: string; age: number };

const sortColumnHelper = createTableColumnHelper<SortPerson>();

const sortColumns = [
  sortColumnHelper.accessor('firstName', {
    id: 'firstName',
    header: () => <span>First Name</span>,
    cell: (info) => info.getValue(),
  }),
  sortColumnHelper.accessor('age', {
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  }),
];

const sortData: SortPerson[] = [
  { id: 'tanner', firstName: 'tanner', age: 24 },
  { id: 'tandy', firstName: 'tandy', age: 40 },
  { id: 'joe', firstName: 'joe', age: 45 },
];

type SortingTableProps = {
  sort?: SortingState;
  defaultSort?: SortingState;
  onSortChange?: (sort: SortingState) => void;
  manualSorting?: boolean;
  enableSorting?: boolean;
  enableColumnReordering?: boolean;
};

function SortingTable(props: SortingTableProps) {
  return <Table columns={sortColumns} data={sortData} {...props} />;
}

function ControlledSortingTable() {
  const [sort, setSort] = useState<SortingState>([]);

  return (
    <>
      <SortingTable sort={sort} onSortChange={setSort} />
      <button
        type='button'
        onClick={() => setSort([{ id: 'firstName', desc: false }])}
      >
        Sort by first name
      </button>
    </>
  );
}

// header menus in column order; meta columns (numeral, kebab) render none
const FIRST_NAME_MENU = 0;
const AGE_MENU = 1;

async function chooseSortItem(menuIndex: number, itemName: string) {
  await userEvent.click(
    screen.getAllByRole('button', { name: 'Menu' })[menuIndex] as HTMLElement,
  );
  // DTK Menu items render as menuitemradio; the popover mounts asynchronously
  await userEvent.click(
    await screen.findByRole('menuitemradio', { name: itemName }),
  );
}

function columnHeader(text: string) {
  return screen
    .getAllByRole('columnheader')
    .find((th) => th.textContent?.includes(text)) as HTMLElement;
}

describe('Table sorting', () => {
  function setup(props: SortingTableProps = {}) {
    return {
      ...render(<SortingTable {...props} />),
    };
  }

  it('should emit the plain SortingState for descending, ascending, and clear', async () => {
    const onSortChange = vi.fn();
    setup({ onSortChange });

    await chooseSortItem(AGE_MENU, 'Sort Descending');

    expect(onSortChange).toHaveBeenCalledTimes(1);
    const payload = onSortChange.mock.calls[0]?.[0];
    expect(Array.isArray(payload)).toBe(true);
    expect(payload).toEqual([{ id: 'age', desc: true }]);

    await chooseSortItem(AGE_MENU, 'Sort Ascending');

    expect(onSortChange.mock.calls[1]?.[0]).toEqual([
      { id: 'age', desc: false },
    ]);

    await chooseSortItem(AGE_MENU, 'Clear Sort');

    expect(onSortChange.mock.calls[2]?.[0]).toEqual([]);
  });

  it('should replace the sorted column when sorting another column', async () => {
    const onSortChange = vi.fn();
    setup({ onSortChange });

    await chooseSortItem(AGE_MENU, 'Sort Descending');
    await chooseSortItem(FIRST_NAME_MENU, 'Sort Ascending');

    expect(onSortChange).toHaveBeenCalledTimes(2);
    expect(onSortChange.mock.calls[1]?.[0]).toEqual([
      { id: 'firstName', desc: false },
    ]);
  });

  it('should seed the sort from defaultSort', () => {
    setup({ defaultSort: [{ id: 'age', desc: true }] });

    expect(dataRowNames()).toEqual(['joe', 'tandy', 'tanner']);
    expect(columnHeader('Age')).toHaveAttribute('aria-sort', 'descending');
    expect(columnHeader('First Name')).not.toHaveAttribute('aria-sort');
  });

  it('should reflect a controlled sort change after mount', async () => {
    render(<ControlledSortingTable />);

    expect(dataRowNames()).toEqual(['tanner', 'tandy', 'joe']);

    await userEvent.click(
      screen.getByRole('button', { name: 'Sort by first name' }),
    );

    expect(dataRowNames()).toEqual(['joe', 'tandy', 'tanner']);
    expect(columnHeader('First Name')).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });

  it('should freeze the sort when controlled without a callback', async () => {
    setup({ sort: [{ id: 'age', desc: true }] });

    await chooseSortItem(AGE_MENU, 'Sort Ascending');

    expect(columnHeader('Age')).toHaveAttribute('aria-sort', 'descending');
    expect(dataRowNames()).toEqual(['joe', 'tandy', 'tanner']);
  });

  it('should reflect the sort without reordering rows in manual mode', async () => {
    setup({ manualSorting: true, sort: [{ id: 'age', desc: true }] });

    expect(dataRowNames()).toEqual(['tanner', 'tandy', 'joe']);
    expect(columnHeader('Age')).toHaveAttribute('aria-sort', 'descending');

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Menu' })[AGE_MENU] as HTMLElement,
    );

    expect(
      await screen.findByRole('menuitemradio', { name: 'Clear Sort' }),
    ).not.toHaveAttribute('aria-disabled');
    expect(
      screen.getByRole('menuitemradio', { name: 'Sort Descending' }),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByRole('menuitemradio', { name: 'Sort Ascending' }),
    ).not.toHaveAttribute('aria-disabled');
  });

  it('should disable Clear Sort on an unsorted column', async () => {
    setup();

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Menu' })[AGE_MENU] as HTMLElement,
    );

    expect(
      await screen.findByRole('menuitemradio', { name: 'Clear Sort' }),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByRole('menuitemradio', { name: 'Sort Ascending' }),
    ).not.toHaveAttribute('aria-disabled');
    expect(
      screen.getByRole('menuitemradio', { name: 'Sort Descending' }),
    ).not.toHaveAttribute('aria-disabled');
  });

  it('should not sort when the header label is clicked', async () => {
    setup();

    await userEvent.click(screen.getByText('Age'));

    for (const th of screen.getAllByRole('columnheader')) {
      expect(th).not.toHaveAttribute('aria-sort');
    }
    expect(dataRowNames()).toEqual(['tanner', 'tandy', 'joe']);
  });

  it('should omit sort items when sorting is disabled', async () => {
    setup({ enableSorting: false, enableColumnReordering: true });

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Menu' })[AGE_MENU] as HTMLElement,
    );

    expect(
      await screen.findByRole('menuitemradio', { name: 'Move Column Left' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitemradio', { name: 'Sort Ascending' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitemradio', { name: 'Sort Descending' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitemradio', { name: 'Clear Sort' }),
    ).not.toBeInTheDocument();
  });
});

type PinningTableProps = {
  rowPinning?: RowPinningState;
  defaultRowPinning?: RowPinningState;
  onRowPinningChange?: (rowPinning: RowPinningState) => void;
};

function PinningTable(props: PinningTableProps) {
  return (
    <Table
      columns={personColumns}
      data={selectionData}
      enableRowActions
      {...props}
    />
  );
}

function ControlledPinningTable() {
  const [pinning, setPinning] = useState<RowPinningState>({
    top: ['joe'],
    bottom: [],
  });

  return (
    <>
      <PinningTable rowPinning={pinning} onRowPinningChange={setPinning} />
      <button type='button' onClick={() => setPinning({ top: [], bottom: [] })}>
        Unpin all
      </button>
    </>
  );
}

function dataRowPins() {
  // skip the header row; the pinned region renders first
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.getAttribute('data-pinned'));
}

describe('Table row pinning', () => {
  function setup(props: PinningTableProps = {}) {
    return {
      ...render(<PinningTable {...props} />),
    };
  }

  it('should seed pinning from defaultRowPinning', () => {
    setup({ defaultRowPinning: { top: ['joe'], bottom: [] } });

    expect(dataRowNames()).toEqual(['joe', 'tanner', 'tandy']);
    expect(dataRowPins()).toEqual(['top', null, null]);
  });

  it('should call onRowPinningChange with the plain next pinning on Pin', async () => {
    const onRowPinningChange = vi.fn();
    setup({ rowPinning: { top: ['joe'], bottom: [] }, onRowPinningChange });

    // tanner keeps data index 0 (kebab label "row 1 actions") even though
    // joe renders first in the pinned region
    await userEvent.click(
      screen.getByRole('button', { name: 'row 1 actions' }),
    );
    await userEvent.click(screen.getByText('Pin'));

    expect(onRowPinningChange).toHaveBeenCalledTimes(1);
    const payload = onRowPinningChange.mock.calls[0]?.[0];
    expect(typeof payload).toBe('object');
    expect(payload).toEqual({ top: ['joe', 'tanner'], bottom: [] });
  });

  it('should remove the row id from top on Unpin', async () => {
    const onRowPinningChange = vi.fn();
    setup({
      rowPinning: { top: ['joe', 'tanner'], bottom: [] },
      onRowPinningChange,
    });

    // joe keeps data index 2, so its kebab stays "row 3 actions"
    await userEvent.click(
      screen.getByRole('button', { name: 'row 3 actions' }),
    );
    await userEvent.click(screen.getByText('Unpin'));

    expect(onRowPinningChange).toHaveBeenCalledTimes(1);
    expect(onRowPinningChange.mock.calls[0]?.[0]).toEqual({
      top: ['tanner'],
      bottom: [],
    });
  });

  it('should reflect a controlled rowPinning change after mount', async () => {
    render(<ControlledPinningTable />);

    expect(dataRowPins()).toEqual(['top', null, null]);

    await userEvent.click(screen.getByRole('button', { name: 'Unpin all' }));

    expect(dataRowPins()).toEqual([null, null, null]);
  });

  it('should skip pinned ids absent from data without pruning', () => {
    const onRowPinningChange = vi.fn();
    setup({
      rowPinning: { top: ['ghost', 'joe'], bottom: [] },
      onRowPinningChange,
    });

    // ghost renders no row; the controlling owner is responsible for pruning
    expect(dataRowNames()).toEqual(['joe', 'tanner', 'tandy']);
    expect(dataRowPins()).toEqual(['top', null, null]);
    expect(onRowPinningChange).not.toHaveBeenCalled();
  });

  it('should freeze pinning when controlled without a callback', async () => {
    setup({ rowPinning: { top: [], bottom: [] } });

    await userEvent.click(
      screen.getByRole('button', { name: 'row 1 actions' }),
    );
    await userEvent.click(screen.getByText('Pin'));

    expect(dataRowPins()).toEqual([null, null, null]);
  });
});
