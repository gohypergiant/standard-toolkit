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

import { ArrowDown, ArrowUp, Kebab } from '@accelint/icons';
import Pin from '@accelint/icons/pin';
import { useListData } from '@react-stately/data';
import {
  type Cell,
  type ColumnOrderState,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
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
  ColumnKebabMenuItems,
  RowKebabMenuItems,
  type TableProps,
} from './types';

const { headerCellButton, pinIcon, rowCell, rowKebab, headerKebab } =
  TableStyles();

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
    () => data?.map((item: T) => item.id),
    [data],
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [hoveredArrow, setHoveredArrow] = useState<boolean>(false);

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
    const selectedRows = data.filter((item: any) =>
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
    const selectedRows = data.filter((item: any) =>
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
          <>
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
                  <Menu.Item onAction={moveUpSelectedRows}>
                    <Menu.Item.Label>
                      {RowKebabMenuItems.MoveUp}
                    </Menu.Item.Label>
                  </Menu.Item>
                  <Menu.Item onAction={moveDownSelectedRows}>
                    <Menu.Item.Label>
                      {RowKebabMenuItems.MoveDown}
                    </Menu.Item.Label>
                  </Menu.Item>
                </Menu>
              </Menu.Trigger>
            </div>
          </>
        );
      },
    }),
    [
      dataIds,
      moveBefore,
      moveAfter,
      moveUpSelectedRows,
      moveDownSelectedRows,
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
  }, [showCheckbox, columnsProp, kebabPosition, actionColumn]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((col) => col.id as string),
  );

  const {
    getHeaderGroups,
    getTopRows,
    getCenterRows,
    getBottomRows,
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
              <TableRow key={headerGroup.id} data-top>
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
                    <div className={headerCellButton()}>
                      <button type='button'>
                        {header.isPlaceholder ||
                        header.column.id === 'kebab' ? null : (
                          <button
                            type='button'
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
                      </button>

                      {['numeral', 'kebab', 'selection'].includes(
                        header.column.id,
                      ) ? null : (
                        <Menu.Trigger>
                          <Button variant='icon' aria-label='Menu'>
                            <Icon>
                              {header.column.getIsSorted() === 'asc' ? (
                                <div
                                  onMouseEnter={() => setHoveredArrow(true)}
                                  onMouseLeave={() => setHoveredArrow(false)}
                                >
                                  {hoveredArrow ? <Kebab /> : <ArrowUp />}
                                </div>
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <div
                                  onMouseEnter={() => setHoveredArrow(true)}
                                  onMouseLeave={() => setHoveredArrow(false)}
                                >
                                  {hoveredArrow ? <Kebab /> : <ArrowDown />}
                                </div>
                              ) : (
                                <div
                                  className={headerKebab({
                                    persistKebab: persistHeaderKebabMenu,
                                  })}
                                >
                                  <Kebab />
                                </div>
                              )}
                            </Icon>
                          </Button>
                          <Menu>
                            <Menu.Item
                              onAction={() => {
                                moveColumnLeft(header.column.getIndex());
                              }}
                              isDisabled={header.column.getIsFirstColumn(
                                'center',
                              )}
                            >
                              <Menu.Item.Label>
                                {ColumnKebabMenuItems.Left}
                              </Menu.Item.Label>
                            </Menu.Item>
                            <Menu.Item
                              onAction={() => {
                                moveColumnRight(header.column.getIndex());
                              }}
                              isDisabled={header.column.getIsLastColumn(
                                'center',
                              )}
                            >
                              <Menu.Item.Label>
                                {ColumnKebabMenuItems.Right}
                              </Menu.Item.Label>
                            </Menu.Item>
                            {enableSorting && (
                              <>
                                <Menu.Separator />
                                <Menu.Item
                                  onAction={() => {
                                    header.column.toggleSorting(false);
                                  }}
                                  isDisabled={
                                    header.column.getIsSorted() === 'asc'
                                  }
                                >
                                  <Menu.Item.Label>
                                    {ColumnKebabMenuItems.Asc}
                                  </Menu.Item.Label>
                                </Menu.Item>
                                <Menu.Item
                                  onAction={() => {
                                    header.column.toggleSorting(true);
                                  }}
                                  isDisabled={
                                    header.column.getIsSorted() === 'desc'
                                  }
                                >
                                  <Menu.Item.Label>
                                    {ColumnKebabMenuItems.Desc}
                                  </Menu.Item.Label>
                                </Menu.Item>
                                <Menu.Item
                                  onAction={() => {
                                    header.column.clearSorting();
                                  }}
                                  isDisabled={!header.column.getIsSorted()}
                                >
                                  <Menu.Item.Label>
                                    {ColumnKebabMenuItems.Clear}
                                  </Menu.Item.Label>
                                </Menu.Item>
                              </>
                            )}
                          </Menu>
                        </Menu.Trigger>
                      )}
                    </div>
                  </HeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {getTopRows().map((row) => (
              <TableRow
                key={row.id}
                {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
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
                data-pinned={row.getIsPinned()}
              >
                {row
                  .getVisibleCells()
                  .map((cell) =>
                    dataTableCell(
                      cell,
                      cell.column.id === 'kebab' ? persistRowKebabMenu : true,
                    ),
                  )}
              </TableRow>
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
