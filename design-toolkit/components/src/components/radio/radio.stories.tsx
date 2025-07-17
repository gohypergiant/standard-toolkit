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
import { Radio } from './index';

const meta: Meta<typeof Radio.Group> = {
  title: 'Components/Radio',
  component: Radio.Group,
  args: {
    orientation: 'vertical',
    isDisabled: false,
    isRequired: false,
    label: 'Header',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  parameters: {
    controls: {
      exclude: ['children', 'validationBehavior'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Radio.Group> = {
  render: ({ children, label, ...args }) => (
    <Radio.Group label={label} {...args}>
      <Radio value='1'>Radio text</Radio>
      <Radio value='2'>Radio text</Radio>
      <Radio value='3'>Radio text</Radio>
    </Radio.Group>
  ),
};
