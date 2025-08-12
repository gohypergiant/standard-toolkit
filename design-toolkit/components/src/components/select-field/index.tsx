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
import type { ProviderProps } from '@/lib/types';
import ChevronDown from '@accelint/icons/chevron-down';
import { createContext } from 'react';
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  type ContextValue,
  FieldError,
  ListLayout,
  Text,
  Virtualizer,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Popover as AriaPopover } from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { Label } from '../label';
import { Options } from '../options';
import { SelectFieldStyles } from './styles';
import type { SelectFieldProps } from './types';

const { description, error, trigger, label, field, value } =
  SelectFieldStyles();

export const SelectFieldContext =
  createContext<ContextValue<SelectFieldProps, HTMLDivElement>>(null);

function SelectFieldProvider({
  children,
  ...props
}: ProviderProps<SelectFieldProps>) {
  return (
    <SelectFieldContext.Provider value={props}>
      {children}
    </SelectFieldContext.Provider>
  );
}
SelectFieldProvider.displayName = 'SelectField.Provider';

export function SelectField({ ref, ...props }: SelectFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, SelectFieldContext);

  const {
    size,
    children,
    classNames,
    description: descriptionProp,
    errorMessage: errorMessageProp,
    label: labelProp,
    layoutOptions,
    isInvalid: isInvalidProp,
    ...rest
  } = props;
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';
  const showLabel = !isSmall && !!label;

  return (
    <AriaSelect
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.field, (className) =>
        field({ className }),
      )}
      isInvalid={isInvalidProp || (errorMessage ? true : undefined)}
      data-size={size}
    >
      {composeRenderProps(
        children,
        (children, { isRequired, isDisabled, isInvalid }) => (
          <>
            {showLabel && (
              <Label
                className={label({ className: classNames?.label })}
                isRequired={isRequired}
                isDisabled={isDisabled}
              >
                {labelProp}
              </Label>
            )}
            <Button
              variant='outline'
              size={isSmall ? 'small' : 'medium'}
              className={composeRenderProps(classNames?.trigger, (className) =>
                trigger({ className }),
              )}
            >
              <AriaSelectValue
                className={value({ className: classNames?.value })}
              />
              <Icon>
                <ChevronDown className='transform group-open/select-field:rotate-180' />
              </Icon>
            </Button>
            {!!descriptionProp && !(isSmall || isInvalid) && (
              <Text
                className={description({ className: classNames?.description })}
                slot='description'
              >
                {descriptionProp}
              </Text>
            )}
            <FieldError
              className={composeRenderProps(classNames?.error, (className) =>
                error({ className }),
              )}
            >
              {errorMessage}
            </FieldError>
            <AriaPopover className='min-w-(--trigger-width)'>
              <Virtualizer layout={ListLayout} layoutOptions={layoutOptions}>
                <Options>{children}</Options>
              </Virtualizer>
            </AriaPopover>
          </>
        ),
      )}
    </AriaSelect>
  );
}
SelectField.displayName = 'SelectField';
SelectField.Provider = SelectFieldProvider;
