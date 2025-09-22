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
import { type Header, flexRender } from '@tanstack/react-table';
import { useContext, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
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
  } = useContext(TableContext);

  const [hoveredArrow, setHoveredArrow] = useState(false);

  if (
    ['numeral', 'kebab', 'selection'].includes(header.column.id) ||
    !(enableSorting || enableColumnReordering)
  ) {
    return null;
  }

  const sort = header.column.getIsSorted();

  return (
    <Menu.Trigger
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
          {!hoveredArrow && sort === 'desc' && <ArrowDown />}
          {!hoveredArrow && sort === 'asc' && <ArrowUp />}
        </Icon>
      </Button>
      <Menu>
        {enableColumnReordering && (
          <>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => moveColumnLeft(header.column.getIndex())}
              isDisabled={header.column.getIsFirstColumn('center')}
            >
              Move Column Left
            </Menu.Item>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => moveColumnRight(header.column.getIndex())}
              isDisabled={header.column.getIsLastColumn('center')}
            >
              Move Column Right
            </Menu.Item>
          </>
        )}
        {enableColumnReordering && enableSorting && <Menu.Separator />}
        {enableSorting && (
          <>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => header.column.toggleSorting(false)}
              isDisabled={sort === 'asc'}
            >
              Sort Ascending
            </Menu.Item>
            <Menu.Item
              onAction={() => header.column.toggleSorting(true)}
              isDisabled={sort === 'desc'}
            >
              Sort Descending
            </Menu.Item>
            <Menu.Item onAction={header.column.clearSorting} isDisabled={!sort}>
              Clear Sort
            </Menu.Item>
          </>
        )}
      </Menu>
    </Menu.Trigger>
  );
}

export function HeaderCell<T>({
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
    header?.column.id === 'numeral' || header?.column.id === 'kebab';

  return (
    <th {...rest} ref={ref}>
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
              {header.column.id !== 'kebab' &&
                renderProps &&
                flexRender(header.column.columnDef.header, renderProps)}
              <HeaderCellMenu header={header} />
            </>
          ))}
      </div>
    </th>
  );
}
