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

import { useCallback } from 'react';

export function useRowMovement<T extends { id: string | number }>(
  data: T[],
  dataIds: (string | number)[],
  rowSelection: Record<string, boolean>,
  moveBefore?: (id: string | number, keys: (string | number)[]) => void,
  moveAfter?: (id: string | number, keys: (string | number)[]) => void,
) {
  /**
   * moveUpSelectedRows moves the selected rows up in the table.
   * It finds the first selected row, determines its index,
   * and moves it before the previous row if it exists.
   */
  const moveUpSelectedRows = useCallback(
    (row: any) => {
      const hasRowSelection =
        Object.keys(rowSelection).length !== 0 &&
        Object.hasOwn(rowSelection, row.id);
      const rowSelectionKeys = Object.keys(rowSelection).filter(
        (id) => rowSelection[id],
      );

      const rowsToMove = hasRowSelection
        ? data.filter((item: T) =>
            rowSelectionKeys.includes(item.id.toString()),
          )
        : [row];

      const firstSelectedRowId = rowsToMove[0]?.id;
      if (firstSelectedRowId) {
        const rowIndex = dataIds.indexOf(firstSelectedRowId);
        const prevRowId = dataIds[rowIndex ? rowIndex - 1 : 0];

        if (prevRowId) {
          const rowsToMoveKeys = hasRowSelection ? rowSelectionKeys : [row.id];
          moveBefore?.(prevRowId, rowsToMoveKeys);
        }
      }
    },
    [data, dataIds, rowSelection, moveBefore],
  );

  // /**
  //  * moveDownRows moves the selected or active rows down in the table.
  //  * It finds the last selected row, determines its index,
  //  * and moves it after the next row if it exists.
  //  */

  const moveDownRows = useCallback(
    (row: any) => {
      const hasRowSelection =
        Object.keys(rowSelection).length !== 0 &&
        Object.hasOwn(rowSelection, row.id);

      const rowSelectionKeys = Object.keys(rowSelection).filter(
        (id) => rowSelection[id],
      );

      const rowsToMove = hasRowSelection
        ? data.filter((item: T) =>
            rowSelectionKeys.includes(item.id.toString()),
          )
        : [row];

      const lastSelectedRowId = rowsToMove[rowsToMove.length - 1]?.id;

      if (lastSelectedRowId) {
        const rowIndex = dataIds.indexOf(lastSelectedRowId);
        const nextRowId =
          dataIds[
            rowIndex < dataIds.length - 1 ? rowIndex + 1 : dataIds.length - 1
          ];

        if (nextRowId) {
          const rowsToMoveKeys = hasRowSelection ? rowSelectionKeys : [row.id];
          moveAfter?.(nextRowId, rowsToMoveKeys);
        }
      }
    },
    [data, dataIds, rowSelection, moveAfter],
  );

  return { moveUpSelectedRows, moveDownRows };
}
