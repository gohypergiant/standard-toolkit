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

import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './index';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    className: '',
    children: 'Checkbox',
    isDisabled: false,
    isIndeterminate: false,
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: ({ children, ...args }) => <Checkbox {...args}>Unsubscribe</Checkbox>,
};

export const CheckboxGroup: Story = {
  render: () => (
    <Checkbox.Group defaultValue={['value1', 'value3']} label='Header'>
      <Checkbox value='value1'>Checkbox text</Checkbox>
      <Checkbox value='value2'>Checkbox text</Checkbox>
      <Checkbox value='value3'>Checkbox text</Checkbox>
      <Checkbox value='value4'>Checkbox text</Checkbox>
    </Checkbox.Group>
  ),
};
