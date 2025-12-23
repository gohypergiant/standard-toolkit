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
import type {
  GridListItemProps,
  GridListProps,
  Key,
} from 'react-aria-components';
import type { IconProps } from '../icon/types';

export type ListDataItem = {
  id: Key;
  title: string;
  children?: ListDataItem[];
};

export type ListItemVariant = 'cozy' | 'compact';

export type ListItemProps<T extends ListDataItem> = Omit<
  GridListItemProps<T>,
  'className'
> &
  RefAttributes<T> & {
    classNames?: {
      item?: GridListItemProps['className'];
      icon?: IconProps['className'];
    };
  };

export type ListItemIconProps = ComponentPropsWithRef<'div'> & {
  children: React.ReactNode;
  className?: string;
};

export type ListItemTitleProps = ComponentPropsWithRef<'div'> & {
  children: string;
  className?: string;
};

export type ListItemDescriptionProps = ComponentPropsWithRef<'div'> & {
  children: string;
  className?: string;
};

export type ListItemContentProps = ComponentPropsWithRef<'div'> & {
  children: React.ReactNode;
  className?: string;
};

export type ListItemIndicatorProps = ComponentPropsWithRef<'div'> & {
  children: React.ReactNode;
  className?: string;
};

export type ListItemActionsProps = {
  children: React.ReactNode;
};

export type ListProps<T extends ListDataItem> = Omit<
  GridListProps<T>,
  'orientation' | 'layout' | 'dragAndDropHooks'
> &
  RefAttributes<HTMLDivElement> & {
    variant?: ListItemVariant;
  };
