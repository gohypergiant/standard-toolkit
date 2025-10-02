// __private-exports
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
import { TableContext } from './context';
import { TableCellStyles } from './styles';
import type { TableCellProps } from './types';

export function TableCell<T>({
  children,
  ref,
  className,
  cell,
  ...rest
}: TableCellProps<T>) {
  const { columnSelection, persistNumerals } = useContext(TableContext);
  const isKebab = cell?.column.id === 'kebab';
  const isNumeral = cell?.column.id === 'numeral';
  const isSelected = cell?.column.id === columnSelection;
  const narrow = isNumeral || isKebab;
  const notPersistNums = isNumeral && !persistNumerals;

  return (
    <td
      {...rest}
      ref={ref}
      className={TableCellStyles({
        className,
        narrow,
        isNumeral,
        notPersistNums,
      })}
      data-selected={isSelected || null}
    >
      {children ||
        (cell && flexRender(cell.column.columnDef.cell, cell.getContext()))}
    </td>
  );
}
