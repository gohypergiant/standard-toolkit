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
  Button as AriaButton,
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  Header as AriaHeader,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Collection as AriaListBoxCollection,
  ListBoxSection as AriaListBoxSection,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  ListLayout as AriaListLayout,
  type ListLayoutOptions as AriaListLayoutOptions,
  Popover as AriaPopover,
  Text as AriaText,
  Virtualizer as AriaVirtualizer,
  type VirtualizerProps as AriaVirtualizerProps,
} from 'react-aria-components';

import { cn } from '@/lib/utils';
import { ChevronDown } from '@accelint/icons';
import { type VariantProps, cva } from 'cva';
import type { ReactNode } from 'react';
import { Icon } from '../icon';
import { Label } from '../label';
import { Options } from '../options';
import { type IOptionsItem, OptionsItem } from '../options-item';

const textFieldStyles = cva(
  [
    'block w-full rounded-medium py-xs pr-[32px] pl-s font-display outline outline-interactive',
    'not-disabled:read-only:rounded-none not-disabled:read-only:p-0 not-disabled:read-only:outline-transparent not-disabled:read-only:hover:outline-transparent not-disabled:read-only:focus:outline-transparent',
  ],
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
      size: {
        medium: 'text-body-s',
        small: 'text-body-xs',
      },
    },
    compoundVariants: [
      {
        isDisabled: true,
        isInvalid: true,
        className: 'outline-interactive-disabled',
      },
    ],
    defaultVariants: {
      size: 'medium',
    },
  },
);

interface InputProps
  extends VariantProps<typeof textFieldStyles>,
    Omit<AriaInputProps, 'size'> {
  isReadOnly?: boolean;
}

const Input = ({
  className,
  isReadOnly = false,
  size = 'medium',
  ...props
}: InputProps) => {
  return (
    <AriaInput
      {...props}
      className={({ isDisabled, isInvalid }) =>
        cn(
          textFieldStyles({
            isDisabled,
            isInvalid,
            size,
            className,
          }),
        )
      }
    />
  );
};
Input.displayName = 'ComboBox.Input';

export interface ComboBoxProps<T extends IOptionsItem>
  extends Omit<
      VariantProps<typeof textFieldStyles>,
      'isDisabled' | 'isInvalid' | 'isReadOnly'
    >,
    Omit<AriaComboBoxProps<T>, 'children'>,
    Pick<AriaVirtualizerProps<AriaListLayoutOptions>, 'layoutOptions'> {
  className?: string;
  children: ReactNode | ((item: T) => ReactNode);
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
}

export function ComboBox<T extends IOptionsItem>({
  children,
  className,
  description,
  errorMessage,
  isDisabled,
  isInvalid,
  isReadOnly,
  label,
  placeholder,
  layoutOptions,
  size = 'medium',
  ...props
}: ComboBoxProps<T>) {
  const isSmall = size === 'small';
  const shouldShowDescription = !(isSmall || isInvalid) || isDisabled;
  const shouldShowError = isInvalid && !isDisabled && !isReadOnly;
  const shouldShowLabel = !isSmall && label;

  return (
    <AriaComboBox<T>
      {...props}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      className='flex flex-col gap-xs'
    >
      {({ isDisabled, isOpen }) => (
        <>
          {shouldShowLabel && (
            <Label
              className='empty:hidden'
              isDisabled={isDisabled}
              isRequired={props.isRequired}
            >
              {label}
            </Label>
          )}
          <div className='relative flex items-center'>
            <Input
              className={className}
              isReadOnly={isReadOnly}
              placeholder={placeholder}
              size={size}
            />
            <AriaButton
              className={cn([
                'fg-default-light absolute right-xs transform',
                isDisabled && 'fg-disabled',
                isOpen && 'rotate-180',
                isReadOnly && 'hidden',
              ])}
            >
              <Icon className='block' size='large'>
                <ChevronDown />
              </Icon>
            </AriaButton>
          </div>
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
          <AriaPopover className='w-(--trigger-width)'>
            <AriaVirtualizer
              layout={AriaListLayout}
              layoutOptions={layoutOptions}
            >
              <Options>{children}</Options>
            </AriaVirtualizer>
          </AriaPopover>
        </>
      )}
    </AriaComboBox>
  );
}
ComboBox.displayName = 'ComboBox';

ComboBox.Item = OptionsItem;

interface ComboBoxSectionProps<T extends IOptionsItem>
  extends AriaListBoxSectionProps<T> {
  header?: string;
}

export function ComboBoxSection<T extends IOptionsItem>({
  children,
  header,
  items,
}: ComboBoxSectionProps<T>) {
  return (
    <AriaListBoxSection
      id={header}
      className='col-span-2 mt-s grid grid-cols-[auto_1fr] border-default-dark border-t first:border-none'
    >
      <AriaHeader className='col-span-2 m-xs my-s text-default-dark text-header-xs'>
        {header}
      </AriaHeader>
      <AriaListBoxCollection items={items}>{children}</AriaListBoxCollection>
    </AriaListBoxSection>
  );
}
ComboBox.displayName = 'ComboBox.Section';
ComboBox.Section = ComboBoxSection;
