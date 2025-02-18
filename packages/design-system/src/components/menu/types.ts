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

import type {
  PopoverRenderProps,
  MenuItemProps as RACMenuItemProps,
  MenuItemRenderProps as RACMenuItemRenderProps,
  MenuProps as RACMenuProps,
  PopoverProps as RACPopoverProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types';
import type { IconClassNames } from '../icon/types';

export type MenuClassNames = PartialDeep<{
  menu: {
    container: string;
    menu: string;
  };
  list: {
    container: string;
    list: string;
    section: string;
    header: string;
    separator: string;
  };
  item: {
    container: string;
    item: string;
    icon: IconClassNames;
    label: string;
    description: string;
    more: IconClassNames;
    shortcut: string;
  };
}>;

export type MenuSizes = 'sm' | 'lg';

export type MenuMapping = {
  description: Partial<Record<MenuSizes, string>>;
  header: Partial<Record<MenuSizes, string>>;
  label: Partial<Record<MenuSizes, string>>;
  shortcut: Partial<Record<MenuSizes, string>>;
};

type BaseMenuProps = {
  classNames?: MenuClassNames;
  mapping?: Partial<MenuMapping>;
  size?: MenuSizes;
};

export type MenuProps = Omit<RACPopoverProps, 'className' | 'style'> &
  BaseMenuProps;

export type MenuListProps<T> = Omit<RACMenuProps<T>, 'className' | 'style'> &
  BaseMenuProps;

export type MenuItemProps<T> = Omit<
  RACMenuItemProps<T>,
  'className' | 'style'
> &
  BaseMenuProps;

export type MenuRenderProps = AsType<PopoverRenderProps> &
  Required<Pick<BaseMenuProps, 'size'>>;

export type MenuItemRenderProps = AsType<RACMenuItemRenderProps> &
  Required<Pick<BaseMenuProps, 'size'>>;

export type MenuState = Omit<MenuRenderProps, 'trigger'>;

export type MenuItemState = Omit<
  MenuItemRenderProps,
  'allowsDragging' | 'isDragging' | 'isDropTarget'
> & {
  hasDescription: boolean;
};
