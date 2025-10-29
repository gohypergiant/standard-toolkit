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
import { composeRenderProps, ListBoxItem } from 'react-aria-components';
import { IconProvider } from '../icon/context';
import { OptionsItemLabel } from './item-label';
import { OptionsStyles } from './styles';
import type { OptionsDataItem, OptionsItemProps } from './types';

const { item, icon } = OptionsStyles();

export function OptionsItem<T extends OptionsDataItem>({
  children,
  classNames,
  color = 'info',
  textValue = typeof children === 'string' ? children : '',
  ...rest
}: OptionsItemProps<T>) {
  return (
    <ListBoxItem
      {...rest}
      className={composeRenderProps(classNames?.item, (className) =>
        item({ className }),
      )}
      textValue={textValue}
      data-color={color}
    >
      {composeRenderProps(children, (children) => (
        <IconProvider
          className={icon({ className: classNames?.icon })}
          size='small'
        >
          {typeof children === 'string' ? (
            <OptionsItemLabel>{children}</OptionsItemLabel>
          ) : (
            children
          )}
        </IconProvider>
      ))}
    </ListBoxItem>
  );
}
