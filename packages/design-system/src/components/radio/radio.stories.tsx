import type { Story, StoryDefault } from '@ladle/react';
import { AriaLabel } from '../aria';
import { Radio, RadioGroup } from './radio';
import type { RadioGroupProps } from './types';

export default {
  title: 'Components / RadioGroup',
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Selection List',
    },
    alignInput: {
      control: {
        type: 'select',
      },
      options: ['start', 'end'],
      defaultValue: 'end',
    },
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      defaultValue: 'vertical',
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isReadOnly: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isInvalid: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} satisfies StoryDefault;

export const Example: Story<RadioGroupProps> = ({
  label,
  alignInput,
  ...rest
}) => (
  <RadioGroup {...rest} alignInput={alignInput}>
    <AriaLabel>{label}</AriaLabel>
    <Radio value='this'>This</Radio>
    <Radio value='that'>That</Radio>
    <Radio value='other'>The Other Thing</Radio>
  </RadioGroup>
);
