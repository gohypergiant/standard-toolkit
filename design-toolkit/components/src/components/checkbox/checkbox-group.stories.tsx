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

import { Checkbox } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { CheckboxGroupProps } from './types';

type Alias = React.FC<CheckboxGroupProps>;

/**
 * The `<Checkbox.Group>` component is a direct wrapper around the equiavalent component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/CheckboxGroup.html">here</a>.
 *
 * By default, it lays its children out in a stacked Flexbox layout, but you can customize the `className` to change the layout
 * behavior.
 */
const meta = {
  title: 'Components/Checkbox.Group',
  component: Checkbox.Group as Alias,
  args: {
    label: 'Header',
    orientation: 'vertical',
    isDisabled: false,
    isRequired: false,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  parameters: {
    controls: {
      exclude: ['validationBehavior'],
    },
  },
} satisfies Meta<Alias>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ children, ...args }) => (
    <Checkbox.Group {...args}>
      <Checkbox value='value1'>Checkbox text</Checkbox>
      <Checkbox value='value2'>Checkbox text</Checkbox>
      <Checkbox value='value3'>Checkbox text</Checkbox>
      <Checkbox value='value4'>Checkbox text</Checkbox>
    </Checkbox.Group>
  ),
};
