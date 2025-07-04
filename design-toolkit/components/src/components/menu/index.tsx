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

import ChevronRight from '@accelint/icons/chevron-right';
import { createContext, useCallback, useContext } from 'react';
import {
  Header as AriaHeader,
  Menu as AriaMenu,
  Collection as AriaMenuCollection,
  MenuItem as AriaMenuItem,
  type MenuItemRenderProps as AriaMenuItemRenderProps,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
  Separator as AriaSeparator,
  SubmenuTrigger as AriaSubmenuTrigger,
  Text as AriaText,
  type ContextValue,
  Popover,
} from 'react-aria-components';
import { callRenderProps, isSlottedContextValue } from '../../lib/utils';
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

const { item, label, description, menu, more, icon, separator } = MenuStyles();

export const MenuContext =
  createContext<ContextValue<MenuProps<object>, HTMLDivElement>>(null);

export const Menu = (props: MenuProps<any>) => {
  const {
    children,
    className,
    variant = MenuStylesDefaults.variant,
    selectionMode = 'single',
    ...rest
  } = props;

  return (
    <Popover offset={-4}>
      <MenuContext.Provider value={{ variant }}>
        <AriaMenu
          className={menu({ className })}
          selectionMode={selectionMode}
          {...rest}
        >
          {children}
        </AriaMenu>
      </MenuContext.Provider>
    </Popover>
  );
};

export const MenuTrigger = ({ children }: AriaMenuTriggerProps) => {
  return <AriaMenuTrigger>{children}</AriaMenuTrigger>;
};
MenuTrigger.displayName = 'Menu.Trigger';

export const MenuItem = (props: MenuItemProps) => {
  const context = useContext(MenuContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    MenuStylesDefaults.variant;

  const { children: childrenProp, className, ...rest } = props;

  const children = useCallback(
    (renderProps: AriaMenuItemRenderProps) => {
      const { hasSubmenu } = renderProps;
      const content = callRenderProps(childrenProp, {
        ...renderProps,
        defaultChildren: null,
      });

      return (
        <>
          {typeof content === 'string' ? (
            <AriaText slot='label'>{content}</AriaText>
          ) : (
            content
          )}
          {hasSubmenu && (
            <Icon className={more()}>
              <ChevronRight />
            </Icon>
          )}
        </>
      );
    },
    [childrenProp],
  );

  return (
    <AriaMenuItem className={item({ className, variant })} {...rest}>
      {children}
    </AriaMenuItem>
  );
};

export function MenuSection<T extends object>(props: MenuSectionProps<T>) {
  const { header, children, items } = props;

  return (
    <AriaMenuSection id={header} className=''>
      <AriaHeader className='fg-default-dark px-s py-xs text-header-xs'>
        {header}
      </AriaHeader>
      <AriaMenuCollection items={items}>{children}</AriaMenuCollection>
    </AriaMenuSection>
  );
}
MenuSection.displayName = 'Menu.Section';

export function MenuSeparator(props: SeparatorProps) {
  return <AriaSeparator {...props} className={separator()} />;
}
MenuSeparator.displayName = 'Menu.Separator';

export function MenuLabel({ children }: MenuTextProps) {
  return (
    <AriaText slot='label' className={label()}>
      {children}
    </AriaText>
  );
}
MenuLabel.displayName = 'Menu.Label';

export function MenuDescription({ children }: MenuTextProps) {
  return (
    <AriaText
      slot='description'
      data-slot='description'
      className={description()}
    >
      {children}
    </AriaText>
  );
}
MenuDescription.displayName = 'Menu.Description';

export function MenuItemIcon({ children }: MenuIconProps) {
  return <Icon className={icon()}>{children}</Icon>;
}

Menu.Trigger = MenuTrigger;
Menu.Item = MenuItem;
Menu.Icon = MenuItemIcon;
Menu.Label = MenuLabel;
Menu.Description = MenuDescription;
Menu.Section = MenuSection;
Menu.Separator = MenuSeparator;
Menu.Submenu = AriaSubmenuTrigger;
