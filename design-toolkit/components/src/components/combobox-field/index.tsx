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
import { ChevronDown } from '@accelint/icons';
import { createContext } from 'react';
import {
  Button,
  ComboBox,
  type ContextValue,
  composeRenderProps,
  FieldError,
  Input,
  ListLayout,
  Popover,
  Text,
  useContextProps,
  Virtualizer,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Label } from '../label';
import { Options } from '../options';
import { ComboBoxStyles } from './styles';
import type { ProviderProps } from '@/lib/types';
import type { OptionsDataItem } from '../options/types';
import type { ComboBoxFieldProps } from './types';

const { field, label, control, input, trigger, description, error, popover } =
  ComboBoxStyles();

export const ComboBoxFieldContext =
  // biome-ignore lint/suspicious/noExplicitAny: Setting a type would restrict it beyond what the component allows to extend to
  createContext<ContextValue<ComboBoxFieldProps<any>, HTMLDivElement>>(null);

function ComboBoxFieldProvider<T extends OptionsDataItem>({
  children,
  ...props
}: ProviderProps<ComboBoxFieldProps<T>>) {
  return (
    <ComboBoxFieldContext.Provider value={props}>
      {children}
    </ComboBoxFieldContext.Provider>
  );
}
ComboBoxFieldProvider.displayName = 'ComboBoxField.Provider';

/**
 * ComboBoxField - Accessible searchable combobox with dropdown options
 *
 * A combobox field that provides a searchable input with virtualized dropdown
 * options and support for sections, icons, and rich content.
 *
 * @example
 * <ComboBoxField defaultItems={items}>
 *   {(item) => <Options.Item key={item.id} textValue={item.name}>{item.name}</Options.Item>}
 * </ComboBoxField>
 */
export function ComboBoxField<T extends OptionsDataItem>({
  ref,
  ...props
}: ComboBoxFieldProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, ComboBoxFieldContext);

  const {
    children,
    classNames,
    description: descriptionProp,
    errorMessage: errorMessageProp,
    inputProps,
    label: labelProp,
    layoutOptions,
    menuTrigger = 'focus',
    size = 'medium',
    isInvalid: isInvalidProp,
    ...rest
  } = props;
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

  return (
    <ComboBox<T>
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.field, (className) =>
        field({ className }),
      )}
      menuTrigger={menuTrigger}
      isInvalid={isInvalidProp || (errorMessage ? true : undefined)} // Leave uncontrolled if possible to fallback to validation state
      data-size={size}
    >
      {(
        { isDisabled, isInvalid, isRequired }, // Rely on internal state, not props, since state could differ from props
      ) => (
        <>
          {!!labelProp && !isSmall && (
            <Label
              className={label({ className: classNames?.label })}
              isDisabled={isDisabled}
              isRequired={isRequired}
            >
              {labelProp}
            </Label>
          )}
          <div className={control({ className: classNames?.control })}>
            <Input
              {...inputProps}
              className={composeRenderProps(classNames?.input, (className) =>
                input({ className }),
              )}
            />
            <Button
              className={composeRenderProps(classNames?.trigger, (className) =>
                trigger({ className }),
              )}
            >
              <Icon size='small'>
                <ChevronDown />
              </Icon>
            </Button>
          </div>
          {!!descriptionProp && !(isSmall || isInvalid) && (
            <Text
              className={description({
                className: classNames?.description,
              })}
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
          <Popover
            className={composeRenderProps(classNames?.popover, (className) =>
              popover({ className }),
            )}
          >
            <Virtualizer layout={ListLayout} layoutOptions={layoutOptions}>
              <Options>{children}</Options>
            </Virtualizer>
          </Popover>
        </>
      )}
    </ComboBox>
  );
}
ComboBoxField.displayName = 'ComboBox';
