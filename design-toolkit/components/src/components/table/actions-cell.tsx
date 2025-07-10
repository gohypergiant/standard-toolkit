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

import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Pressable as AriaPressable,
} from 'react-aria-components';
import { Icon } from '../icon';
import { actionsCellStyles } from './styles';
import type { ActionsCellProps } from './types';

const { button, popover, menuItem } = actionsCellStyles();

export function ActionsCell({
  className,
  isOpen,
  onOpenChange,
  actions,
  children,
  persistent = false,
}: ActionsCellProps) {
  return (
    <AriaMenuTrigger onOpenChange={onOpenChange} isOpen={isOpen}>
      <AriaPressable>
        <button className={button({ persistent, className })} type='button'>
          <Icon>{children}</Icon>
        </button>
      </AriaPressable>
      <AriaPopover className={popover()}>
        <AriaMenu>
          {actions.map((action) => (
            <AriaMenuItem
              key={action.label}
              className={menuItem()}
              onAction={action.onAction}
            >
              {action.label}
            </AriaMenuItem>
          ))}
        </AriaMenu>
      </AriaPopover>
    </AriaMenuTrigger>
  );
}
