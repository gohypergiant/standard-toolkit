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
import { ListItemTitle } from './item-title';
import styles from './styles.module.css';
import type { ListItemProps } from './types';

/**
 * ListItem - Individual selectable item within a List
 *
 * Represents a single row in the grid list with full interaction support including
 * selection, hover states, and keyboard navigation. Can contain icons, content,
 * indicators, and action elements. If children is a string, it will be automatically
 * wrapped in a ListItemTitle.
 *
 * @example
 * <ListItem textValue="User item">
 *   <Icon><Avatar /></Icon>
 *   <ListItemContent>
 *     <ListItemTitle>John Doe</ListItemTitle>
 *     <ListItemDescription>Software Engineer</ListItemDescription>
 *   </ListItemContent>
 * </ListItem>
 */
export function ListItem<T extends object>({
  children,
  classNames,
  textValue = typeof children === 'string' ? children : '',
  ...rest
}: ListItemProps<T>) {
  return (
    <GridListItem
      className={composeRenderProps(classNames?.item, (className) =>
        clsx('group/list-item', styles.item, className),
      )}
      textValue={textValue}
      {...rest}
    >
      {composeRenderProps(children, (children) =>
        typeof children === 'string' ? (
          <ListItemTitle>{children}</ListItemTitle>
        ) : (
          children
        ),
      )}
    </GridListItem>
  );
}
