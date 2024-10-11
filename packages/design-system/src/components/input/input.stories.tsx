import type { Story, StoryDefault } from '@ladle/react';
import { actions } from '../../ladle';
import { Input } from './input';
import type { InputProps } from './types';

export default {
  title: 'Components/Input',
  argTypes: {
    'aria-invalid': {
      control: {
        type: 'select',
      },
      options: ['true', 'false', 'grammar', 'spelling'],
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    placeholder: {
      control: {
        type: 'text',
      },
      defaultValue: 'Placeholder text',
    },
    readOnly: {
      control: {
        type: 'boolean',
      },
    },
    required: {
      control: {
        type: 'boolean',
      },
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'sm',
    },
    type: {
      control: {
        type: 'select',
      },
      options: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'],
    },
  },
} satisfies StoryDefault<InputProps>;

export const ControlledExample: Story<InputProps> = (props) => (
  <Input
    {...props}
    {...actions<InputProps>(
      'onChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onBlur',
      'onFocus',
    )}
  />
);

ControlledExample.storyName = 'Controlled';

ControlledExample.argTypes = {
  value: {
    control: {
      type: 'text',
    },
    defaultValue: '',
  },
};

export const UncontrolledExample: Story<InputProps> = (props) => (
  <Input
    {...props}
    defaultValue=''
    {...actions<InputProps>(
      'onChange',
      'onHoverChange',
      'onHoverEnd',
      'onHoverStart',
      'onBlur',
      'onFocus',
    )}
  />
);

UncontrolledExample.storyName = 'Uncontrolled';
