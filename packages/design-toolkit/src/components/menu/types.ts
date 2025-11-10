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

import type { RefAttributes } from 'react';
import type {
  MenuItemProps as AriaMenuItemProps,
  MenuProps as AriaMenuProps,
  MenuSectionProps as AriaMenuSectionProps,
  PopoverProps as AriaPopoverProps,
  TextProps as AriaTextProps,
  PopoverProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { IconProps } from '../icon/types';
import type { MenuStyles } from './styles';

export type MenuProps<T> = Omit<AriaMenuProps<T>, 'className'> &
  VariantProps<typeof MenuStyles> &
  RefAttributes<HTMLDivElement> & {
    classNames?: {
      menu?: AriaMenuProps<T>['className'];
      popover?: PopoverProps['className'];
    };
    popoverProps?: Omit<AriaPopoverProps, 'children' | 'className'>;
  };

export type MenuItemProps = Omit<AriaMenuItemProps, 'className'> & {
  classNames?: {
    item?: AriaMenuItemProps['className'];
    text?: AriaTextProps['className'];
    more?: IconProps['className'];
    icon?: IconProps['className'];
    hotkey?: string;
  };
  color?: 'info' | 'serious' | 'critical';
};

export type MenuSectionProps<T> = Omit<AriaMenuSectionProps<T>, 'className'> & {
  classNames?: {
    section?: AriaMenuSectionProps<T>['className'];
    header?: string;
  };
  title?: string;
};
