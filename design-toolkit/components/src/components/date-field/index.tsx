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
import type { DateValue } from '@internationalized/date';
import type { DateSegment as TDateSegment } from '@react-stately/datepicker';
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  type DateSegmentProps as AriaDateSegmentProps,
  Text as AriaText,
  DateSegment,
  type DateSegmentRenderProps,
  FieldError,
  composeRenderProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Label } from '../label';
import { DateFieldStyles } from './styles';
import type { DateFieldProps, DateInputProps } from './types';

const {
  field,
  dateInput,
  dateInputContainer,
  icon,
  descriptionText,
  error,
  dateSegment,
} = DateFieldStyles();

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

const MonthDateSegment = ({
  value,
  isFocused,
  isPlaceholder,
  placeholder,
  isReadOnly,
  shortMonth,
}: DateSegmentRenderProps & { shortMonth?: boolean }) => {
  if (isPlaceholder) {
    return placeholder;
  }

  let displayValue: string | undefined = `${value}`;

  if (!isReadOnly && isFocused) {
    displayValue = displayValue.padStart(2, '0');
  } else if (shortMonth) {
    displayValue = months[(value ?? 0) - 1];
  }

  return displayValue;
};

interface FormattedDateSegmentProps extends AriaDateSegmentProps {
  segment: TDateSegment;
  shortMonth?: boolean;
}

const FormattedDateSegment = ({
  segment,
  shortMonth,
  ...props
}: FormattedDateSegmentProps) => {
  if (segment.type === 'literal' && segment.text !== ':') {
    return <></>;
  }

  return (
    <DateSegment segment={segment} className={dateSegment({})} {...props}>
      {segment.type === 'month'
        ? (renderProps) => (
            <MonthDateSegment {...renderProps} shortMonth={shortMonth} />
          )
        : segment.text}
    </DateSegment>
  );
};

const DateInput = ({
  className,
  ref = null,
  size,
  ...props
}: DateInputProps) => {
  return (
    <div className={dateInputContainer({})}>
      {size === 'medium' ? (
        <Icon className={icon({})}>
          <Calendar />
        </Icon>
      ) : null}
      <AriaDateInput
        {...props}
        className={composeRenderProps(className, (className) =>
          dateInput({
            className,
          }),
        )}
        data-size={size}
      />
    </div>
  );
};

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
  isDisabled,
  isInvalid: isInvalidProp,
  isReadOnly,
  label,
  placeholder,
  slot,
  size = 'medium',
  shortMonth = true,
  isRequired,
  ...props
}: DateFieldProps<T>) {
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

  return (
    <AriaDateField<T>
      {...props}
      isDisabled={isDisabled}
      isInvalid={isInvalidProp || (errorMessage ? true : undefined)} // Leave uncontrolled if possible to fallback to validation state
      isReadOnly={isReadOnly}
      slot={slot}
      className={composeRenderProps(classNames?.field, (className) =>
        field({ className }),
      )}
    >
      {(
        { isDisabled, isInvalid }, // Rely on internal state, not props, since state could differ from props
      ) => (
        <>
          {!isSmall && label && (
            <Label
              className={classNames?.label}
              isDisabled={isDisabled}
              isRequired={isRequired}
            >
              {label}
            </Label>
          )}
          <DateInput
            className={classNames?.input}
            size={size}
            isInvalid={isInvalid}
          >
            {(segment) => (
              <FormattedDateSegment segment={segment} shortMonth={shortMonth} />
            )}
          </DateInput>
          {descriptionProp && (!(isSmall || isInvalidProp) || isDisabled) && (
            <AriaText className={descriptionText({})} slot='description'>
              {descriptionProp}
            </AriaText>
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
    </AriaDateField>
  );
}
