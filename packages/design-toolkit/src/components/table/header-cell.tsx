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

import { ArrowDown, ArrowUp, Kebab } from '@accelint/icons';
import { flexRender, type Header } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { useContext, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { MenuItem } from '../menu/item';
import { MenuSeparator } from '../menu/separator';
import { MenuTrigger } from '../menu/trigger';
import {
  HeaderColumnAction,
  headerColumnActionValues,
  SortDirection,
} from './constants/table';
import { TableContext } from './context';
import styles from './styles.module.css';
import type { TableHeaderCellProps } from './types';

function HeaderCellMenu<T>({ header }: { header: Header<T, unknown> }) {
  const {
    enableColumnReordering,
    enableSorting,
    moveColumnLeft,
    moveColumnRight,
    persistHeaderKebabMenu,
    setColumnSelection,
    manualSorting,
    handleSortChange,
    handleColumnReordering,
  } = useContext(TableContext);

  const [hoveredArrow, setHoveredArrow] = useState(false);
  const hideHeaderKebab = !persistHeaderKebabMenu;

  if (
    headerColumnActionValues.includes(
      header.column.id as 'numeral' | 'kebab' | 'selection',
    ) ||
    !(enableSorting || enableColumnReordering)
  ) {
    return null;
  }

  const sort = header.column.getIsSorted();

  return (
    <div className={clsx(hideHeaderKebab && styles.hideInHeader)}>
      <MenuTrigger
        onOpenChange={(isOpen) =>
          setColumnSelection(isOpen ? header.column.id : null)
        }
      >
        <Button
          variant='icon'
          aria-label='Menu'
          onHoverChange={setHoveredArrow}
        >
          <Icon>
            {(!sort || hoveredArrow) && <Kebab />}
            {!hoveredArrow && sort === SortDirection.DESC && <ArrowDown />}
            {!hoveredArrow && sort === SortDirection.ASC && <ArrowUp />}
          </Icon>
        </Button>
        <Menu>
          {enableColumnReordering && (
            <>
              <MenuItem
                onAction={() => {
                  const index = header.column.getIndex();
                  moveColumnLeft(index);
                  handleColumnReordering?.(index);
                }}
                isDisabled={header.column.getIsFirstColumn('center')}
              >
                Move Column Left
              </MenuItem>
              <MenuItem
                onAction={() => {
                  const index = header.column.getIndex();
                  moveColumnRight(index);
                  handleColumnReordering?.(index);
                }}
                isDisabled={header.column.getIsLastColumn('center')}
              >
                Move Column Right
              </MenuItem>
            </>
          )}
          {enableColumnReordering && enableSorting && <MenuSeparator />}
          {enableSorting && (
            <>
              <MenuItem
                onAction={() => {
                  manualSorting
                    ? handleSortChange?.(header.column.id, SortDirection.ASC)
                    : header.column.toggleSorting(false);
                }}
                isDisabled={sort === SortDirection.ASC}
              >
                Sort Ascending
              </MenuItem>
              <MenuItem
                onAction={() => {
                  manualSorting
                    ? handleSortChange?.(header.column.id, SortDirection.DESC)
                    : header.column.toggleSorting(true);
                }}
                isDisabled={sort === SortDirection.DESC}
              >
                Sort Descending
              </MenuItem>
              <MenuItem
                onAction={() => {
                  manualSorting
                    ? handleSortChange?.(header.column.id, null)
                    : header.column.clearSorting();
                }}
                isDisabled={!sort}
              >
                Clear Sort
              </MenuItem>
            </>
          )}
        </Menu>
      </MenuTrigger>
    </div>
  );
}

export function TableHeaderCell<T>({
  ref,
  children,
  className,
  header,
  ...rest
}: TableHeaderCellProps<T>) {
  const { columnSelection } = useContext(TableContext);
  const renderProps = header?.getContext();
  const sortLabel =
    header?.column.getIsSorted() === SortDirection.ASC
      ? 'ascending'
      : header?.column.getIsSorted() === SortDirection.DESC
        ? 'descending'
        : undefined;

  return (
    <th {...rest} ref={ref} aria-sort={sortLabel}>
      <div
        className={clsx('group/header-cell', styles.headerCell, className)}
        data-selected={header?.column.id === columnSelection || null}
      >
        {children ||
          (header && (
            <>
              {header.column.id !== HeaderColumnAction.KEBAB &&
                // {header.column.id !== '8' &&
                renderProps &&
                flexRender(header.column.columnDef.header, renderProps)}
              <HeaderCellMenu header={header} />
            </>
          ))}
      </div>
    </th>
  );
}
