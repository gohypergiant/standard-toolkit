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

import { actions } from '../../ladle/actions';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { Input } from '../input';
import { TextField } from './';
import type { Story, StoryDefault } from '@ladle/react';
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
