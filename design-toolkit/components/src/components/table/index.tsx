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
  type ColumnOrderState,
  type Row,
  type RowSelectionState,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { createContext, useCallback, useMemo, useState } from 'react';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { TableStyles } from './styles';
import { TableBody } from './table-body';
import { TableCell } from './table-cell';
import { TableHeader } from './table-header';
import { HeaderCell } from './table-header-cell';
import { TableRow } from './table-row';
import {
  RowKebabMenuItems,
  type TableContextValue,
  type TableProps,
} from './types';

const { pinIcon, rowCell, rowKebab, menuItem } = TableStyles();

// Only keep values in context that are needed across multiple component levels
export const TableContext = createContext<TableContextValue>({
  moveColumnLeft: () => undefined,
  moveColumnRight: () => undefined,
  setColumnSelection: () => null,
  columnSelection: null,
  persistRowKebabMenu: true,
  persistHeaderKebabMenu: true,
  enableSorting: true,
  enableColumnReordering: true,
  enableRowActions: true,
});

export function Table<T extends { id: string | number }>({
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
  ...props
}: TableProps<T>) {
  const {
    items: data,
    moveAfter,
    moveBefore,
  } = useListData({
    initialItems: dataProp,
  });
  const dataIds = useMemo(() => data?.map((item: T) => item.id), [data]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnSelection, setColumnSelection] = useState<string | null>(null);

  /**
   * moveUpSelectedRows moves the selected rows up in the table.
   * It finds the first selected row, determines its index,
   * and moves it before the previous row if it exists.
   */
  const moveUpSelectedRows = useCallback(
    (row: Row<T>) => {
      const hasRowSelection =
        Object.keys(rowSelection).length !== 0 &&
        Object.hasOwn(rowSelection, row.id);
      const rowSelectionKeys = Object.keys(rowSelection).filter(
        (id) => rowSelection[id],
      );
      const rowsToMove = hasRowSelection
        ? data.filter((item: T) =>
            rowSelectionKeys.includes(item.id.toString()),
          )
        : [row];
      const firstSelectedRowId = rowsToMove[0]?.id;

      if (firstSelectedRowId) {
        const rowIndex = dataIds.indexOf(firstSelectedRowId);
        const prevRowId = dataIds[rowIndex ? rowIndex - 1 : 0];

        if (prevRowId) {
          const rowsToMoveKeys = hasRowSelection ? rowSelectionKeys : [row.id];

          moveBefore?.(prevRowId, rowsToMoveKeys);
        }
      }
    },
    [data, dataIds, rowSelection, moveBefore],
  );

  // /**
  //  * moveDownRows moves the selected or active rows down in the table.
  //  * It finds the last selected row, determines its index,
  //  * and moves it after the next row if it exists.
  //  */

  const moveDownRows = useCallback(
    (row: Row<T>) => {
      const hasRowSelection =
        Object.keys(rowSelection).length !== 0 &&
        Object.hasOwn(rowSelection, row.id);
      const rowSelectionKeys = Object.keys(rowSelection).filter(
        (id) => rowSelection[id],
      );
      const rowsToMove = hasRowSelection
        ? data.filter((item: T) =>
            rowSelectionKeys.includes(item.id.toString()),
          )
        : [row];
      const lastSelectedRowId = rowsToMove[rowsToMove.length - 1]?.id;

      if (lastSelectedRowId) {
        const rowIndex = dataIds.indexOf(lastSelectedRowId);
        const nextRowId =
          dataIds[
            rowIndex < dataIds.length - 1 ? rowIndex + 1 : dataIds.length - 1
          ];

        if (nextRowId) {
          const rowsToMoveKeys = hasRowSelection ? rowSelectionKeys : [row.id];

          moveAfter?.(nextRowId, rowsToMoveKeys);
        }
      }
    },
    [data, dataIds, rowSelection, moveAfter],
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

  const moveColumnLeft = useCallback(
    (oldIndex: number) => {
      setColumnOrderCallback((order: string[]) => {
        const newColumnOrder = [...order];
        const newIndex = oldIndex - 1;
        if (newIndex < 0) {
          return order;
        }

        newColumnOrder.splice(
          newIndex,
          0,
          newColumnOrder.splice(oldIndex, 1)[0] ?? '',
        );
        return newColumnOrder;
      });
    },
    [setColumnOrderCallback],
  );

  const moveColumnRight = useCallback(
    (oldIndex: number) => {
      setColumnOrderCallback((order: string[]) => {
        const newColumnOrder = [...order];
        const newIndex = oldIndex + 1;
        if (newIndex >= newColumnOrder.length) {
          return order;
        }

        newColumnOrder.splice(
          newIndex,
          0,
          newColumnOrder.splice(oldIndex, 1)[0] ?? '',
        );
        return newColumnOrder;
      });
    },
    [setColumnOrderCallback],
  );

  if (!dataProp) {
    return <table>{props.children}</table>;
  }

  return (
    <TableContext.Provider
      value={{
        moveColumnLeft,
        moveColumnRight,
        persistRowKebabMenu,
        persistHeaderKebabMenu,
        enableSorting,
        enableColumnReordering,
        enableRowActions,
        columnSelection,
        setColumnSelection,
      }}
    >
      <table {...props}>
        <TableHeader
          headerGroups={getHeaderGroups()}
          columnSelection={columnSelection}
        />
        <TableBody
          topRows={getTopRows()}
          centerRows={getCenterRows()}
          bottomRows={getBottomRows()}
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
