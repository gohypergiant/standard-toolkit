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
  Popover,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { MenuStyles, MenuStylesDefaults } from './styles';
import type {
  MenuIconProps,
  MenuItemProps,
  MenuProps,
  MenuSectionProps,
  MenuTextProps,
  SeparatorProps,
} from './types';

const { menu, icon, item, label, description, more, header, separator } =
  MenuStyles();

export const MenuContext =
  createContext<ContextValue<MenuProps<unknown>, HTMLDivElement>>(null);

export function Menu<T extends object>({ ref, ...props }: MenuProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, MenuContext);

  const {
    children,
    className,
    selectionMode = 'single',
    offset = -4,
    placement,
    isNonModal,
    containerPadding,
    variant = MenuStylesDefaults.variant,
    ...rest
  } = props;

  return (
    <Popover
      offset={offset}
      placement={placement}
      isNonModal={isNonModal}
      containerPadding={containerPadding}
    >
      <MenuContext.Provider value={{ variant }}>
        <AriaMenu
          className={composeRenderProps(className, (className) =>
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

export const MenuItem = (props: MenuItemProps) => {
  const context = useContext(MenuContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    MenuStylesDefaults.variant;

  const { children: childrenProp, className, ...rest } = props;

  return (
    <AriaMenuItem
      {...rest}
      className={composeRenderProps(className, (className) =>
        item({ className, variant }),
      )}
    >
      {composeRenderProps(props.children, (children, { hasSubmenu }) => (
        <>
          {typeof children === 'string' ? (
            <AriaText slot='label'>{children}</AriaText>
          ) : (
            children
          )}
          {hasSubmenu && (
            <Icon className={more()}>
              <ChevronRight />
            </Icon>
          )}
        </>
      ))}
    </AriaMenuItem>
  );
};
MenuItem.displayName = 'Menu.Item';

export function MenuSection<T extends object>(props: MenuSectionProps<T>) {
  const { header: headerTitle, children, items, ...rest } = props;

  return (
    <AriaMenuSection {...rest}>
      <AriaHeader className={header()}>{headerTitle}</AriaHeader>
      <AriaMenuCollection items={items}>{children}</AriaMenuCollection>
    </AriaMenuSection>
  );
}
MenuSection.displayName = 'Menu.Section';

export function MenuSeparator(props: SeparatorProps) {
  return <AriaSeparator {...props} className={separator()} />;
}
MenuSeparator.displayName = 'Menu.Separator';

export function MenuLabel(props: MenuTextProps) {
  const { children, ...rest } = props;

  return (
    <AriaText {...rest} slot='label' className={label()}>
      {children}
    </AriaText>
  );
}
MenuLabel.displayName = 'Menu.Item.Label';

export function MenuDescription(props: MenuTextProps) {
  const { children, ...rest } = props;

  return (
    <AriaText
      {...rest}
      slot='description'
      data-slot='description'
      className={description()}
    >
      {children}
    </AriaText>
  );
}
MenuDescription.displayName = 'Menu.Item.Description';

export function MenuItemIcon(props: MenuIconProps) {
  const { children, ...rest } = props;

  return (
    <Icon {...rest} className={icon()}>
      {children}
    </Icon>
  );
}
MenuItemIcon.displayName = 'Menu.Item.Icon';

Menu.Trigger = AriaMenuTrigger;
Menu.Submenu = AriaSubmenuTrigger;
Menu.Item = MenuItem;
MenuItem.Icon = MenuItemIcon;
MenuItem.Label = MenuLabel;
MenuItem.Description = MenuDescription;
Menu.Separator = MenuSeparator;
Menu.Section = MenuSection;
