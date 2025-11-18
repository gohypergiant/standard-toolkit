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
import { clsx } from 'clsx';
import {
  composeRenderProps,
  FieldError,
  Text,
  TextArea,
  TextField,
  useContextProps,
} from 'react-aria-components';
import { Label } from '../label';
import { TextAreaFieldContext } from './context';
import styles from './styles.module.css';
import type { TextAreaFieldProps } from './types';

/**
 * TextAreaField - A multi-line text input component with label and validation
 *
 * Provides a complete form field experience for longer text content with integrated
 * label, description, and error message components. Handles validation states and
 * accessibility automatically while supporting resizable text areas.
 *
 * @example
 * // Basic text area field
 * <TextAreaField label="Comments" />
 *
 * @example
 * // Text area with validation
 * <TextAreaField
 *   isInvalid={true}
 *   errorMessage='Message is required'
 *   label='Foo'
 *   isRequired
 *   />
 */
export function TextAreaField({ ref, ...props }: TextAreaFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, TextAreaFieldContext);

  const {
    classNames,
    description: descriptionProp,
    errorMessage: errorMessageProp,
    label: labelProp,
    inputProps,
    size = 'medium',
    isInvalid: isInvalidProp,
    ...rest
  } = props;
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

  return (
    <TextField
      {...rest}
      aria-label={labelProp}
      ref={ref}
      className={composeRenderProps(classNames?.field, (className) =>
        clsx('group/text-area-field', styles.field, className),
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
              className={clsx(styles.label, classNames?.label)}
              isDisabled={isDisabled}
              isRequired={isRequired}
            >
              {labelProp}
            </Label>
          )}
          <TextArea
            {...inputProps}
            className={composeRenderProps(classNames?.input, (className) =>
              clsx(styles.input, className),
            )}
          />
          {!!descriptionProp && !(isSmall || isInvalid) && (
            <Text
              slot='description'
              className={clsx(styles.description, classNames?.description)}
            >
              {descriptionProp}
            </Text>
          )}
          <FieldError
            className={composeRenderProps(classNames?.error, (className) =>
              clsx(styles.error, className),
            )}
          >
            {errorMessage}
          </FieldError>
        </>
      )}
    </TextField>
  );
}
