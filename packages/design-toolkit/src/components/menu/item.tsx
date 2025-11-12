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

import ChevronRight from '@accelint/icons/chevron-right';
import 'client-only';
import { useContext } from 'react';
import {
  MenuItem as AriaMenuItem,
  composeRenderProps,
  DEFAULT_SLOT,
  KeyboardContext,
  Provider,
  Text,
} from 'react-aria-components';
import { isSlottedContextValue } from '../../lib/utils';
import { Icon } from '../icon';
import { IconContext } from '../icon/context';
import { MenuContext } from './context';
import { MenuStyles, MenuStylesDefaults } from './styles';
import type { MenuItemProps } from './types';

const { item, icon, more, hotkey } = MenuStyles();

export function MenuItem({
  children,
  classNames,
  color = 'info',
  ...rest
}: MenuItemProps) {
  const context = useContext(MenuContext);
  const variant =
    (isSlottedContextValue(context) ? undefined : context?.variant) ??
    MenuStylesDefaults.variant;

  return (
    <AriaMenuItem
      {...rest}
      className={composeRenderProps(classNames?.item, (className) =>
        item({ className, variant }),
      )}
      data-color={color}
    >
      {composeRenderProps(children, (children, { hasSubmenu }) => (
        <Provider
          values={[
            [
              KeyboardContext,
              { className: hotkey({ className: classNames?.hotkey }) },
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
            <Text slot='label' className={classNames?.text}>
              {children}
            </Text>
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
