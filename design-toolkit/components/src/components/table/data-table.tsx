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

import Pin from '@accelint/icons/pin';
import { useListData } from '@react-stately/data';
import {
  type Cell,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { ActionsCell } from './actions-cell';
import { Table } from './index';

const dataTableCell = <T,>(cell: Cell<T, unknown>, persistent: boolean) => (
  <Table.Cell
    key={cell.id}
    persistent={persistent}
    narrow={cell.column.id === 'numeral' || cell.column.id === 'kebab'}
    numeral={cell.column.id === 'numeral'}
  >
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </Table.Cell>
);

/**
 * TableProps defines the properties for the Table component.
 * It includes the columns, data, and optional properties for checkbox display,
 * kebab menu position, and persistence of kebab and numeral columns.
 *
 * @template T - The type of data in the table, which must have a unique 'id' property.
 */
export interface DataTableProps<T extends { id: string | number }> {
  columns: {
    [K in keyof Required<T>]: ColumnDef<T, T[K]>;
  }[keyof T][];
  data: T[];
  showCheckbox?: boolean;
  kebabPosition?: 'left' | 'right';
  persistKebab?: boolean;
  persistNumerals?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  columns: columnsProp,
  data: dataProp,
  showCheckbox,
  kebabPosition = 'right',
  persistKebab = false,
  persistNumerals = false,
}: DataTableProps<T>) {
  const {
    items: data,
    moveAfter,
    moveBefore,
  } = useListData({
    initialItems: dataProp,
  });

  const dataIds = useMemo<(string | number)[]>(
    () => data?.map(({ id }) => id),
    [data],
  );

  const [activeRow, setActiveRow] = useState<string | number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  /**
   * moveUpSelectedRows moves the selected rows up in the table.
   * It finds the first selected row, determines its index,
   * and moves it before the previous row if it exists.
   */
  const moveUpSelectedRows = useCallback(() => {
    const rowSelectionKeys = Object.keys(rowSelection).filter(
      (id) => rowSelection[id],
    );
    const selectedRows = data.filter((item) =>
      rowSelectionKeys.includes(item.id.toString()),
    );

    const firstSelectedRowId = selectedRows[0]?.id;
    if (firstSelectedRowId) {
      const rowIndex = dataIds.indexOf(firstSelectedRowId);

      const prevRowId = dataIds[rowIndex ? rowIndex - 1 : 0];

      if (prevRowId) {
        moveBefore?.(prevRowId, rowSelectionKeys);
      }
    }
  }, [data, dataIds, rowSelection, moveBefore]);

  /**
   * moveDownSelectedRows moves the selected rows down in the table.
   * It finds the last selected row, determines its index,
   * and moves it after the next row if it exists.
   */
  const moveDownSelectedRows = useCallback(() => {
    const rowSelectionKeys = Object.keys(rowSelection).filter(
      (id) => rowSelection[id],
    );
    const selectedRows = data.filter((item) =>
      rowSelectionKeys.includes(item.id.toString()),
    );

    const lastSelectedRowId = selectedRows[selectedRows.length - 1]?.id;
    if (lastSelectedRowId) {
      const rowIndex = dataIds.indexOf(lastSelectedRowId);

      const nextRowId =
        dataIds[
          rowIndex < dataIds.length - 1 ? rowIndex + 1 : dataIds.length - 1
        ];

      if (nextRowId) {
        moveAfter?.(nextRowId, rowSelectionKeys);
      }
    }
  }, [data, dataIds, rowSelection, moveAfter]);

  /**
   * actionColumn defines the actions available in the kebab menu for each row.
   * It includes options to move the row up or down in the table.
   */
  const actionColumn: (typeof columnsProp)[number] = useMemo(
    () => ({
      id: 'kebab',
      cell: ({ row }) => {
        const isPinned = row.getIsPinned();
        return (
          <ActionsCell
            isOpen={activeRow === row.id}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                setActiveRow(row.id);
              } else {
                setActiveRow(null);
              }
            }}
            actions={[
              ...(row.getIsPinned()
                ? [{ label: 'Unpin', onAction: () => row.pin(false) }]
                : []),
              ...(['top', false].includes(isPinned)
                ? [
                    {
                      label: 'Pin to bottom',
                      onAction: () => row.pin('bottom'),
                    },
                  ]
                : []),
              ...(['bottom', false].includes(isPinned)
                ? [
                    {
                      label: 'Pin to top',
                      onAction: () => row.pin('top'),
                    },
                  ]
                : []),

              {
                label: 'Move up',
                onAction: () => {
                  const prevRowId = dataIds[row.index - 1];
                  if (row.index > 0 && prevRowId) {
                    moveBefore?.(prevRowId, [row.id]);
                  }
                },
              },
              {
                label: 'Move down',
                onAction: () => {
                  const nextRowId = dataIds[row.index + 1];
                  if (row.index < dataIds.length - 1 && nextRowId) {
                    moveAfter?.(nextRowId, [row.id]);
                  }
                },
              },
            ]}
          />
        );
      },
      header: () => (
        <ActionsCell
          actions={[
            {
              label: 'Move up',
              onAction: moveUpSelectedRows,
            },
            {
              label: 'Move down',
              onAction: moveDownSelectedRows,
            },
          ]}
        />
      ),
    }),
    [
      dataIds,
      moveBefore,
      moveAfter,
      moveUpSelectedRows,
      moveDownSelectedRows,
      activeRow,
    ],
  );

  /**
   * columns defines the structure of the table.
   * It includes the action column and optionally a checkbox column.
   * The kebab menu position can be set to 'left' or 'right'.
   * If showCheckbox is true, a checkbox column is added.
   */
  const columns = useMemo<typeof columnsProp>(() => {
    const columns = [...columnsProp];

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
            <Icon size='small' className='mx-auto block'>
              <Pin />
            </Icon>
          ) : (
            <span className='mx-auto block text-center'>{row.index + 1}</span>
          ),
      },
      ...columns,
    ];
  }, [showCheckbox, columnsProp, kebabPosition, actionColumn]);

  const { getHeaderGroups, getTopRows, getCenterRows, getBottomRows } =
    useReactTable<T>({
      data: data,
      columns,
      enableSorting: true,
      state: {
        rowSelection,
        sorting,
      },
      getRowId: (row, index) => {
        // Use the index as the row ID if no unique identifier is available
        return row.id ? row.id.toString() : index.toString();
      },
      enableRowSelection: true,
      onSortingChange: setSorting,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel<T>(),
      getSortedRowModel: getSortedRowModel<T>(),
    });

  return (
    <Table>
      <Table.Header>
        {getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <Table.HeaderCell
                  key={header.id}
                  narrow={
                    header.column.id === 'numeral' ||
                    header.column.id === 'kebab'
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {getTopRows().map((row) => (
          <Table.Row
            key={row.id}
            data-selected={row.getIsSelected()}
            data-active={activeRow === row.id}
            data-pinned={row.getIsPinned()}
          >
            {row.getVisibleCells().map((cell) =>
              dataTableCell(
                cell,
                cell.column.id === 'kebab' ? persistKebab : true, // not accounting for numeral here, as these rows are pinned, and numerals are not shown
              ),
            )}
          </Table.Row>
        ))}
        {getCenterRows().map((row) => (
          <Table.Row
            key={row.id}
            data-selected={row.getIsSelected()}
            data-active={activeRow === row.id}
            data-pinned={row.getIsPinned()}
          >
            {row
              .getVisibleCells()
              .map((cell) =>
                dataTableCell(
                  cell,
                  cell.column.id === 'numeral'
                    ? persistNumerals
                    : cell.column.id === 'kebab'
                      ? persistKebab
                      : true,
                ),
              )}
          </Table.Row>
        ))}
        {getBottomRows().map((row) => (
          <Table.Row
            key={row.id}
            data-selected={row.getIsSelected()}
            data-active={activeRow === row.id}
            data-pinned={row.getIsPinned()}
          >
            {row.getVisibleCells().map((cell) =>
              dataTableCell(
                cell,
                cell.column.id === 'kebab' ? persistKebab : true, // not accounting for numeral here, as these rows are pinned, and numerals are not shown
              ),
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
