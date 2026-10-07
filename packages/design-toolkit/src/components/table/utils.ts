// __private-exports
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

import { headerColumnActionValues } from './constants/table';
import type { RowData, Table } from '@tanstack/react-table';
import type { DensityVariant } from '@/lib/types';
import type { MenuProps } from '../menu/types';
import type { TableFeatures } from './features';

/**
 * Clamps a table density to the subset the Menu accepts, so the row actions
 * and header cell kebab menus can inherit the table's `variant`. Menu has no
 * `crammed` density, so `crammed` maps to `compact`; the others pass through.
 *
 * @remarks pure function
 *
 * @param variant - The table density from `TableContext`.
 * @returns The matching Menu density (`cozy` or `compact`).
 *
 * @example
 * ```ts
 * toMenuVariant('crammed'); // 'compact'
 * toMenuVariant('cozy'); // 'cozy'
 * ```
 */
export function toMenuVariant(
  variant: DensityVariant,
): NonNullable<MenuProps<object>['variant']> {
  return variant === 'crammed' ? 'compact' : variant;
}

const metaColumnIds: ReadonlySet<string> = new Set(headerColumnActionValues);

/**
 * Whether a column id belongs to one of the Table's own meta columns (numeral,
 * selection, kebab) rather than a consumer-defined column. Meta columns keep
 * their configured positions and never take part in column reordering.
 *
 * @remarks pure function
 *
 * @param columnId - A TanStack column id.
 * @returns `true` for the numeral, selection, and kebab column ids.
 *
 * @example
 * ```ts
 * isMetaColumnId('kebab'); // true
 * isMetaColumnId('firstName'); // false
 * ```
 */
export function isMetaColumnId(columnId: string): boolean {
  return metaColumnIds.has(columnId);
}

/**
 * Ids of the consumer-defined columns in their current display order: every
 * leaf column except the Table's meta columns. Column reordering swaps within
 * this list, and `onColumnOrderChange` emits it.
 *
 * @remarks pure function
 *
 * @template TData - Row data type of the table.
 * @param table - The TanStack table instance.
 * @returns Consumer column ids in display order.
 *
 * @example
 * ```ts
 * getConsumerColumnIds(table); // ['firstName', 'lastName', 'age']
 * ```
 */
export function getConsumerColumnIds<TData extends RowData>(
  table: Table<TableFeatures, TData>,
): string[] {
  return table
    .getAllLeafColumns()
    .map(({ id }) => id)
    .filter((id) => !isMetaColumnId(id));
}
