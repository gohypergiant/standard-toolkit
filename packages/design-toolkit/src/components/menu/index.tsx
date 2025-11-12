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
  Popover,
  useContextProps,
} from 'react-aria-components';
import { MenuContext } from './context';
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
 * <MenuTrigger>
 *   <Button>Open Menu</Button>
 *   <Menu>
 *     <MenuItem>Edit</MenuItem>
 *     <MenuItem>Copy</MenuItem>
 *     <MenuItem>Delete</MenuItem>
 *   </Menu>
 * </MenuTrigger>
 *
 * @example
 * // Menu with sections and separators
 * <MenuTrigger>
 *   <Button>Open</Button>
 *   <Menu>
 *     <MenuSection>
 *       <MenuItem>New File</MenuItem>
 *       <MenuItem>Open File</MenuItem>
 *     </MenuSection>
 *
 *     <MenuSeparator />
 *
 *     <MenuItem>Settings</MenuItem>
 *   </Menu>
 * </MenuTrigger>
 *
 * @example
 * // Menu with selection
 * <MenuTrigger>
 *   <Button>Group</Button>
 *   <Menu selectionMode='multiple'>
 *     <MenuItem>Option 1</MenuItem>
 *     <MenuItem>Option 2</MenuItem>
 *   </Menu>
 * </MenuTrigger>
 *
 * @example
 * // Menu with submenu
 * <MenuTrigger>
 *   <Button>Actions</Button>
 *   <Menu>
 *     <MenuItem>New File</MenuItem>
 *     <MenuSubmenu>
 *       <MenuItem>Export</MenuItem>
 *       <Menu>
 *         <MenuItem>Export as PDF</MenuItem>
 *         <MenuItem>Export as CSV</MenuItem>
 *         <MenuItem>Export as JSON</MenuItem>
 *       </Menu>
 *     </MenuSubmenu>
 *     <MenuItem>Delete</MenuItem>
 *   </Menu>
 * </MenuTrigger>
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
