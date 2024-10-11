import { action, type StoryDefault, type Story } from '@ladle/react';
import { Switch } from './switch';
import type { SwitchProps } from './types';

export default {
  title: 'Components',
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
      defaultValue: 'Hello',
    },
    alignInput: {
      control: {
        type: 'select',
      },
      options: ['start', 'end'],
      defaultValue: 'end',
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
  },
} satisfies StoryDefault;

export const ControlledExample: Story<SwitchProps> = (props) => (
  <Switch {...props} onChange={action('onChange')} />
);

ControlledExample.storyName = 'Switch / Controlled';

ControlledExample.argTypes = {
  isSelected: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
  },
};

export const UncontrolledExample: Story<SwitchProps> = (props) => (
  <Switch {...props} defaultSelected={false} onChange={action('onChange')} />
);

UncontrolledExample.storyName = 'Switch / Uncontrolled';
