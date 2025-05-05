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

import { Check, Minus } from '@/icons';
import { cn } from '@/lib/utils';
import { cva } from 'cva';
import type React from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
  Label as AriaLabel,
} from 'react-aria-components';

const checkboxStyles = cva('fg-inverse-light size-l rounded-small border', {
  variants: {
    isHovered: {
      true: 'border-interactive-hover',
      false: 'border-interactive',
    },
    isIndeterminate: {
      true: 'border-highlight bg-highlight hover:border-highlight',
    },
    isSelected: {
      true: 'border-highlight bg-highlight hover:border-highlight',
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
        'icon-inverse-light hover:interactive-disabled bg-interactive-disabled',
    },
    {
      isDisabled: true,
      isIndeterminate: true,
      className:
        'icon-inverse-light hover:interactive-disabled bg-interactive-disabled',
    },
  ],
  defaultVariants: {
    isIndeterminate: false,
    isSelected: false,
  },
});

/**
 * This is a checkbox.
 */
export interface CheckboxProps extends AriaCheckboxProps {}

export function Checkbox({ className, children, ...args }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...args}
      className={cn(
        'fg-default-light flex items-center gap-m ai-disabled:text-interactive-disabled text-body-s',
        className,
      )}
    >
      {({ isDisabled, isHovered, isIndeterminate, isSelected }) => (
        <>
          <div
            className={cn(
              checkboxStyles({
                isDisabled,
                isHovered,
                isIndeterminate,
                isSelected,
              }),
            )}
            aria-hidden
          >
            {isIndeterminate && !isSelected && <Minus />}
            {isSelected && !isIndeterminate && <Check />}
          </div>
          {children}
        </>
      )}
    </AriaCheckbox>
  );
}

export interface CheckboxGroupProps extends AriaCheckboxGroupProps {
  // children: React.JSX.Element;
  label?: string | React.JSX.Element;
}

function CheckboxGroup({
  children,
  className,
  label,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
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
    </AriaCheckboxGroup>
  );
}

Checkbox.Group = CheckboxGroup;
