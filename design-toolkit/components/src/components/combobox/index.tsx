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
import { cn } from '@/lib/utils';
import { ChevronDown } from '@accelint/icons';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  Input as AriaInput,
  ListLayout as AriaListLayout,
  Popover as AriaPopover,
  Text as AriaText,
  Virtualizer as AriaVirtualizer,
} from 'react-aria-components';
import { Icon } from '../icon';
import type { InputProps } from '../input/types';
import { Label } from '../label';
import { Options } from '../options';
import type { OptionsDataItem } from '../options/types';
import { ComboBoxStyles } from './styles';
import type { ComboBoxProps } from './types';

const { textFieldBase, comboBox, input, error, popOver } = ComboBoxStyles();

const Input = ({ classNames, size = 'medium', ...props }: InputProps) => {
  return (
    <AriaInput {...props} className={textFieldBase({})} data-size={size} />
  );
};
Input.displayName = 'ComboBox.Input';

export function ComboBox<T extends OptionsDataItem>({
  children,
  classNames,
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
      className={comboBox({})}
    >
      {({ isDisabled, isOpen }) => (
        <>
          {shouldShowLabel && (
            <Label isDisabled={isDisabled} isRequired={props.isRequired}>
              {label}
            </Label>
          )}
          <div className={input({})}>
            <Input
              classNames={classNames?.input}
              placeholder={placeholder}
              size={size}
            />
            <AriaButton
              className={cn([
                'fg-default-light absolute right-xs transform',
                isDisabled && 'fg-disabled',
                isOpen && 'rotate-180',
              ])}
            >
              <Icon size='small'>
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
            <AriaText className={error({})} slot='errorMessage'>
              {errorMessage}
            </AriaText>
          )}
          <AriaPopover className={popOver({})}>
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
