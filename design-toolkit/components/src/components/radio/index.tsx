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
import 'client-only';
import { cva } from 'cva';
import type React from 'react';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  composeRenderProps,
} from 'react-aria-components';
import { Label } from '../label';

const radioStyles = cva(
  'fg-default-light flex size-l items-center justify-center rounded-round outline outline-interactive before:block before:size-s before:rounded-round before:bg-transparent',
  {
    variants: {
      isSelected: {
        true: 'outline-highlight before:bg-highlight',
      },
      isFocused: {
        true: 'outline-interactive-hover hover:outline-interactive-hover',
      },
      isHovered: {
        true: 'outline-interactive-hover hover:outline-interactive-hover',
      },
      isDisabled: {
        true: 'outline-interactive-disabled',
      },
    },
    compoundVariants: [
      {
        isDisabled: true,
        isSelected: true,
        className:
          'hover:interactive-disabled outline-interactive-disabled before:bg-interactive-disabled',
      },
      {
        isDisabled: true,
        className: 'hover:interactive-disabled outline-interactive-disabled',
      },
    ],
    defaultVariants: {
      isDisabled: false,
      isFocused: false,
      isHovered: false,
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
        'fg-default-light flex items-center gap-m dtk-disabled:text-interactive-disabled',
        className,
      )}
    >
      {(props) => (
        <>
          <div
            className={cn(
              radioStyles({
                isDisabled: props.isDisabled,
                isFocused: props.isFocused,
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
      className={composeRenderProps(className, (className, renderProps) =>
        cn(
          'fg-default-light flex flex-col gap-m text-body-s',
          renderProps.orientation === 'horizontal' && 'flex-row items-center',

          className,
        ),
      )}
    >
      {(props) => (
        <>
          {label ? <Label>{label}</Label> : undefined}
          {typeof children === 'function' ? children(props) : children}
        </>
      )}
    </AriaRadioGroup>
  );
}

Radio.Group = RadioGroup;
