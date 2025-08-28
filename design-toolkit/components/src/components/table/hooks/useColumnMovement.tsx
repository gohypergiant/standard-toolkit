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

import type { ColumnOrderState, Updater } from '@tanstack/react-table';
import { useCallback } from 'react';

export function useColumnMovement(
  setColumnOrderCallback: (updater: Updater<ColumnOrderState>) => void,
) {
  const moveColumnLeft = useCallback(
    (oldIndex: number) => {
      setColumnOrderCallback((order: string[]) => {
        const newColumnOrder = [...order];
        const newIndex = oldIndex - 1;
        if (newIndex < 0) {
          return order;
        }

        newColumnOrder.splice(
          newIndex,
          0,
          newColumnOrder.splice(oldIndex, 1)[0] ?? '',
        );
        return newColumnOrder;
      });
    },
    [setColumnOrderCallback],
  );

  const moveColumnRight = useCallback(
    (oldIndex: number) => {
      setColumnOrderCallback((order: string[]) => {
        const newColumnOrder = [...order];
        const newIndex = oldIndex + 1;
        if (newIndex >= newColumnOrder.length) {
          return order;
        }

        newColumnOrder.splice(
          newIndex,
          0,
          newColumnOrder.splice(oldIndex, 1)[0] ?? '',
        );
        return newColumnOrder;
      });
    },
    [setColumnOrderCallback],
  );

  return { moveColumnLeft, moveColumnRight };
}
