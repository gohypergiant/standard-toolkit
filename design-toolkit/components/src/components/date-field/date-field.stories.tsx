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

import { parseDate } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';
import { DateField } from './index';

const meta: Meta<typeof DateField> = {
  title: 'Components/DateField',
  component: DateField,
  args: {
    className: '',
    description: 'Format: dd mmm yyyy',
    errorMessage: 'Error description',
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: true,
    label: 'Label',
    defaultValue: parseDate('2020-01-23'),
    size: 'medium',
  },
  argTypes: {
    className: { type: 'string' },
    size: { options: ['small', 'medium'], control: 'select' },
  },
};

export default meta;
type Story = StoryObj<typeof DateField>;

export const Default: Story = {
  render: ({ children, ...args }) => <DateField {...args} />,
};
