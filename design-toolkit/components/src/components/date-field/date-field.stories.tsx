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

import { parseAbsoluteToLocal, parseDate } from '@internationalized/date';
import { SIZE_RANGE } from '@/constants/size';
import { DateField } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/DateField',
  component: DateField,
  args: {
    label: 'Label',
    defaultValue: parseDate('2020-01-23'),
    description: 'Format: d MMM yyyy',
    errorMessage: '',
    granularity: 'day',
    size: 'medium',
    isDisabled: false,
    isInvalid: false,
    isRequired: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: SIZE_RANGE.COMPACT,
    },
    granularity: {
      control: 'select',
      options: ['day', 'hour', 'minute', 'second'],
    },
  },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: DateField,
};

export const WithoutShortMonth: Story = {
  args: {
    ...Default.args,
    granularity: 'day',
    shortMonth: false,
    description: 'Format: d MM yyyy',
    defaultValue: parseDate('2020-01-23'),
  },
  render: DateField,
};

export const DateTime: Story = {
  args: {
    ...Default.args,
    granularity: 'second',
    description: 'Format: d MMM yyyy hh:mm:ss a ZZZZ',
    defaultValue: parseAbsoluteToLocal('2021-04-07T18:45:22Z'),
  },
  render: DateField,
};
