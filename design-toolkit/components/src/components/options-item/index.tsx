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
import { mergeProps } from '@react-aria/utils';
import 'client-only';
import { type VariantProps, cva } from 'cva';
import { type ReactNode, useContext, useMemo } from 'react';
import {
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  Text as AriaText,
} from 'react-aria-components';
import { Icon } from '../icon';
import { OptionsContext } from '../options';

const optionsItemStyles = cva(
  [
    'fg-default-light flex items-center gap-s p-s text-body-s ',
    '**:data-[slot=description]:fg-default-dark **:data-[slot=description]:text-body-xs',
    'hover:fg-inverse-light hover:**:data-[slot=description]:fg-inverse-light',
    'focus:fg-inverse-light focus:**:data-[slot=description]:fg-inverse-light ',
    'disabled:fg-disabled disabled:**:data-[slot=description]:fg-disabled disabled:bg-transparent',
    'hover:bg-highlight-bold focus:bg-highlight-bold',
  ],
  {
    variants: {
      type: {
        destructive: 'hover:bg-serious-bold focus:bg-serious-bold',
        default: 'hover:bg-highlight-bold focus:bg-highlight-bold',
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

export interface IOptionsItem {
  children?: IOptionsItem[];
  description?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  id?: string | number;
  name: string;
}

export interface OptionsItemProps<T extends IOptionsItem>
  extends VariantProps<typeof optionsItemStyles>,
    AriaListBoxItemProps<T> {
  description?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  name: string;
}

export function OptionsItem<T extends IOptionsItem>({
  children,
  className,
  description,
  prefixIcon,
  suffixIcon,
  name,
  type: typeProp,
  size: sizeProp,
  ...props
}: OptionsItemProps<T>) {
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
      className={optionsItemStyles({ type, size, className })}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps);
        }

        return (
          <>
            {prefixIcon && (
              <span className='flex w-[16px] items-center'>
                <Icon>{prefixIcon}</Icon>
              </span>
            )}
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
            {suffixIcon && (
              <span className='flex w-[16px] items-center'>
                <Icon size='small'>{suffixIcon}</Icon>
              </span>
            )}
          </>
        );
      }}
    </AriaListBoxItem>
  );
}
OptionsItem.displayName = 'OptionsItem';
