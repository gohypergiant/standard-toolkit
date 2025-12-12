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
import {
  composeRenderProps,
  GridList,
  ListLayout,
  useContextProps,
  Virtualizer,
} from 'react-aria-components';
import { ListViewContext, ListViewStylesDefaults } from './context';
import styles from './styles.module.css';
import type { ListViewDataItem, ListViewProps } from './types';

/**
 * ListView - A flexible grid list component for selectable items with rich content
 *
 * Provides accessible grid list functionality with support for selection, virtualization,
 * and rich item content including labels, descriptions, icons, and actions. Perfect for
 * data tables, file lists, or any selectable grid interface.
 *
 * Note: Virtualization is enabled by default. You must set explicit dimensions on the
 * ListView itself (not a wrapper) for virtualization to work properly.
 *
 * @example
 * // Basic list view with sizing
 * <div className='h-[400px] w-[300px]'>
 *   <ListView className='h-full' aria-label='Items'>
 *     <ListViewItem>
 *       <ListViewItemContent>
 *         <ListViewItemTitle>Item 1</ListViewItemTitle>
 *       </ListViewItemContent>
 *     </ListViewItem>
 *   </ListView>
 * </div>
 */
export function ListView<T extends ListViewDataItem>({
  ref,
  ...props
}: ListViewProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, ListViewContext);

  const { children, className, ...rest } = props;
  const size = props.size ?? ListViewStylesDefaults.size;

  return (
    <ListViewContext.Provider value={{ size }}>
      <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 48 }}>
        <GridList<T>
          {...rest}
          ref={ref}
          className={composeRenderProps(className, (className) =>
            clsx('group/listView', styles.listView, className),
          )}
        >
          {children}
        </GridList>
      </Virtualizer>
    </ListViewContext.Provider>
  );
}

export { ListViewContext } from './context';
export { ListViewItem } from './item';
export { ListViewItemContent } from './item-content';
export { ListViewItemDescription } from './item-description';
export { ListViewItemTitle } from './item-title';
export type {
  ListViewDataItem,
  ListViewItemContentProps,
  ListViewItemDescriptionProps,
  ListViewItemProps,
  ListViewItemTitleProps,
  ListViewProps,
} from './types';
