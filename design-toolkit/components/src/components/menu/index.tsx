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
import { isSlottedContextValue } from '@/lib/utils';
import ChevronRight from '@accelint/icons/chevron-right';
import { createContext, useContext } from 'react';
import {
  Header as AriaHeader,
  Menu as AriaMenu,
  Collection as AriaMenuCollection,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Separator as AriaSeparator,
  SubmenuTrigger as AriaSubmenuTrigger,
  Text as AriaText,
  type ContextValue,
  DEFAULT_SLOT,
  KeyboardContext,
  Popover,
  Provider,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Icon, IconContext } from '../icon';
import { MenuStyles, MenuStylesDefaults } from './styles';
import type {
  MenuItemProps,
  MenuProps,
  MenuSectionProps,
  MenuTextProps,
  SeparatorProps,
} from './types';

const {
  menu,
  icon,
  item,
  label,
  description,
  more,
  sectionHeader,
  separator,
  hotkey,
  popover,
} = MenuStyles();

export const MenuContext =
  createContext<ContextValue<MenuProps<unknown>, HTMLDivElement>>(null);

function MenuSection<T extends object>(props: MenuSectionProps<T>) {
  const { header, children, classNames, items, ...rest } = props;

  return (
    <AriaMenuSection className={classNames?.section} {...rest}>
      <AriaHeader
        className={sectionHeader({ className: classNames?.sectionHeader })}
      >
        {header}
      </AriaHeader>
      <AriaMenuCollection items={items}>{children}</AriaMenuCollection>
    </AriaMenuSection>
  );
}
MenuSection.displayName = 'Menu.Section';

function MenuSeparator({ className, ...rest }: SeparatorProps) {
  return <AriaSeparator {...rest} className={separator({ className })} />;
}
MenuSeparator.displayName = 'Menu.Separator';

function MenuLabel(props: MenuTextProps) {
  const { children, className, ...rest } = props;

  return (
    <AriaText {...rest} slot='label' className={label({ className })}>
      {children}
    </AriaText>
  );
}
MenuLabel.displayName = 'Menu.Item.Label';

function MenuDescription(props: MenuTextProps) {
  const { children, className, ...rest } = props;

  return (
    <AriaText
      {...rest}
      slot='description'
      className={description({ className })}
    >
      {children}
    </AriaText>
  );
}
MenuDescription.displayName = 'Menu.Item.Description';

function MenuItem(props: MenuItemProps) {
  const context = useContext(MenuContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    MenuStylesDefaults.variant;

  const {
    classNames,
    color = MenuStylesDefaults.color,
    children,
    ...rest
  } = props;

  return (
    <AriaMenuItem
      {...rest}
      className={composeRenderProps(classNames?.item, (className) =>
        item({ className, variant, color }),
      )}
    >
      {composeRenderProps(children, (children, { hasSubmenu }) => (
        <Provider
          values={[
            [
              KeyboardContext,
              { className: hotkey({ className: classNames?.hotkey }) },
            ],
            [
              IconContext,
              {
                slots: {
                  [DEFAULT_SLOT]: {
                    className: icon({ className: classNames?.icon }),
                  },
                  submenu: { className: more({ className: classNames?.more }) },
                },
              },
            ],
          ]}
        >
          {typeof children === 'string' ? (
            <AriaText className={classNames?.text} slot='label'>
              {children}
            </AriaText>
          ) : (
            children
          )}
          {hasSubmenu && (
            <Icon slot='submenu'>
              <ChevronRight />
            </Icon>
          )}
        </Provider>
      ))}
    </AriaMenuItem>
  );
}
MenuItem.displayName = 'Menu.Item';
MenuItem.Label = MenuLabel;
MenuItem.Description = MenuDescription;

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
    selectionMode = 'single',
    variant = MenuStylesDefaults.variant,
    popoverProps,
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
          ref={ref}
          className={composeRenderProps(classNames?.menu, (className) =>
            menu({ className, variant }),
          )}
          selectionMode={selectionMode}
          {...rest}
        >
          {children}
        </AriaMenu>
      </MenuContext.Provider>
    </Popover>
  );
}
Menu.displayName = 'Menu';
Menu.Trigger = AriaMenuTrigger;
Menu.Submenu = AriaSubmenuTrigger;
Menu.Item = MenuItem;
Menu.Separator = MenuSeparator;
Menu.Section = MenuSection;
