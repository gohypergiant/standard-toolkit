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

'use client';

import 'client-only';
import { Kebab, Pin } from '@accelint/icons';
import { useListData } from '@react-stately/data';
import {
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { TableContext } from './context';
import { TableStyles } from './styles';
import { TableBody } from './table-body';
import { TableCell } from './table-cell';
import { TableHeader } from './table-header';
import { HeaderCell } from './table-header-cell';
import { TableRow } from './table-row';
import type { Key } from '@react-types/shared';
import type { TableProps } from './types';

const { menuItem, notPersistRowKebab } = TableStyles();

type RowActionsMenuProps<T> = {
  row: Row<T>;
  rows: Row<T>[];
  moveRowsDown: (row: Row<T>, rows: Row<T>[]) => void;
  moveRowsUp: (row: Row<T>, rows: Row<T>[]) => void;
};

function RowActionsMenu<T>({
  moveRowsDown,
  moveRowsUp,
  row,
  rows,
}: RowActionsMenuProps<T>) {
  const { enableRowActions, persistRowKebabMenu } = useContext(TableContext);
  const isPinned = !!row.getIsPinned();

  return (
    enableRowActions && (
      <div className={persistRowKebabMenu ? '' : notPersistRowKebab()}>
        <Menu.Trigger>
          <Button variant='icon' aria-label='Menu'>
            <Icon>
              <Kebab />
            </Icon>
          </Button>
          <Menu>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => row.pin(isPinned ? false : 'top')}
            >
              {isPinned ? 'Unpin' : 'Pin'}
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => moveRowsUp(row, rows)}
              isDisabled={isPinned || row.index === 0}
            >
              Move Up
            </Menu.Item>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => moveRowsDown(row, rows)}
              isDisabled={isPinned || row.index === rows.length - 1}
            >
              Move Down
            </Menu.Item>
          </Menu>
        </Menu.Trigger>
      </div>
    )
  );
}

/**
 * Table - Configurable data table with sorting and row actions
 *
 * Standardizes table behavior (sorting, selection, row actions) and can be
 * used with column definitions from TanStack React Table.
 *
 * @example
 * <Table columns={columns} data={data} />
 */
