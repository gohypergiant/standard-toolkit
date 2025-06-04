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

import { Check, ChevronRight } from '@accelint/icons';
import { cva } from 'cva';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuProps as AriaMenuProps,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  Collection,
  Header,
  type MenuItemProps,
  Separator,
  type SeparatorProps,
  composeRenderProps,
} from 'react-aria-components';
import { Popover, type PopoverProps } from '../popover';

interface MenuProps<T> extends AriaMenuProps<T> {
  placement?: PopoverProps['placement'];
}

export function Menu<T extends object>(props: MenuProps<T>) {
  return (
    <Popover placement={props.placement} className='min-w-[150px]'>
      <AriaMenu
        {...props}
        className='max-h-[inherit] overflow-auto p-1 outline outline-0 [clip-path:inset(0_0_0_0_round_.75rem)]'
      />
    </Popover>
  );
}

export const menuItemStyles = cva(
  'group fg-default-dark flex cursor-default select-none items-center gap-4 rounded-lg py-2 pr-1 pl-3 text-sm outline outline-0 forced-color-adjust-none',
  {
    variants: {
      isDisabled: {
        false: 'text-gray-900 dark:text-zinc-100',
        true: 'text-gray-300 dark:text-zinc-600 forced-colors:text-[GrayText]',
      },
      isFocused: {
        true: 'bg-blue-600 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
      },
    },
  },
);

export function MenuItem(props: MenuItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === 'string' ? props.children : undefined);
  return (
    <AriaMenuItem textValue={textValue} {...props} className={menuItemStyles}>
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {selectionMode !== 'none' && (
              <span className='flex w-4 items-center'>
                {isSelected && <Check aria-hidden className='h-4 w-4' />}
              </span>
            )}
            <span className='flex flex-1 items-center gap-2 truncate font-normal group-selected:font-semibold'>
              {children}
            </span>
            {hasSubmenu && (
              <ChevronRight aria-hidden className='absolute right-2 h-4 w-4' />
            )}
          </>
        ),
      )}
    </AriaMenuItem>
  );
}

export function MenuSeparator(props: SeparatorProps) {
  return (
    <Separator
      {...props}
      className='mx-3 my-1 border-gray-300 border-b dark:border-zinc-700'
    />
  );
}

export interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {
  title?: string;
  items?: any;
}

export function MenuSection<T extends object>(props: MenuSectionProps<T>) {
  return (
    <AriaMenuSection className=''>
      <Header className='fg-default-dark'>{props.title}</Header>
      <Collection items={props.items}>{props.children}</Collection>
    </AriaMenuSection>
  );
}
