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

import { Kebab } from '@accelint/icons';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
  Popover as AriaPopover,
  Pressable as AriaPressable,
} from 'react-aria-components';
import { Icon } from '../icon';

/** * ActionsCellProps defines the properties for the ActionsCell component.
 * It includes an array of actions, each with a unique label and an optional onAction callback.
 * The component renders a kebab menu icon that, when clicked, displays the actions in a popover.
 * @property onOpen - An optional callback function that is called when the menu is opened.
 * @property actions - An array of action objects, each containing a label and an optional onAction function.
 */
export type ActionsCellProps = Pick<
  AriaMenuTriggerProps,
  'isOpen' | 'onOpenChange'
> & {
  actions: {
    label: string;
    onAction?: () => void;
  }[];
};

export function ActionsCell({
  isOpen,
  onOpenChange,
  actions,
}: ActionsCellProps) {
  return (
    <AriaMenuTrigger onOpenChange={onOpenChange} isOpen={isOpen}>
      <AriaPressable>
        <button
          title='row actions'
          className='mx-auto block align-middle'
          type='button'
        >
          <Icon>
            <Kebab />
          </Icon>
        </button>
      </AriaPressable>
      <AriaPopover className='border border-default-light bg-surface-raised'>
        <AriaMenu>
          {actions.map((action) => (
            <AriaMenuItem
              key={action.label}
              className='text-default-light hover:bg-highlight-bold'
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
