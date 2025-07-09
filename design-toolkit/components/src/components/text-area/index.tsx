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
import {
  Text as AriaText,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  TextAreaContext,
  useContextProps,
} from 'react-aria-components';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'cva';
import type { ForwardedRef } from 'react';
import { Label } from '../label';

const textAreaStyles = cva(
  ['block w-full rounded-medium p-s font-display outline outline-interactive'],
  {
    variants: {
      isDisabled: {
        true: 'text-disabled outline-interactive-disabled placeholder:text-disabled',
        false:
          'text-default-light placeholder:text-default-dark hover:outline-interactive-hover focus:outline-highlight',
      },
      isInvalid: {
        true: 'outline-serious',
      },
      isReadOnly: {
        true: 'rounded-none p-0 outline-none',
      },
      size: {
        medium: 'text-body-s',
        small: 'text-body-xs',
      },
      isClearable: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        isDisabled: true,
        isInvalid: true,
        className: 'outline-interactive-disabled',
      },
      {
        isClearable: true,
        isDisabled: false,
        size: 'medium',
        className: 'pr-xl',
      },
    ],
    defaultVariants: {
      isClearable: false,
      size: 'medium',
    },
  },
);

interface InputProps
  extends VariantProps<typeof textAreaStyles>,
    Omit<AriaTextAreaProps, 'size'> {
  selectOnFocus?: boolean;
  ref?: ForwardedRef<HTMLTextAreaElement>;
}

const Input = ({
  className,
  ref = null,
  selectOnFocus = false,
  size = 'medium',
  ...props
}: InputProps) => {
  [props, ref] = useContextProps(props, ref, TextAreaContext);

  if (props.readOnly) {
    return (
      <span
        className={cn(
          textAreaStyles({
            isDisabled: false,
            isReadOnly: props.readOnly,
            size,
            className,
          }),
        )}
      >
        {props.value || '\u00A0'}
      </span>
    );
  }

  return (
    <div className='relative flex items-center'>
      <AriaTextArea
        {...props}
        onFocus={(e) => {
          if (selectOnFocus) {
            ref.current?.select();
          }

          props.onFocus?.(e);
        }}
        ref={ref}
        className={({ isDisabled, isInvalid }) =>
          cn(
            textAreaStyles({
              isDisabled,
              isInvalid,
              isReadOnly: props.readOnly,
              size,
              className,
            }),
          )
        }
      />
    </div>
  );
};
Input.displayName = 'TextArea.Input';

export interface TextAreaProps
  extends Omit<
      VariantProps<typeof textAreaStyles>,
      'isDisabled' | 'isInvalid' | 'isReadOnly'
    >,
    Omit<AriaTextFieldProps, 'className'>,
    Omit<InputProps, keyof AriaTextFieldProps> {
  className?: string;
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
}

export function TextArea({
  className,
  description,
  errorMessage,
  isDisabled,
  isInvalid,
  isReadOnly,
  label,
  placeholder,
  size = 'medium',
  ...props
}: TextAreaProps) {
  const isSmall = size === 'small';
  const shouldShowDescription = !(isSmall || isInvalid) || isDisabled;
  const shouldShowError = isInvalid && !isDisabled && !isReadOnly;

  return (
    <AriaTextField
      {...(props as AriaTextFieldProps)}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      className={'flex flex-col gap-xs'}
    >
      {!isSmall && (
        <Label
          className='empty:hidden'
          isDisabled={isDisabled}
          isOptional={!props.isRequired}
        >
          {label}
        </Label>
      )}
      <Input className={className} placeholder={placeholder} size={size} />
      {shouldShowDescription && (
        <AriaText
          className={cn([
            'fg-default-dark text-body-xs empty:hidden',
            isDisabled && 'fg-disabled',
          ])}
          slot='description'
        >
          {description}
        </AriaText>
      )}
      {shouldShowError && (
        <AriaText
          className='fg-serious text-body-xs empty:hidden'
          slot='errorMessage'
        >
          {errorMessage}
        </AriaText>
      )}
    </AriaTextField>
  );
}
TextArea.displayName = 'TextArea';
