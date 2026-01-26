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
import { clsx } from '@accelint/design-foundation/lib/utils';
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
 * TextAreaField - Multi-line text input with label and validation
 *
 * Provides integrated label, description, and error message with automatic accessibility.
 *
 * @param props - {@link TextAreaFieldProps}
 * @param props.ref - Ref to the field container element.
 * @param props.classNames - Custom CSS class names for field elements.
 * @param props.description - Helper text displayed below the input.
 * @param props.errorMessage - Error message displayed when validation fails.
 * @param props.label - Label text for the field.
 * @param props.inputProps - Props passed to the underlying TextArea element.
 * @param props.size - Size variant of the field.
 * @param props.isInvalid - Whether the field is in an invalid state.
 * @returns The rendered TextAreaField component.
 *
 * @example
 * ```tsx
 * <TextAreaField
 *   label="Description"
 *   placeholder="Enter description..."
 *   onChange={setDescription}
 * />
 * ```
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
