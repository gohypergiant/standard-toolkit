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
import {
  Menu as AriaMenu,
  composeRenderProps,
  MenuTrigger,
  Popover,
  SubmenuTrigger,
  useContextProps,
} from 'react-aria-components';
import { MenuContext } from './context';
import { MenuItem } from './menu-item';
import { MenuSection } from './menu-section';
import { MenuSeparator } from './menu-separator';
import { MenuStyles, MenuStylesDefaults } from './styles';
import type { MenuProps } from './types';

const { menu, popover } = MenuStyles();

/**
 * Menu - A dropdown menu component with keyboard navigation and selection
 *
 * Provides accessible dropdown menu functionality with support for single and
 * multiple selection modes. Includes sections, separators, and submenu support
 * with comprehensive keyboard navigation and ARIA compliance.
 *
 * @example
 * // Basic menu with trigger
 * <Menu.Trigger>
 *   <Button>Open Menu</Button>
 *   <Menu>
 *     <Menu.Item>Edit</Menu.Item>
 *     <Menu.Item>Copy</Menu.Item>
 *     <Menu.Item>Delete</Menu.Item>
 *   </Menu>
 * </Menu.Trigger>
 *
 * @example
 * // Menu with sections and separators
 * <Menu.Trigger>
 *   <Button>Open</Button>
 *   <Menu>
 *     <Menu.Section>
 *       <Menu.Item>New File</Menu.Item>
 *       <Menu.Item>Open File</Menu.Item>
 *     </Menu.Section>
 *
 *     <Menu.Separator />
 *
 *     <Menu.Item>Settings</Menu.Item>
 *   </Menu>
 * </Menu.Trigger>
 *
 * @example
 * // Menu with selection
 * <Menu.Trigger>
 *   <Button>Group</Button>
 *   <Menu selectionMode='multiple'>
 *     <Menu.Item>Option 1</Menu.Item>
 *     <Menu.Item>Option 2</Menu.Item>
 *   </Menu>
 * </Menu.Trigger>
 *
 * @example
 * // Menu with submenu
 * <Menu.Trigger>
 *   <Button>Actions</Button>
 *   <Menu>
 *     <Menu.Item>New File</Menu.Item>
 *     <Menu.Submenu>
 *       <Menu.Item>Export</Menu.Item>
 *       <Menu>
 *         <Menu.Item>Export as PDF</Menu.Item>
 *         <Menu.Item>Export as CSV</Menu.Item>
 *         <Menu.Item>Export as JSON</Menu.Item>
 *       </Menu>
 *     </Menu.Submenu>
 *     <Menu.Item>Delete</Menu.Item>
 *   </Menu>
 * </Menu.Trigger>
 */
export function Menu<T extends object>({ ref, ...props }: MenuProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, MenuContext);

  const {
    children,
    classNames,
    popoverProps,
    selectionMode = 'single',
    variant = MenuStylesDefaults.variant,
    ...rest
  } = props;

  return (
    <Popover
      {...popoverProps}
      className={composeRenderProps(classNames?.popover, (className) =>
        popover({ className }),
      )}
    >
      <MenuContext.Provider value={{ variant }}>
        <AriaMenu
          {...rest}
          ref={ref}
          className={composeRenderProps(classNames?.menu, (className) =>
            menu({ className, variant }),
          )}
          selectionMode={selectionMode}
        >
          {children}
        </AriaMenu>
      </MenuContext.Provider>
    </Popover>
  );
}

Menu.Trigger = MenuTrigger;
Menu.Submenu = SubmenuTrigger;
Menu.Item = MenuItem;
Menu.Separator = MenuSeparator;
Menu.Section = MenuSection;
