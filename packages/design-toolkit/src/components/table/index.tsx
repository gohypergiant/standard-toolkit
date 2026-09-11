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

'use client';
import 'client-only';
import { clsx } from '@accelint/design-foundation/lib/utils';
import Kebab from '@accelint/icons/kebab';
import Pin from '@accelint/icons/pin';
import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowData,
  type RowPinningState,
  type RowSelectionState,
  type SortingState,
  useTable,
} from '@tanstack/react-table';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useControlledState } from 'react-stately/useControlledState';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { MenuItem } from '../menu/item';
import { MenuSeparator } from '../menu/separator';
import { MenuTrigger } from '../menu/trigger';
import { TableBody } from './body';
import { TableContext } from './context';
import { tableFeatures } from './features';
import { TableHeader } from './header';
import styles from './styles.module.css';
import { useTableControlledState } from './use-table-controlled-state';
import type { Key } from '@react-types/shared';
import type { TableFeatures } from './features';
import type { RowOrderingState } from './row-ordering-feature';
import type { TableProps } from './types';

// This width is for columns in the table that provide features:
// - Row count
// - Row actions kebab
// - Row selection (checkbox)
// These columns should not need to grow with table width
const META_COLUMN_WIDTH = 32;

// Stable default so an uncontrolled selection slice does not re-seed on
// every render.
const EMPTY_ROW_SELECTION: RowSelectionState = {};

// Stable default so an uncontrolled pinning slice does not re-seed on every
// render.
const EMPTY_ROW_PINNING: RowPinningState = { top: [], bottom: [] };

// Stable default so an uncontrolled sort slice does not re-seed on every
// render.
const EMPTY_SORT: SortingState = [];

type RowActionsMenuProps<T extends RowData> = {
  row: Row<TableFeatures, T>;
};

function RowActionsMenu<T extends RowData>({ row }: RowActionsMenuProps<T>) {
  const { enableRowActions, persistRowKebabMenu } = useContext(TableContext);
  const isPinned = !!row.getIsPinned();
  const hideRowKebab = !persistRowKebabMenu;

  return (
    enableRowActions && (
      <div className={clsx(hideRowKebab && styles.hideInRow)}>
        <MenuTrigger>
          <Button variant='icon' aria-label={`row ${row.index + 1} actions`}>
            <Icon>
              <Kebab />
            </Icon>
          </Button>
          <Menu>
            <MenuItem onAction={() => row.pin(isPinned ? false : 'top')}>
              {isPinned ? 'Unpin' : 'Pin'}
            </MenuItem>
            <MenuSeparator />
            <MenuItem
              onAction={() => row.moveUp()}
              isDisabled={!row.getCanMoveUp()}
            >
              Move Up
            </MenuItem>
            <MenuItem
              onAction={() => row.moveDown()}
              isDisabled={!row.getCanMoveDown()}
            >
              Move Down
            </MenuItem>
          </Menu>
        </MenuTrigger>
      </div>
    )
  );
}

