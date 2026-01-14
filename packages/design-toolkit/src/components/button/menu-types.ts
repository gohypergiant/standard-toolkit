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

import type { ReactNode } from 'react';
import type { PopoverProps as AriaPopoverProps } from 'react-aria-components';
import type { ButtonProps } from './types';
import type { MenuProps } from '../menu/types';

export type MenuButtonProps = {
  /**
   * Content to render inside the button, before the chevron icon.
   * Can be text, an Icon component, or both.
   */
  buttonChildren?: ReactNode;

  /**
   * Props passed to the internal Button component.
   * Excludes 'children' as that's handled by buttonChildren.
   */
  buttonProps?: Omit<ButtonProps, 'children'>;

  /**
   * Props passed to the internal Menu component.
   * Excludes 'children' as that's handled by the MenuButton's children.
   */
  menuProps?: Omit<MenuProps<object>, 'children'>;

  /**
   * Menu items to display when the button is clicked.
   * Accepts MenuItem, MenuSection, MenuSeparator, MenuSubmenu, etc.
   */
  children: ReactNode;

  /**
   * Optional tooltip text to display when hovering over the button.
   * Tooltip is automatically hidden when the menu is open.
   */
  tooltip?: string;

  /**
   * Props passed to the internal Popover component.
   */
  popoverProps?: Omit<AriaPopoverProps, 'children' | 'className'>;
};
