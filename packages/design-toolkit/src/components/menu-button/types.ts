/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { Key, ReactNode } from 'react';
import type {
  MenuProps as AriaMenuProps,
  PopoverProps as AriaPopoverProps,
  Selection,
} from 'react-aria-components';
import type { ButtonStyleVariants } from '../button/types';

export type MenuButtonProps = ButtonStyleVariants & {
  /**
   * The label text displayed on the button.
   * Optional for icon-only mode (when variant="icon").
   */
  label?: ReactNode;

  /**
   * Optional icon to display before the label.
   */
  icon?: ReactNode;

  /**
   * Menu items to display when the button is clicked.
   * Accepts MenuItem, MenuSection, MenuSeparator, MenuSubmenu, etc.
   */
  children: ReactNode;

  /**
   * The variant of the internal Menu component.
   * @default 'cozy'
   */
  menuVariant?: 'compact' | 'cozy';

  /**
   * Selection mode for menu items.
   * @default 'single'
   */
  selectionMode?: AriaMenuProps<object>['selectionMode'];

  /**
   * The currently selected keys in the menu.
   */
  selectedKeys?: Iterable<Key>;

  /**
   * Handler called when the selection changes.
   */
  onSelectionChange?: (keys: Selection) => void;

  /**
   * Handler called when a menu item is activated.
   */
  onAction?: (key: Key) => void;

  /**
   * Props passed to the internal Popover component.
   */
  popoverProps?: Omit<AriaPopoverProps, 'children' | 'className'>;

  /**
   * Whether the button is disabled.
   */
  isDisabled?: boolean;

  /**
   * Accessible label for the button.
   * Required when no label is provided (icon-only mode).
   */
  'aria-label'?: string;

  /**
   * Additional CSS class name for the button.
   */
  className?: string;

  /**
   * Optional tooltip text to display when hovering over the button.
   * Tooltip is automatically hidden when the menu is open.
   */
  tooltip?: string;
};
