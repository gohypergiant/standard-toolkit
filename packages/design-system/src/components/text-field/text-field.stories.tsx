import type { Story, StoryDefault } from '@ladle/react';
import { Input } from '../../components';
import { actions } from '../../ladle';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { TextField } from './text-field';
import type { TextFieldProps } from './types';

type StoryProps = TextFieldProps & {
  description?: string;
  errorMessage?: string;
  label?: string;
};

export default {
  title: 'Components/Textfield',
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
    isInvalid: {
      control: {
        type: 'boolean',
      },
    },
    description: {
      control: {
        type: 'text',
      },
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
      defaultValue: 'Name',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'sm',
    },
  },
} satisfies StoryDefault<StoryProps>;

export const ControlledExample: Story<StoryProps> = ({
  description,
  errorMessage,
  label,
  ...rest
}) => (
  <TextField
    {...rest}
    {...actions<TextFieldProps>('onBlur', 'onFocus', 'onFocusChange')}
  >
    <AriaLabel>{label}</AriaLabel>
    <Input placeholder='Placeholder text' />
    {description && <AriaText slot='description'>{description}</AriaText>}
    <AriaFieldError>{errorMessage}</AriaFieldError>
  </TextField>
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

export const UncontrolledExample: Story<StoryProps> = ({
  description,
  errorMessage,
  label,
  ...rest
}) => (
  <TextField
    defaultValue=''
    {...rest}
    {...actions<TextFieldProps>('onBlur', 'onFocus', 'onFocusChange')}
  >
    <AriaLabel>{label}</AriaLabel>
    <Input placeholder='Placeholder text' />
    {description && <AriaText slot='description'>{description}</AriaText>}
    <AriaFieldError>{errorMessage}</AriaFieldError>
  </TextField>
);

UncontrolledExample.storyName = 'Uncontrolled';
