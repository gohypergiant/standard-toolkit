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

import { Kebab } from '@accelint/icons';
import Pin from '@accelint/icons/pin';
import { useListData } from '@react-stately/data';
import {
  type ColumnOrderState,
  type RowSelectionState,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { useColumnMovement } from './hooks/use-column-movement';
import { useRowMovement } from './hooks/use-row-movement';
import { TableStyles } from './styles';
import { TableBody } from './table-body';
import { TableCell } from './table-cell';
import { TableHeader } from './table-header';
import { HeaderCell } from './table-header-cell';
import { TableRow } from './table-row';
import { RowKebabMenuItems, type TableProps } from './types';

const { pinIcon, rowCell, rowKebab, menuItem } = TableStyles();

const TableDefaultProps = {
  kebabPosition: 'right',
  persistRowKebabMenu: true,
  persistHeaderKebabMenu: true,
  persistNumerals: false,
  pageSize: 10,
  enableSorting: true,
  enableColumnReordering: true,
  enableRowActions: true,
} as const;

export function Table<T extends { id: string | number }>({
  columns: columnsProp,
  data: dataProp,
  showCheckbox,
  kebabPosition = TableDefaultProps.kebabPosition,
  persistRowKebabMenu = TableDefaultProps.persistRowKebabMenu,
  persistHeaderKebabMenu = TableDefaultProps.persistHeaderKebabMenu,
  persistNumerals = TableDefaultProps.persistNumerals,
  pageSize = TableDefaultProps.pageSize,
  enableSorting = TableDefaultProps.enableSorting,
  enableColumnOrdering:
    enableColumnReordering = TableDefaultProps.enableColumnReordering,
  enableRowActions = TableDefaultProps.enableRowActions,
  ...props
}: TableProps<T>) {
  const {
    items: data,
    moveAfter,
    moveBefore,
  } = useListData({
    initialItems: dataProp,
  });

  const dataIds = useMemo<(string | number)[]>(
    () => data?.map((item: T) => item.id),
    [data],
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnSelection, setColumnSelection] = useState<string | null>();

  const { moveUpSelectedRows, moveDownRows } = useRowMovement<T>(
    data,
    dataIds,
    rowSelection,
    moveBefore,
    moveAfter,
  );
  /**
   * actionColumn defines the actions available in the kebab menu for each row.
   * It includes options to move the row up or down in the table.
   */
  const actionColumn: NonNullable<typeof columnsProp>[number] = useMemo(
    () => ({
      id: 'kebab',
      cell: ({ row }) => {
        const isPinned = row.getIsPinned();
        return (
          enableRowActions && (
            <div
              className={rowKebab({
                persistKebab: persistRowKebabMenu,
              })}
            >
              <Menu.Trigger>
                <Button variant='icon' aria-label='Menu'>
                  <Icon>
                    <Kebab />
                  </Icon>
                </Button>
                <Menu>
                  <Menu.Item
                    classNames={{ item: menuItem() }}
                    onAction={() => {
                      row.pin(isPinned ? false : 'top');
                    }}
                  >
                    <Menu.Item.Label>
                      {isPinned
                        ? RowKebabMenuItems.Unpin
                        : RowKebabMenuItems.Pin}
                    </Menu.Item.Label>
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item
                    classNames={{ item: menuItem() }}
                    onAction={() => {
                      moveUpSelectedRows(row);
                    }}
                    isDisabled={row.index === 0}
                  >
                    <Menu.Item.Label>
                      {RowKebabMenuItems.MoveUp}
                    </Menu.Item.Label>
                  </Menu.Item>
                  <Menu.Item
                    classNames={{ item: menuItem() }}
                    onAction={() => {
                      moveDownRows(row);
                    }}
                    isDisabled={row.index === getRowModel().rows.length - 1}
                  >
                    <Menu.Item.Label>
                      {RowKebabMenuItems.MoveDown}
                    </Menu.Item.Label>
                  </Menu.Item>
                </Menu>
              </Menu.Trigger>
            </div>
          )
        );
      },
    }),
    [moveUpSelectedRows, moveDownRows, persistRowKebabMenu, enableRowActions],
  );

  /**
   * columns defines the structure of the table.
   * It includes the action column and optionally a checkbox column.
   * The kebab menu position can be set to 'left' or 'right'.
   * If showCheckbox is true, a checkbox column is added.
   */
  const columns = useMemo<NonNullable<typeof columnsProp>>(() => {
    const columns = [...(columnsProp || [])];

    if (kebabPosition === 'left') {
      columns.unshift(actionColumn);
    } else if (kebabPosition === 'right') {
      columns.push(actionColumn);
    }

    if (showCheckbox) {
      columns.unshift({
        id: 'selection',
        header: ({ table }) => (
          <Checkbox
            isSelected={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={table.toggleAllRowsSelected}
            slot='selection'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            isSelected={row.getIsSelected()}
            isIndeterminate={row.getIsSomeSelected()}
            onChange={row.toggleSelected}
            slot='selection'
          />
        ),
      });
    }

    return [
      {
        id: 'numeral',
        cell: ({ row }) =>
          row.getIsPinned() ? (
            <Icon size='small' className={pinIcon()}>
              <Pin />
            </Icon>
          ) : (
            <span
              className={rowCell({ persistNums: persistNumerals })}
              data-testid='numeral'
            >
              {row.index + 1}
            </span>
          ),
      },
      ...columns,
    ];
  }, [showCheckbox, columnsProp, kebabPosition, actionColumn, persistNumerals]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((col) => col.id as string),
  );

  const {
    getHeaderGroups,
    getTopRows,
    getCenterRows,
    getBottomRows,
    getRowModel,
    setColumnOrder: setColumnOrderCallback,
  } = useReactTable<T>({
    data: data,
    columns,
    enableSorting,
    state: {
      rowSelection,
      sorting,
      columnOrder,
      columnPinning: {
        left: [
          'numeral',
          'selection',
          ...(kebabPosition === 'left' ? ['kebab'] : []),
        ],
        right: kebabPosition === 'left' ? [] : ['kebab'],
      },
    },
    getRowId: (row, index) => {
      // Use the index as the row ID if no unique identifier is available
      return row.id ? row.id.toString() : index.toString();
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel<T>(),
    getSortedRowModel: getSortedRowModel<T>(),
  });

  const { moveColumnLeft, moveColumnRight } = useColumnMovement(
    setColumnOrderCallback,
  );

  if (dataProp) {
    return (
      <div>
        <table {...props}>
          <TableHeader>
            {getHeaderGroups().map((headerGroup) => (
              <tr>
                {headerGroup.headers.map((header) => {
                  return (
                    <HeaderCell
                      key={header.id}
                      narrow={
                        header.column.id === 'numeral' ||
                        header.column.id === 'kebab'
                      }
                      data-selected={
                        header.column.id === columnSelection ? '' : undefined
                      }
                      header={header}
                      enableColumnReordering={enableColumnReordering}
                      enableSorting={enableSorting}
                      moveColumnLeft={moveColumnLeft}
                      moveColumnRight={moveColumnRight}
                      persistHeaderKebabMenu={persistHeaderKebabMenu}
                    ></HeaderCell>
                  );
                })}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {getTopRows().map((row) => (
              <TableRow
                key={row.id}
                row={row}
                {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
                persistRowKebabMenu={persistHeaderKebabMenu}
                persistNumerals={persistNumerals}
                data-pinned={row.getIsPinned()}
              ></TableRow>
            ))}
            {getCenterRows().map((row) => (
              <TableRow
                key={row.id}
                row={row}
                {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
                persistRowKebabMenu={persistHeaderKebabMenu}
                persistNumerals={persistNumerals}
                data-pinned={row.getIsPinned()}
              ></TableRow>
            ))}
            {getBottomRows().map((row) => (
              <TableRow
                key={row.id}
                row={row}
                {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
                persistRowKebabMenu={persistHeaderKebabMenu}
                persistNumerals={persistNumerals}
                data-pinned={row.getIsPinned()}
              ></TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    );
  }

  return <table {...props} />;
}

Table.displayName = 'Table';
Table.Body = TableBody;
Table.Cell = TableCell;
Table.Header = TableHeader;
Table.HeaderCell = HeaderCell;
Table.Row = TableRow;
