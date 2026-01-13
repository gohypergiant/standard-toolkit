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
import { clsx } from '@accelint/design-foundation/lib/utils';
import { useRef, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { MenuTrigger } from '../menu/trigger';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import styles from './styles.module.css';
import type { MenuButtonProps } from './types';

/**
 * MenuButton - A convenience wrapper that combines Button + MenuTrigger + Menu
 *
 * Provides a streamlined API for the common pattern of a button that opens a
 * dropdown menu. The chevron icon is automatically included and children are
 * wrapped in a Menu internally.
 *
 * @example
 * // Basic menu button
 * <MenuButton label="Actions">
 *   <MenuItem>Edit</MenuItem>
 *   <MenuItem>Copy</MenuItem>
 *   <MenuItem>Delete</MenuItem>
 * </MenuButton>
 *
 * @example
 * // With icon
 * <MenuButton label="Create" icon={<Plus />} variant="filled" color="accent">
 *   <MenuItem>New File</MenuItem>
 *   <MenuItem>New Folder</MenuItem>
 * </MenuButton>
 *
 * @example
 * // Icon-only (chevron dropdown)
 * <MenuButton variant="icon" aria-label="More options">
 *   <MenuItem>Edit</MenuItem>
 *   <MenuItem>Delete</MenuItem>
 * </MenuButton>
 *
 * @example
 * // With action handler
 * <MenuButton label="Actions" onAction={(key) => console.log(key)}>
 *   <MenuItem id="edit">Edit</MenuItem>
 *   <MenuItem id="delete">Delete</MenuItem>
 * </MenuButton>
 */
export function MenuButton({
  label,
  icon,
  children,
  tooltip,
  menuVariant,
  selectionMode,
  selectedKeys,
  onSelectionChange,
  onAction,
  popoverProps,
  size = 'medium',
  color = 'mono-muted',
  variant = 'filled',
  isDisabled,
  className,
  ...rest
}: MenuButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isIconOnly = !label && variant === 'icon';

  // Show tooltip only when hovered AND menu is closed
  const showTooltip = tooltip && !isMenuOpen;

  const buttonElement = (
    <Button
      ref={buttonRef}
      variant={isIconOnly ? 'icon' : variant}
      size={size}
      color={color}
      isDisabled={isDisabled}
      className={className}
      {...rest}
    >
      {icon && <Icon>{icon}</Icon>}
      {label}
      <Icon className={clsx(styles.chevron, isMenuOpen && styles.chevronOpen)}>
        <ChevronDown />
      </Icon>
    </Button>
  );

  const menuElement = (
    <Menu
      variant={menuVariant}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      onAction={onAction}
      popoverProps={popoverProps}
    >
      {children}
    </Menu>
  );

  if (tooltip) {
    return (
      <TooltipTrigger disabled={!showTooltip}>
        <MenuTrigger onOpenChange={setIsMenuOpen}>
          {buttonElement}
          {menuElement}
        </MenuTrigger>
        <Tooltip triggerRef={buttonRef}>{tooltip}</Tooltip>
      </TooltipTrigger>
    );
  }

  return (
    <MenuTrigger onOpenChange={setIsMenuOpen}>
      {buttonElement}
      {menuElement}
    </MenuTrigger>
  );
}
