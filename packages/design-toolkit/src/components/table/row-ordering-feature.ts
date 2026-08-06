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
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '@tanstack/react-table';
import type {
  OnChangeFn,
  Row,
  RowData,
  RowSelectionState,
  Table,
  TableFeature,
  TableFeatures,
  Updater,
} from '@tanstack/react-table';

/**
 * Manual row order as row ids in display order. Empty means natural
 * (data-prop) order. Consumers own applying the order to their data; the
 * feature owns the state and the move semantics.
 */
export type RowOrderingState = string[];

export interface RowOrderingTableState {
  rowOrdering: RowOrderingState;
}

export interface RowOrderingTableOptions {
  /**
   * Callback fired when the manual row order changes.
   */
  onRowOrderingChange?: OnChangeFn<RowOrderingState>;
}

export interface RowOrderingTableApis {
  /**
   * Updates the manual row order state. The absolute write door: resets
   * (`setRowOrdering([])`) and bulk reorders (drag and drop) go through here.
   */
  setRowOrdering: (updater: Updater<RowOrderingState>) => void;
}

export interface RowOrderingRowApis {
  /**
   * Moves this row — or every selected row when this row is selected — up one
   * place in display order.
   */
  moveUp: () => void;
  /**
   * Moves this row — or every selected row when this row is selected — down
   * one place in display order.
   */
  moveDown: () => void;
}

declare module '@tanstack/react-table' {
  interface Plugins {
    rowOrderingFeature?: TableFeature;
  }

  interface TableState_FeatureMap {
    rowOrderingFeature: RowOrderingTableState;
  }

  interface TableOptions_FeatureMap<
    // biome-ignore lint/correctness/noUnusedVariables: merged declarations must repeat the original type parameters
    TFeatures extends TableFeatures,
    // biome-ignore lint/correctness/noUnusedVariables: merged declarations must repeat the original type parameters
    TData extends RowData,
  > {
    rowOrderingFeature: RowOrderingTableOptions;
  }

  interface Table_FeatureMap<
    // biome-ignore lint/correctness/noUnusedVariables: merged declarations must repeat the original type parameters
    TFeatures extends TableFeatures,
    // biome-ignore lint/correctness/noUnusedVariables: merged declarations must repeat the original type parameters
    TData extends RowData,
  > {
    rowOrderingFeature: RowOrderingTableApis;
  }

  interface Row_FeatureMap<
    // biome-ignore lint/correctness/noUnusedVariables: merged declarations must repeat the original type parameters
    TFeatures extends TableFeatures,
    // biome-ignore lint/correctness/noUnusedVariables: merged declarations must repeat the original type parameters
    TData extends RowData,
  > {
    rowOrderingFeature: RowOrderingRowApis;
  }
}

function tableSetRowOrdering<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<RowOrderingState>) {
  (table.options as RowOrderingTableOptions).onRowOrderingChange?.(updater);
}

/**
 * Captures the current base order by id, extracts the moving rows, and
 * reinserts them next to the target row.
 */
function tableMoveRows<TFeatures extends TableFeatures, TData extends RowData>(
  table: Table<TFeatures, TData>,
  ids: string[],
  targetId: string,
  position: 'before' | 'after',
) {
  const moving = new Set(ids);
  const remaining = table
    .getCoreRowModel()
    .rows.reduce<string[]>((acc, row) => {
      if (!moving.has(row.id)) {
        acc.push(row.id);
      }

      return acc;
    }, []);
  const targetIndex = remaining.indexOf(targetId);

  if (targetIndex === -1) {
    return;
  }

  const insertAt = position === 'before' ? targetIndex : targetIndex + 1;

  remaining.splice(insertAt, 0, ...ids);
  tableSetRowOrdering(table, remaining);
}

/**
 * Gathers the rows a move applies to: every selected row when the acted-on
 * row is selected, otherwise just the acted-on row.
 */
function getRowsToMove<TFeatures extends TableFeatures, TData extends RowData>(
  table: Table<TFeatures, TData>,
  row: Row<TFeatures, TData>,
) {
  const rows = table.getRowModel().rows;
  // structural read: rowSelection only exists when rowSelectionFeature is on
  const selection =
    (
      table.atoms as { rowSelection?: { get: () => RowSelectionState } }
    ).rowSelection?.get() ?? {};
  const rowsToMove = selection[row.id]
    ? rows.filter(({ id }) => selection[id])
    : [row];

  return { rows, rowsToMove };
}

function tableMoveRowsUp<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, row: Row<TFeatures, TData>) {
  const { rows, rowsToMove } = getRowsToMove(table, row);
  const firstRowToMove = rowsToMove[0];

  if (!firstRowToMove || firstRowToMove.index === 0) {
    return;
  }

  const prevRowId = rows[firstRowToMove.index - 1]?.id;

  if (!prevRowId) {
    return;
  }

  tableMoveRows(
    table,
    rowsToMove.map(({ id }) => id),
    prevRowId,
    'before',
  );
}

function tableMoveRowsDown<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, row: Row<TFeatures, TData>) {
  const { rows, rowsToMove } = getRowsToMove(table, row);
  const lastRowToMove = rowsToMove[rowsToMove.length - 1];

  if (!lastRowToMove || lastRowToMove.index === rows.length - 1) {
    return;
  }

  const nextRowId = rows[lastRowToMove.index + 1]?.id;

  if (!nextRowId) {
    return;
  }

  tableMoveRows(
    table,
    rowsToMove.map(({ id }) => id),
    nextRowId,
    'after',
  );
}

/**
 * TanStack Table custom feature adding manual row ordering: a `rowOrdering`
 * state slice (row ids in display order), a `table.setRowOrdering` state
 * setter, and `row.moveUp()` / `row.moveDown()` row APIs.
 *
 * Feature APIs have stable identities, so column defs can call them without
 * capturing component-scope callbacks.
 */
export const rowOrderingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    ...initialState,
    rowOrdering:
      (initialState as Partial<RowOrderingTableState>).rowOrdering ?? [],
  }),
  getDefaultTableOptions: (table) => ({
    onRowOrderingChange: makeStateUpdater('rowOrdering', table),
  }),
  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ) => {
    assignTableAPIs('rowOrderingFeature', table, {
      // biome-ignore lint/style/useNamingConvention: assignTableAPIs derives the instance method name from the table_ prefix
      table_setRowOrdering: {
        fn: (updater: Updater<RowOrderingState>) =>
          tableSetRowOrdering(table, updater),
      },
    });
  },
  assignRowPrototype: <TFeatures extends TableFeatures, TData extends RowData>(
    prototype: Record<string, unknown>,
    table: Table<TFeatures, TData>,
  ) => {
    assignPrototypeAPIs('rowOrderingFeature', prototype, table, {
      // biome-ignore lint/style/useNamingConvention: assignPrototypeAPIs derives the method name from the row_ prefix
      row_moveUp: {
        fn: (row: Row<TFeatures, TData>) => tableMoveRowsUp(table, row),
      },
      // biome-ignore lint/style/useNamingConvention: assignPrototypeAPIs derives the method name from the row_ prefix
      row_moveDown: {
        fn: (row: Row<TFeatures, TData>) => tableMoveRowsDown(table, row),
      },
    });
  },
};