/**
 * Table - Configurable data table with sorting, selection, and row actions
 *
 * Supports data-driven mode with TanStack column definitions or static mode with subcomponents.
 *
 * @param props - {@link TableProps}
 * @param props.children - Custom children for static mode.
 * @param props.columns - Column definitions for data-driven mode.
 * @param props.data - Data array for data-driven mode.
 * @param props.showCheckbox - Whether to show selection checkboxes.
 * @param props.rowSelection - Controlled row selection state; without
 * `onRowSelectionChange` the selection stays frozen at this value.
 * @param props.defaultRowSelection - Initial row selection state for uncontrolled use.
 * @param props.rowPinning - Controlled row pinning state; without
 * `onRowPinningChange` the pinning stays frozen at this value.
 * @param props.defaultRowPinning - Initial row pinning state for uncontrolled use.
 * @param props.onRowPinningChange - Callback receiving the plain next row pinning state.
 * @param props.kebabPosition - Position of row action menu.
 * @param props.persistRowKebabMenu - Keep row kebab menu visible.
 * @param props.persistHeaderKebabMenu - Keep header kebab menu visible.
 * @param props.persistNumerals - Keep row numerals visible.
 * @param props.enableSorting - Enable column sorting.
 * @param props.enableColumnReordering - Enable column reordering.
 * @param props.enableRowActions - Enable row action menu.
 * @param props.manualSorting - Use server-side sorting; rows keep the `data` order.
 * @param props.sort - Controlled sort state; without `onSortChange` the
 * sort stays frozen at this value.
 * @param props.defaultSort - Initial sort state for uncontrolled use.
 * @param props.onSortChange - Callback receiving the plain next
 * `SortingState`, in both client-side and `manualSorting` modes.
 * @param props.onColumnReorderChange - Callback when column order changes.
 * @param props.onRowSelectionChange - Callback receiving the plain next row selection state.
 * @param props.fullWidth - Whether table uses full width.
 * @param props.pageSize - Rows per page; enables built-in pagination when set.
 * @param props.page - Controlled current page (1-indexed).
 * @param props.defaultPage - Initial page (1-indexed) for uncontrolled use.
 * @param props.onPageChange - Callback receiving the plain next page number.
 * @returns The rendered Table component.
 *
 * @example
 * ```tsx
 * <Table columns={columns} data={rows} enableSorting showCheckbox />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled sorting: the handler receives the plain next SortingState
 * const [sort, setSort] = useState<SortingState>([]);
 *
 * <Table columns={columns} data={rows} sort={sort} onSortChange={setSort} />;
 * ```
 */
