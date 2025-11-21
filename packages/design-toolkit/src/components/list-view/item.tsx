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
'use client';

import 'client-only';
import { clsx } from '@accelint/design-foundation/lib/utils';
import { composeRenderProps, GridListItem } from 'react-aria-components';
import { IconProvider } from '../icon/context';
import { useListViewItemSize } from './context';
import { ListViewItemTitle } from './item-title';
import styles from './styles.module.css';
import type { ListViewDataItem, ListViewItemProps } from './types';

export function ListViewItem<T extends ListViewDataItem>({
  children,
  classNames,
  textValue = typeof children === 'string' ? children : '',
  ...rest
}: ListViewItemProps<T>) {
  const size = useListViewItemSize();

  return (
    <GridListItem
      {...rest}
      className={composeRenderProps(classNames?.item, (className) =>
        clsx('group/listView-item', styles.item, className),
      )}
      textValue={textValue}
    >
      {composeRenderProps(children, (children) => (
        <IconProvider
          className={clsx(styles.icon, classNames?.icon)}
          size={
            size === 'compact' ? 'small' : size === 'cozy' ? 'medium' : 'small'
          }
        >
          {typeof children === 'string' ? (
            <ListViewItemTitle>{children}</ListViewItemTitle>
          ) : (
            children
          )}
        </IconProvider>
      ))}
    </GridListItem>
  );
}
