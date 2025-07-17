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
import { cn } from '@/lib/utils';
import { CheckboxIndeterminate, CheckboxSelected } from '@accelint/icons';
import 'client-only';
import { cva } from 'cva';
import type React from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components';
import { Label } from '../label';

const checkboxStyles = cva(
  'fg-inverse-light size-l rounded-small outline outline-interactive',
  {
    variants: {
      isIndeterminate: {
        true: 'bg-highlight outline-highlight hover:outline-interactive-hover focus:outline-interactive-hover',
      },
      isSelected: {
        true: 'bg-highlight outline-highlight hover:outline-interactive-hover focus:outline-interactive-hover',
      },
      isHovered: {
        true: 'outline-interactive-hover',
      },
      isFocused: {
        true: 'outline-interactive-hover',
      },
      isDisabled: {
        true: 'outline-interactive-disabled hover:outline-interactive-disabled',
      },
      isReadOnly: {
        true: 'outline-interactive-disabled hover:outline-interactive-disabled',
      },
    },
    compoundVariants: [
      {
        isDisabled: true,
        isSelected: true,
        className: 'icon-inverse-light bg-interactive-disabled',
      },
      {
        isDisabled: true,
        isIndeterminate: true,
        className: 'icon-inverse-light bg-interactive-disabled',
      },
      {
        isReadOnly: true,
        isSelected: true,
        className: 'icon-inverse-light bg-interactive-disabled',
      },
      {
        isReadOnly: true,
        isIndeterminate: true,
        className: 'icon-inverse-light bg-interactive-disabled',
      },
    ],
    defaultVariants: {
      isIndeterminate: false,
      isSelected: false,
    },
  },
);

/**
 * This is a checkbox.
 */
export interface CheckboxProps extends AriaCheckboxProps {}

export function Checkbox({ className, children, ...args }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...args}
      className={cn(
        'fg-default-light flex items-center gap-m text-body-s disabled:text-interactive-disabled',
        className,
      )}
    >
      {({
        isDisabled,
        isFocused,
        isHovered,
        isIndeterminate,
        isReadOnly,
        isSelected,
      }) => (
        <>
          <div
            className={cn(
              checkboxStyles({
                isDisabled,
                isFocused,
                isHovered,
                isIndeterminate,
                isReadOnly,
                isSelected,
              }),
            )}
            aria-hidden
          >
            {isIndeterminate && !isSelected && <CheckboxIndeterminate />}
            {isSelected && !isIndeterminate && <CheckboxSelected />}
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
        'fg-default-light flex flex-col gap-m text-body-s',
        className,
      )}
    >
      {(props) => (
        <>
          {label ? <Label>{label}</Label> : undefined}
          {typeof children === 'function' ? children(props) : children}
        </>
      )}
    </AriaCheckboxGroup>
  );
}

Checkbox.Group = CheckboxGroup;
