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

import type { Row } from '@tanstack/react-table';
import { useContext } from 'react';
import { TableContext } from '.';
import { tableBodyStyles } from './styles';
import { TableRow } from './table-row';
import type { TableBodyProps } from './types';

export function TableBody({
  className,
  ref,
  // getTopRows,
  // getCenterRows,
  // getBottomRows,
  // persistNumerals,
  // columnSelection,
  ...props
}: TableBodyProps) {
  let {
    getTopRows,
    getCenterRows,
    getBottomRows,
    persistNumerals,
    columnSelection,
  } = useContext(TableContext);
  return (
    <tbody
      ref={ref}
      className={tableBodyStyles({
        className,
      })}
      {...props}
    >
      {getTopRows().map((row: Row<any>) => (
        <TableRow
          key={row.id}
          row={row}
          {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
          persistNumerals={persistNumerals}
          selectedCol={columnSelection}
          data-pinned={row.getIsPinned()}
        ></TableRow>
      ))}
      {getCenterRows().map((row: Row<any>) => (
        <TableRow
          key={row.id}
          row={row}
          {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
          // persistNumerals={persistNumerals}
          // selectedCol={columnSelection}
          data-pinned={row.getIsPinned()}
        ></TableRow>
      ))}
      {getBottomRows().map((row: Row<any>) => (
        <TableRow
          key={row.id}
          row={row}
          {...(row.getIsSelected() ? { 'data-selected': '' } : {})}
          // persistNumerals={persistNumerals}
          // selectedCol={columnSelection}
          data-pinned={row.getIsPinned()}
        ></TableRow>
      ))}
    </tbody>
  );
}
