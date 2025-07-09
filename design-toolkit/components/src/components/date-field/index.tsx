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
import { cn } from '@/lib/utils';
import Calendar from '@accelint/icons/calendar';
import type { DateValue } from '@internationalized/date';
import type { DateSegment as TDateSegment } from '@react-stately/datepicker';
import 'client-only';
import { type VariantProps, cva } from 'cva';
import type { ForwardedRef } from 'react';
import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  type DateSegmentProps as AriaDateSegmentProps,
  Text as AriaText,
  DateSegment,
  type DateSegmentRenderProps,
  FieldError,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Label } from '../label';

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
    <DateSegment
      segment={segment}
      className='focus:bg-highlight focus:text-inverse-light focus:outline-none' // Ensure caret color is visible, RAC sets the style prop and it is not overridable. Thanks for that.
      {...props}
    >
      {segment.type === 'month'
        ? (renderProps) => (
            <MonthDateSegment {...renderProps} shortMonth={shortMonth} />
          )
        : segment.text}
    </DateSegment>
  );
};

const dateFieldStyles = cva(
  [
    'flex w-full gap-xs rounded-medium px-s py-xs font-display outline outline-interactive',
  ],
  {
    variants: {
      isDisabled: {
        true: 'text-disabled outline-interactive-disabled placeholder:text-disabled',
        false:
          'text-default-light placeholder:text-default-dark focus-within:outline-highlight hover:outline-interactive-hover',
      },
      isInvalid: {
        true: 'outline-serious',
      },
      isReadOnly: {
        true: 'rounded-none p-0 outline-none',
      },
      size: {
        medium: ['text-body-s', 'pl-[32px]'],
        small: 'text-body-xs',
      },
    },
    compoundVariants: [
      {
        isDisabled: true,
        isInvalid: true,
        className: 'outline-interactive-disabled',
      },
      {
        isDisabled: false,
        size: 'medium',
      },
    ],
    defaultVariants: {
      size: 'medium',
    },
  },
);

interface DateInputProps
  extends VariantProps<typeof dateFieldStyles>,
    Omit<AriaDateInputProps, 'size'> {
  ref?: ForwardedRef<HTMLDivElement>;
}

const DateInput = ({
  className,
  ref = null,
  size = 'medium',
  isReadOnly,
  ...props
}: DateInputProps) => {
  return (
    <div className='relative flex'>
      {size === 'medium' ? (
        <Icon
          className={cn([
            '-translate-y-1/2 absolute top-1/2 left-s',
            props.isDisabled ? 'text-disabled' : 'text-default-light',
          ])}
        >
          <Calendar />
        </Icon>
      ) : null}
      <AriaDateInput
        {...props}
        className={({ isDisabled, isInvalid }) =>
          cn(
            dateFieldStyles({
              isDisabled,
              isInvalid,
              isReadOnly: isReadOnly,
              size,
              className,
            }),
          )
        }
      />
    </div>
  );
};

export interface DateFieldProps<T extends DateValue>
  extends Omit<
      VariantProps<typeof dateFieldStyles>,
      'isDisabled' | 'isInvalid' | 'isReadOnly'
    >,
    Omit<AriaDateFieldProps<T>, 'className' | 'style'>, // Exclude className to avoid conflict with cva
    Omit<AriaDateInputProps, 'className' | 'children' | 'style'> {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  size?: 'small' | 'medium';
  className?: string;
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  shortMonth?: boolean;
}

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
          isOptional={!props.isRequired}
        >
          {label}
        </Label>
      )}

      <DateInput
        className={className}
        isDisabled={isDisabled}
        size={size}
        isReadOnly={isReadOnly}
        isInvalid={isInvalid}
      >
        {(segment) => (
          <FormattedDateSegment segment={segment} shortMonth={shortMonth} />
        )}
      </DateInput>
      {shouldShowDescription && (
        <AriaText
          className={cn([
            'fg-default-dark text-body-xs empty:hidden',
            isDisabled && 'fg-disabled',
          ])}
          slot='description'
        >
          {description}
        </AriaText>
      )}
      {shouldShowError && (
        <FieldError className='fg-serious text-body-xs empty:hidden'>
          {errorMessage}
        </FieldError>
      )}
    </AriaDateField>
  );
}
