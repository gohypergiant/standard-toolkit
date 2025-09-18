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

import type { Row, RowData } from '@tanstack/react-table';
import { tableBodyStyles } from './styles';
import { TableRow } from './table-row';
import type { TableBodyProps } from './types';

export function TableBody({
  children,
  className,
  ref,
  topRows,
  centerRows,
  bottomRows,
  ...rest
}: TableBodyProps) {
  const allRows = [
    ...(topRows ?? []),
    ...(centerRows ?? []),
    ...(bottomRows ?? []),
  ];

  return (
    <tbody
      {...rest}
      ref={ref}
      className={tableBodyStyles({
        className,
      })}
    >
      {children ||
        allRows.map((row: Row<RowData>) => (
          <TableRow
            key={row.id}
            data-selected={row.getIsSelected() || null}
            data-pinned={row.getIsPinned() || null}
            cells={row.getVisibleCells()}
          />
        ))}
    </tbody>
  );
}
