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
import { clsx } from 'clsx';
import { useContext } from 'react';
import { HeaderColumnAction } from './constants/table';
import { TableContext } from './context';
import styles from './styles.module.css';
import type { TableCellProps } from './types';

export function TableCell<T>({
  children,
  ref,
  className,
  cell,
  ...rest
}: TableCellProps<T>) {
  const { columnSelection, persistNumerals } = useContext(TableContext);
  const isNumeral = cell?.column.id === HeaderColumnAction.NUMERAL;
  const isSelected = cell?.column.id === columnSelection;
  const notPersistNums = isNumeral && !persistNumerals;

  return (
    <td
      {...rest}
      ref={ref}
      className={clsx(
        styles.cell,
        notPersistNums && styles.hideInRow,
        className,
      )}
      data-selected={isSelected || null}
    >
      {children ||
        (cell && flexRender(cell.column.columnDef.cell, cell.getContext()))}
    </td>
  );
}
