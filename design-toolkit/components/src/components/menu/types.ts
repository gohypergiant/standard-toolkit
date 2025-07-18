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

import type { HTMLAttributes, PropsWithChildren, RefAttributes } from 'react';
import type {
  MenuItemProps as AriaMenuItemProps,
  MenuProps as AriaMenuProps,
  MenuSectionProps as AriaMenuSectionProps,
  MenuTriggerProps as AriaMenuTriggerProps,
  PopoverProps as AriaPopoverProps,
  SeparatorProps as AriaSeparatorProps,
  SubmenuTriggerProps as AriaSubmenuTriggerProps,
  TextProps as AriaTextProps,
} from 'react-aria-components';
import type { IconProps } from '../icon/types';
import type { MenuStyleVariants } from './styles';

export type MenuProps<T> = AriaMenuProps<T> &
  Pick<MenuStyleVariants, 'variant'> &
  RefAttributes<HTMLDivElement> &
  Pick<
    AriaPopoverProps,
    'placement' | 'offset' | 'containerPadding' | 'isNonModal'
  >;

export type MenuItemProps = Omit<AriaMenuItemProps, 'className'> & {
  color?: 'info' | 'serious';
  classNames?: {
    item?: AriaMenuItemProps['className'];
    text?: AriaTextProps['className'];
    more?: IconProps['className'];
  };
};

export type MenuTriggerProps = AriaMenuTriggerProps;

export type SubmenuTriggerProps = AriaSubmenuTriggerProps;

export type MenuSectionProps<T> = Omit<AriaMenuSectionProps<T>, 'className'> & {
  header?: string;
  classNames?: {
    section?: string;
    sectionHeader?: string;
  };
};

export type SeparatorProps = AriaSeparatorProps;

export type MenuTextProps = PropsWithChildren & AriaTextProps;

export type MenuIconProps = PropsWithChildren & IconProps;

export type MenuKeyboardProps = PropsWithChildren & HTMLAttributes<HTMLElement>;
