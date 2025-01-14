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
import { Input } from './input';
import type { InputProps } from './types';

const meta: Meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<InputProps> = {
  args: {
    placeholder: 'Placeholder text',
    size: 'sm',
  },
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
    },
    type: {
      control: {
        type: 'select',
      },
      options: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'],
    },
  },
};
