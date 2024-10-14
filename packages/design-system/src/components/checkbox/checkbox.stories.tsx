import {
  action,
  type ArgTypes,
  type Story,
  type StoryDefault,
} from '@ladle/react';
import { AriaLabel, AriaText } from '../aria';
import { Icon } from '../icon';
import { Checkbox, CheckboxGroup } from './checkbox';
import type { CheckboxGroupProps, CheckboxProps } from './types';

export default {
  title: 'Components / Checkbox',
  argTypes: {
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

const args: ArgTypes<CheckboxProps> = {
  label: {
    control: {
      type: 'text',
    },
    defaultValue: 'Checkbox text',
  },
  alignInput: {
    control: {
      type: 'select',
    },
    options: ['start', 'end'],
    defaultValue: 'end',
  },
  isIndeterminate: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
  },
};

const indeterminateSvg = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    strokeWidth={3}
  >
    <title>Ladle</title>
    <line x1='6' y1='12' x2='18' y2='12' />
  </svg>
);

const checkedSvg = (
  <svg viewBox='0 0 18 18' aria-hidden='true' strokeWidth={3} fill='none'>
    <title>Ladle</title>
    <polyline points='1 9 7 14 15 4' />
  </svg>
);

export const CheckboxGroupExample: Story<CheckboxGroupProps> = ({
  label,
  ...rest
}) => (
  <CheckboxGroup {...rest}>
    <AriaLabel>{label}</AriaLabel>
    <Checkbox value='foo'>
      <Icon stroke='currentcolor'>{checkedSvg}</Icon>
      <AriaText>Checkbox text</AriaText>
    </Checkbox>
    <Checkbox value='bar'>
      <Icon stroke='currentcolor'>{checkedSvg}</Icon>
      <AriaText>Checkbox text</AriaText>
    </Checkbox>
    <Checkbox value='baz'>
      <Icon stroke='currentcolor'>{checkedSvg}</Icon>
      <AriaText>Checkbox text</AriaText>
    </Checkbox>
  </CheckboxGroup>
);

CheckboxGroupExample.storyName = 'Checkbox Group';

CheckboxGroupExample.argTypes = {
  label: {
    control: {
      type: 'text',
    },
    defaultValue: 'Group label',
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
    options: ['vertical', 'horizontal'],
    defaultValue: 'vertical',
  },
};

export const ControlledExample: Story<CheckboxProps> = ({ label, ...rest }) => (
  <Checkbox {...rest} onChange={action('onChange')}>
    {({ isIndeterminate }) => (
      <>
        <Icon stroke='currentcolor'>
          {isIndeterminate ? indeterminateSvg : checkedSvg}
        </Icon>
        {label && <AriaText>{label}</AriaText>}
      </>
    )}
  </Checkbox>
);

ControlledExample.storyName = 'Controlled';

ControlledExample.argTypes = {
  ...args,
  isSelected: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
  },
};

export const UncontrolledExample: Story<CheckboxProps> = ({
  label,
  ...rest
}) => (
  <Checkbox {...rest} defaultSelected={false} onChange={action('onChange')}>
    {({ isIndeterminate }) => (
      <>
        <Icon stroke='currentcolor'>
          {isIndeterminate ? indeterminateSvg : checkedSvg}
        </Icon>
        {label && <AriaText>{label}</AriaText>}
      </>
    )}
  </Checkbox>
);

UncontrolledExample.storyName = 'Uncontrolled';

UncontrolledExample.argTypes = { ...args };

export const WithoutIconExample: Story<CheckboxProps> = ({
  label,
  ...rest
}) => (
  <Checkbox {...rest} defaultSelected={false} onChange={action('onChange')}>
    {label && <AriaText>{label as string}</AriaText>}
  </Checkbox>
);

WithoutIconExample.storyName = 'Without Icon';

WithoutIconExample.argTypes = { ...args };
