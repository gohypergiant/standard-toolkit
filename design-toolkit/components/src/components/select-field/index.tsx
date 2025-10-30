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

import ChevronDown from '@accelint/icons/chevron-down';
import 'client-only';
import {
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  composeRenderProps,
  FieldError,
  ListLayout,
  Text,
  useContextProps,
  Virtualizer,
} from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { Label } from '../label';
import { Options } from '../options';
import { SelectFieldContext } from './context';
import { SelectFieldStyles } from './styles';
import type { SelectFieldProps } from './types';

const { description, error, trigger, label, field, value, popover } =
  SelectFieldStyles();

/**
 * SelectField - A dropdown selection component with comprehensive form field features
 *
 * Provides an accessible and feature-rich select dropdown with built-in validation,
 * multiple sizing options, virtualization support for large datasets, and seamless
 * integration with form libraries. Includes label, description, and error messaging
 * capabilities with customizable styling through className props.
 *
 * @example
 * // Basic select field
 * <SelectField label='Country' placeholder='Select a country'>
 *   <OptionsItem textValue='us'>United States</OptionsItem>
 *   <OptionsItem textValue='ca'>Canada</OptionsItem>
 *   <OptionsItem textValue='uk'>United Kingdom</OptionsItem>
 * </SelectField>
 *
 * @example
 * // Select field with validation and description
 * <SelectField
 *   label="Priority Level"
 *   description="Choose the urgency level for this task"
 *   errorMessage={errors.priority}
 *   isRequired
 *   isInvalid={!!errors.priority}
 * >
 *   <OptionsItem textValue="low">Low</OptionsItem>
 *   <OptionsItem textValue="medium">Medium</OptionsItem>
 *   <OptionsItem textValue="high">High</OptionsItem>
 * </SelectField>
 *
 * @example
 * // Small size select field with custom styling
 * <SelectField
 *   size="small"
 *   placeholder="Quick select"
 *   classNames={{
 *     field: "custom-field-styles",
 *     trigger: "custom-trigger-styles"
 *   }}
 * >
 *   <OptionsItem textValue="option1">Option 1</OptionsItem>
 *   <OptionsItem textValue="option2">Option 2</OptionsItem>
 * </SelectField>
 */
export function SelectField({ ref, ...props }: SelectFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, SelectFieldContext);

  const {
    size = 'medium',
    children,
    classNames,
    description: descriptionProp,
    errorMessage: errorMessageProp,
    label: labelProp,
    layoutOptions,
    isInvalid: isInvalidProp,
    ...rest
  } = props;

  const errorMessage = errorMessageProp?.trim() ?? null;
  const hasError = !!errorMessage;
  const isInvalid = isInvalidProp ?? hasError;
  const isSmall = size === 'small';
  const showLabel = !isSmall && !!labelProp;

  return (
    <AriaSelect
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.field, (className) =>
        field({ className }),
      )}
      isInvalid={isInvalid}
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
              className={composeRenderProps(classNames?.trigger, (className) =>
                trigger({ className }),
              )}
              variant='outline'
              size={size}
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
            <AriaPopover
              className={composeRenderProps(classNames?.popover, (className) =>
                popover({ className }),
              )}
            >
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
