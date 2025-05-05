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
import type React from 'react';
import {
  Label as AriaLabel,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from 'react-aria-components';

const radioStyles = cva(
  'fg-default-light flex size-l items-center justify-center rounded-round border before:block before:size-s before:rounded-round before:bg-transparent',
  {
    variants: {
      isHovered: {
        true: 'border-interactive-hover',
        false: 'border-interactive',
      },
      isSelected: {
        true: 'border-highlight before:bg-highlight hover:border-highlight',
      },
      isDisabled: {
        true: 'border-interactive-disabled',
      },
    },
    compoundVariants: [
      {
        isDisabled: true,
        isSelected: true,
        className:
          'hover:interactive-disabled border-interactive-disabled before:bg-interactive-disabled',
      },
      {
        isDisabled: true,
        className: 'hover:interactive-disabled border-interactive-disabled',
      },
    ],
    defaultVariants: {
      isSelected: false,
    },
  },
);

export interface RadioProps extends AriaRadioProps {}

export function Radio({ className, children, ...args }: RadioProps) {
  return (
    <AriaRadio
      {...args}
      className={cn(
        'fg-default-light flex items-center gap-m ai-disabled:text-interactive-disabled text-body-s',
        className,
      )}
    >
      {(props) => (
        <>
          <div
            className={cn(
              radioStyles({
                isDisabled: props.isDisabled,
                isHovered: props.isHovered,
                isSelected: props.isSelected,
              }),
            )}
            aria-hidden
          />
          {typeof children === 'function' ? children(props) : children}
        </>
      )}
    </AriaRadio>
  );
}

export interface RadioGroupProps extends AriaRadioGroupProps {
  // children: React.JSX.Element;
  label?: string | React.JSX.Element;
}

function RadioGroup({ children, className, label, ...props }: RadioGroupProps) {
  return (
    <AriaRadioGroup
      {...props}
      className={cn(
        'fg-default-light flex flex-col gap-m text-header-m',
        className,
      )}
    >
      {(props) => (
        <>
          {label ? <AriaLabel>{label}</AriaLabel> : undefined}
          {typeof children === 'function' ? children(props) : children}
        </>
      )}
    </AriaRadioGroup>
  );
}

Radio.Group = RadioGroup;
