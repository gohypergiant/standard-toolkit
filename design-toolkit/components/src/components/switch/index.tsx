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

import { cn } from '@/lib/utils';
import { cva } from 'cva';
import type { ReactNode } from 'react';
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from 'react-aria-components';
import { Label } from '../label';

const labelStyles = Label.as();

const switchStyles = cva(
  [
    'relative flex h-l w-[32px] items-center rounded-round bg-transparent outline outline-interactive',
    'before:absolute before:block before:size-m before:rounded-full before:bg-default-dark',
    'group-hover:bg-interactive-hover-dark group-hover:outline-interactive-hover group-hover:before:bg-interactive-hover',
    'group-focus-within:bg-interactive-hover-dark group-focus-within:outline-interactive-hover group-focus-within:before:bg-interactive-hover',
  ],
  {
    variants: {
      isSelected: {
        true: [
          'outline-highlight before:right-[3px] before:bg-highlight',
          'group-hover:bg-highlight-subtle group-hover:outline-highlight group-hover:before:bg-highlight',
          'group-focus-within:bg-highlight-subtle group-focus-within:outline-interactive-hover group-focus-within:before:bg-highlight',
          'group-ai-disabled:bg-interactive-disabled group-ai-disabled:outline-interactive-disabled group-ai-disabled:before:bg-disabled',
        ],
        false: 'before:left-[3px]',
      },
      isDisabled: {
        true: 'group-ai-disabled:bg-interactive-disabled group-ai-disabled:outline-interactive-disabled group-ai-disabled:before:bg-disabled',
        false: '',
      },
    },
    defaultVariants: {
      isSelected: false,
    },
  },
);

export interface SwitchProps extends Omit<AriaSwitchProps, 'children'> {
  children?: ReactNode;
}

export function Switch({ children, className, ...props }: SwitchProps) {
  return (
    <AriaSwitch
      {...props}
      className='group flex ai-disabled:cursor-not-allowed items-center gap-s'
    >
      {({ isDisabled, isSelected }) => (
        <>
          <div
            className={cn(switchStyles({ className, isDisabled, isSelected }))}
          />
          {children && <span className={labelStyles}>{children}</span>}
        </>
      )}
    </AriaSwitch>
  );
}
Switch.displayName = 'Switch';
Switch.as = (className?: string | string[]) => cn(switchStyles({ className }));
