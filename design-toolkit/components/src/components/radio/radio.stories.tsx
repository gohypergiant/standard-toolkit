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

import { Radio } from './index';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * The `<Radio.Group>` component is a direct wrapper around the equiavalent component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/RadioGroup.html">here</a>.
 */
const meta: Meta<typeof Radio.Group> = {
  title: 'Components/Radio.Group',
  component: Radio.Group,
  args: {
    className: undefined,
    isDisabled: false,
    label: 'Header',
  },
  argTypes: {
    className: { type: 'string' },
    label: { type: 'string' },
  },
};

export default meta;
type Story = StoryObj<typeof Radio.Group>;

export const Default: Story = {
  render: ({ children, label, ...args }) => (
    <Radio.Group label={label} {...args}>
      <Radio value='1'>Radio text</Radio>
      <Radio value='2'>Radio text</Radio>
      <Radio value='3'>Radio text</Radio>
    </Radio.Group>
  ),
};
