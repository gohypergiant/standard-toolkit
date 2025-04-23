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

import { type VariantProps, cva } from 'cva';
import type * as React from 'react';
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps as AriaTooltipTriggerComponentProps,
  Focusable,
} from 'react-aria-components';
import { containsExactChildren } from '../../lib/react';
import { cn } from '../../lib/utils';

const tooltipStyles = cva(
  'flex max-w-[160px] items-center justify-center rounded-small bg-surface-overlay px-s py-xs text-center text-body-xs break-words text-default-light shadow-elevation-overlay',
);

export type TooltipProps = AriaTooltipProps;
export type TooltipTriggerComponentProps = AriaTooltipTriggerComponentProps;

function Tooltip({ children, ...props }: TooltipTriggerComponentProps) {
  containsExactChildren({
    children,
    componentName: Tooltip.displayName,
    restrictions: {
      [TooltipTrigger.displayName]: 1,
      [TooltipBody.displayName]: 1,
    },
  });

  return (
    <AriaTooltipTrigger {...props}>
      <div>{children}</div>
    </AriaTooltipTrigger>
  );
}
Tooltip.displayName = 'Tooltip';
Tooltip.as = (
  props: VariantProps<typeof tooltipStyles>,
  className?: string | string[],
) => cn(tooltipStyles({ ...props, className }));

const TooltipTrigger = ({
  children,
}: React.ComponentProps<typeof Focusable>) => {
  return <Focusable>{children}</Focusable>;
};
TooltipTrigger.displayName = 'Tooltip.Trigger';

const TooltipBody = ({
  children,
  className,
  offset = 5,
  ...props
}: TooltipProps) => {
  return (
    <AriaTooltip
      {...props}
      className={cn(tooltipStyles({ className }))}
      offset={offset}
    >
      {children}
    </AriaTooltip>
  );
};
TooltipBody.displayName = 'Tooltip.Body';

Tooltip.Trigger = TooltipTrigger;
Tooltip.Body = TooltipBody;

export { Tooltip };