export function Table<T extends { id: Key }>({
  children,
  columns: columnsProp,
  data: dataProp,
  showCheckbox,
  kebabPosition = 'right',
  persistRowKebabMenu = true,
  persistHeaderKebabMenu = true,
  persistNumerals = false,
  enableSorting = true,
  enableColumnOrdering: enableColumnReordering = true,
  enableRowActions = true,
  ...rest
}: TableProps<T>) {
  const {
    items: data,
    moveAfter,
    moveBefore,
  } = useListData({
    initialItems: dataProp,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnSelection, setColumnSelection] = useState<string | null>(null);

  /**
   * moveUpSelectedRows moves the selected rows up in the table.
   * It finds the first selected row, determines its index,
   * and moves it before the previous row if it exists.
   */
  const moveRowsUp = useCallback(
    (row: Row<T>, rows: Row<T>[]) => {
      const isSelected = rowSelection[row.id];
      const rowsToMove = isSelected
        ? rows.filter(({ id }) => rowSelection[id])
        : [row];
      const firstRowToMove = rowsToMove[0];

      if (!firstRowToMove || firstRowToMove.index === 0) {
        return;
      }

      const prevRowId = rows[firstRowToMove.index - 1]?.id;

      if (!prevRowId) {
        return;
      }

      moveBefore(
        prevRowId,
        rowsToMove.map(({ id }) => id),
      );
    },
    [rowSelection, moveBefore],
  );

  /**
   * moveDownRows moves the selected or active rows down in the table.
   * It finds the last selected row, determines its index,
   * and moves it after the next row if it exists.
   */
  const moveRowsDown = useCallback(
    (row: Row<T>, rows: Row<T>[]) => {
      const isSelected = rowSelection[row.id];
      const rowsToMove = isSelected
        ? rows.filter(({ id }) => rowSelection[id])
        : [row];
      const lastRowToMove = rowsToMove[rowsToMove.length - 1];

      if (!lastRowToMove || lastRowToMove.index === rows.length - 1) {
        return;
      }

      const nextRowId = rows[lastRowToMove.index + 1]?.id;

      if (!nextRowId) {
        return;
      }

      moveAfter(
        nextRowId,
        rowsToMove.map(({ id }) => id),
      );
    },
    [rowSelection, moveAfter],
  );

  /**
   * actionColumn defines the actions available in the kebab menu for each row.
   * It includes options to move the row up or down in the table.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: can of worms to fix ticket added
  const actionColumn: NonNullable<typeof columnsProp>[number] = useMemo(
    () => ({
      id: 'kebab',
      cell: ({ row }) => (
        <RowActionsMenu
          moveRowsUp={moveRowsUp}
          moveRowsDown={moveRowsDown}
          row={row}
          rows={getRowModel().rows}
        />
      ),
    }),
    [moveRowsUp, moveRowsDown],
  );

  /**
   * columns defines the structure of the table.
   * It includes the action column and optionally a checkbox column.
   * The kebab menu position can be set to 'left' or 'right'.
   * If showCheckbox is true, a checkbox column is added.
   */
  const columns = useMemo<NonNullable<typeof columnsProp>>(
    () => [
      {
        id: 'numeral',
        cell: ({ row }) =>
          row.getIsPinned() ? (
            <Icon size='small'>
              <Pin />
            </Icon>
          ) : (
            <span data-testid='numeral'>{row.index + 1}</span>
          ),
      },
      ...(showCheckbox
        ? ([
            {
              id: 'selection',
              header: ({ table }) => (
                <Checkbox
                  isSelected={table.getIsAllRowsSelected()}
                  isIndeterminate={table.getIsSomeRowsSelected()}
                  onChange={table.toggleAllRowsSelected}
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  isSelected={row.getIsSelected()}
                  isIndeterminate={row.getIsSomeSelected()}
                  onChange={row.toggleSelected}
                />
              ),
            },
          ] satisfies NonNullable<typeof columnsProp>)
        : []),
      ...(kebabPosition === 'left' ? [actionColumn] : []),
      ...(columnsProp ?? []),
      ...(kebabPosition === 'right' ? [actionColumn] : []),
    ],
    [showCheckbox, columnsProp, kebabPosition, actionColumn],
  );

  const {
    getHeaderGroups,
    getTopRows,
    getCenterRows,
    getBottomRows,
    getRowModel,
    setColumnOrder,
  } = useReactTable<T>({
    data,
    columns,
    enableSorting,
    initialState: {
      columnOrder: columns.map(({ id }) => id ?? ''),
    },
    state: {
      rowSelection,
    },
    getRowId: (row, index) => {
      // Use the index as the row ID if no unique identifier is available
      return row.id ? row.id.toString() : index.toString();
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel<T>(),
    getSortedRowModel: getSortedRowModel<T>(),
  });

  const moveColumnLeft = useCallback(
    (oldIndex: number) => {
      setColumnOrder((order) => {
        const newColumnOrder = [...order];
        const newIndex = oldIndex - 1;

        if (newIndex < 0) {
          return order;
        }

        [newColumnOrder[oldIndex], newColumnOrder[newIndex]] = [
          newColumnOrder[newIndex] as string,
          newColumnOrder[oldIndex] as string,
        ];

        return newColumnOrder;
      });
    },
    [setColumnOrder],
  );

  const moveColumnRight = useCallback(
    (oldIndex: number) => {
      setColumnOrder((order) => {
        const newColumnOrder = [...order];
        const newIndex = oldIndex + 1;

        if (newIndex >= order.length) {
          return order;
        }

        [newColumnOrder[oldIndex], newColumnOrder[newIndex]] = [
          newColumnOrder[newIndex] as string,
          newColumnOrder[oldIndex] as string,
        ];

        return newColumnOrder;
      });
    },
    [setColumnOrder],
  );

  if (children) {
    return <table {...rest}>{children}</table>;
  }

  return (
    <TableContext.Provider
      value={{
        persistRowKebabMenu,
        persistHeaderKebabMenu,
        persistNumerals,
        enableSorting,
        enableColumnReordering,
        enableRowActions,
        columnSelection,
        setColumnSelection,
        moveColumnLeft,
        moveColumnRight,
      }}
    >
      <table {...rest}>
        <TableHeader
          headerGroups={getHeaderGroups()}
          columnSelection={columnSelection}
        />
        <TableBody
          rows={[...getTopRows(), ...getCenterRows(), ...getBottomRows()]}
        />
      </table>
    </TableContext.Provider>
  );
}

Table.displayName = 'Table';
Table.Body = TableBody;
Table.Cell = TableCell;
Table.Header = TableHeader;
Table.HeaderCell = HeaderCell;
Table.Row = TableRow;
