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

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import menuStyles from '../menu/styles.module.css';
import { TableBody } from './body';
import { TableCell } from './cell';
import { TableContext } from './context';
import { createTableColumnHelper } from './features';
import { TableHeader } from './header';
import { TableHeaderCell } from './header-cell';
import { Table } from './index';
import { TableRow } from './row';
import styles from './styles.module.css';
import type { DensityVariant } from '@/lib/types';
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

type Track = { id: string; callsign: string; altitude: number };

const trackColumnHelper = createTableColumnHelper<Track>();

const trackColumns = [
  trackColumnHelper.accessor('callsign', {
    id: 'callsign',
    header: 'Callsign',
    cell: (info) => info.getValue(),
  }),
  trackColumnHelper.accessor('altitude', {
    id: 'altitude',
    header: 'Altitude',
    cell: (info) => info.getValue(),
  }),
];

const tracks: Track[] = [
  { id: 'AF1', callsign: 'AF1', altitude: 35000 },
  { id: 'RCH27', callsign: 'RCH27', altitude: 28000 },
];

const DENSITY_VARIANTS = [
  'cozy',
  'compact',
  'crammed',
] as const satisfies readonly DensityVariant[];

/**
 * Resolves the module class for a density so assertions never compare
 * against `undefined` (which `toHaveClass` would reject at the type level).
 */
function densityClass(variant: DensityVariant): string {
  const className = styles[variant];

  if (className === undefined) {
    throw new Error(`styles.${variant} is not defined in styles.module.css`);
  }

  return className;
}

/** Resolves the Menu module class for a density (Menu has no `crammed`). */
function menuDensityClass(variant: Exclude<DensityVariant, 'crammed'>): string {
  const className = menuStyles[variant];

  if (className === undefined) {
    throw new Error(
      `menuStyles.${variant} is not defined in menu/styles.module.css`,
    );
  }

  return className;
}

/**
 * Asserts an open Menu and every item in it carry exactly the Menu density
 * class for `variant` (and not the other one).
 */
function expectMenuDensity(
  menu: HTMLElement,
  variant: Exclude<DensityVariant, 'crammed'>,
) {
  const other = variant === 'cozy' ? 'compact' : 'cozy';
  const items = within(menu).getAllByRole('menuitemradio');

  expect(items.length).toBeGreaterThan(0);
  for (const element of [menu, ...items]) {
    expect(element).toHaveClass(menuDensityClass(variant));
    expect(element).not.toHaveClass(menuDensityClass(other));
    expect(element.className).not.toMatch(/crammed/);
  }
}

/** Asserts exactly one density class: the one for `variant`, none of the others. */
function expectDensity(element: Element | null, variant: DensityVariant) {
  for (const candidate of DENSITY_VARIANTS) {
    if (candidate === variant) {
      expect(element).toHaveClass(densityClass(candidate));
    } else {
      expect(element).not.toHaveClass(densityClass(candidate));
    }
  }
}

/** The styled element of each header cell: the `div` inside the `th`. */
function headerCellElements() {
  return screen.getAllByRole('columnheader').map((th) => th.firstElementChild);
}

/** The first data row (index 0 is the header row). */
function firstDataRow() {
  return screen.getAllByRole('row')[1] as HTMLElement;
}

describe('Table variant', () => {
  it('should apply the cozy class to header cells and cells by default', () => {
    render(<Table columns={trackColumns} data={tracks} />);

    for (const headerCell of headerCellElements()) {
      expectDensity(headerCell, 'cozy');
    }
    for (const cell of screen.getAllByRole('cell')) {
      expectDensity(cell, 'cozy');
    }
  });

  it.each`
    variant
    ${'compact'}
    ${'crammed'}
  `(
    'should apply the $variant class to header cells and cells',
    ({ variant }: { variant: DensityVariant }) => {
      render(<Table columns={trackColumns} data={tracks} variant={variant} />);

      for (const headerCell of headerCellElements()) {
        expectDensity(headerCell, variant);
      }
      for (const cell of screen.getAllByRole('cell')) {
        expectDensity(cell, variant);
      }
    },
  );

  it('should apply the variant to numeral, selection, and kebab cells', () => {
    render(
      <Table
        columns={trackColumns}
        data={tracks}
        variant='crammed'
        showCheckbox
        persistNumerals
      />,
    );
    const row = within(firstDataRow());

    expectDensity(row.getByTestId('numeral').closest('td'), 'crammed');
    expectDensity(row.getByRole('checkbox').closest('td'), 'crammed');
    expectDensity(
      row.getByRole('button', { name: 'row 1 actions' }).closest('td'),
      'crammed',
    );
  });

  it('should keep the variant class on a hidden numeral cell', () => {
    render(
      <Table
        columns={trackColumns}
        data={tracks}
        variant='compact'
        persistNumerals={false}
      />,
    );

    const numeralCell = within(firstDataRow())
      .getByTestId('numeral')
      .closest('td');

    expect(numeralCell).toHaveClass(densityClass('compact'));
    expect(numeralCell).toHaveClass(styles.hideInRow as string);
  });

  it('should not apply a density class to rows', () => {
    render(<Table columns={trackColumns} data={tracks} variant='crammed' />);

    for (const row of screen.getAllByRole('row')) {
      for (const variant of DENSITY_VARIANTS) {
        expect(row).not.toHaveClass(densityClass(variant));
      }
    }
  });

  it('should render cozy for cells composed without a Table provider', () => {
    setup();

    for (const headerCell of headerCellElements()) {
      expectDensity(headerCell, 'cozy');
    }
    for (const cell of screen.getAllByRole('cell')) {
      expectDensity(cell, 'cozy');
    }
  });

  it('should apply a variant provided through the public TableContext to hand-composed cells', () => {
    render(
      <TableContext.Consumer>
        {(value) => (
          <TableContext.Provider value={{ ...value, variant: 'crammed' }}>
            <table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Callsign</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>AF1</TableCell>
                </TableRow>
              </TableBody>
            </table>
          </TableContext.Provider>
        )}
      </TableContext.Consumer>,
    );

    for (const headerCell of headerCellElements()) {
      expectDensity(headerCell, 'crammed');
    }
    expectDensity(screen.getByRole('cell'), 'crammed');
  });

  it.each`
    variant
    ${'compact'}
    ${'crammed'}
  `(
    'should pass compact to the row kebab menu for compact and crammed ($variant)',
    async ({ variant }: { variant: DensityVariant }) => {
      render(<Table columns={trackColumns} data={tracks} variant={variant} />);

      await userEvent.click(
        screen.getByRole('button', { name: 'row 1 actions' }),
      );

      expectMenuDensity(await screen.findByRole('menu'), 'compact');
    },
  );

  it('should pass cozy to the row kebab menu by default', async () => {
    render(<Table columns={trackColumns} data={tracks} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'row 1 actions' }),
    );

    expectMenuDensity(await screen.findByRole('menu'), 'cozy');
  });

  it('should pass cozy to the header cell menu by default', async () => {
    render(<Table columns={trackColumns} data={tracks} enableSorting />);

    await userEvent.click(
      within(screen.getByRole('columnheader', { name: /callsign/i })).getByRole(
        'button',
        { name: 'Menu' },
      ),
    );

    const menu = await screen.findByRole('menu');
    expectMenuDensity(menu, 'cozy');
    expect(
      within(menu).getByRole('menuitemradio', { name: 'Sort Ascending' }),
    ).toBeInTheDocument();
  });
});
