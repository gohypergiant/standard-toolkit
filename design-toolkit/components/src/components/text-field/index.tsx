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
import { createContext } from 'react';
import {
  TextField as AriaTextField,
  type ContextValue,
  FieldError,
  Text,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';

import type { ProviderProps } from '@/lib/types';
import { Input } from '../input';
import { Label } from '../label';
import { TextFieldStyles } from './styles';
import type { TextFieldProps } from './types';

const { field, label, description, error } = TextFieldStyles();

export const TextFieldContext =
  createContext<ContextValue<TextFieldProps, HTMLDivElement>>(null);

function TextFieldProvider({
  children,
  ...props
}: ProviderProps<TextFieldProps>) {
  return (
    <TextFieldContext.Provider value={props}>
      {children}
    </TextFieldContext.Provider>
  );
}
TextFieldProvider.displayName = 'TextField.Provider';

export function TextField({ ref, ...props }: TextFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, TextFieldContext);

  const {
    classNames,
    description: descriptionProp,
    errorMessage: errorMessageProp,
    inputProps,
    label: labelProp,
    size = 'medium',
    isInvalid: isInvalidProp,
    ...rest
  } = props;
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

  return (
    <AriaTextField
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.field, (className) =>
        field({ className }),
      )}
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
          <Input
            {...inputProps}
            classNames={classNames?.input}
            disabled={isDisabled}
            required={isRequired}
            size={size}
            isInvalid={isInvalid}
          />
          {!!descriptionProp && !(isSmall || isInvalid) && (
            <Text
              slot='description'
              className={description({ className: classNames?.description })}
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
        </>
      )}
    </AriaTextField>
  );
}
TextField.displayName = 'TextField';
TextField.Provider = TextFieldProvider;
