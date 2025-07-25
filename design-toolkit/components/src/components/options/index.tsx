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
import { createContext, useContext } from 'react';
import {
  Header as AriaHeader,
  ListBox as AriaListBox,
  Collection as AriaListBoxCollection,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  Text as AriaText,
  type ContextValue,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';

import { isSlottedContextValue } from '@/lib/utils';
import { Icon } from '../icon';
import { OptionsStyles } from './styles';
import type {
  OptionsItemProps,
  OptionsItemTextProps,
  IOptionsItem,
  OptionsProps,
  OptionsSectionProps,
} from './types';

const {
  list,
  section,
  sectionHeader,
  item,
  itemIcon,
  itemContent,
  itemLabel,
  itemDescription,
} = OptionsStyles();

export const OptionsContext =
  createContext<ContextValue<OptionsProps<IOptionsItem>, HTMLDivElement>>(
    null,
  );

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
      <AriaListBox<T>
        ref={ref}
        className={composeRenderProps(className, (className) =>
          list({ className }),
        )}
        {...rest}
      >
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
  const color =
    (isSlottedContextValue(context) ? undefined : context?.color) ?? colorProp;
  const size =
    (isSlottedContextValue(context) ? undefined : context?.size) ?? sizeProp;

  return (
    <AriaListBoxItem
      {...props}
      data-size={size}
      className={composeRenderProps(className, (className) =>
        item({ color, className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <Icon.Provider size='small' className={itemIcon()}>
          {typeof children === 'string' ? (
            <OptionsItemLabel>{children}</OptionsItemLabel>
          ) : (
            children
          )}
        </Icon.Provider>
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
    <div {...props} className={itemContent({ className })}>
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
    <AriaText {...props} className={itemLabel({ className })} slot='label'>
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
      className={itemDescription({ className })}
      slot='description'
    >
      {children}
    </AriaText>
  );
}
OptionsItemDescription.displayName = 'Options.Item.Description';

OptionsItem.Label = OptionsItemLabel;
OptionsItem.Content = OptionsItemContent;
OptionsItem.Description = OptionsItemDescription;
Options.Item = OptionsItem;
Options.Section = OptionsSection;
