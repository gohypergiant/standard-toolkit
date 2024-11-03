import {
  type CalendarDateTime,
  type CalendarDate as CalendarDateType,
  parseDate,
  parseDateTime,
} from '@internationalized/date';
import { type Story, action } from '@ladle/react';
import { I18nProvider } from 'react-aria';
import type { DateSegmentRenderProps, DateValue } from 'react-aria-components';
import type { DateSegment as TDateSegment } from 'react-stately';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { DateInput, DateSegment, DateSegments } from '../date-input/date-input';
import type { DateInputRenderProps } from '../date-input/types';
import { Icon } from '../icon';
import { DateField } from './date-field';
import type { DateFieldProps } from './types';

type DateFieldStoryProps<T extends DateValue> = DateFieldProps<T> & {
  description?: string;
  errorMessage?: string;
  label?: string;
};

export default {
  title: 'Components / Date',
  argTypes: {
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
    },
    description: {
      control: {
        type: 'text',
      },
      defaultValue: 'Format: dd mmm yyyy',
    },
    errorMessage: {
      control: {
        type: 'text',
      },
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Birth Date',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'sm',
    },
  },
};

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
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M6.66665 4.16665V3.33331H5.41665V4.16665H4.58331C3.33331 4.16665 3.33331 5.41665 3.33331 5.41665V15.4166C3.33331 15.4166 3.33331 16.6666 4.58331 16.6666H15.4166C15.4166 16.6666 16.6666 16.6666 16.6666 15.4166V5.41665C16.6666 5.41665 16.6666 4.16665 15.4166 4.16665H14.5833V3.33331H13.3333V4.16665H6.66665ZM15.4166 5.41665V6.66665H4.58331V5.41665H15.4166ZM4.58331 7.91665H15.4166V15.4166H4.58331V7.91665Z'
        fill='white'
      />
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M5.83331 9.16665H7.49998V10.8333H5.83331V9.16665ZM12.5 9.16665H14.1666V10.8333H12.5V9.16665ZM10.8333 9.16665H9.16665V10.8333H10.8333V9.16665Z'
        fill='white'
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
  const { value, isFocused } = props;
  return isFocused ? `${value}`.padStart(2, '0') : months[(value ?? 0) - 1];
};

const FormattedDateSegment = (segment: TDateSegment) => {
  if (segment.type === 'literal') {
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

export const CalendarDateExample: Story<
  DateFieldStoryProps<CalendarDateType>
> = ({ value, label, description, errorMessage, ...rest }) => (
  <I18nProvider locale='en-GB'>
    <DateField
      {...rest}
      defaultValue={parseDate('2020-01-23')}
      onChange={action('onChange')}
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

CalendarDateExample.storyName = 'Calendar Date';

export const ProviderExample: Story<DateFieldStoryProps<CalendarDateType>> = ({
  value,
  label,
  description,
  errorMessage,
  ...rest
}) => (
  <I18nProvider locale='en-GB'>
    <DateField
      {...rest}
      defaultValue={parseDate('2020-01-23')}
      onChange={action('onChange')}
    >
      <AriaLabel>{label}</AriaLabel>
      <DateInput provider={true}>
        {(renderProps: DateInputRenderProps) => {
          console.log({ renderProps });
          return (
            <>
              <DateIcon />
              <DateSegments>
                {(segment: TDateSegment) => (
                  <FormattedDateSegment {...segment} />
                )}
              </DateSegments>
            </>
          );
        }}
      </DateInput>
      {description && <AriaText slot='description'>{description}</AriaText>}
      <AriaFieldError>{errorMessage}</AriaFieldError>
    </DateField>
  </I18nProvider>
);

ProviderExample.storyName = 'Provider';

export const CalendarDateTimeExample: Story<
  DateFieldStoryProps<CalendarDateTime>
> = ({ value, description, errorMessage, ...rest }) => (
  <I18nProvider locale='en-GB'>
    <DateField<CalendarDateTime>
      {...rest}
      defaultValue={parseDateTime('2020-01-23T14:56:26')}
      onChange={action('onChange')}
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
  hourCycle: {
    control: {
      type: 'select',
    },
    options: [12, 24],
    defaultValue: 24,
  },
};

export const StandaloneExample = () => {
  return (
    <DateInput provider={false}>
      {(segment: TDateSegment) => <DateSegment segment={segment} />}
    </DateInput>
  );
};

StandaloneExample.storyName = 'Date Input Standalone';
