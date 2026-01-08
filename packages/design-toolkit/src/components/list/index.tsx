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
  useContextProps,
} from 'react-aria-components';
import { IconProvider } from '../icon/context';
import { ListContext } from './context';
import styles from './styles.module.css';
import type { ListProps } from './types';

/**
 * List - A flexible grid list component for selectable items with rich content
 *
 * Provides accessible grid list functionality with support for selection,
 * and rich item content including labels, descriptions, icons, and actions. Perfect for
 * data tables, file lists, or any selectable grid interface.
 *
 * @example
 * // Basic list view with sizing
 * <div className='h-[400px] w-[300px]'>
 *   <List className='h-full' aria-label='Items'>
 *     <ListItem>
 *       <ListItemContent>
 *         <ListItemTitle>Item 1</ListItemTitle>
 *       </ListItemContent>
 *     </ListItem>
 *   </List>
 * </div>
 */
export function List<T extends object>({ ref, ...props }: ListProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, ListContext);

  const { children, className, variant, ...rest } = props;

  return (
    <ListContext.Provider value={{ variant }}>
      <IconProvider size={variant === 'cozy' ? 'large' : 'small'}>
        <GridList<T>
          {...rest}
          ref={ref}
          className={composeRenderProps(className, (className) =>
            clsx('group/list', styles.list, className),
          )}
        >
          {children}
        </GridList>
      </IconProvider>
    </ListContext.Provider>
  );
}
