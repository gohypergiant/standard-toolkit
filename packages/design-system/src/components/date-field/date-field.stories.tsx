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

import {
  CalendarDate,
  type CalendarDateTime,
  type CalendarDate as CalendarDateType,
  type ZonedDateTime,
  parseAbsolute,
  parseDate,
  parseDateTime,
} from '@internationalized/date';
import { type Story, type StoryDefault, action } from '@ladle/react';
import { I18nProvider } from '@react-aria/i18n';
import type { DateSegment as TDateSegment } from '@react-stately/datepicker';
import type { DateSegmentRenderProps, DateValue } from 'react-aria-components';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { DateInput, DateSegment, DateSegments } from '../date-input';
import { Icon } from '../icon';
import { DateField } from './';
import type { DateFieldProps } from './types';

type DateFieldStoryProps<T extends DateValue> = DateFieldProps<T> & {
  description?: string;
  errorMessage?: string;
  label?: string;
};

export default {
  title: 'Components / DateField',
  argTypes: {
    errorMessage: {
      control: {
        type: 'text',
      },
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Date',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'lg',
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
    isInvalid: {
      control: {
        type: 'boolean',
      },
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
    },
  },
} satisfies StoryDefault;

const DateIcon = () => (
  <Icon>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
    >
      <title>calender icon</title>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.66665 4.16665V3.33331H5.41665V4.16665H4.58331C3.33331 4.16665 3.33331 5.41665 3.33331 5.41665V15.4166C3.33331 15.4166 3.33331 16.6666 4.58331 16.6666H15.4166C15.4166 16.6666 16.6666 16.6666 16.6666 15.4166V5.41665C16.6666 5.41665 16.6666 4.16665 15.4166 4.16665H14.5833V3.33331H13.3333V4.16665H6.66665ZM15.4166 5.41665V6.66665H4.58331V5.41665H15.4166ZM4.58331 7.91665H15.4166V15.4166H4.58331V7.91665Z'
        fill='currentcolor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.83331 9.16665H7.49998V10.8333H5.83331V9.16665ZM12.5 9.16665H14.1666V10.8333H12.5V9.16665ZM10.8333 9.16665H9.16665V10.8333H10.8333V9.16665Z'
        fill='currentcolor'
      />
    </svg>
  </Icon>
);

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
  const { value, isFocused, isPlaceholder, placeholder } = props;
  if (isPlaceholder) {
    return placeholder;
  }

  return isFocused ? `${value}`.padStart(2, '0') : months[(value ?? 0) - 1];
};

const FormattedDateSegment = (segment: TDateSegment) => {
  if (segment.type === 'literal' && segment.text !== ':') {
    return <></>;
  }
  if (segment.type === 'month') {
    return (
      <DateSegment segment={segment}>
        {(renderProps) => <MonthDateSegment {...renderProps} />}
      </DateSegment>
    );
  }
  return <DateSegment segment={segment} />;
};

/**
 * The format of the placeholder value will determine its display
 */
export const CalendarDateExample: Story<
  DateFieldStoryProps<CalendarDateType>
> = ({ description, errorMessage, label, value, ...rest }) => {
  return (
    <I18nProvider locale='en-GB'>
      <DateField
        {...rest}
        defaultValue={parseDate('2020-01-23')}
        onChange={action('onChange')}
        placeholderValue={new CalendarDate(1980, 1, 1)}
        aria-label={label}
      >
        <AriaLabel>{label}</AriaLabel>
        <DateInput provider={true}>
          <DateIcon />
          <DateSegments>
            {(segment: TDateSegment) => <FormattedDateSegment {...segment} />}
          </DateSegments>
        </DateInput>

        {description && <AriaText slot='description'>{description}</AriaText>}
        <AriaFieldError>{errorMessage}</AriaFieldError>
      </DateField>
    </I18nProvider>
  );
};

CalendarDateExample.storyName = 'Calendar Date';
CalendarDateExample.argTypes = {
  description: {
    control: {
      type: 'text',
    },
    defaultValue: 'dd mmm yyyy',
  },
};

export const CalendarDateTimeExample: Story<
  DateFieldStoryProps<CalendarDateTime>
> = ({ description, errorMessage, label, value, ...rest }) => (
  <I18nProvider locale='en-GB'>
    <DateField<CalendarDateTime>
      {...rest}
      defaultValue={parseDateTime('2020-01-23T14:56:26')}
      onChange={action('onChange')}
      aria-label={label}
    >
      <AriaLabel>Birth Date And Time</AriaLabel>
      <DateInput provider={true}>
        <DateIcon />
        <DateSegments>
          {(segment: TDateSegment) => <FormattedDateSegment {...segment} />}
        </DateSegments>
      </DateInput>
      {description && <AriaText slot='description'>{description}</AriaText>}
      <AriaFieldError>{errorMessage}</AriaFieldError>
    </DateField>
  </I18nProvider>
);

CalendarDateTimeExample.storyName = 'Calendar Datetime';
CalendarDateTimeExample.argTypes = {
  description: {
    control: {
      type: 'text',
    },
    defaultValue: 'dd mmm yyyy hh:mm',
  },
  hourCycle: {
    control: {
      type: 'select',
    },
    options: [12, 24],
    defaultValue: 24,
  },
};

export const ZonedDateTimeExample: Story<
  DateFieldStoryProps<ZonedDateTime>
> = ({ description, errorMessage, label, ...rest }) => (
  <I18nProvider locale='en-GB'>
    <DateField
      {...rest}
      // Use parseAbsolute with 'Z' suffix to specify UTC/Zulu time
      defaultValue={parseAbsolute('2023-04-15T14:30:00Z', 'UTC')}
      // Not hiding the time zone ensures the 'Z' or 'UTC' indicator will be shown
      hideTimeZone={false}
      onChange={action('onChange')}
      aria-label={label}
    >
      <AriaLabel>{label || 'Zulu Date/Time'}</AriaLabel>
      <DateInput provider={true}>
        <DateIcon />
        <DateSegments>
          {(segment) => <DateSegment segment={segment} />}
        </DateSegments>
      </DateInput>
      {description && <AriaText slot='description'>{description}</AriaText>}
      <AriaFieldError>{errorMessage}</AriaFieldError>
    </DateField>
  </I18nProvider>
);

ZonedDateTimeExample.storyName = 'Zoned Datetime';
