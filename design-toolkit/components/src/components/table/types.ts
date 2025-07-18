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

import type { ColumnDef } from '@tanstack/react-table';
import type {
  ForwardedRef,
  HTMLAttributes,
  PropsWithChildren,
  RefAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import type { MenuTriggerProps as AriaMenuTriggerProps } from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { actionsCellStyles, cellStyles, headerCellStyles } from './styles';

type BaseTableProps = TableHTMLAttributes<HTMLTableElement> &
  RefAttributes<HTMLTableElement>;

type ExtendedTableProps<T extends { id: string | number }> = {
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
   * Whether to persist the kebab menu.
   * If true, the kebab menu is always visible.
   * If false, it is only visible on hover or when the row is hovered.
   */
  persistRowActionMenu?: boolean;
  /**
   * Whether to persist numeral columns.
   * If true, numeral columns are always visible.
   * If false, they are only visible on hover or when the row is hovered.
   */
  persistNumerals?: boolean;
  /**
   * Optional page size for pagination.
   * If provided, the table will support pagination with the specified page size.
   */
  pageSize?: number;
  /**
   * Whether to enable sorting.
   * If true, the table will support sorting.
   * If false, the table will not support sorting.
   */
  enableSorting?: boolean;
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
export type TableProps<T extends { id: string | number }> = BaseTableProps &
  (
    | (ExtendedTableProps<T> & {
        children?: never;
      })
    | {
        [K in keyof ExtendedTableProps<T>]?: never;
      }
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
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement> &
  RefAttributes<HTMLTableSectionElement>;

/**
 * Props for a table row (`<tr>`) component.
 *
 * Extends standard HTML attributes and ref attributes for an HTMLTableRowElement,
 * allowing you to pass any valid `<tr>` properties and a ref.
 *
 * @see {@link HTMLAttributes}
 * @see {@link RefAttributes}
 */
export type TableRowProps = HTMLAttributes<HTMLTableRowElement> &
  RefAttributes<HTMLTableRowElement>;

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
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> &
  VariantProps<typeof cellStyles> & {
    ref?: ForwardedRef<HTMLTableCellElement>;
  };

/**
 * Props for a table header cell component.
 *
 * This type combines standard HTML `<th>` element attributes, style variant props,
 * and ref attributes for a table header cell.
 *
 * @see {@link ThHTMLAttributes}
 * @see {@link VariantProps}
 * @see {@link RefAttributes}
 */
export type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement> &
  VariantProps<typeof headerCellStyles> &
  RefAttributes<HTMLTableCellElement>;

/**
 * Props for the table header (`<thead>`) component.
 *
 * Extends standard HTML attributes and ref attributes for an HTMLTableSectionElement.
 *
 * @see {@link HTMLAttributes}
 * @see {@link RefAttributes}
 */
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement> &
  RefAttributes<HTMLTableSectionElement>;

/** * ActionsCellProps defines the properties for the ActionsCell component.
 * It includes an array of actions, each with a unique label and an optional onAction callback.
 * The component renders a kebab menu icon that, when clicked, displays the actions in a popover.
 * @property onOpen - An optional callback function that is called when the menu is opened.
 * @property actions - An array of action objects, each containing a label and an optional onAction function.
 */
export type ActionsCellProps = VariantProps<typeof actionsCellStyles> &
  PropsWithChildren<Pick<AriaMenuTriggerProps, 'isOpen' | 'onOpenChange'>> & {
    className?: string;
    actions: {
      label: string;
      onAction?: () => void;
    }[];
  };
