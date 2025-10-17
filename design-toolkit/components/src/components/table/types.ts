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

import type { Key } from '@react-types/shared';
import type {
  Cell,
  ColumnDef,
  Header,
  HeaderGroup,
  Row,
} from '@tanstack/react-table';
import type {
  ComponentPropsWithRef,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
} from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { TableCellStyles, TableHeaderCellStyles } from './styles';

type BaseTableProps = Omit<ComponentPropsWithRef<'table'>, 'children'>;

type ExtendedTableProps<T extends { id: Key }> = {
  /**
   * An array of column definitions, one for each key in `T`.
   */
  columns: {
    [K in keyof Required<T>]: ColumnDef<T, T[K]>;
  }[keyof T][];
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
  onSortChange?: (columnId: string, sortDirection: 'asc' | 'desc' | null) => void;
  onColumnReorderChange?: (index: number) => void
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
export type TableBodyProps<T> = ComponentPropsWithRef<'tbody'> & {
  rows?: Row<T>[];
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
export type TableRowProps<T> = ComponentPropsWithRef<'tr'> & {
  row?: Row<T>;
};

/**
 * Props for a table cell component.
 *
 * Extends the standard HTML `<td>` element attributes and includes variant styling props.
 *
 * @remarks
 * - Inherits all properties from `TdHTMLAttributes<HTMLTableCellElement>`.
 * - Includes variant properties from `cellStyles`.
 * - Optionally accepts a `ref` to the underlying `<td>` element.
 *
 * @property ref - Optional React ref for the table cell element.
 * @property className - Optional class name for custom styling.
 * @property narrow - Optional boolean to apply narrow styling.
 * @property numeral - Optional boolean to apply numeral styling.
 * @property persistent - Optional boolean to control visibility behavior.
 *   If true, the cell is always visible.
 *   If false, the cell content is only visible on hover or when the row is hovered.
 */
export type TableCellProps<T> = ComponentPropsWithRef<'td'> &
  VariantProps<typeof TableCellStyles> & {
    cell?: Cell<T, unknown>;
  };

/**
 * Props for a table header cell component.
 *
 * This type combines standard HTML `<th>` element attributes, style variant props,
 * and ref attributes for a table header cell.
 *
 * @see {@link VariantProps}
 * @see {@link RefAttributes}
 */
export type TableHeaderCellProps<T> = ComponentPropsWithRef<'th'> &
  VariantProps<typeof TableHeaderCellStyles> & {
    header?: Header<T, unknown>;
  };

/**
 * Props for the table header (`<thead>`) component.
 *
 * Extends standard HTML attributes and ref attributes for an HTMLTableSectionElement.
 *
 * @see {@link HTMLAttributes}
 * @see {@link RefAttributes}
 */
export type TableHeaderProps<T> = ComponentPropsWithRef<'thead'> & {
  /**
   * Array of header groups of the table
   */
  headerGroups?: HeaderGroup<T>[];
  /**
   * The currently selected column ID
   */
  columnSelection?: string | null;
};

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
  handleSortChange?: (columnId: string, direction: 'asc' | 'desc' | null) => void;
  handleColumnReordering?: (index: number) => void;
};
