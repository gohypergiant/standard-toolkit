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
import { actions } from '../../storybook/actions';
import { AriaGroup, Button, Input } from '..';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { NumberField } from './number-field';
import type { NumberFieldProps } from './types';

type StoryProps = NumberFieldProps & {
  description?: string;
  errorMessage?: string;
  label?: string;
};

const meta: Meta = {
  title: 'Components/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  args: {
    description: '',
    errorMessage: '',
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    label: 'Counter',
    size: 'sm',
    step: 1,
    ...actions<NumberFieldProps>(
      'onBlur',
      'onFocus',
      'onFocusChange',
      'onChange',
    ),
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
    step: {
      control: {
        type: 'number',
      },
    },
  },
  render: ({ description, errorMessage, label, ...rest }) => (
    <NumberField defaultValue={0} {...rest}>
      <AriaLabel>{label}</AriaLabel>
      <AriaGroup>
        <Button slot='decrement'>-</Button>
        <Input />
        <Button slot='increment'>+</Button>
      </AriaGroup>
      {description && <AriaText slot='description'>{description}</AriaText>}
      <AriaFieldError>{errorMessage}</AriaFieldError>
    </NumberField>
  ),
};

export default meta;

export const Uncontrolled: StoryObj<StoryProps> = {};

/** Controlled via the value prop */
export const Controlled: StoryObj<StoryProps> = {
  args: {
    value: 0,
  },
};
