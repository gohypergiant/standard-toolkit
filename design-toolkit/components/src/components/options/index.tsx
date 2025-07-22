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
  type ContextValue,
  composeRenderProps,
  useContextProps,
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
  OptionsItemIconProps,
  OptionsItemProps,
  OptionsItemTextProps,
  OptionsProps,
  OptionsSectionProps,
} from './types';

import { OptionsStyles } from './styles';

const { list, section, sectionHeader, item, itemIcon, itemContent } =
  OptionsStyles();

export const OptionsContext = createContext<
  ContextValue<OptionsProps<IOptionsItem>, HTMLDivElement>
>({
  size: 'large',
  color: 'default',
});

export function Options<T extends IOptionsItem>({
  ref,
  ...props
}: OptionsProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, OptionsContext);
  const {
    children,
    className,
    description,
    errorMessage,
    label,
    placeholder,
    size,
    color,
    ...rest
  } = props;
  return (
    <OptionsContext.Provider value={{ size, color }}>
      <AriaListBox<T> ref={ref} className={list()} {...rest}>
        {children}
      </AriaListBox>
    </OptionsContext.Provider>
  );
}
Options.displayName = 'Options';

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

export function OptionsItem({
  children,
  className,
  size: sizeProp,
  color: colorProp,
  ...props
}: OptionsItemProps) {
  const context = useContext(OptionsContext) ?? {};

  const { size, color } = useMemo(
    () =>
      mergeProps(context, {
        size: sizeProp,
        color: colorProp,
      }),
    [context, sizeProp, colorProp],
  );

  return (
    <AriaListBoxItem
      {...props}
      className={composeRenderProps(className, () => item({ size, color }))}
    >
      {composeRenderProps(children, (children) => (
        <>
          {typeof children === 'string' ? (
            <OptionsItemLabel>{children}</OptionsItemLabel>
          ) : (
            children
          )}
        </>
      ))}
    </AriaListBoxItem>
  );
}
OptionsItem.displayName = 'Options.Item';

function OptionsItemContent({
  children,
  className,
  ...props
}: OptionsItemTextProps) {
  return (
    <div {...props} className={itemContent()}>
      {children}
    </div>
  );
}
OptionsItemContent.displayName = 'Options.Item.Content';

function OptionsItemLabel({
  children,
  className,
  ...props
}: OptionsItemTextProps) {
  return (
    <AriaText {...props} className='truncate' slot='label'>
      {children}
    </AriaText>
  );
}
OptionsItemLabel.displayName = 'Options.Item.Label';

function OptionsItemDescription({
  children,
  className,
  ...props
}: OptionsItemTextProps) {
  return (
    <AriaText
      {...props}
      className='truncate'
      data-slot='description'
      slot='description'
    >
      {children}
    </AriaText>
  );
}
OptionsItemDescription.displayName = 'Options.Item.Description';

function OptionsItemIcon({
  children,
  className,
  ...props
}: OptionsItemIconProps) {
  return (
    <span className={itemIcon()}>
      <Icon size='small' {...props}>
        {children}
      </Icon>
    </span>
  );
}
OptionsItemIcon.displayName = 'Options.Item.Icon';

OptionsItem.Label = OptionsItemLabel;
OptionsItem.Content = OptionsItemContent;
OptionsItem.Description = OptionsItemDescription;
OptionsItem.Icon = OptionsItemIcon;
Options.Item = OptionsItem;
Options.Section = OptionsSection;
