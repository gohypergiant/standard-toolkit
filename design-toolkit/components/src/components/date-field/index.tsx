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

import 'client-only';
import { cn } from '@/lib/utils';
import Calendar from '@accelint/icons/calendar';
import type { CalendarDate } from '@internationalized/date';
import type { DateSegment as TDateSegment } from '@react-stately/datepicker';
import { type VariantProps, cva } from 'cva';
import { type CSSProperties, type ForwardedRef, createContext } from 'react';
import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  Text as AriaText,
  type ContextValue,
  DateSegment,
  type DateSegmentRenderProps,
  FieldError,
  useContextProps,
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

const MonthDateSegment = (props: DateSegmentRenderProps) => {
  const { value, isFocused, isPlaceholder, placeholder, isReadOnly } = props;
  if (isPlaceholder) {
    return placeholder;
  }

  return !isReadOnly && isFocused
    ? `${value}`.padStart(2, '0')
    : months[(value ?? 0) - 1];
};

const dateSegmentStyle: CSSProperties = {
  caretColor: 'white',
};

const FormattedDateSegment = (segment: TDateSegment) => {
  if (segment.type === 'literal' && segment.text !== ':') {
    return <></>;
  }

  return (
    <DateSegment
      segment={segment}
      className='!caret-default-light focus:outline-none' // Ensure caret color is visible, RAC sets the style prop and it is not overridable. Thanks for that.
      style={dateSegmentStyle}
    >
      {segment.type === 'month'
        ? (renderProps) => <MonthDateSegment {...renderProps} />
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

const DateInputContext =
  createContext<ContextValue<DateInputProps, HTMLDivElement>>(null);

const DateInput = ({
  className,
  ref = null,
  size = 'medium',
  isReadOnly,
  ...props
}: DateInputProps) => {
  // @ts-ignore react types are resolving to v18.3.11 instead of v19 due to other packages in monorepo
  // TODO remove comment when versions are aligned
  [props, ref] = useContextProps(props, ref, DateInputContext);

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

export interface DateFieldProps
  extends Omit<
      VariantProps<typeof dateFieldStyles>,
      'isDisabled' | 'isInvalid' | 'isReadOnly'
    >,
    Omit<AriaDateFieldProps<CalendarDate>, 'className' | 'style'>, // Exclude className to avoid conflict with cva
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
}

export function DateField({
  className,
  description,
  errorMessage,
  isDisabled,
  isInvalid,
  isReadOnly,
  label,
  placeholder,
  size = 'medium',
  ...props
}: DateFieldProps) {
  const isSmall = size === 'small';
  const shouldShowDescription =
    description && (!(isSmall || isInvalid) || isDisabled);
  const shouldShowError =
    errorMessage && isInvalid && !isDisabled && !isReadOnly;

  return (
    <AriaDateField
      {...props}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
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
        {...props}
      >
        {(segment) => (
          <FormattedDateSegment
            {...segment}
            isEditable={!(isReadOnly || isDisabled)}
          />
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
