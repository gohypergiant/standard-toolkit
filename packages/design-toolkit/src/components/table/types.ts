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

import type { Key } from '@react-types/shared';
import type {
  Cell,
  ColumnDef,
  Header,
  HeaderGroup,
  Row,
  RowData,
  RowPinningState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import type {
  ComponentPropsWithRef,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
} from 'react';
import type { TableFeatures } from './features';

type BaseTableProps = Omit<ComponentPropsWithRef<'table'>, 'children'>;

type ExtendedTableProps<T extends { id: Key }> = {
  /**
   * An array of column definitions. Build them with
   * `createTableColumnHelper<T>()`.
   */
  // biome-ignore lint/suspicious/noExplicitAny: mirrors TanStack's own ColumnHelper['columns'] typing — ColumnDef is invariant in TValue, and only `any` accepts column-helper output
  columns: ColumnDef<TableFeatures, T, any>[];
  /**
   * An array of data objects of type `T`.
   * Each object must have a unique `id` property.
   */
  data: T[];

  /**
   * Whether to display a checkbox column.
   */
  showCheckbox?: boolean;

  /**
   * Controlled row selection state.
   * An object mapping row IDs to their selection state (true = selected).
   * Example: { 'row-1': true, 'row-2': true }
   *
   * The slice is controlled when this prop is not `undefined`; pair it with
   * `onRowSelectionChange` to apply changes, otherwise the selection stays
   * frozen at this value.
   */
  rowSelection?: RowSelectionState;

  /**
   * Initial row selection state for uncontrolled use.
   * Ignored while `rowSelection` is provided.
   */
  defaultRowSelection?: RowSelectionState;

  /**
   * Controlled row pinning state.
   * Arrays of row IDs pinned to the top and bottom of the table.
   * Example: { top: ['row-1'], bottom: [] }
   *
   * The slice is controlled when this prop is not `undefined`; pair it with
   * `onRowPinningChange` to apply changes, otherwise the pinning stays frozen
   * at this value. IDs absent from `data` are skipped when rendering, never
   * pruned - the controlling owner is responsible for pruning stale IDs.
   */
  rowPinning?: RowPinningState;

  /**
   * Initial row pinning state for uncontrolled use.
   * Ignored while `rowPinning` is provided.
   * @default { top: [], bottom: [] }
   */
  defaultRowPinning?: RowPinningState;

  /**
   * Callback function triggered when row pinning changes (for example via the
   * row kebab menu's Pin / Unpin actions).
   * Receives the plain next pinning state; functional updaters from the
   * table engine are resolved internally and never reach this callback.
   * IDs absent from `data` are skipped, not pruned, so they never trigger
   * this callback on their own.
   *
   * @param rowPinning - The next row pinning state.
   *
   * @example
   * // Using with a state setter
   * onRowPinningChange={setRowPinning}
   */
  onRowPinningChange?: (rowPinning: RowPinningState) => void;

  /**
   * Position of the kebab menu, either 'left' or 'right'.
   */
  kebabPosition?: 'left' | 'right';

  /**
   * Whether to persist the header kebab menu.
   * If true, the header kebab menu is always visible.
   * If false, it is only visible on hover or when the row is hovered.
   */
  persistHeaderKebabMenu?: boolean;

  /**
   * Whether to persist the kebab menu.
   * If true, the kebab menu is always visible.
   * If false, it is only visible on hover or when the row is hovered.
   */
  persistRowKebabMenu?: boolean;

  /**
   * Whether to persist numeral columns.
   * If true, numeral columns are always visible.
   * If false, they are only visible on hover or when the row is hovered.
   */
  persistNumerals?: boolean;

  /**
   * Whether to enable sorting.
   * If true, the table will support sorting.
   * If false, the table will not support sorting.
   */
  enableSorting?: boolean;

  /**
   * Whether to enable column ordering.
   * If true, the table will support column ordering.
   * If false, the table will not support column ordering.
   */
  enableColumnReordering?: boolean;

  /**
   * Whether to enable actions for rows.
   * If true, the table will support ability to take action on row.
   * If false, the table will not support ability to take action on row.
   */
  enableRowActions?: boolean;
  /**
   * When manualSorting is set to true, the table will assume that the data that you provide is already sorted, and will not apply any sorting to it.
   * This is used for server-side sorting.
   * If true, getSortedRowModel() is not needed.
   ***/
  manualSorting?: boolean;
  /**
   * Controlled sort state.
   * An array of `{ id, desc }` entries keyed by column id; the header menu
   * writes at most one entry (no multi-column sort).
   * Example: [{ id: 'age', desc: true }]
   *
   * The slice is controlled when this prop is not `undefined`; pair it with
   * `onSortChange` to apply changes, otherwise the sort stays frozen at this
   * value. Applies in both client-side and `manualSorting` modes.
   */
  sort?: SortingState;
  /**
   * Initial sort state for uncontrolled use.
   * Ignored while `sort` is provided.
   * @default []
   */
  defaultSort?: SortingState;
  /**
   * Callback function triggered when the sorting state changes.
   * Receives the plain next `SortingState` in both client-side and
   * `manualSorting` modes; functional updaters from the table engine are
   * resolved internally and never reach this callback.
   *
   * @param sort - The next sort state: `[{ id, desc }]` or `[]` when cleared.
   *
   * @example
   * // Using with a state setter
   * onSortChange={setSort}
   */
  onSortChange?: (sort: SortingState) => void;
  /**
   * Callback function triggered when a column is reordered via drag-and-drop or other mechanism.
   *
   * @param index - The new index position of the column after reordering.
   */
  onColumnReorderChange?: (index: number) => void;
  /**
   * Callback function triggered when row selection changes.
   * Receives the plain next selection state; functional updaters from the
   * table engine are resolved internally and never reach this callback.
   *
   * @param rowSelection - The next row selection state.
   *
   * @example
   * // Using with a state setter
   * onRowSelectionChange={setSelectedRows}
   */
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
  /**
   * Whether the table should take full width and use fixed layout.
   * When true, applies 'w-full table-fixed' classes.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Number of rows per page. Enables built-in pagination when set.
   */
  pageSize?: number;

  /**
   * Controlled current page (1-indexed).
   */
  page?: number;

  /**
   * Uncontrolled default page (1-indexed).
   * @default 1
   */
  defaultPage?: number;

  /**
   * Callback when the page changes.
   */
  onPageChange?: (page: number) => void;
};

/**
 * Props for the Table component.
 *
 * @template T - The type of data objects, which must include an `id` property of type `string` or `number`.
 *
 * This type extends `BaseTableProps` and supports two mutually exclusive prop sets:
 *
 * 1. **Data Table Mode**:
 *    - `columns`: An array of column definitions, one for each key in `T`.
 *    - `data`: An array of data objects of type `T`.
 *    - `showCheckbox` (optional): Whether to display a checkbox column.
 *    - `kebabPosition` (optional): Position of the kebab menu, either `'left'` or `'right'`.
 *    - `persistRowActionMenu` (optional): Whether to persist the kebab menu.
 *    - `persistNumerals` (optional): Whether to persist numeral columns.
 *    - `children`: Must not be provided in this mode.
 *
 * 2. **Custom Content Mode**:
 *    - All table-related props (`data`, `columns`, etc.) must not be provided.
 *    - Allows for custom children content.
 *
 * @see {@link BaseTableProps}
 */
export type TableProps<T extends { id: Key }> = BaseTableProps &
  (
    | (ExtendedTableProps<T> & {
        children?: never;
      })
    | PropsWithChildren<{
        [K in keyof ExtendedTableProps<T>]?: never;
      }>
  );

/**
 * Props for the `<tbody>` section of a table component.
 *
 * Extends standard HTML attributes and ref attributes for the `<tbody>` element,
 * allowing you to pass any valid HTML properties or refs to the table body.
 *
 * @see {@link HTMLAttributes}
 * @see {@link RefAttributes}
 */
export type TableBodyProps<T extends RowData> =
  ComponentPropsWithRef<'tbody'> & {
    rows?: Row<TableFeatures, T>[];
  };

/**
 * Props for a table row (`<tr>`) component.
 *
 * Extends standard HTML attributes and ref attributes for an HTMLTableRowElement,
 * allowing you to pass any valid `<tr>` properties and a ref.
 *
 * @see {@link HTMLAttributes}
 * @see {@link RefAttributes}
 */
export type TableRowProps<T extends RowData> = ComponentPropsWithRef<'tr'> & {
  row?: Row<TableFeatures, T>;
};

/**
 * Props for a table cell component.
 *
 * Extends the standard HTML `<td>` element attributes.
 *
 * @remarks
 * - Inherits all properties from `TdHTMLAttributes<HTMLTableCellElement>`.
 * - Optionally accepts a `ref` to the underlying `<td>` element.
 *
 * @property ref - Optional React ref for the table cell element.
 * @property className - Optional class name for custom styling.
 */
export type TableCellProps<T extends RowData> = ComponentPropsWithRef<'td'> & {
  cell?: Cell<TableFeatures, T, unknown>;
};

/**
 * Props for a table header cell component.
 *
 * This type combines standard HTML `<th>` element attributes
 * and ref attributes for a table header cell.
 *
 * @see {@link RefAttributes}
 */
export type TableHeaderCellProps<T extends RowData> =
  ComponentPropsWithRef<'th'> & {
    header?: Header<TableFeatures, T, unknown>;
  };

/**
 * Props for the table header (`<thead>`) component.
 *
 * Accepts standard HTML attributes and ref attributes for an HTMLTableSectionElement.
 *
 * @see {@link HTMLAttributes}
 * @see {@link RefAttributes}
 */
export type TableHeaderProps<T extends RowData> =
  ComponentPropsWithRef<'thead'> & {
    /**
     * Array of header groups of the table
     */
    headerGroups?: HeaderGroup<TableFeatures, T>[];
    /**
     * The currently selected column ID
     */
    columnSelection?: string | null;
  };

/**
 * Context value for table configuration and state.
 */
export type TableContextValue = {
  columnSelection: string | null;
  enableColumnReordering: boolean;
  enableSorting: boolean;
  enableRowActions: boolean;
  persistHeaderKebabMenu: boolean;
  persistRowKebabMenu: boolean;
  persistNumerals: boolean;
  moveColumnLeft: (index: number) => void;
  moveColumnRight: (index: number) => void;
  setColumnSelection: Dispatch<SetStateAction<string | null>>;
  manualSorting: boolean;
  handleSortChange?: (
    columnId: string,
    direction: 'asc' | 'desc' | null,
  ) => void;
  handleColumnReordering?: (index: number) => void;
};
