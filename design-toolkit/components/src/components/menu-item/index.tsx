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

import 'client-only';
import { mergeProps } from '@react-aria/utils';
import { type VariantProps, cva } from 'cva';
import { type ReactNode, useContext, useMemo } from 'react';
import {
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  Text as AriaText,
} from 'react-aria-components';
import { Icon } from '../icon';
import { OptionsContext } from '../options';

const menuItemStyles = cva(
  [
    'fg-default-light icon-size-l flex items-center gap-s p-s text-body-s ',
    '**:data-[slot=description]:fg-default-dark **:data-[slot=description]:text-body-xs',
    'hover:fg-inverse-light hover:**:data-[slot=description]:fg-inverse-light',
    'ai-focus:fg-inverse-light ai-focus:**:data-[slot=description]:fg-inverse-light ',
    'ai-disabled:fg-disabled ai-disabled:**:data-[slot=description]:fg-disabled ai-disabled:bg-transparent',
    'ai-focus:bg-highlight-bold hover:bg-highlight-bold',
  ],
  {
    variants: {
      type: {
        destructive: 'ai-focus:bg-serious-bold hover:bg-serious-bold',
        default: 'ai-focus:bg-highlight-bold hover:bg-highlight-bold',
      },
      size: {
        large: 'pt-s pb-s',
        small: 'pt-xs pb-xs',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  },
);

export interface IMenuItem {
  children?: IMenuItem[];
  description?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  id?: string | number;
  name: string;
}

export interface MenuItemProps<T extends IMenuItem>
  extends VariantProps<typeof menuItemStyles>,
    AriaListBoxItemProps<T> {
  description?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  name: string;
}

export function MenuItem<T extends IMenuItem>({
  children,
  className,
  description,
  leftIcon,
  rightIcon,
  name,
  type: typeProp,
  size: sizeProp,
  ...props
}: MenuItemProps<T>) {
  const optionsContext = useContext(OptionsContext) ?? {};

  const { size, type } = useMemo(
    () =>
      mergeProps(optionsContext, {
        size: sizeProp,
        type: typeProp,
      }),
    [optionsContext, sizeProp, typeProp],
  );

  return (
    <AriaListBoxItem<T>
      textValue={name}
      {...props}
      className={menuItemStyles({ type, size, className })}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps);
        }

        return (
          <>
            <span className='flex w-[16px] items-center'>
              {leftIcon && <Icon>{leftIcon}</Icon>}
            </span>

            <div className='flex min-w-0 flex-auto flex-col gap-xxs'>
              <AriaText className='truncate' slot='label'>
                {name}
              </AriaText>
              {description && (
                <AriaText
                  className='truncate'
                  data-slot='description'
                  slot='description'
                >
                  {description}
                </AriaText>
              )}
            </div>
            <span className='flex w-[16px] items-center'>
              {rightIcon && <Icon>{rightIcon}</Icon>}
            </span>
          </>
        );
      }}
    </AriaListBoxItem>
  );
}
MenuItem.displayName = 'MenuItem';
