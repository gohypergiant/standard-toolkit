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

import 'client-only';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  Header as AriaHeader,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  ListBox as AriaListBox,
  Collection as AriaListBoxCollection,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
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
import type { MenuItem } from '@/types/types';
import ChevronDown from '@accelint/icons/chevron-down';
import { type VariantProps, cva } from 'cva';
import type { ReactNode } from 'react';
import { Icon } from '../icon';
import { Label } from '../label';

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

export interface ComboBoxProps<T extends MenuItem>
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

export function ComboBox<T extends MenuItem>({
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
              isOptional={!props.isRequired}
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
                'fg-default-light icon-size-xl absolute right-xs transform',
                isDisabled && 'fg-disabled',
                isOpen && 'rotate-180',
                isReadOnly && 'hidden',
              ])}
            >
              <Icon className='block'>
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
              <AriaListBox className='grid max-h-[200px] grid-cols-[auto_1fr] overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static-light'>
                {/* @ts-expect-error package version mismatch TODO */}
                {children}
              </AriaListBox>
            </AriaVirtualizer>
          </AriaPopover>
        </>
      )}
    </AriaComboBox>
  );
}
ComboBox.displayName = 'ComboBox';

const comboBoxItemStyles = cva([
  'fg-default-light icon-size-l flex items-center p-s pl-xs text-body-s',
  '**:data-[slot=description]:fg-default-dark **:data-[slot=description]:text-body-xs',
  'hover:fg-inverse-light hover:**:data-[slot=description]:fg-inverse-light hover:bg-highlight-bold',
  'ai-focus:fg-inverse-light ai-focus:**:data-[slot=description]:fg-inverse-light ai-focus:bg-highlight-bold',
  'ai-disabled:fg-disabled ai-disabled:**:data-[slot=description]:fg-disabled ai-disabled:bg-transparent',
]);

interface ComboBoxItemProps<T extends MenuItem>
  extends AriaListBoxItemProps<T> {
  description?: string;
  icon?: ReactNode;
  name: string;
}

function ComboBoxItem<T extends MenuItem>({
  children,
  className,
  description,
  icon,
  name,
  ...props
}: ComboBoxItemProps<T>) {
  return (
    <AriaListBoxItem<T>
      textValue={name}
      {...props}
      className={comboBoxItemStyles({ className })}
    >
      {(renderProps) => {
        if (typeof children === 'function') {
          return children(renderProps);
        }

        return (
          <>
            <span className='mr-s flex w-[16px] items-center'>
              {icon && <Icon>{icon}</Icon>}
            </span>

            <div className='flex min-w-0 flex-col gap-xxs'>
              <AriaText className='truncate' slot='label'>
                {name}
              </AriaText>
              {description && (
                <AriaText
                  className='truncate'
                  data-slot='description'
                  slot='description'
                >
                  {description}
                </AriaText>
              )}
            </div>
          </>
        );
      }}
    </AriaListBoxItem>
  );
}
ComboBoxItem.displayName = 'ComboBox.Item';

ComboBox.Item = ComboBoxItem;

interface ComboBoxSectionProps<T extends MenuItem>
  extends AriaListBoxSectionProps<T> {
  header?: string;
}

export function ComboBoxSection<T extends MenuItem>({
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