export function Table<T extends { id: Key }>({
  children,
  columns: columnsProp,
  data: dataProp,
  showCheckbox,
  rowSelection: rowSelectionProp,
  defaultRowSelection = EMPTY_ROW_SELECTION,
  rowPinning: rowPinningProp,
  defaultRowPinning = EMPTY_ROW_PINNING,
  onRowPinningChange,
  kebabPosition = 'right',
  persistRowKebabMenu = true,
  persistHeaderKebabMenu = true,
  persistNumerals = false,
  enableSorting = true,
  enableColumnReordering = true,
  enableRowActions = true,
  manualSorting = false,
  sort: sortProp,
  defaultSort = EMPTY_SORT,
  onSortChange,
  onColumnReorderChange,
  onRowSelectionChange,
  fullWidth = false,
  pageSize,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  ...rest
}: TableProps<T>) {
  // Only the manual row order is state (owned by the table's
  // rowOrderingFeature, mirrored here); row content stays owned by the data
  // prop so external updates (polling, refetch) flow through without remount.
  const [rowOrdering, setRowOrdering] = useState<RowOrderingState>([]);

  const data = useMemo(() => {
    const items = dataProp ?? [];

    if (!rowOrdering.length) {
      return items;
    }

    // rowOrdering holds positions, not sort keys: place ranked rows straight
    // into their slot and append the rest in natural order — O(n), no sort
    const rank = new Map<string, number>();
    rowOrdering.forEach((id, index) => {
      rank.set(id, index);
    });

    const slots = new Array<T | undefined>(rowOrdering.length);
    const unranked: T[] = [];

    for (const item of items) {
      const slot = rank.get(String(item.id));

      // duplicate ids fall through to unranked
      if (slot === undefined || slots[slot] !== undefined) {
        unranked.push(item);
      } else {
        slots[slot] = item;
      }
    }

    const ordered: T[] = [];

    // stale ids (rows no longer in data) leave holes; skip them
    for (const slot of slots) {
      if (slot !== undefined) {
        ordered.push(slot);
      }
    }

    for (const item of unranked) {
      ordered.push(item);
    }

    return ordered;
  }, [dataProp, rowOrdering]);

  const [rowSelection, setRowSelection] = useTableControlledState(
    rowSelectionProp,
    defaultRowSelection,
    onRowSelectionChange,
  );
  const [columnSelection, setColumnSelection] = useState<string | null>(null);

  const [rowPinning, setRowPinning] = useTableControlledState(
    rowPinningProp,
    defaultRowPinning,
    onRowPinningChange,
  );

  const [sort, setSort] = useTableControlledState(
    sortProp,
    defaultSort,
    onSortChange,
  );

  const [currentPage, setCurrentPage] = useControlledState(
    pageProp,
    defaultPage,
    onPageChange,
  );

  const pagination = useMemo(
    () =>
      pageSize != null ? { pageIndex: currentPage - 1, pageSize } : undefined,
    [currentPage, pageSize],
  );

  const handlePaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      if (pagination == null) {
        return;
      }
      const next =
        typeof updater === 'function' ? updater(pagination) : updater;
      setCurrentPage(next.pageIndex + 1);
    },
    [pagination, setCurrentPage],
  );

  /**
   * actionColumn defines the actions available in the kebab menu for each row.
   * It includes options to move the row up or down in the table. Moves go
   * through the table's rowOrderingFeature APIs, which are identity-stable, so
   * this column def never has to be recreated.
   */
  const actionColumn: ColumnDef<TableFeatures, T, unknown> = useMemo(
    () => ({
      id: 'kebab',
      cell: ({ row }) => <RowActionsMenu row={row} />,
      size: META_COLUMN_WIDTH,
    }),
    [],
  );

  /**
   * columns defines the structure of the table.
   * It includes the action column and optionally a checkbox column.
   * The kebab menu position can be set to 'left' or 'right'.
   * If showCheckbox is true, a checkbox column is added.
   */
  const columns = useMemo<ColumnDef<TableFeatures, T, unknown>[]>(
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
        size: META_COLUMN_WIDTH,
      },
      ...(showCheckbox
        ? ([
            {
              id: 'selection',
              header: ({ table }) => (
                <Checkbox
                  isSelected={table.getIsAllRowsSelected()}
                  // v9: getIsSomeRowsSelected stays true at full selection
                  isIndeterminate={
                    table.getIsSomeRowsSelected() &&
                    !table.getIsAllRowsSelected()
                  }
                  onChange={table.toggleAllRowsSelected}
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  isSelected={row.getIsSelected()}
                  isIndeterminate={row.getIsSomeSelected()}
                  // v9 row methods are prototype-shared; keep the receiver
                  onChange={(isSelected) => row.toggleSelected(isSelected)}
                />
              ),
              size: META_COLUMN_WIDTH,
            },
          ] satisfies ColumnDef<TableFeatures, T, unknown>[])
        : []),
      ...(kebabPosition === 'left' ? [actionColumn] : []),
      ...(columnsProp ?? []),
      ...(kebabPosition === 'right' ? [actionColumn] : []),
    ],
    [showCheckbox, columnsProp, kebabPosition, actionColumn],
  );

  // Single write path for both sort modes: the header menu emits at most one
  // column entry; the adapter resolves it and fires onSortChange with the
  // plain SortingState.
  const handleSortChange = useCallback(
    (columnId: string, sortDirection: 'asc' | 'desc' | null) => {
      setSort(
        sortDirection ? [{ id: columnId, desc: sortDirection === 'desc' }] : [],
      );
    },
    [setSort],
  );

  const handleColumnReordering = (index: number) => {
    onColumnReorderChange?.(index);
  };

  const {
    getHeaderGroups,
    getTopRows,
    getCenterRows,
    getBottomRows,
    setColumnOrder,
  } = useTable({
    features: tableFeatures,
    data,
    columns,
    enableSorting,
    initialState: {
      columnOrder: columns.map(({ id }) => id ?? ''),
    },
    state: {
      rowSelection,
      rowPinning,
      rowOrdering,
      sorting: sort,
      ...(pagination != null && { pagination }),
    },
    getRowId: (row, index) => {
      // Use the index as the row ID if no unique identifier is available
      return row.id ? row.id.toString() : index.toString();
    },
    enableRowSelection: true,
    enableRowPinning: true,
    manualSorting: manualSorting,
    // no pageSize → paginated row model passes rows through untouched
    manualPagination: pagination == null,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSort,
    onRowPinningChange: setRowPinning,
    onRowOrderingChange: setRowOrdering,
    onPaginationChange: handlePaginationChange,
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

  const className = clsx(fullWidth && 'w-full table-fixed', rest.className);

  if (children) {
    return (
      <table {...rest} className={className}>
        {children}
      </table>
    );
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
        manualSorting,
        handleSortChange,
        handleColumnReordering,
      }}
    >
      <table {...rest} className={className}>
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
