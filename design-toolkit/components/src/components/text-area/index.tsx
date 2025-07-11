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
import { isSlottedContextValue } from '@/lib/utils';
import { createContext, useContext } from 'react';
import {
  Text as AriaText,
  TextArea as AriaTextArea,
  TextAreaContext as AriaTextAreaContext,
  TextField as AriaTextField,
  type ContextValue,
  FieldError,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Label } from '../label';
import { TextAreaStyles, TextAreaStylesDefaults } from './styles';
import type {
  TextAreaFieldProps,
  TextAreaFieldProviderProps,
  TextAreaProps,
} from './types';

const { field, input, description, error } = TextAreaStyles();

// context
export const TextAreaContext =
  createContext<ContextValue<TextAreaFieldProviderProps, HTMLDivElement>>(null);

function TextAreaProvider({ children, ...props }: TextAreaFieldProviderProps) {
  return (
    <TextAreaContext.Provider value={props}>
      {children}
    </TextAreaContext.Provider>
  );
}
TextAreaProvider.displayName = 'TextArea.Provider';

// TextArea.Input
export function TextAreaInput({ ref, ...props }: TextAreaProps) {
  [props, ref] = useContextProps(props, ref ?? null, AriaTextAreaContext);
  const context = useContext(TextAreaContext);
  const finalSize =
    props.size ??
    (isSlottedContextValue(context) ? undefined : context?.size) ??
    TextAreaStylesDefaults.size;

  const { className, readOnly, selectOnFocus, ...rest } = props;

  return (
    <div className='relative flex items-center'>
      <AriaTextArea
        {...rest}
        onFocus={(e) => {
          if (selectOnFocus) {
            ref.current?.select();
          }

          props.onFocus?.(e);
        }}
        ref={ref}
        readOnly={readOnly}
        className={({ isDisabled, isInvalid }) =>
          input({
            isDisabled,
            isInvalid,
            isReadOnly: readOnly,
            size: finalSize,
            className,
          })
        }
      />
    </div>
  );
}
TextAreaInput.displayName = 'TextArea.Input';

// TextArea
export function TextArea(props: TextAreaFieldProps) {
  const { size, isDisabled, isInvalid, isReadOnly, classNames, selectOnFocus } =
    props;

  const context = useContext(TextAreaContext);
  const finalSize =
    size ??
    (isSlottedContextValue(context) ? undefined : context?.size) ??
    TextAreaStylesDefaults.size;
  const finalIsDisabled =
    isDisabled ??
    (isSlottedContextValue(context) ? undefined : context?.isDisabled) ??
    TextAreaStylesDefaults.isDisabled;
  const finalIsInvalid =
    isInvalid ??
    (isSlottedContextValue(context) ? undefined : context?.isInvalid) ??
    TextAreaStylesDefaults.isInvalid;
  const finalIsReadOnly =
    isReadOnly ??
    (isSlottedContextValue(context) ? undefined : context?.isReadOnly) ??
    TextAreaStylesDefaults.isReadOnly;
  const finalSelectOnFocus =
    selectOnFocus ??
    (isSlottedContextValue(context) ? undefined : context?.selectOnFocus) ??
    TextAreaStylesDefaults.selectOnFocus;

  const isSmall = finalSize === 'small';
  const shouldShowDescription = !(isSmall || finalIsInvalid) || finalIsDisabled;

  return (
    <TextAreaContext.Provider
      value={{
        size: finalSize,
        isDisabled: finalIsDisabled,
        isInvalid: finalIsInvalid,
        isReadOnly: finalIsReadOnly,
        selectOnFocus: finalSelectOnFocus,
      }}
    >
      <AriaTextField
        {...props}
        isDisabled={finalIsDisabled}
        isInvalid={finalIsInvalid}
        isReadOnly={finalIsReadOnly}
        className={composeRenderProps(classNames?.field, (className) =>
          field({ className }),
        )}
      >
        {!isSmall && (
          <Label
            className='empty:hidden'
            isDisabled={finalIsDisabled}
            isRequired={props.isRequired}
          >
            {props.label}
          </Label>
        )}
        <TextAreaInput
          className={classNames?.input}
          placeholder={props.placeholder}
          size={finalSize}
          selectOnFocus={finalSelectOnFocus}
        />
        {shouldShowDescription && (
          <AriaText
            className={description({ isDisabled: finalIsDisabled })}
            slot='description'
          >
            {props.description}
          </AriaText>
        )}
        <FieldError className={error()}>{props.errorMessage}</FieldError>
      </AriaTextField>
    </TextAreaContext.Provider>
  );
}
TextArea.displayName = 'TextArea';
TextArea.Provider = TextAreaProvider;
TextArea.Input = TextAreaInput;
