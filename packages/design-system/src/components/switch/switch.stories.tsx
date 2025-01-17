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

import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import type { SwitchProps } from './types';

const meta: Meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    children: 'Hello',
    alignInput: 'end',
    isDisabled: false,
    isReadOnly: false,
    onChange: action('onChange'),
  },
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
    alignInput: {
      control: {
        type: 'select',
      },
      options: ['start', 'end'],
    },
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
  },
};

export default meta;

export const Uncontrolled: StoryObj<SwitchProps> = {};

/** Controlled via the `isSelected` prop */
export const Controlled: StoryObj<SwitchProps> = {
  args: {
    isSelected: false,
  },
};
