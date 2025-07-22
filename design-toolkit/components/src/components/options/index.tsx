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
import { mergeProps } from '@react-aria/utils';
import { createContext } from 'react';
import {
  Header as AriaHeader,
  ListBox as AriaListBox,
  Collection as AriaListBoxCollection,
  ListBoxSection as AriaListBoxSection,
} from 'react-aria-components';
import 'client-only';
import { useContext, useMemo } from 'react';
import {
  ListBoxItem as AriaListBoxItem,
  Text as AriaText,
} from 'react-aria-components';
import { Icon } from '../icon';

import type {
  IOptionsItem,
  OptionsItemProps,
  OptionsProps,
  OptionsSectionProps,
} from './types';

import { OptionsStyles } from './styles';

const { list, section, sectionHeader, item, itemIcon, itemContent } =
  OptionsStyles();

export const OptionsContext = createContext<
  Pick<OptionsProps<IOptionsItem>, 'size' | 'type'>
>({
  size: 'large',
  type: 'default',
});

export function Options<T extends IOptionsItem>({
  children,
  className,
  description,
  errorMessage,
  label,
  placeholder,
  size,
  type,
  ...props
}: OptionsProps<T>) {
  return (
    <OptionsContext.Provider value={{ size, type }}>
      <AriaListBox<T> className={list()} {...props}>
        {children}
      </AriaListBox>
    </OptionsContext.Provider>
  );
}
Options.displayName = 'Options';

Options.Item = OptionsItem;

export function OptionsSection<T extends IOptionsItem>({
  children,
  header,
  items,
}: OptionsSectionProps<T>) {
  return (
    <AriaListBoxSection id={header} className={section()}>
      <AriaHeader className={sectionHeader()}>{header}</AriaHeader>
      <AriaListBoxCollection items={items}>{children}</AriaListBoxCollection>
    </AriaListBoxSection>
  );
}
OptionsSection.displayName = 'Options.Section';
Options.Section = OptionsSection;

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
      className={item({ type, size })}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps);
        }

        return (
          <>
            {prefixIcon && (
              <span className={itemIcon()}>
                <Icon>{prefixIcon}</Icon>
              </span>
            )}
            <div className={itemContent()}>
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
              <span className={itemIcon()}>
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
