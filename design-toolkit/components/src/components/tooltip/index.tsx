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
import { createContext } from 'react';
import 'client-only';
import { containsExactChildren } from '@/lib/react';
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type ContextValue,
  Focusable,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { TooltipStyles } from './styles';
import type {
  TooltipBodyProps,
  TooltipProps,
  TooltipTriggerProps,
} from './types';

export const TooltipContext =
  createContext<ContextValue<TooltipProps, HTMLDivElement>>(null);

export function Tooltip({ ref, ...props }: TooltipProps) {
  [props, ref] = useContextProps(props, ref ?? null, TooltipContext);

  const { children, ...rest } = props;

  containsExactChildren({
    children,
    componentName: Tooltip.displayName,
    restrictions: [
      [TooltipTrigger, { min: 1, max: 1 }],
      [TooltipBody, { min: 1, max: 1 }],
    ],
  });

  return <AriaTooltipTrigger {...rest}>{children}</AriaTooltipTrigger>;
}
Tooltip.displayName = 'Tooltip';

function TooltipTrigger({ children, ...props }: TooltipTriggerProps) {
  return <Focusable {...props}>{children}</Focusable>;
}
TooltipTrigger.displayName = 'Tooltip.Trigger';

function TooltipBody({
  children,
  className,
  offset = 5,
  placement = 'bottom',
  ...props
}: TooltipBodyProps) {
  return (
    <AriaTooltip
      {...props}
      className={composeRenderProps(className, (className) =>
        TooltipStyles({ className }),
      )}
      offset={offset}
      placement={placement}
    >
      {children}
    </AriaTooltip>
  );
}
TooltipBody.displayName = 'Tooltip.Body';

Tooltip.Trigger = TooltipTrigger;
Tooltip.Body = TooltipBody;
