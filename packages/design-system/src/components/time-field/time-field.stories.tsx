import { Time, type Time as TimeType } from '@internationalized/date';
import type { Story } from '@ladle/react';
import type { TimeValue } from 'react-aria';
import { DateSegment } from 'react-aria-components';
import type { DateSegment as TDateSegment } from 'react-stately';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { DateInput, DateSegments } from '../date-input/date-input';
import { Icon } from '../icon';
import { TimeField } from './time-field';
import type { TimeFieldProps } from './types';

type TimeFieldStoryProps<T extends TimeValue> = TimeFieldProps<T> & {
  description?: string;
  errorMessage?: string;
  label?: string;
};

export default {
  title: 'Components / Time',
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

const TimeIcon = () => (
  <Icon>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='21'
      height='20'
      viewBox='0 0 21 20'
      fill='none'
    >
      <title>tempus fugit</title>
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M10.9594 16.252C7.50763 16.252 4.70941 13.4537 4.70941 10.002C4.70941 6.55017 7.50763 3.75195 10.9594 3.75195C14.4112 3.75195 17.2094 6.55017 17.2094 10.002C17.2094 13.4537 14.4112 16.252 10.9594 16.252ZM10.9594 17.502C6.81728 17.502 3.45941 14.1441 3.45941 10.002C3.45941 5.85982 6.81728 2.50195 10.9594 2.50195C15.1015 2.50195 18.4594 5.85982 18.4594 10.002C18.4594 14.1441 15.1015 17.502 10.9594 17.502Z'
        fill='white'
      />
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M11.5844 10.192V5.83529H10.3344V10.192C10.3344 10.7975 10.6268 11.3658 11.1196 11.7178L13.5128 13.4272L14.2394 12.41L11.8461 10.7006C11.6819 10.5833 11.5844 10.3939 11.5844 10.192Z'
        fill='white'
      />
    </svg>
  </Icon>
);

export const BasicExample: Story<TimeFieldStoryProps<TimeType>> = ({
  description,
  errorMessage,
  ...rest
}) => (
  <TimeField {...rest} defaultValue={new Time(11, 45)}>
    <AriaLabel>Time of Occurrence</AriaLabel>
    <DateInput>
      <TimeIcon />
      <DateSegments>
        {(segment: TDateSegment) => {
          return segment.type === 'literal' ? (
            <></>
          ) : (
            <DateSegment segment={segment} />
          );
        }}
      </DateSegments>
    </DateInput>
    {description && <AriaText slot='description'>{description}</AriaText>}
    <AriaFieldError>{errorMessage}</AriaFieldError>
  </TimeField>
);

BasicExample.storyName = 'Basic Example';
