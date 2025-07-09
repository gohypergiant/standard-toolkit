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
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Text as AriaText,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  Button,
  InputContext,
  useContextProps,
} from 'react-aria-components';

import { cn } from '@/lib/utils';
import { CancelFill } from '@accelint/icons';
import { type VariantProps, cva } from 'cva';
import { type ChangeEvent, type ForwardedRef, useEffect } from 'react';
import { Icon } from '../icon';
import { Label } from '../label';

const textFieldStyles = cva(
  [
    'block w-full rounded-medium px-s py-xs font-display outline outline-interactive',
  ],
  {
    variants: {
      isDisabled: {
        true: 'text-disabled outline-interactive-disabled placeholder:text-disabled',
        false:
          'text-default-light placeholder:text-default-dark hover:outline-interactive-hover focus:outline-highlight',
      },
      isInvalid: {
        true: 'outline-serious focus:outline-serious',
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
  extends VariantProps<typeof textFieldStyles>,
    Omit<AriaInputProps, 'size'> {
  isClearable?: boolean;
  selectOnFocus?: boolean;
  ref?: ForwardedRef<HTMLInputElement>;
}

const clearInputEvent = {
  target: { value: '' },
} as ChangeEvent<HTMLInputElement>;

const Input = ({
  className,
  isClearable = true,
  ref = null,
  selectOnFocus = false,
  size = 'medium',
  ...props
}: InputProps) => {
  [props, ref] = useContextProps(props, ref, InputContext);

  useEffect(() => {
    function handleKeyPressed(e: KeyboardEvent) {
      if (isClearable && e.key === 'Escape') {
        props.onChange?.(clearInputEvent);
      }
    }

    ref.current?.addEventListener('keydown', handleKeyPressed);

    return () => ref.current?.removeEventListener('keydown', handleKeyPressed);
  }, [isClearable, props.onChange, ref]);

  const shouldShowClearButton =
    !props.readOnly &&
    props.value &&
    size !== 'small' &&
    isClearable &&
    !props.disabled;

  if (props.readOnly) {
    return (
      <span
        className={cn(
          textFieldStyles({
            isClearable: false,
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
      <AriaInput
        onFocus={(e) => {
          if (selectOnFocus) {
            ref.current?.select();
          }

          props.onFocus?.(e);
        }}
        ref={ref}
        className={({ isDisabled, isInvalid }) =>
          cn(
            textFieldStyles({
              isClearable,
              isDisabled,
              isInvalid,
              isReadOnly: props.readOnly,
              size,
              className,
            }),
          )
        }
      />
      {shouldShowClearButton && (
        <Button
          className='fg-default-dark hover:fg-interactive-hover absolute right-[5px] cursor-pointer'
          excludeFromTabOrder
          onPress={() => {
            props.onChange?.(clearInputEvent);
            ref.current?.focus();
          }}
        >
          <Icon size='small'>
            <CancelFill />
          </Icon>
        </Button>
      )}
    </div>
  );
};

export interface TextFieldProps
  extends Omit<
      VariantProps<typeof textFieldStyles>,
      'isDisabled' | 'isInvalid' | 'isReadOnly'
    >,
    Omit<AriaTextFieldProps, 'className'>,
    Omit<InputProps, keyof AriaTextFieldProps> {
  className?: string;
  isClearable?: boolean;
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
}

export function TextField({
  className,
  isClearable = true,
  description,
  errorMessage,
  isDisabled,
  isInvalid,
  isReadOnly,
  label,
  placeholder,
  size = 'medium',
  ...props
}: TextFieldProps) {
  const isSmall = size === 'small';
  const shouldShowDescription =
    description && (!(isSmall || isInvalid) || isDisabled);
  const shouldShowError =
    errorMessage && isInvalid && !isDisabled && !isReadOnly;

  return (
    <AriaTextField
      {...(props as TextFieldProps)}
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
      <Input
        className={className}
        isClearable={isClearable}
        placeholder={placeholder}
        size={size}
        {...(props as InputProps)}
      />
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
