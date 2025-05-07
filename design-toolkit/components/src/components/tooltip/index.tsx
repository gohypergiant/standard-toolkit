import { containsExactChildren } from '@/lib/react';
import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'cva';
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
import type React from 'react';
import {
  Focusable,
  Tooltip as RACTooltip,
  type TooltipProps as RACTooltipProps,
  TooltipTrigger as RACTooltipTrigger,
  type TooltipTriggerComponentProps,
} from 'react-aria-components';

const tooltipStyles = cva(
  'fg-default-light flex max-w-[160px] items-center justify-center break-words rounded-small bg-surface-overlay px-s py-xs text-center text-body-xs shadow-elevation-overlay',
);

export interface TooltipProps extends TooltipTriggerComponentProps {}

export function Tooltip({
  children,
  closeDelay = 0,
  delay = 400,
  ...props
}: TooltipProps) {
  containsExactChildren({
    children,
    componentName: Tooltip.displayName,
    restrictions: {
      [TooltipTrigger.displayName]: 1,
      [TooltipBody.displayName]: 1,
    },
  });

  return (
    <RACTooltipTrigger closeDelay={closeDelay} delay={delay} {...props}>
      {children}
    </RACTooltipTrigger>
  );
}
Tooltip.displayName = 'Tooltip';
Tooltip.as = (
  props: VariantProps<typeof tooltipStyles>,
  className?: string | string[],
) => cn(tooltipStyles({ ...props, className }));

export interface TooltipTriggerProps
  extends React.ComponentProps<typeof Focusable> {}

export const TooltipTrigger = ({ children, ...props }: TooltipTriggerProps) => {
  return <Focusable {...props}>{children}</Focusable>;
};
TooltipTrigger.displayName = 'Tooltip.Trigger';

export interface TooltipBodyProps extends RACTooltipProps {}

export const TooltipBody = ({
  children,
  className,
  offset = 5,
  placement = 'bottom',
  ...props
}: TooltipBodyProps) => {
  return (
    <RACTooltip
      {...props}
      className={cn(tooltipStyles({ className }))}
      offset={offset}
      placement={placement}
    >
      {children}
    </RACTooltip>
  );
};
TooltipBody.displayName = 'Tooltip.Body';

Tooltip.Trigger = TooltipTrigger;
Tooltip.Body = TooltipBody;
