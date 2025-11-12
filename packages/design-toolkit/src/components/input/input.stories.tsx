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

import { Input } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    autoSize: false,
    disabled: false,
    placeholder: 'Placeholder',
    size: 'medium',
    isClearable: true,
    isInvalid: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'small'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

export const Default: StoryObj<typeof meta> = {};

export const WithPrefix: StoryObj<typeof meta> = {
  args: {
    placeholder: '0.00',
    type: 'number',
    prefix: '$',
  },
};

export const WithSuffix: StoryObj<typeof meta> = {
  args: {
    placeholder: '0',
    type: 'number',
    suffix: 'kg',
  },
};

export const WithPrefixAndSuffix: StoryObj<typeof meta> = {
  args: {
    placeholder: '0',
    type: 'number',
    prefix: '~',
    suffix: '°C',
  },
};
