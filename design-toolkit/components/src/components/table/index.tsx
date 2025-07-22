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

import ArrowDown from '@accelint/icons/arrow-down';
import ArrowUp from '@accelint/icons/arrow-up';
import ChevronLeft from '@accelint/icons/chevron-left';
import ChevronRight from '@accelint/icons/chevron-right';
import Kebab from '@accelint/icons/kebab';
import Pin from '@accelint/icons/pin';
import { useListData } from '@react-stately/data';
import {
  type Cell,
  type ColumnOrderState,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { Input as AriaInput } from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
// import { IconButton } from '../icon-button';
import { ActionsCell } from './actions-cell';
import { TableBody } from './table-body';
import { TableCell } from './table-cell';
import { TableHeader } from './table-header';
import { HeaderCell } from './table-header-cell';
import { TableRow } from './table-row';
import type { TableProps } from './types';

const MAX_VISIBLE_PAGES = 5;

const range = (lo: number, hi: number) =>
  Array.from({ length: hi - lo }, (_, i) => i + lo);

const pagination = (page: number, total: number) => {
  const start = Math.max(
    1,
    Math.min(
      page - Math.floor((MAX_VISIBLE_PAGES - 3) / 2),
      total - MAX_VISIBLE_PAGES + 2,
    ),
  );
  const end = Math.min(
    total,
    Math.max(
      page + Math.floor((MAX_VISIBLE_PAGES - 2) / 2),
      MAX_VISIBLE_PAGES - 1,
    ),
  );
  return [
    ...(start > 2 ? ([1, 'ellipsis'] as const) : start > 1 ? [1] : []),
    ...range(start, end + 1),
    ...(end < total - 1
      ? (['ellipsis', total] as const)
      : end < total
        ? [total]
        : []),
  ];
};

const dataTableCell = <T,>(cell: Cell<T, unknown>, persistent: boolean) => (
  <TableCell
    key={cell.id}
    persistent={persistent}
    narrow={cell.column.id === 'numeral' || cell.column.id === 'kebab'}
    numeral={cell.column.id === 'numeral'}
    kebab={cell.column.id === 'kebab'}
    style={{ width: cell.column.getSize() }}
  >
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </TableCell>
);

const TableDefaultProps = {
  kebabPosition: 'right',
  persistRowKebabMenu: true,
  persistHeaderKebabMenu: true,
  persistNumerals: false,
  pageSize: 10,
  enableSorting: true,
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
  const actionColumn: NonNullable<typeof columnsProp>[number] = useMemo(
    () => ({
      id: 'kebab',
      cell: ({ row }) => {
        const isPinned = row.getIsPinned();
        return (
          <ActionsCell
            persistent={persistRowKebabMenu}
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
                label: 'Move row up',
                onAction: () => {
                  const rowIndex = dataIds.indexOf(row.id);
                  const prevRowId = dataIds[rowIndex ? rowIndex - 1 : 0];
                  if (rowIndex > 0 && prevRowId) {
                    moveBefore?.(prevRowId, [row.id]);
                  }
                },
              },
              {
                label: 'Move row down',
                onAction: () => {
                  const rowIndex = dataIds.indexOf(row.id);
                  const nextRowId =
                    dataIds[
                      rowIndex < dataIds.length - 1
                        ? rowIndex + 1
                        : dataIds.length - 1
                    ];
                  if (rowIndex < dataIds.length - 1 && nextRowId) {
                    moveAfter?.(nextRowId, [row.id]);
                  }
                },
              },
            ]}
          >
            <Kebab />
          </ActionsCell>
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
        >
          <Kebab />
        </ActionsCell>
      ),
    }),
    [
      dataIds,
      moveBefore,
      moveAfter,
      moveUpSelectedRows,
      moveDownSelectedRows,
      activeRow,
      persistRowKebabMenu,
    ],
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

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((col) => col.id as string),
  );

  const {
    getHeaderGroups,
    getTopRows,
    getCenterRows,
    getBottomRows,
    setPageIndex,
    getCanPreviousPage,
    getCanNextPage,
    previousPage,
    nextPage,
    getPageCount,
    getState,
    setColumnOrder: setColumnOrderCallback,
  } = useReactTable<T>({
    data: data,
    columns,
    enableSorting,
    initialState: {
      pagination: { pageIndex: 0, pageSize },
    },
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
    getPaginationRowModel: getPaginationRowModel<T>(),
  });

  const moveColumnLeft = useCallback(
    (oldIndex: number) => {
      setColumnOrderCallback((order) => {
        const newColumnOrder = [...order];
        const newIndex = oldIndex - 1;
        if (newIndex < 0) {
          return order;
        }
        newColumnOrder.splice(
          newIndex,
          0,
          newColumnOrder.splice(oldIndex, 1)[0] as string,
        );
        return newColumnOrder;
      });
    },
    [setColumnOrderCallback],
  );

  const moveColumnRight = useCallback(
    (oldIndex: number) => {
      setColumnOrderCallback((order) => {
        const newColumnOrder = [...order];
        const newIndex = oldIndex + 1;
        if (newIndex >= newColumnOrder.length) {
          return order;
        }
        newColumnOrder.splice(
          newIndex,
          0,
          newColumnOrder.splice(oldIndex, 1)[0] as string,
        );
        return newColumnOrder;
      });
    },
    [setColumnOrderCallback],
  );

  if (dataProp) {
    return (
      <div>
        <table {...props}>
          <TableHeader>
            {getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> */}
                {headerGroup.headers.map((header) => (
                  <HeaderCell
                    key={header.id}
                    narrow={
                      header.column.id === 'numeral' ||
                      header.column.id === 'kebab'
                    }
                    style={{ width: header.getSize() }}
                  >
                    <div className='flex items-center justify-between gap-xxs'>
                      {header.isPlaceholder ||
                      header.column.id === 'kebab' ? null : (
                        <button
                          type='button'
                          onClick={header.column.getToggleSortingHandler?.()}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: header.column.getCanSort()
                              ? 'pointer'
                              : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                          }}
                          disabled={!header.column.getCanSort()}
                          aria-label={
                            header.column.getIsSorted()
                              ? `Sorted ${header.column.getIsSorted() === 'asc' ? 'ascending' : 'descending'}`
                              : 'Not sorted'
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </button>
                      )}

                      {['numeral', 'kebab', 'selection'].includes(
                        header.column.id,
                      ) ? null : (
                        <ActionsCell
                          persistent={persistHeaderKebabMenu}
                          actions={[
                            {
                              label: 'Move column left',
                              onAction: () =>
                                header.column.getIsFirstColumn('center')
                                  ? undefined
                                  : moveColumnLeft(header.column.getIndex()),
                            },
                            {
                              label: 'Move column right',
                              onAction: () =>
                                header.column.getIsLastColumn('center')
                                  ? undefined
                                  : moveColumnRight(header.column.getIndex()),
                            },
                            ...(header.column.getIsSorted() === 'asc'
                              ? [
                                  {
                                    label: 'Clear sort',
                                    onAction: () =>
                                      header.column.clearSorting(),
                                  },
                                ]
                              : [
                                  {
                                    label: 'Sort ascending',
                                    onAction: () =>
                                      header.column.toggleSorting(false),
                                  },
                                ]),
                            ...(header.column.getIsSorted() === 'desc'
                              ? [
                                  {
                                    label: 'Clear sort',
                                    onAction: () =>
                                      header.column.clearSorting(),
                                  },
                                ]
                              : [
                                  {
                                    label: 'Sort descending',
                                    onAction: () =>
                                      header.column.toggleSorting(true),
                                  },
                                ]),
                          ]}
                        >
                          {header.column.getIsSorted() === 'asc' ? (
                            <ArrowUp />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ArrowDown />
                          ) : (
                            <Kebab />
                          )}
                        </ActionsCell>
                      )}
                    </div>
                  </HeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Top Rows */}
            {getTopRows().map((row) => (
              <TableRow
                key={row.id}
                {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
                data-active={activeRow === row.id}
                data-pinned={row.getIsPinned()}
              >
                {row.getVisibleCells().map((cell) =>
                  dataTableCell(
                    cell,
                    cell.column.id === 'kebab' ? persistRowKebabMenu : true, // not accounting for numeral here, as these rows are pinned, and numerals are not shown
                  ),
                )}
              </TableRow>
            ))}
            {getCenterRows().map((row) => (
              <TableRow
                key={row.id}
                {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
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
                          ? persistRowKebabMenu
                          : true,
                    ),
                  )}
              </TableRow>
            ))}
            {getBottomRows().map((row) => (
              <TableRow
                key={row.id}
                {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
                data-active={activeRow === row.id}
                data-pinned={row.getIsPinned()}
              >
                {row.getVisibleCells().map((cell) =>
                  dataTableCell(
                    cell,
                    cell.column.id === 'kebab' ? persistRowKebabMenu : true, // not accounting for numeral here, as these rows are pinned, and numerals are not shown
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </table>

        {/* Pagination (Placeholder until we have a proper pagination component) */}
        <div className='flex items-center gap-xxs'>
          <Button
            variant='icon'
            onPress={() => previousPage()}
            isDisabled={!getCanPreviousPage()}
            className='min-h-[32px] min-w-[32px] rounded-medium'
          >
            <ChevronLeft />
          </Button>

          {pagination(getState().pagination.pageIndex + 1, getPageCount()).map(
            (page) => {
              if (page === 'ellipsis') {
                return (
                  <span key={page} className='text-default-light'>
                    ...
                  </span>
                );
              }

              // Will move to pagination component once we have one
              const paginationButtonStyles = tv({
                base: 'min-h-[32px] min-w-[32px] rounded-medium border-1 border-transparent bg-transparent px-s font-display text-default-light hover:bg-interactive-hover-dark focus:bg-interactive-hover-dark ',
                variants: {
                  selected: {
                    true: 'border-highlight-bold bg-highlight-subtle text-highlight-bold',
                  },
                },
              });

              return (
                <Button
                  key={page}
                  className={paginationButtonStyles({
                    selected: getState().pagination.pageIndex + 1 === page,
                  })}
                  onPress={() => setPageIndex(page - 1)}
                  isDisabled={getState().pagination.pageIndex + 1 === page}
                  data-selected={getState().pagination.pageIndex + 1 === page}
                  type='button'
                  variant='flat'
                >
                  {page}
                </Button>
              );
            },
          )}

          <Button
            variant='icon'
            onPress={() => nextPage()}
            isDisabled={!getCanNextPage()}
            className='min-h-[32px] min-w-[32px] rounded-medium'
          >
            <ChevronRight />
          </Button>

          <span className='flex items-center gap-s text-default-light'>
            Page{' '}
            <AriaInput
              type='number'
              min='1'
              max={getPageCount()}
              value={(getState().pagination.pageIndex + 1).toString()}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                setPageIndex(page);
              }}
              className='w-16 rounded-medium border border-interactive px-s py-xs font-display'
            />
          </span>
        </div>
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
Table.ActionsCell = ActionsCell;
