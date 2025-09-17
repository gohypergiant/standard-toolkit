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

import { flexRender } from '@tanstack/react-table';
import { useContext } from 'react';
import { TableContext } from '.';
import { cellStyles } from './styles';
import type { TableCellProps } from './types';

export function TableCell({
  ref,
  className,
  cell,
  ...props
}: TableCellProps<any>) {
  const { columnSelection } = useContext(TableContext);

  const kebab = cell && cell.column.id === 'kebab';
  const narrow =
    (cell && cell.column.id === 'numeral') ||
    (cell && cell.column.id === 'kebab');
  const numeral = cell && cell.column.id === 'numeral';
  const selectedCol = cell && cell?.column.id === columnSelection;

  return (
    <td
      ref={ref}
      className={cellStyles({
        narrow,
        numeral,
        kebab,
        selectedCol,
        className,
      })}
      {...props}
    >
      {props.children ||
        (cell && flexRender(cell.column.columnDef.cell, cell.getContext()))}
    </td>
  );
}
