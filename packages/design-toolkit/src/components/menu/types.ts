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

import type { ReactElement, RefAttributes } from 'react';
import type {
  MenuItemProps as AriaMenuItemProps,
  MenuProps as AriaMenuProps,
  MenuSectionProps as AriaMenuSectionProps,
  PopoverProps as AriaPopoverProps,
  TextProps as AriaTextProps,
  PopoverProps,
} from 'react-aria-components';
import type { IconProps } from '../icon/types';

/**
 * Props for the Menu component.
 */
export type MenuProps<T> = Omit<AriaMenuProps<T>, 'className'> &
  RefAttributes<HTMLDivElement> & {
    /** CSS class names for menu elements. */
    classNames?: {
      /** Class name for the menu container. */
      menu?: AriaMenuProps<T>['className'];
      /** Class name for the popover wrapper. */
      popover?: PopoverProps['className'];
    };
    /** Props passed to the internal Popover component. */
    popoverProps?: Omit<AriaPopoverProps, 'children' | 'className'>;
    /** Visual density variant for the menu. */
    variant?: 'compact' | 'cozy';
  };

/**
 * Props for the MenuItem component.
 */
export type MenuItemProps = Omit<AriaMenuItemProps, 'className'> & {
  /** CSS class names for menu item elements. */
  classNames?: {
    /** Class name for the menu item container. */
    item?: AriaMenuItemProps['className'];
    /** Class name for the text label. */
    text?: AriaTextProps['className'];
    /** Class name for the submenu indicator icon. */
    more?: IconProps['className'];
    /** Class name for the item icon. */
    icon?: IconProps['className'];
    /** Class name for the hotkey display. */
    hotkey?: string;
  };
  /** Color variant for the menu item. */
  color?: 'info' | 'serious' | 'critical';
};

/**
 * Props for the MenuSection component.
 */
export type MenuSectionProps<T> = Omit<AriaMenuSectionProps<T>, 'className'> & {
  /** CSS class names for section elements. */
  classNames?: {
    /** Class name for the section container. */
    section?: AriaMenuSectionProps<T>['className'];
    /** Class name for the section header. */
    header?: string;
  };
  /** Title displayed in the section header. */
  title?: string | ReactElement;
};
