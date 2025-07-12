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
  type ContextValue,
  FieldError,
  Text,
  TextArea,
  TextField,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Label } from '../label';
import { TextAreaStyles, TextAreaStylesDefaults } from './styles';
import type { TextAreaFieldProps, TextAreaFieldProviderProps } from './types';

const { field, label, input, description, error } = TextAreaStyles();

export const TextAreaFieldContext =
  createContext<ContextValue<TextAreaFieldProviderProps, HTMLDivElement>>(null);

function TextAreaFieldProvider({
  children,
  ...props
}: TextAreaFieldProviderProps) {
  return (
    <TextAreaFieldContext.Provider value={props}>
      {children}
    </TextAreaFieldContext.Provider>
  );
}
TextAreaFieldProvider.displayName = 'TextAreaField.Provider';

export function TextAreaField({ ref, ...props }: TextAreaFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, TextAreaFieldContext);

  const {
    classNames,
    description: descriptionProp,
    errorMessage,
    label: labelProp,
    inputRef,
    inputProps,
    size = TextAreaStylesDefaults.size,
    isDisabled,
    isInvalid: isInvalidProp,
    isReadOnly,
    isRequired,
    ...rest
  } = props;
  const isInvalid = isInvalidProp || !!errorMessage;

  return (
    <TextField
      {...rest}
      className={composeRenderProps(classNames?.field, (className) =>
        field({ className, size, isDisabled, isInvalid, isReadOnly }),
      )}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      {size !== 'small' && (
        <Label
          className={label({
            className: classNames?.label,
            size,
            isDisabled,
            isInvalid,
            isReadOnly,
          })}
          isDisabled={isDisabled}
          isRequired={isRequired}
        >
          {labelProp}
        </Label>
      )}
      <TextArea
        ref={inputRef}
        {...inputProps}
        className={composeRenderProps(
          classNames?.input,
          (className, { isDisabled, isInvalid }) =>
            input({
              className,
              size,
              isDisabled,
              isInvalid,
              isReadOnly,
            }),
        )}
      />
      {size !== 'small' && !isInvalid && (
        <Text
          slot='description'
          className={description({
            className: classNames?.description,
            size,
            isDisabled,
            isInvalid,
            isReadOnly,
          })}
        >
          {descriptionProp}
        </Text>
      )}
      <FieldError
        className={composeRenderProps(classNames?.error, (className) =>
          error({
            className,
            size,
            isDisabled,
            isInvalid,
            isReadOnly,
          }),
        )}
      >
        {errorMessage}
      </FieldError>
    </TextField>
  );
}
TextAreaField.displayName = 'TextAreaField';
TextAreaField.Provider = TextAreaFieldProvider;
