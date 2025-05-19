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

import type { Story, StoryDefault } from '@ladle/react';
import { AriaGroup, Button, Input } from '../../components';
import { actions } from '../../ladle/actions';
import { AriaFieldError, AriaLabel, AriaText } from '../aria';
import { NumberField } from './';
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
