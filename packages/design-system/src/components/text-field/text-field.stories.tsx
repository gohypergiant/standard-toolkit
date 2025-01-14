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

import type { StoryObj, Meta } from '@storybook/react';
import { actions } from '../../storybook';
import { Input } from '..';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { TextField } from './text-field';
import type { TextFieldProps } from './types';

const meta: Meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Name',
    size: 'sm',
    ...actions<TextFieldProps>('onBlur', 'onFocus', 'onFocusChange'),
  },
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
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'lg'],
    },
  },
};

export default meta;

type StoryProps = TextFieldProps & {
  description?: string;
  errorMessage?: string;
  label?: string;
};

export const Default: StoryObj<StoryProps> = {
  render: ({ description, errorMessage, label, ...rest }) => (
    <TextField defaultValue='' {...rest}>
      <AriaLabel>{label}</AriaLabel>
      <Input placeholder='Placeholder text' />
      {description && <AriaText slot='description'>{description}</AriaText>}
      <AriaFieldError>{errorMessage}</AriaFieldError>
    </TextField>
  ),
};
