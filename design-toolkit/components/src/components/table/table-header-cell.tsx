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
import { type Header, flexRender } from '@tanstack/react-table';
import { useContext, useState } from 'react';
import { TableContext } from '.';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { TableStyles, headerCellStyles } from './styles';
import { type TableHeaderCellProps } from './types';

const { headerCellButton, headerKebab, menuItem } = TableStyles();

export function HeaderCell({
  ref,
  className,
  narrow,
  header,
  ...props
}: TableHeaderCellProps<any>) {
  const {
    enableColumnReordering,
    enableSorting,
    moveColumnLeft,
    moveColumnRight,
    persistHeaderKebabMenu,
    setColumnSelection,
  } = useContext(TableContext);

  const [hoveredArrow, setHoveredArrow] = useState(false);

  const showKebab = enableColumnReordering || enableSorting;

  const headerActionIcon = (isAsc: boolean) => {
    return (
      <div
        onMouseEnter={() => setHoveredArrow(true)}
        onMouseLeave={() => setHoveredArrow(false)}
      >
        {hoveredArrow ? <Kebab /> : isAsc ? <ArrowUp /> : <ArrowDown />}
      </div>
    );
  };

  const tableMenu = (header: Header<any, any>) => {
    if (!(enableSorting || enableColumnReordering)) {
      return;
    }
    return (
      <Menu.Trigger
        onOpenChange={(isOpen) => {
          setColumnSelection?.(isOpen ? header.column.id : null);
        }}
      >
        <Button variant='icon' aria-label='Menu'>
          <Icon>
            {header?.column.getIsSorted() === 'asc' ? (
              headerActionIcon(true)
            ) : header?.column.getIsSorted() === 'desc' ? (
              headerActionIcon(false)
            ) : (
              <Kebab
                className={headerKebab({
                  persistKebab: persistHeaderKebabMenu,
                })}
              />
            )}
          </Icon>
        </Button>
        <Menu>
          {enableColumnReordering && (
            <>
              <Menu.Item
                classNames={{ item: menuItem() }}
                onAction={() => {
                  moveColumnLeft?.(header.column.getIndex() ?? -1);
                }}
                isDisabled={header.column.getIsFirstColumn('center')}
              >
                <Menu.Item.Label>Move Column Left</Menu.Item.Label>
              </Menu.Item>
              <Menu.Item
                classNames={{ item: menuItem() }}
                onAction={() => {
                  moveColumnRight?.(header.column.getIndex() ?? -1);
                }}
                isDisabled={header.column.getIsLastColumn('center')}
              >
                <Menu.Item.Label>Move Column Right</Menu.Item.Label>
              </Menu.Item>
            </>
          )}
          {enableSorting && (
            <>
              <Menu.Separator />
              <Menu.Item
                classNames={{ item: menuItem() }}
                onAction={() => {
                  header.column.toggleSorting(false);
                }}
                isDisabled={header.column.getIsSorted() === 'asc'}
              >
                <Menu.Item.Label>Sort Ascending</Menu.Item.Label>
              </Menu.Item>
              <Menu.Item
                onAction={() => {
                  header.column.toggleSorting(true);
                }}
                isDisabled={header.column.getIsSorted() === 'desc'}
              >
                <Menu.Item.Label>Sort Descending</Menu.Item.Label>
              </Menu.Item>
              <Menu.Item
                onAction={() => {
                  header?.column.clearSorting();
                }}
                isDisabled={!header.column.getIsSorted()}
              >
                <Menu.Item.Label>Clear Sort</Menu.Item.Label>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Menu.Trigger>
    );
  };

  return (
    <th
      {...props}
      ref={ref}
      className={headerCellStyles({ narrow, className, showKebab })}
    >
      {props.children ||
        (header && (
          <div className={headerCellButton()}>
            {header.column.id === 'kebab' ? null : (
              <div>
                {header.getContext() &&
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              </div>
            )}

            {['numeral', 'kebab', 'selection'].includes(header.column.id ?? '')
              ? null
              : tableMenu(header)}
          </div>
        ))}
    </th>
  );
}
