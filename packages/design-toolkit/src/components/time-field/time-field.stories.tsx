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

import { parseTime } from '@internationalized/date';
import { TimeField } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/TimeField',
  component: TimeField,
  args: {
    label: 'Label',
    description: 'Format: hh:mm:ssz',
    errorMessage: '',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
    defaultValue: parseTime('20:03'),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    granularity: {
      control: 'select',
    },
  },
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: TimeField,
};
