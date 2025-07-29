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

const { field, icon, descriptionText, error, dateSegment } = DateFieldStyles();

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
  size = 'medium',
  ...props
}: DateInputProps) => {
  return (
    <div className='relative flex'>
      {size === 'medium' ? (
        <Icon className={icon({ size })}>
          <Calendar />
        </Icon>
      ) : null}
      <AriaDateInput
        {...props}
        className={composeRenderProps(className, (className) =>
          field({ size, className }),
        )}
        data-size={size}
      />
    </div>
  );
};

export function DateField<T extends DateValue>({
  className,
  description,
  errorMessage,
  isDisabled,
  isInvalid,
  isReadOnly,
  label,
  placeholder,
  slot,
  size = 'medium',
  shortMonth = true,
  ...props
}: DateFieldProps<T>) {
  const isSmall = size === 'small';
  const shouldShowDescription =
    description && (!(isSmall || isInvalid) || isDisabled);
  const shouldShowError =
    errorMessage && isInvalid && !isDisabled && !isReadOnly;

  return (
    <AriaDateField<T>
      {...props}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      slot={slot}
      className={'flex flex-col gap-xs'}
    >
      {!isSmall && (
        <Label
          className='empty:hidden'
          isDisabled={isDisabled}
          isRequired={props.isRequired}
        >
          {label}
        </Label>
      )}

      <DateInput className={className} size={size}>
        {(segment) => (
          <FormattedDateSegment segment={segment} shortMonth={shortMonth} />
        )}
      </DateInput>
      {shouldShowDescription && (
        <AriaText className={descriptionText({})} slot='description'>
          {description}
        </AriaText>
      )}
      {shouldShowError && (
        <FieldError className={error({})}>{errorMessage}</FieldError>
      )}
    </AriaDateField>
  );
}
