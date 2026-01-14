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

'use client';

import 'client-only';
import ChevronDown from '@accelint/icons/chevron-down';
import { useRef, useState } from 'react';
import { Button } from './index';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { MenuTrigger } from '../menu/trigger';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import styles from './menu.module.css';
import type { MenuButtonProps } from './menu-types';

/**
 * MenuButton - A convenience wrapper that combines Button + MenuTrigger + Menu
 *
 * Provides a streamlined API for the common pattern of a button that opens a
 * dropdown menu. The chevron icon is automatically included and children are
 * wrapped in a Menu internally.
 *
 * @example
 * // Basic menu button
 * <MenuButton buttonChildren="Actions">
 *   <MenuItem>Edit</MenuItem>
 *   <MenuItem>Copy</MenuItem>
 *   <MenuItem>Delete</MenuItem>
 * </MenuButton>
 *
 * @example
 * // With icon
 * <MenuButton
 *   buttonChildren={<><Icon><Plus /></Icon>Create</>}
 *   buttonProps={{ variant: 'filled', color: 'accent' }}
 * >
 *   <MenuItem>New File</MenuItem>
 *   <MenuItem>New Folder</MenuItem>
 * </MenuButton>
 *
 * @example
 * // Icon-only (chevron dropdown)
 * <MenuButton buttonProps={{ variant: 'icon', 'aria-label': 'More options' }}>
 *   <MenuItem>Edit</MenuItem>
 *   <MenuItem>Delete</MenuItem>
 * </MenuButton>
 *
 * @example
 * // With action handler
 * <MenuButton
 *   buttonChildren="Actions"
 *   menuProps={{ onAction: (key) => console.log(key) }}
 * >
 *   <MenuItem id="edit">Edit</MenuItem>
 *   <MenuItem id="delete">Delete</MenuItem>
 * </MenuButton>
 */
export function MenuButton({
  buttonChildren,
  buttonProps = {},
  menuProps = {},
  children,
  tooltip,
  popoverProps,
}: MenuButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Destructure button props with defaults
  const {
    variant = 'filled',
    size = 'medium',
    color = 'mono-muted',
    className,
    ...restButtonProps
  } = buttonProps;

  const menuContent = (
    <MenuTrigger onOpenChange={setIsMenuOpen}>
      <Button
        {...restButtonProps}
        ref={buttonRef}
        variant={variant}
        size={size}
        color={color}
        className={className}
      >
        {buttonChildren}
        <Icon className={styles.chevron} data-open={isMenuOpen || undefined}>
          <ChevronDown />
        </Icon>
      </Button>
      <Menu {...menuProps} popoverProps={popoverProps}>
        {children}
      </Menu>
    </MenuTrigger>
  );

  if (tooltip) {
    return (
      <TooltipTrigger disabled={isMenuOpen}>
        {menuContent}
        <Tooltip triggerRef={buttonRef}>{tooltip}</Tooltip>
      </TooltipTrigger>
    );
  }

  return menuContent;
}
