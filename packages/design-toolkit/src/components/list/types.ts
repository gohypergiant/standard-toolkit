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

import type { ComponentPropsWithRef, RefAttributes } from 'react';
import type { GridListItemProps, GridListProps } from 'react-aria-components';
import type { IconProps } from '../icon/types';

/**
 * Visual density variant for list items.
 */
export type ListItemVariant = 'cozy' | 'compact';

/**
 * Props for the ListItem component.
 */
export type ListItemProps<T extends object> = Omit<
  GridListItemProps<T>,
  'className'
> & {
  /** CSS class names for list item elements. */
  classNames?: {
    /** Class name for the list item container. */
    item?: GridListItemProps['className'];
    /** Class name for the list item icon. */
    icon?: IconProps['className'];
  };
};

/**
 * Props for the ListItemTitle component.
 */
export type ListItemTitleProps = ComponentPropsWithRef<'div'>;

/**
 * Props for the ListItemDescription component.
 */
export type ListItemDescriptionProps = ComponentPropsWithRef<'div'>;

/**
 * Props for the ListItemContent component.
 */
export type ListItemContentProps = ComponentPropsWithRef<'div'>;

/**
 * Props for the List component.
 */
export type ListProps<T> = Omit<
  GridListProps<T>,
  'orientation' | 'layout' | 'dragAndDropHooks'
> &
  RefAttributes<HTMLDivElement> & {
    /** Visual density variant for list items. */
    variant?: ListItemVariant;
  };
