import type { Story, StoryDefault } from '@ladle/react';
import { AriaGroup, Button, Input } from '../../components';
import { actions } from '../../ladle';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { NumberField } from './number-field';
import type { NumberFieldProps } from './types';

type StoryProps = NumberFieldProps & {
  description?: string;
  errorMessage?: string;
  label?: string;
};

export default {
  title: 'Components/Numberfield',
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
      defaultValue: 'Counter',
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
      defaultValue: 'sm',
    },
    step: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
  },
} satisfies StoryDefault<StoryProps>;

export const ControlledExample: Story<StoryProps> = ({
  description,
  errorMessage,
  label,
  ...rest
}) => (
  <NumberField
    {...rest}
    {...actions<NumberFieldProps>(
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onChange',
    )}
  >
    <AriaLabel>{label}</AriaLabel>
    <AriaGroup>
      <Button slot='decrement'>-</Button>
      <Input />
      <Button slot='increment'>+</Button>
    </AriaGroup>
    {description && <AriaText slot='description'>{description}</AriaText>}
    <AriaFieldError>{errorMessage}</AriaFieldError>
  </NumberField>
);

ControlledExample.storyName = 'Controlled';

ControlledExample.argTypes = {
  value: {
    control: {
      type: 'number',
    },
    defaultValue: 0,
  },
};

export const UncontrolledExample: Story<StoryProps> = ({
  description,
  errorMessage,
  label,
  ...rest
}) => (
  <NumberField
    defaultValue={0}
    {...rest}
    {...actions<NumberFieldProps>('onBlur', 'onFocus', 'onFocusChange')}
  >
    <AriaLabel>{label}</AriaLabel>
    <AriaGroup>
      <Button slot='decrement'>-</Button>
      <Input />
      <Button slot='increment'>+</Button>
    </AriaGroup>
    {description && <AriaText slot='description'>{description}</AriaText>}
    <AriaFieldError>{errorMessage}</AriaFieldError>
  </NumberField>
);

UncontrolledExample.storyName = 'Uncontrolled';
