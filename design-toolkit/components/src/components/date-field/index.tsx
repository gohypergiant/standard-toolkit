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
import Calendar from '@accelint/icons/calendar';
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  Text as AriaText,
  composeRenderProps,
  DateSegment,
  FieldError,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Label } from '../label';
import { DateFieldStyles, DateFieldStylesDefaults } from './styles';
import type { DateValue } from '@internationalized/date';
import type { DateFieldProps } from './types';

const { field, label, control, input, segment, description, error } =
  DateFieldStyles();

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

/**
 * DateField - A comprehensive date input component with segmented editing
 *
 * Provides accessible date input functionality with separate segments for day,
 * month, and year. Includes calendar icon, validation states, and international
 * date format support with keyboard navigation between segments.
 *
 * @example
 * // Basic date field
 * <DateField label="Birth Date" />
 *
 * @example
 * // Date field with validation
 * <DateField
 *   label="Event Date"
 *   isRequired
 *   isInvalid={hasError}
 *   errorMessage="Please select a valid date"
 * />
 *
 * @example
 * // Date field with custom formatting
 * <DateField
 *   label="Meeting Date"
 *   shortMonth={false}
 *   placeholder="Select meeting date"
 * />
 *
 * @example
 * // Compact date field
 * <DateField
 *   label="Due Date"
 *   size="small"
 *   description="When is this task due?"
 * />
 *
 * @example
 * // Controlled date field
 * <DateField
 *   label="Selected Date"
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 * />
 */
export function DateField<T extends DateValue>({
  classNames,
  description: descriptionProp,
  errorMessage: errorMessageProp,
  inputProps,
  label: labelProp,
  size = 'medium',
  shortMonth = DateFieldStylesDefaults.shortMonth,
  shouldForceLeadingZeros = true,
  isDisabled,
  isInvalid: isInvalidProp,
  isRequired,
  ...rest
}: DateFieldProps<T>) {
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

  return (
    <AriaDateField<T>
      {...rest}
      className={composeRenderProps(classNames?.field, (className) =>
        field({ className, shortMonth }),
      )}
      shouldForceLeadingZeros={shouldForceLeadingZeros}
      isDisabled={isDisabled}
      isInvalid={isInvalidProp || (errorMessage ? true : undefined)} // Leave uncontrolled if possible to fallback to validation state
      isRequired={isRequired}
      aria-label={labelProp}
      data-size={size}
    >
      {(
        { isDisabled }, // Rely on internal state, not props, since state could differ from props
      ) => (
        <>
          {!isSmall && label && (
            <Label
              className={label({ className: classNames?.label, shortMonth })}
              isDisabled={isDisabled}
              isRequired={isRequired}
            >
              {labelProp}
            </Label>
          )}
          <div
            className={control({ className: classNames?.control, shortMonth })}
          >
            {size === 'medium' && (
              <Icon>
                <Calendar />
              </Icon>
            )}
            <AriaDateInput
              {...inputProps}
              className={composeRenderProps(classNames?.input, (className) =>
                input({
                  className,
                  shortMonth,
                }),
              )}
            >
              {(segmentProp) => {
                // Remove extra space and punctuation from input display
                if (segmentProp.type === 'literal') {
                  return <>{segmentProp.text === ':' ? ':' : null}</>;
                }

                return (
                  <DateSegment
                    className={composeRenderProps(
                      classNames?.segment,
                      (className) => segment({ className, shortMonth }),
                    )}
                    segment={segmentProp}
                  >
                    {({
                      placeholder,
                      text,
                      value,
                      isFocused,
                      isPlaceholder,
                    }) => {
                      if (isPlaceholder) {
                        return placeholder;
                      }

                      return segmentProp.type === 'month' &&
                        shortMonth &&
                        !isFocused
                        ? months[(value ?? 0) - 1]
                        : text;
                    }}
                  </DateSegment>
                );
              }}
            </AriaDateInput>
          </div>
          {descriptionProp && (!(isSmall || isInvalidProp) || isDisabled) && (
            <AriaText
              className={description({
                className: classNames?.description,
                shortMonth,
              })}
              slot='description'
            >
              {descriptionProp}
            </AriaText>
          )}
          <FieldError
            className={composeRenderProps(classNames?.error, (className) =>
              error({ className, shortMonth }),
            )}
          >
            {errorMessage}
          </FieldError>
        </>
      )}
    </AriaDateField>
  );
}
