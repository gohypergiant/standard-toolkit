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
import { useContext, useRef } from 'react';
import { composeRenderProps } from 'react-aria-components';
import { ToggleButton } from '../button/toggle';
import { Icon } from '../icon';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import { ViewStackContext } from '../view-stack/context';
import { DrawerContext } from './context';
import { DrawerMenuStyles } from './styles';
import { DrawerTrigger } from './trigger';
import type { DrawerMenuItemProps } from './types';

const { item } = DrawerMenuStyles();

const tooltipPlacementMap = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
} as const;

export function DrawerMenuItem({
  for: id,
  children,
  classNames,
  toggle,
  textValue,
  ...rest
}: DrawerMenuItemProps) {
  const { parent, stack } = useContext(ViewStackContext);
  const { placement } = useContext(DrawerContext);
  const view = stack.at(-1);
  const action = toggle ? 'toggle' : 'open';
  const tooltipRef = useRef(null);

  if (!parent) {
    return null;
  }

  return (
    <TooltipTrigger>
      <DrawerTrigger for={`${action}:${id}`}>
        <ToggleButton
          {...rest}
          ref={tooltipRef}
          className={composeRenderProps(classNames?.item, (className) =>
            item({ className }),
          )}
          role='tab'
          variant='icon'
          isSelected={id === view || (stack.length > 1 && stack.includes(id))}
        >
          {composeRenderProps(children, (children) => (
            <Icon>{children}</Icon>
          ))}
        </ToggleButton>
      </DrawerTrigger>
      <Tooltip
        triggerRef={tooltipRef}
        placement={tooltipPlacementMap[placement]}
        offset={6}
        className={classNames?.tooltip}
      >
        {textValue}
      </Tooltip>
    </TooltipTrigger>
  );
}
