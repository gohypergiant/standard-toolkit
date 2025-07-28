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
import { createContext } from 'react';
import {
  Collection,
  type ContextValue,
  Header,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Text,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { OptionsStyles } from './styles';
import type {
  OptionsDataItem,
  OptionsItemProps,
  OptionsItemTextProps,
  OptionsProps,
  OptionsSectionProps,
} from './types';

const {
  list,
  section,
  header: headerClassNames,
  item,
  content,
  icon,
  label,
  description,
} = OptionsStyles();

export const OptionsContext =
  createContext<ContextValue<OptionsProps<OptionsDataItem>, HTMLDivElement>>(
    null,
  );

function OptionsSection<T extends OptionsDataItem>({
  children,
  classNames,
  header,
  items,
}: OptionsSectionProps<T>) {
  return (
    <ListBoxSection
      id={header}
      className={section({ className: classNames?.section })}
    >
      <Header className={headerClassNames({ className: classNames?.header })}>
        {header}
      </Header>
      <Collection items={items}>{children}</Collection>
    </ListBoxSection>
  );
}
OptionsSection.displayName = 'Options.Section';

function OptionsItemContent({ className, ...rest }: OptionsItemTextProps) {
  return <div {...rest} className={content({ className })} />;
}
OptionsItemContent.displayName = 'Options.Item.Content';

function OptionsItemLabel({ className, ...rest }: OptionsItemTextProps) {
  return <Text {...rest} slot='label' className={label({ className })} />;
}
OptionsItemLabel.displayName = 'Options.Item.Label';

function OptionsItemDescription({ className, ...rest }: OptionsItemTextProps) {
  return (
    <Text {...rest} slot='description' className={description({ className })} />
  );
}
OptionsItemDescription.displayName = 'Options.Item.Description';

function OptionsItem<T extends OptionsDataItem>({
  children,
  classNames,
  color = 'info',
  ...rest
}: OptionsItemProps<T>) {
  return (
    <ListBoxItem
      {...rest}
      className={composeRenderProps(classNames?.item, (className) =>
        item({ className }),
      )}
      data-color={color}
    >
      {composeRenderProps(children, (children) => (
        <Icon.Provider
          className={icon({ className: classNames?.icon })}
          size='small'
        >
          {typeof children === 'string' ? (
            <OptionsItemLabel>{children}</OptionsItemLabel>
          ) : (
            children
          )}
        </Icon.Provider>
      ))}
    </ListBoxItem>
  );
}
OptionsItem.displayName = 'Options.Item';
OptionsItem.Label = OptionsItemLabel;
OptionsItem.Content = OptionsItemContent;
OptionsItem.Description = OptionsItemDescription;

export function Options<T extends OptionsDataItem>({
  ref,
  ...props
}: OptionsProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, OptionsContext);

  const { children, className, size, ...rest } = props;

  return (
    <ListBox<T>
      {...rest}
      ref={ref}
      className={composeRenderProps(className, (className) =>
        list({ className }),
      )}
      data-size={size}
    >
      {children}
    </ListBox>
  );
}
Options.displayName = 'Options';
Options.Item = OptionsItem;
Options.Section = OptionsSection;
