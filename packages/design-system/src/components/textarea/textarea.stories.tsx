import type { Story, StoryDefault } from '@ladle/react';
import { actions } from '../../ladle';
import { TextArea } from './textarea';
import type { TextAreaProps } from './types';

export default {
  title: 'Components/TextArea',
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    'aria-invalid': {
      control: {
        type: 'select',
      },
      options: ['true', 'false', 'grammar', 'spelling'],
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    readOnly: {
      control: {
        type: 'boolean',
      },
    },
    resize: {
      control: {
        type: 'select',
      },
      options: ['both', 'horizontal', 'vertical', 'none'],
      defaultValue: 'none',
    },
  },
} satisfies StoryDefault<TextAreaProps>;

export const ControlledExample: Story<TextAreaProps> = (props) => (
  <TextArea
    {...props}
    {...actions<TextAreaProps>(
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

export const UncontrolledExample: Story<TextAreaProps> = (props) => (
  <TextArea
    {...props}
    defaultValue=''
    {...actions<TextAreaProps>(
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
