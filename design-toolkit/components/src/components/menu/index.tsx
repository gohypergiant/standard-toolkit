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
  composeRenderProps,
  DEFAULT_SLOT,
  KeyboardContext,
  Popover,
  Provider,
  useContextProps,
} from 'react-aria-components';
import { isSlottedContextValue } from '@/lib/utils';
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
  keyboard,
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
              { className: keyboard({ className: classNames?.keyboard }) },
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
          ref={ref}
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
Menu.Trigger = AriaMenuTrigger;
Menu.Submenu = AriaSubmenuTrigger;
Menu.Item = MenuItem;
Menu.Separator = MenuSeparator;
Menu.Section = MenuSection;
