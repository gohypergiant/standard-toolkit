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
import { TableHeaderCellStyles, TableStyles } from './styles';
import type { TableHeaderCellProps } from './types';

const { menuItem } = TableStyles();

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
    <MenuTrigger
      onOpenChange={(isOpen) =>
        setColumnSelection(isOpen ? header.column.id : null)
      }
    >
      <Button
        variant='icon'
        aria-label='Menu'
        onHoverChange={setHoveredArrow}
        className={TableHeaderCellStyles({
          notPersistHeaderKebab: !persistHeaderKebabMenu,
        })}
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
              classNames={{ item: menuItem() }}
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
              classNames={{ item: menuItem() }}
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
              classNames={{ item: menuItem() }}
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
              classNames={{ item: menuItem() }}
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
              classNames={{ item: menuItem() }}
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
  );
}

export function TableHeaderCell<T>({
  ref,
  children,
  className,
  header,
  ...rest
}: TableHeaderCellProps<T>) {
  const { columnSelection, enableColumnReordering, enableSorting } =
    useContext(TableContext);
  const showKebab = enableColumnReordering || enableSorting;
  const renderProps = header?.getContext();
  const narrow =
    header?.column.id === HeaderColumnAction.NUMERAL ||
    header?.column.id === HeaderColumnAction.KEBAB;
  const sortLabel =
    header?.column.getIsSorted() === SortDirection.ASC
      ? 'ascending'
      : header?.column.getIsSorted() === SortDirection.DESC
        ? 'descending'
        : undefined;

  return (
    <th {...rest} ref={ref} aria-sort={sortLabel}>
      <div
        className={TableHeaderCellStyles({
          narrow,
          className,
          isKebabEnabled: showKebab,
        })}
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
