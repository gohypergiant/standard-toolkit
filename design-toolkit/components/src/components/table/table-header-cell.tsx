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
import { flexRender } from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { TableStyles, headerCellStyles } from './styles';
import { ColumnKebabMenuItems, type TableHeaderCellProps } from './types';

const { headerCellButton, headerKebab, menuItem } = TableStyles();

export function HeaderCell({
  ref,
  className,
  narrow,
  header,
  enableColumnReordering,
  enableSorting,
  moveColumnLeft,
  moveColumnRight,
  persistHeaderKebabMenu,
  setColumnSelection,
  ...props
}: TableHeaderCellProps<any>) {
  const [hoveredArrow, setHoveredArrow] = useState<boolean>(false);

  return (
    <th
      ref={ref}
      className={headerCellStyles({ narrow, className })}
      {...props}
    >
      {props.children ||
        (header && (
          <div className={headerCellButton()}>
            {header.column.id === 'kebab' ? null : (
              <button type='button'>
                {header.getContext() &&
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              </button>
            )}

            {['numeral', 'kebab', 'selection'].includes(header.column.id ?? '')
              ? null
              : (enableColumnReordering || enableSorting) && (
                  <Menu.Trigger
                    onOpenChange={(isOpen) => {
                      if (isOpen) {
                        setColumnSelection?.(header.column.id);
                      } else {
                        setColumnSelection?.(null);
                      }
                    }}
                  >
                    <Button variant='icon' aria-label='Menu'>
                      <Icon>
                        {header?.column.getIsSorted() === 'asc' ? (
                          <div
                            onMouseEnter={() => setHoveredArrow(true)}
                            onMouseLeave={() => setHoveredArrow(false)}
                          >
                            {hoveredArrow ? <Kebab /> : <ArrowUp />}
                          </div>
                        ) : header?.column.getIsSorted() === 'desc' ? (
                          <div
                            onMouseEnter={() => setHoveredArrow(true)}
                            onMouseLeave={() => setHoveredArrow(false)}
                          >
                            {hoveredArrow ? <Kebab /> : <ArrowDown />}
                          </div>
                        ) : (
                          <div
                            className={headerKebab({
                              persistKebab: persistHeaderKebabMenu,
                            })}
                          >
                            <Kebab />
                          </div>
                        )}
                      </Icon>
                    </Button>
                    <Menu>
                      {enableColumnReordering && (
                        <>
                          <Menu.Item
                            classNames={{ item: menuItem() }}
                            onAction={() => {
                              moveColumnLeft
                                ? moveColumnLeft(header.column.getIndex() ?? -1)
                                : null;
                            }}
                            isDisabled={header.column.getIsFirstColumn(
                              'center',
                            )}
                          >
                            <Menu.Item.Label>
                              {ColumnKebabMenuItems.Left}
                            </Menu.Item.Label>
                          </Menu.Item>
                          <Menu.Item
                            classNames={{ item: menuItem() }}
                            onAction={() => {
                              moveColumnRight
                                ? moveColumnRight(
                                    header.column.getIndex() ?? -1,
                                  )
                                : null;
                            }}
                            isDisabled={header.column.getIsLastColumn('center')}
                          >
                            <Menu.Item.Label>
                              {ColumnKebabMenuItems.Right}
                            </Menu.Item.Label>
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
                            <Menu.Item.Label>
                              {ColumnKebabMenuItems.Asc}
                            </Menu.Item.Label>
                          </Menu.Item>
                          <Menu.Item
                            onAction={() => {
                              header.column.toggleSorting(true);
                            }}
                            isDisabled={header.column.getIsSorted() === 'desc'}
                          >
                            <Menu.Item.Label>
                              {ColumnKebabMenuItems.Desc}
                            </Menu.Item.Label>
                          </Menu.Item>
                          <Menu.Item
                            onAction={() => {
                              header?.column.clearSorting();
                            }}
                            isDisabled={!header.column.getIsSorted()}
                          >
                            <Menu.Item.Label>
                              {ColumnKebabMenuItems.Clear}
                            </Menu.Item.Label>
                          </Menu.Item>
                        </>
                      )}
                    </Menu>
                  </Menu.Trigger>
                )}
          </div>
        ))}
    </th>
  );
}
