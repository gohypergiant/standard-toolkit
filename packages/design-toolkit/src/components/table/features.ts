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

import {
  columnOrderingFeature,
  columnSizingFeature,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  tableFeatures as createTableFeatures,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
} from '@tanstack/react-table';
import { rowOrderingFeature } from './row-ordering-feature';
import type { RowData } from '@tanstack/react-table';

/**
 * The TanStack Table feature set registered for every Table instance.
 *
 * Use `typeof tableFeatures` (or {@link TableFeatures}) as the first generic
 * of TanStack types (`ColumnDef`, `CellContext`, etc.) when typing columns
 * for the Table component.
 */
export const tableFeatures = createTableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  rowPinningFeature,
  rowPaginationFeature,
  rowOrderingFeature,
  columnOrderingFeature,
  columnSizingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  // all built-in sortFns so column `sortFn` string names (and 'auto') resolve
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
    textCaseSensitive: sortFn_textCaseSensitive,
  },
});

/**
 * Feature set type of the Table component; first generic parameter for
 * TanStack Table types.
 */
export type TableFeatures = typeof tableFeatures;

/**
 * Column helper pre-bound to the Table component's feature set.
 *
 * Replacement for TanStack Table v8's `createColumnHelper<TData>()`.
 *
 * @example
 * ```tsx
 * const columnHelper = createTableColumnHelper<Person>();
 * const columns = [columnHelper.accessor('firstName', { header: 'First Name' })];
 * ```
 */
export function createTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<TableFeatures, TData>();
}
